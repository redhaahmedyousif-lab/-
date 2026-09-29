import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // مسارات نسبية حتى يعمل الموقع من أي مسار فرعي (مثل GitHub Pages: /<repo>/)
  base: './',
});
