import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Builds the prerender entry for Node. Output is consumed by tools/prerender.mjs
// and never shipped to the browser.
export default defineConfig({
  plugins: [react()],
  build: {
    ssr: 'src/entry-server.jsx',
    outDir: 'dist-ssr',
    // CSS is already inlined into the artifact by the client build; the SSR
    // bundle only needs the markup.
    cssCodeSplit: false,
    reportCompressedSize: false,
  },
});
