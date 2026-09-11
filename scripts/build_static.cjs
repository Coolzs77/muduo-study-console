const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

console.log('[BUILD] Packaging decoupled static web console into dist/ ...');

if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      copyRecursive(path.join(src, child), path.join(dest, child));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

// 1. Copy index.html
if (fs.existsSync(path.join(rootDir, 'index.html'))) {
  fs.copyFileSync(path.join(rootDir, 'index.html'), path.join(distDir, 'index.html'));
  console.log('✓ Copied index.html -> dist/index.html');
}

// 2. Copy classic.html
if (fs.existsSync(path.join(rootDir, 'classic.html'))) {
  fs.copyFileSync(path.join(rootDir, 'classic.html'), path.join(distDir, 'classic.html'));
  console.log('✓ Copied classic.html -> dist/classic.html');
}

// 3. Copy css/
if (fs.existsSync(path.join(rootDir, 'css'))) {
  copyRecursive(path.join(rootDir, 'css'), path.join(distDir, 'css'));
  console.log('✓ Copied css/ -> dist/css/');
}

// 4. Copy js/
if (fs.existsSync(path.join(rootDir, 'js'))) {
  copyRecursive(path.join(rootDir, 'js'), path.join(distDir, 'js'));
  console.log('✓ Copied js/ -> dist/js/');
}

// 5. Copy images/
if (fs.existsSync(path.join(rootDir, 'images'))) {
  copyRecursive(path.join(rootDir, 'images'), path.join(distDir, 'images'));
  console.log('✓ Copied images/ -> dist/images/');
}

console.log('[BUILD SUCCESS] Production ready static build in dist/');
