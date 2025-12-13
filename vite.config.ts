import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-manifest',
      closeBundle() {
        // Copy manifest.json to dist
        const manifestSrc = resolve('manifest.json');
        const manifestDest = resolve('dist', 'manifest.json');
        if (fs.existsSync(manifestSrc)) {
          fs.copyFileSync(manifestSrc, manifestDest);
          console.log('Copied manifest.json to dist/');
        }
        
        // Copy metadata.json to dist (if exists)
        const metaSrc = resolve('metadata.json');
        const metaDest = resolve('dist', 'metadata.json');
        if (fs.existsSync(metaSrc)) {
          fs.copyFileSync(metaSrc, metaDest);
        }
      }
    }
  ],
  build: {
    rollupOptions: {
      input: {
        popup: resolve('popup.html'),
        panel: resolve('panel.html'),
        devtools: resolve('devtools.html'),
        background: resolve('background.ts') 
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    },
    outDir: 'dist',
    emptyOutDir: true
  }
});