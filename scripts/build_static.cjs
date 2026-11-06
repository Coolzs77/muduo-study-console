const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

console.log('[BUILD] Packaging modern Vite React SPA into dist/ ...');

try {
  // Execute modern Vite build
  execSync('npx vite build', {
    cwd: rootDir,
    stdio: 'inherit'
  });
  console.log('✓ Successfully completed Vite production build');
} catch (e) {
  console.error('❌ Vite build failed:', e.message);
  process.exit(1);
}

// Ensure classic.html is also copied into dist for standalone backup access
if (fs.existsSync(path.join(rootDir, 'classic.html'))) {
  fs.copyFileSync(path.join(rootDir, 'classic.html'), path.join(distDir, 'classic.html'));
  console.log('✓ Copied classic.html -> dist/classic.html');
}

// Ensure .nojekyll exists in dist for GitHub Pages SPA routing
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
console.log('✓ Created dist/.nojekyll');

console.log('[BUILD SUCCESS] Production ready static build in dist/');
