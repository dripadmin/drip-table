import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  optimizeDeps: {
    include: ['@element-plus/icons-vue', 'element-plus'],
  },
  server: {
    fs: {
      // 允许访问到组件库源码，以便通过相对路径引入 ../../../packages
      allow: [resolve(__dirname, '../../..')],
    },
  },
});