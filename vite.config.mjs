// Plugins
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import Fonts from 'unplugin-fonts/vite';
import Layouts from 'vite-plugin-vue-layouts';
import Vue from '@vitejs/plugin-vue';
import VueRouter from 'unplugin-vue-router/vite';
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';
import { VuetifyResolver } from 'unplugin-vue-components/resolvers';

// Utilities
import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import path from 'path';

import electron from 'vite-plugin-electron';
import { spawn } from 'child_process';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    electron({
      entry: 'src/electron/main.js',
      vite: {
        build: {
          outDir: 'dist-electron',
          rollupOptions: {
            input: {
              main: 'src/electron/main.js',
              preload: 'src/electron/preload.js', // 如果你有 preload 脚本
            },
          },
        },
        resolve: {
          alias: {
            '#': path.resolve(__dirname, './src/electron'),
          },
        },
      },
    }),
    VueRouter({
      // 确保这里的路径正确指向你的页面目录
      routesFolder: 'src/renderer/pages',
    }),
    Layouts(),
    Vue({
      template: { transformAssetUrls },
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
    Vuetify({
      autoImport: true,
      styles: {
        configFile: 'src/renderer/styles/settings.scss',
      },
    }),
    Components({
      // 指定组件所在的目录
      dirs: ['src/renderer/components'],
      // 配置组件的扩展名
      extensions: ['vue'],
      // 配置自动导入的解析器
      resolvers: [VuetifyResolver()],
      // 生成 `components.d.ts` 全局声明文件
      dts: true,
    }),
    Fonts(),
    AutoImport({
      imports: ['vue', 'vue-router'],
      eslintrc: {
        enabled: true,
      },
      vueTemplate: true,
    }),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000, // 将警告阈值提高到 1000 kB
    rollupOptions: {
      external: [/^electron/],
      output: {
        manualChunks: {
          vendor: ['vue', 'vuetify'], // 更新为包含 vuetify
          // 可以根据需要添加更多的 chunks
        },
      },
    },
    assetsInlineLimit: 0, // 禁用小文件内联,确保所有资源文件都会被复制
  },
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src/renderer', import.meta.url)),
    },
    extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
  },
  // server: {
  //   port: 3033,
  // },
  clearScreen: true,
});
