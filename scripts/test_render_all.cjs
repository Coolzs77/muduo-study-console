const http = require('http');
const fs = require('fs');
const { spawn } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const userDataDir = 'C:\\Users\\86166\\AppData\\Local\\Temp\\edge_test_render_all';

const edgeProcess = spawn(edgePath, [
  '--headless=new',
  '--remote-debugging-port=9290',
  '--window-size=1600,1000',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

setTimeout(async () => {
  try {
    const listRes = await fetchJson('http://127.0.0.1:9290/json/list');
    const pageTarget = listRes.find(t => t.type === 'page');
    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    let id = 1;

    function sendCmd(method, params = {}) {
      return new Promise((resolve) => {
        const msgId = id++;
        const handler = (event) => {
          const data = JSON.parse(event.data);
          if (data.id === msgId) {
            ws.removeEventListener('message', handler);
            resolve(data.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    async function evaluate(js) {
      const res = await sendCmd('Runtime.evaluate', { expression: js, returnByValue: true, awaitPromise: true });
      return res?.result?.value;
    }

    ws.onopen = async () => {
      await sendCmd('Page.enable');
      await sendCmd('Runtime.enable');
      await sendCmd('Console.enable');

      const consoleErrors = [];
      ws.addEventListener('message', (event) => {
        const msg = JSON.parse(event.data);
        if (msg.method === 'Console.messageAdded' && msg.params.message.level === 'error') {
          consoleErrors.push(msg.params.message.text);
        } else if (msg.method === 'Runtime.exceptionThrown') {
          consoleErrors.push(JSON.stringify(msg.params.exceptionDetails));
        }
      });

      console.log('Navigating to local index.html...');
      await sendCmd('Page.navigate', { url: 'file:///e:/workspace/muduo-study-console/index.html' });
      await sleep(3000);

      await evaluate('switchView("knowledge")');
      await sleep(1000);

      const dataset = await evaluate('window.YUQUE_DATASET.map(d => ({ id: d.id, title: d.title, bookId: d.bookId }))');
      console.log(`Verifying all ${dataset.length} articles...`);

      let totalInlineCodeLeaks = 0;
      let totalBrokenImages = 0;

      for (let i = 0; i < dataset.length; i++) {
        const art = dataset[i];
        await evaluate(`selectYuqueArticle('${art.id}')`);
        await sleep(300);

        const checkRes = await evaluate(`
          (() => {
            const bodyEl = document.getElementById('yq-reader-body');
            const html = bodyEl ? bodyEl.innerHTML : '';
            const inlineCodeLeaks = (html.match(/__INLINE_CODE_\\d+__/g) || []).length;
            
            // Check images
            const imgs = Array.from(bodyEl.querySelectorAll('img'));
            const brokenImgs = imgs.filter(img => img.naturalWidth === 0 && img.src.length > 0).map(img => img.src);

            return {
              htmlLength: html.length,
              codeBlocksCount: bodyEl.querySelectorAll('.yuque-code-block').length,
              imagesCount: imgs.length,
              inlineCodeLeaks,
              brokenImgs
            };
          })()
        `);

        if (checkRes.inlineCodeLeaks > 0) {
          console.error(`❌ [${art.id}] ${art.title} HAS ${checkRes.inlineCodeLeaks} INLINE CODE LEAKS!`);
          totalInlineCodeLeaks += checkRes.inlineCodeLeaks;
        }

        if (checkRes.brokenImgs.length > 0) {
          console.warn(`⚠️ [${art.id}] ${art.title} has ${checkRes.brokenImgs.length} broken images:`, checkRes.brokenImgs);
          totalBrokenImages += checkRes.brokenImgs.length;
        }

        console.log(`[${i+1}/${dataset.length}] ${art.id} (${art.title.substring(0, 18)}): HTML=${checkRes.htmlLength}, Codes=${checkRes.codeBlocksCount}, Imgs=${checkRes.imagesCount}, Leaks=${checkRes.inlineCodeLeaks}`);
      }

      console.log('\n==========================================');
      console.log(`Verification Summary:`);
      console.log(`Total Articles Tested: ${dataset.length}`);
      console.log(`Total Inline Code Leaks: ${totalInlineCodeLeaks}`);
      console.log(`Total Broken Images: ${totalBrokenImages}`);
      console.log(`Total Console Errors: ${consoleErrors.length}`);
      console.log('==========================================');

      // Capture screenshot of doc 6 with image and codes rendered
      await evaluate("filterYuqueBook('muduo-core')");
      await evaluate("selectYuqueArticle('yq_muduo_06')");
      await sleep(1000);

      const shotRes = await sendCmd('Page.captureScreenshot', { format: 'png' });
      const buf = Buffer.from(shotRes.data, 'base64');
      fs.writeFileSync('e:\\workspace\\muduo-study-console\\docs\\yuque_muduo\\live_muduo_doc06_full.png', buf);
      console.log('✓ Captured full screenshot of doc 06 to docs/yuque_muduo/live_muduo_doc06_full.png');

      ws.close();
      edgeProcess.kill();
      process.exit((totalInlineCodeLeaks === 0 && consoleErrors.length === 0) ? 0 : 1);
    };
  } catch(e) {
    console.error('Test execution failed:', e);
    edgeProcess.kill();
    process.exit(1);
  }
}, 1500);
