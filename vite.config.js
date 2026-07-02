import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/pjsk/',
  server: {
    port: 3000,
    open: false,
  },
  build: {
    outDir: 'build', // CRA 默认输出是 build/，为了兼容原有的部署和 nginx/docker，我们配置为 build
  },
});
