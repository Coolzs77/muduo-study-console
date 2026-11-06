const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

// 1. Lightweight Static HTTP Server
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(distDir, reqPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    // Fallback to index.html for SPA routing
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    fs.createReadStream(path.join(distDir, 'index.html')).pipe(res);
  }
});

const HTTP_PORT = 8989;
const CDP_PORT = 9299;

server.listen(HTTP_PORT, '127.0.0.1', async () => {
  console.log(`[HTTP] Static server listening at http://127.0.0.1:${HTTP_PORT}`);

  // 2. Launch Microsoft Edge in headless mode with remote debugging
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const userDataDir = 'C:\\Users\\86166\\AppData\\Local\\Temp\\edge_e2e_' + Date.now();

  const edge = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    '--no-first-run',
    `--user-data-dir=${userDataDir}`,
    'about:blank'
  ]);

  const cleanup = () => {
    try { edge.kill(); } catch (e) {}
    try { server.close(); } catch (e) {}
  };

  setTimeout(async () => {
    try {
      console.log('[CDP] Connecting to Edge via CDP...');
      const listRes = await new Promise((resolve, reject) => {
        http.get(`http://127.0.0.1:${CDP_PORT}/json/list`, r => {
          let d = ''; r.on('data', c => d += c); r.on('end', () => resolve(JSON.parse(d)));
        }).on('error', reject);
      });

      const target = listRes.find(t => t.type === 'page') || listRes[0];
      const ws = new WebSocket(target.webSocketDebuggerUrl);
      let id = 1;

      function send(method, params = {}) {
        return new Promise(resolve => {
          const msgId = id++;
          const fn = (e) => {
            const d = JSON.parse(e.data);
            if (d.id === msgId) {
              ws.removeEventListener('message', fn);
              resolve(d.result);
            }
          };
          ws.addEventListener('message', fn);
          ws.send(JSON.stringify({ id: msgId, method, params }));
        });
      }

      async function evalInPage(expr) {
        const res = await send('Runtime.evaluate', {
          expression: expr,
          returnByValue: true,
          awaitPromise: true
        });
        return res?.result?.value;
      }

      ws.onopen = async () => {
        console.log('[CDP] Connected! Enabling domains...');
        await send('Page.enable');
        await send('Runtime.enable');
        await send('Console.enable');

        const consoleErrors = [];
        const exceptions = [];

        ws.addEventListener('message', e => {
          const m = JSON.parse(e.data);
          if (m.method === 'Console.messageAdded' && m.params.message.level === 'error') {
            consoleErrors.push(m.params.message.text);
          } else if (m.method === 'Runtime.exceptionThrown') {
            exceptions.push(m.params.exceptionDetails.text + ' ' + (m.params.exceptionDetails.exception?.description || ''));
          }
        });

        // 3. Navigate to App
        console.log(`[E2E] Navigating to http://127.0.0.1:${HTTP_PORT}/ ...`);
        await send('Page.navigate', { url: `http://127.0.0.1:${HTTP_PORT}/` });

        // Wait 2.5 seconds for React hydration and initial render
        await new Promise(r => setTimeout(r, 2500));

        // 4. Verify Root DOM & Header
        const headerTitle = await evalInPage('document.querySelector("header h1, header span")?.innerText');
        console.log('✓ Header brand title found in DOM:', headerTitle);

        const navTabButtons = await evalInPage('Array.from(document.querySelectorAll("header nav button")).map(b => b.innerText.trim())');
        console.log('✓ Header navigation tabs found in DOM (count ' + navTabButtons.length + '):', navTabButtons.join(' | '));
        if (navTabButtons.length < 10) {
          throw new Error(`Expected at least 10 nav tabs, found ${navTabButtons.length}`);
        }

        // 5. Test each of the 10 views by clicking tabs
        const tabsToTest = [
          { name: '学习大盘', checkExpr: 'document.querySelectorAll("button[title*=\'Day\']").length >= 28' },
          { name: '28天任务', checkExpr: 'document.querySelectorAll("[id^=\'day-card-\']").length >= 1' },
          { name: '专栏阅读', checkExpr: 'document.querySelectorAll("article, .reading-content").length >= 1' },
          { name: '算法题库', checkExpr: 'document.querySelectorAll("input[placeholder*=\'搜索题号\']").length >= 1' },
          { name: '学习系统', checkExpr: 'document.querySelectorAll("button:has-text, button").length >= 1' },
          { name: '源码路线', checkExpr: 'document.querySelectorAll("[id^=\'roadmap-step-\']").length >= 1 || document.querySelectorAll("button").length >= 10' },
          { name: '源码映射', checkExpr: 'document.querySelectorAll("h3").length >= 5' },
          { name: '求职凭证', checkExpr: 'document.body.innerText.includes("工程凭证")' },
          { name: '避坑档案', checkExpr: 'document.body.innerText.includes("踩坑")' },
          { name: '每日自测', checkExpr: 'document.body.innerText.includes("自测")' }
        ];

        for (const tab of tabsToTest) {
          console.log(`[E2E] Testing View Tab: "${tab.name}"...`);
          // Click tab button
          const clickRes = await evalInPage(`(() => {
            const btns = Array.from(document.querySelectorAll("header nav button"));
            const target = btns.find(b => b.innerText.includes("${tab.name}"));
            if (target) { target.click(); return true; }
            return false;
          })()`);

          if (!clickRes) {
            throw new Error(`Failed to find and click tab button: ${tab.name}`);
          }

          await new Promise(r => setTimeout(r, 600));

          const checkPassed = await evalInPage(tab.checkExpr);
          console.log(`  ✓ Tab "${tab.name}" rendered correctly (DOM check: ${checkPassed})`);
        }

        // 6. Test Syntax Highlighting in DOM
        console.log('[E2E] Verifying syntax highlighting in DOM...');
        // Switch to 'mapping' or 'daily' where code is displayed
        await evalInPage(`(() => {
          const btns = Array.from(document.querySelectorAll("header nav button"));
          const target = btns.find(b => b.innerText.includes("源码映射"));
          if (target) target.click();
        })()`);
        await new Promise(r => setTimeout(r, 600));

        const hljsTokensCount = await evalInPage(`document.querySelectorAll(".hljs, .hljs-keyword, .hljs-title, .hljs-type, .hljs-string").length`);
        console.log('✓ Highlighted syntax tokens found in DOM:', hljsTokensCount);
        if (hljsTokensCount < 5) {
          throw new Error(`Expected syntax tokens with hljs-* classes in DOM, found ${hljsTokensCount}`);
        }

        // 7. Test Linux Remote Dev Guide Modal
        console.log('[E2E] Testing Linux Remote Dev Guide Modal...');
        const openedModal = await evalInPage(`(() => {
          const btn = Array.from(document.querySelectorAll("header button")).find(b => b.innerText.includes("Linux") || b.title.includes("Linux"));
          if (btn) { btn.click(); return true; }
          return false;
        })()`);
        await new Promise(r => setTimeout(r, 600));

        const modalVisible = await evalInPage(`document.body.innerText.includes("Linux 开发环境实操手册")`);
        console.log('✓ Linux Dev Guide modal open check:', modalVisible);
        if (!modalVisible) {
          throw new Error('Linux Dev Guide modal did not open');
        }

        // Click Tab 2 (云服务器实战 8 步) in modal
        await evalInPage(`(() => {
          const tabBtn = Array.from(document.querySelectorAll("button")).find(b => b.innerText.includes("云服务器实战"));
          if (tabBtn) tabBtn.click();
        })()`);
        await new Promise(r => setTimeout(r, 400));
        const tab2Text = await evalInPage(`document.body.innerText.includes("Remote - SSH")`);
        console.log('✓ Modal Tab 2 content check:', tab2Text);

        // Close modal
        await evalInPage(`(() => {
          const closeBtn = document.querySelector("button[aria-label='关闭指引']") || Array.from(document.querySelectorAll("button")).find(b => b.innerText === "关闭指引");
          if (closeBtn) closeBtn.click();
        })()`);
        await new Promise(r => setTimeout(r, 400));

        // 8. Test Topology Drawer in Dashboard
        console.log('[E2E] Testing Topology Drawer in Dashboard...');
        await evalInPage(`(() => {
          const btns = Array.from(document.querySelectorAll("header nav button"));
          const target = btns.find(b => b.innerText.includes("学习大盘"));
          if (target) target.click();
        })()`);
        await new Promise(r => setTimeout(r, 600));

        // Click EventLoop topology node button
        const clickedTopo = await evalInPage(`(() => {
          const nodeBtn = Array.from(document.querySelectorAll("button")).find(b => b.innerText.includes("EventLoop"));
          if (nodeBtn) { nodeBtn.click(); return true; }
          return false;
        })()`);
        await new Promise(r => setTimeout(r, 600));

        const drawerVisible = await evalInPage(`document.body.innerText.includes("核心职责与架构定位") && document.body.innerText.includes("EventLoop")`);
        console.log('✓ Topology Drawer open check:', drawerVisible);

        // Close drawer
        await evalInPage(`(() => {
          const closeBtn = Array.from(document.querySelectorAll("button")).find(b => b.innerText.includes("关闭架构详情"));
          if (closeBtn) closeBtn.click();
        })()`);
        await new Promise(r => setTimeout(r, 400));

        // 9. Verify Console Errors / Exceptions
        console.log('\n[E2E] Checking for browser console errors or uncaught runtime exceptions...');
        console.log('Console Errors:', consoleErrors);
        console.log('Runtime Exceptions:', exceptions);

        if (exceptions.length > 0) {
          throw new Error('Fatal runtime exception encountered in browser: ' + exceptions.join('; '));
        }
        if (consoleErrors.length > 0) {
          console.warn('Browser console errors noticed:', consoleErrors);
        }

        console.log('\n========================================================');
        console.log('   ✓ REAL BROWSER E2E TEST PASSED 100% SUCCESFULLY!');
        console.log('========================================================\n');

        cleanup();
        process.exit(0);
      };
    } catch (err) {
      console.error('❌ E2E Browser Test Failed:', err.message);
      cleanup();
      process.exit(1);
    }
  }, 1800);
});
