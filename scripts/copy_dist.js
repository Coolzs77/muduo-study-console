import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

console.log('[SYNC] Starting sync from dist/ to repository root...');

if (!fs.existsSync(distDir)) {
  console.error('[ERROR] dist directory does not exist! Run vite build first.');
  process.exit(1);
}

// 1. Check dist/index.html
const distHtml = path.join(distDir, 'index.html');
if (fs.existsSync(distHtml)) {
  const destHtml = path.join(rootDir, 'index.html');
  fs.copyFileSync(distHtml, destHtml);
  console.log(`[OK] Copied ${distHtml} -> ${destHtml}`);
} else {
  console.error('[ERROR] dist/index.html not found!');
  process.exit(1);
}

// 2. Copy dist/assets/ to root assets/
const distAssets = path.join(distDir, 'assets');
const rootAssets = path.join(rootDir, 'assets');

if (fs.existsSync(distAssets)) {
  if (!fs.existsSync(rootAssets)) {
    fs.mkdirSync(rootAssets, { recursive: true });
  }

  // Clear old assets in rootAssets
  const existingFiles = fs.readdirSync(rootAssets);
  for (const file of existingFiles) {
    fs.unlinkSync(path.join(rootAssets, file));
  }

  // Copy new assets
  const files = fs.readdirSync(distAssets);
  for (const file of files) {
    fs.copyFileSync(path.join(distAssets, file), path.join(rootAssets, file));
    console.log(`[OK] Copied asset: ${file}`);
  }
}

console.log('[DONE] Dual sync completed successfully! Both dist/ and root are production ready.');
