const { execSync } = require('child_process');
const path = require('path');
const rootDir = path.resolve(__dirname, '..');

console.log('[DEPLOY-ALL] Starting Git Commit & Remote Push...');
try {
  execSync('git add .', { cwd: rootDir, stdio: 'inherit' });
  const fs = require('fs');
  const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
  const version = pkg.version || '6.5.0';
  execSync(`git commit -m "feat: 任务行内代码高亮、仪表盘四色卡片、专注计时跨Tab持久化与时长调整至3h (v${version})"`, { cwd: rootDir, stdio: 'inherit' });
  console.log('[DEPLOY-ALL] Pushing main branch to origin/main...');
  execSync('git push origin main', { cwd: rootDir, stdio: 'inherit' });
  console.log('✓ [DEPLOY-ALL] Pushed main successfully!');
  
  console.log('[DEPLOY-ALL] Deploying gh-pages branch...');
  require('./deploy_gh_pages.cjs');
} catch (e) {
  console.error('❌ [DEPLOY-ALL] Error:', e.message);
  process.exit(1);
}
