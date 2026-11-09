import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

function copyImagesPlugin(): Plugin {
  return {
    name: 'copy-images-and-sync-assets',
    closeBundle() {
      const srcImages = path.resolve(__dirname, 'images');
      const destImages = path.resolve(__dirname, 'dist/images');
      if (fs.existsSync(srcImages)) {
        fs.cpSync(srcImages, destImages, { recursive: true });
        console.log('✓ Copied images/ to dist/images/');
      }

      // Sync dist/assets to root assets/ for multi-channel GitHub Pages hosting
      const distAssets = path.resolve(__dirname, 'dist/assets');
      const rootAssets = path.resolve(__dirname, 'assets');
      if (fs.existsSync(distAssets)) {
        fs.cpSync(distAssets, rootAssets, { recursive: true });
        console.log('✓ Synced dist/assets/ to root assets/ for dual-channel static hosting');
      }

      // Ensure root .nojekyll
      fs.writeFileSync(path.resolve(__dirname, '.nojekyll'), '');
      fs.writeFileSync(path.resolve(__dirname, 'dist/.nojekyll'), '');
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), copyImagesPlugin()],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name].[ext]',
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (
              id.includes('/node_modules/react/') ||
              id.includes('\\node_modules\\react\\') ||
              id.includes('/node_modules/react-dom/') ||
              id.includes('\\node_modules\\react-dom\\') ||
              id.includes('/node_modules/scheduler/') ||
              id.includes('\\node_modules\\scheduler\\')
            ) {
              return 'vendor-react';
            }
            if (id.includes('highlight.js')) {
              return 'vendor-highlight';
            }
            if (id.includes('@tiptap') || id.includes('prosemirror') || id.includes('turndown') || id.includes('marked')) {
              return 'vendor-editor';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            return 'vendor-misc';
          }
        }
      }
    }
  },
  server: {
    port: 3000,
  },
});
