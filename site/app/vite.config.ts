import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// The site plays the video from the same scene code that renders the MP4 (video/animation).
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@film': path.resolve(__dirname, '../../video/animation/src') },
    dedupe: ['react', 'react-dom', 'gsap'],
  },
  server: { fs: { allow: [path.resolve(__dirname, '../..')] } },
  build: { chunkSizeWarningLimit: 2500 },
});
