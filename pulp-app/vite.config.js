import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base so the built site works from any Netlify path or subfolder.
export default defineConfig({
  base: './',
  plugins: [react()],
  // Keep JS/CSS bundles in /static so the site's own /assets folder stays free
  // for real product images/video (assets/origin.jpg, assets/origin.mp4 …).
  build: { assetsDir: 'static' },
});
