import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base so the built site works from any Netlify path or subfolder.
export default defineConfig({
  base: './',
  plugins: [react()],
  // Keep JS/CSS bundles in /static so the site's own /assets folder stays free
  // for real product images/video (assets/origin.jpg, assets/origin.mp4 …).
  build: {
    assetsDir: 'static',
    rollupOptions: {
      output: {
        // Fonts keep stable, unhashed names so index.html can preload them by
        // path. Everything else stays content-hashed for long-term caching.
        assetFileNames: (info) => {
          const n = info.name || '';
          if (/\.woff2?$/.test(n)) return 'fonts/[name][extname]';
          return 'static/[name]-[hash][extname]';
        },
      },
    },
  },
});
