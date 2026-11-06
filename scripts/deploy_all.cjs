const { execSync } = require('child_process');
const path = require('path');
const rootDir = path.resolve(__dirname, '..');

console.log('[DEPLOY-ALL] Starting Git Commit & Remote Push...');
try {
  execSync('git add .', { cwd: rootDir, stdio: 'inherit' });
  execSync('git commit -m "feat: 全站大屏流式全宽自适应与全栏目左侧导航折叠 (v6.3.0)"', { cwd: rootDir, stdio: 'inherit' });
  console.log('[DEPLOY-ALL] Pushing main branch to origin/main...');
  execSync('git push origin main', { cwd: rootDir, stdio: 'inherit' });
  console.log('✓ [DEPLOY-ALL] Pushed main successfully!');
  
  console.log('[DEPLOY-ALL] Deploying gh-pages branch...');
  require('./deploy_gh_pages.cjs');
} catch (e) {
  console.error('❌ [DEPLOY-ALL] Error:', e.message);
  process.exit(1);
}
