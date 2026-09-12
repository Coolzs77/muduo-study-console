const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

console.log('=== [Browser Context Simulation Test: All Frontend Scripts] ===\n');

// 构造拟真浏览器环境
const window = {
  location: { href: 'http://localhost:3000/' },
  addEventListener: () => {},
  document: {
    addEventListener: () => {},
    getElementById: (id) => {
      return {
        classList: { add: () => {}, remove: () => {}, contains: () => false },
        innerText: '',
        innerHTML: '',
        value: '',
        style: {},
        addEventListener: () => {}
      };
    },
    querySelectorAll: () => [],
    querySelector: () => null,
    createElement: () => ({ setAttribute: () => {}, style: {}, appendChild: () => {} }),
    body: { appendChild: () => {} }
  },
  localStorage: {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = String(v); },
    removeItem(k) { delete this._data[k]; }
  }
};
window.window = window;
window.globalThis = window;
const globalContext = vm.createContext(window);

// 提取 index.html 中引入的所有 js 脚本
const indexHtml = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
const scriptMatches = [...indexHtml.matchAll(/<script src="(js\/[^"?]+)/g)].map(m => m[1]);

console.log('Detected script sequence from index.html:');
scriptMatches.forEach((s, idx) => console.log(`  ${idx + 1}. ${s}`));

// 逐个顺序执行脚本
scriptMatches.forEach(scriptRelPath => {
  const absPath = path.resolve(__dirname, '..', scriptRelPath);
  const code = fs.readFileSync(absPath, 'utf8');
  try {
    vm.runInContext(code, globalContext);
    console.log(`✓ Evaluated ${scriptRelPath} cleanly`);
  } catch (err) {
    console.error(`❌ Failed to evaluate ${scriptRelPath}:`, err);
    process.exit(1);
  }
});

// 验证上下文核心全局变量
assert.ok(globalContext.DAYS_DATASET, 'DAYS_DATASET must be defined');
assert.ok(globalContext.DOMAIN_PROJECTS, 'DOMAIN_PROJECTS must be defined');
assert.ok(globalContext.DOMAIN_MODULES, 'DOMAIN_MODULES must be defined');
assert.ok(globalContext.StateManager, 'StateManager must be defined');
assert.ok(globalContext.appState, 'appState must be defined');
assert.strictEqual(globalContext.appState.version, '6.0.0', 'appState.version should be 6.0.0');

console.log('\n🎉 ALL SCRIPTS LOADED & INITIALIZED CLEANLY IN MOCK BROWSER ENVIRONMENT!');
