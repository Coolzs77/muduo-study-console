import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

function copyImagesPlugin(): Plugin {
  return {
    name: 'copy-images',
    closeBundle() {
      const srcImages = path.resolve(__dirname, 'images');
      const destImages = path.resolve(__dirname, 'dist/images');
      if (fs.existsSync(srcImages)) {
        fs.cpSync(srcImages, destImages, { recursive: true });
        console.log('✓ Copied images/ to dist/images/');
      }
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
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('highlight.js')) {
              return 'vendor-highlight';
            }
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
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
