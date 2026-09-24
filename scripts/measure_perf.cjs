const http = require('http');
const { spawn } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const userDataDir = 'C:\\Users\\86166\\AppData\\Local\\Temp\\edge_perf_test_' + Date.now();

const edge = spawn(edgePath, [
  '--headless=new',
  '--remote-debugging-port=9293',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

setTimeout(async () => {
  try {
    const res = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9293/json/list', r => {
        let d = ''; r.on('data', c => d += c); r.on('end', () => resolve(JSON.parse(d)));
      }).on('error', reject);
    });
    const target = res.find(t => t.type === 'page') || res[0];
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    let id = 1;
    function send(m, p={}) {
      return new Promise(res => {
        const mid = id++;
        const fn = (e) => {
          const d = JSON.parse(e.data);
          if (d.id === mid) { ws.removeEventListener('message', fn); res(d.result); }
        };
        ws.addEventListener('message', fn);
        ws.send(JSON.stringify({ id: mid, method: m, params: p }));
      });
    }
    ws.onopen = async () => {
      await send('Page.enable');
      await send('Runtime.enable');
      await send('Network.enable');

      const requests = {};
      ws.addEventListener('message', e => {
        const m = JSON.parse(e.data);
        if (m.method === 'Network.requestWillBeSent') {
          requests[m.params.requestId] = { url: m.params.request.url, start: m.params.timestamp };
        } else if (m.method === 'Network.loadingFinished') {
          if (requests[m.params.requestId]) requests[m.params.requestId].end = m.params.timestamp;
        } else if (m.method === 'Network.loadingFailed') {
          if (requests[m.params.requestId]) {
            requests[m.params.requestId].failed = true;
            requests[m.params.requestId].errorText = m.params.errorText;
          }
        }
      });

      console.log('Navigating to file:///e:/workspace/muduo-study-console/index.html...');
      const t0 = Date.now();
      await send('Page.navigate', { url: 'file:///e:/workspace/muduo-study-console/index.html' });
      await new Promise(r => setTimeout(r, 4000));
      const navDuration = Date.now() - t0;
      console.log('Total nav wait:', navDuration);

      const navTiming = await send('Runtime.evaluate', {
        expression: 'JSON.stringify(performance.getEntriesByType("navigation")[0])',
        returnByValue: true
      });
      console.log('Nav timing:', navTiming?.result?.value);

      const resTimings = await send('Runtime.evaluate', {
        expression: 'JSON.stringify(performance.getEntriesByType("resource").map(r => ({ name: r.name, duration: Math.round(r.duration), initiatorType: r.initiatorType })))',
        returnByValue: true
      });
      console.log('Resource timings:');
      const resources = JSON.parse(resTimings?.result?.value || '[]');
      resources.sort((a,b) => b.duration - a.duration);
      resources.forEach(r => console.log(`  ${r.duration}ms : [${r.initiatorType}] ${r.name.slice(0, 80)}`));

      // Test switching views
      const switchTest = await send('Runtime.evaluate', {
        expression: `(() => {
          const times = {};
          ['dashboard', 'mapping', 'daily', 'learning', 'career', 'knowledge'].forEach(v => {
            const t0 = performance.now();
            switchView(v);
            times[v] = Math.round(performance.now() - t0);
          });
          return JSON.stringify(times);
        })()`,
        returnByValue: true
      });
      console.log('View switch times:', switchTest?.result?.value);

      edge.kill();
      process.exit(0);
    };
  } catch (err) {
    console.error('Error:', err);
    edge.kill();
    process.exit(1);
  }
}, 1500);
