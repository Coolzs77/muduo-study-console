const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');

console.log('[GH-PAGES] Pushing dist/ directly to origin/gh-pages ...');
try {
  // Ensure clean dist git
  const distGit = path.join(distDir, '.git');
  if (fs.existsSync(distGit)) {
    fs.rmSync(distGit, { recursive: true, force: true });
  }

  execSync('git init', { cwd: distDir, stdio: 'inherit' });
  execSync('git checkout -b gh-pages', { cwd: distDir, stdio: 'inherit' });
  execSync('git add -A', { cwd: distDir, stdio: 'inherit' });
  const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
  const version = pkg.version || 'v6.3.0';
  execSync(`git commit -m "deploy: update production build on gh-pages (v${version})"`, { cwd: distDir, stdio: 'inherit' });
  
  const remoteUrl = execSync('git config --get remote.origin.url', { cwd: rootDir }).toString().trim();
  console.log('[GH-PAGES] Remote URL:', remoteUrl);
  execSync(`git remote add origin "${remoteUrl}"`, { cwd: distDir, stdio: 'inherit' });
  execSync('git push -f origin gh-pages', { cwd: distDir, stdio: 'inherit' });
  console.log('✓ [GH-PAGES] Successfully deployed to origin/gh-pages!');
} catch (e) {
  console.error('❌ Error deploying to gh-pages:', e.message);
} finally {
  try {
    const distGit = path.join(distDir, '.git');
    if (fs.existsSync(distGit)) {
      fs.rmSync(distGit, { recursive: true, force: true });
    }
  } catch (e) {}
}
