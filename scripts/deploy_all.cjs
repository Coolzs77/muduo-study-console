const { execSync } = require('child_process');
const path = require('path');
const rootDir = path.resolve(__dirname, '..');

console.log('[DEPLOY-ALL] Starting Git Commit & Remote Push...');
try {
  execSync('git add .', { cwd: rootDir, stdio: 'inherit' });
  const fs = require('fs');
  const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
  const version = pkg.version || '6.4.0';
  execSync(`git commit -m "fix: 消除外网首屏阻塞、注入美观启动动画、清理侧栏备忘与任务日历精简 (v${version})"`, { cwd: rootDir, stdio: 'inherit' });
  console.log('[DEPLOY-ALL] Pushing main branch to origin/main...');
  execSync('git push origin main', { cwd: rootDir, stdio: 'inherit' });
  console.log('✓ [DEPLOY-ALL] Pushed main successfully!');
  
  console.log('[DEPLOY-ALL] Deploying gh-pages branch...');
  require('./deploy_gh_pages.cjs');
} catch (e) {
  console.error('❌ [DEPLOY-ALL] Error:', e.message);
  process.exit(1);
}
