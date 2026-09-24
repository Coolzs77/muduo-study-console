const http = require('http');
const { spawn } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const userDataDir = 'C:\\Users\\86166\\AppData\\Local\\Temp\\edge_bench_' + Date.now();

const edge = spawn(edgePath, [
  '--headless=new',
  '--remote-debugging-port=9295',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

setTimeout(async () => {
  try {
    const res = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9295/json/list', r => {
        let d = ''; r.on('data', c => d += c); r.on('end', () => resolve(JSON.parse(d)));
      }).on('error', reject);
    });
    const target = res.find(t => t.type === 'page') || res[0];
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    let id = 1;
    function send(m, p={}) {
      return new Promise(resolve => {
        const mid = id++;
        const fn = (e) => {
          const d = JSON.parse(e.data);
          if (d.id === mid) { ws.removeEventListener('message', fn); resolve(d.result); }
        };
        ws.addEventListener('message', fn);
        ws.send(JSON.stringify({ id: mid, method: m, params: p }));
      });
    }
    ws.onopen = async () => {
      await send('Page.enable');
      await send('Runtime.enable');

      await send('Page.navigate', { url: 'file:///e:/workspace/muduo-study-console/index.html' });
      await new Promise(r => setTimeout(r, 3000));

      const fnTimes = await send('Runtime.evaluate', {
        expression: `(() => {
          const t = {};
          let t0 = performance.now();
          renderHomeDashboard();
          t.renderHomeDashboard = Math.round(performance.now() - t0);

          t0 = performance.now();
          renderModuleHierarchyMap();
          t.renderModuleHierarchyMap = Math.round(performance.now() - t0);

          t0 = performance.now();
          renderDailyCards();
          t.renderDailyCards = Math.round(performance.now() - t0);

          t0 = performance.now();
          renderMappingTable();
          t.renderMappingTable = Math.round(performance.now() - t0);

          t0 = performance.now();
          renderLearningSystem();
          t.renderLearningSystem = Math.round(performance.now() - t0);

          t0 = performance.now();
          renderCareerSystem();
          t.renderCareerSystem = Math.round(performance.now() - t0);

          return JSON.stringify(t);
        })()`,
        returnByValue: true
      });
      console.log('Function execution times:', JSON.stringify(fnTimes));

      edge.kill();
      process.exit(0);
    };
  } catch(e) {
    console.error(e);
    edge.kill();
    process.exit(1);
  }
}, 1500);
