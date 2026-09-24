const http = require('http');
const { spawn } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const userDataDir = 'C:\\Users\\86166\\AppData\\Local\\Temp\\edge_check_err_' + Date.now();

const edge = spawn(edgePath, [
  '--headless=new',
  '--remote-debugging-port=9298',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

setTimeout(async () => {
  try {
    const listRes = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9298/json/list', r => {
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
          if (d.id === msgId) { ws.removeEventListener('message', fn); resolve(d.result); }
        };
        ws.addEventListener('message', fn);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    ws.onopen = async () => {
      await send('Page.enable');
      await send('Runtime.enable');
      await send('Console.enable');

      const consoleMsgs = [];
      ws.addEventListener('message', e => {
        const m = JSON.parse(e.data);
        if (m.method === 'Console.messageAdded') {
          consoleMsgs.push(`[${m.params.message.level}] ${m.params.message.text}`);
        } else if (m.method === 'Runtime.exceptionThrown') {
          consoleMsgs.push(`[EXCEPTION] ${JSON.stringify(m.params.exceptionDetails)}`);
        }
      });

      await send('Page.navigate', { url: 'file:///e:/workspace/muduo-study-console/index.html' });
      await new Promise(r => setTimeout(r, 2000));

      const innerP = await send('Runtime.evaluate', {
        expression: 'document.getElementById("home-project-progress-content")?.innerHTML',
        returnByValue: true
      });
      const innerM = await send('Runtime.evaluate', {
        expression: 'document.getElementById("home-muduo-progress-content")?.innerHTML',
        returnByValue: true
      });

      console.log('Console messages:', consoleMsgs);
      console.log('Project progress HTML length:', innerP?.result?.value?.length);
      console.log('Muduo progress HTML length:', innerM?.result?.value?.length);
      console.log('Project HTML snippet:', innerP?.result?.value?.slice(0, 300));
      console.log('Muduo HTML snippet:', innerM?.result?.value?.slice(0, 300));

      edge.kill();
      process.exit(0);
    };
  } catch(e) {
    console.error(e);
    edge.kill();
    process.exit(1);
  }
}, 1500);
