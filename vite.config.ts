import path from 'node:path'
import Vue from '@vitejs/plugin-vue'

import Unocss from 'unocss/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { viteSingleFile } from 'vite-plugin-singlefile'

import { defineConfig } from 'vite'

// 判断是否为单文件构建模式
const isSingleFile = process.env.BUILD_MODE === 'single'

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // 使用相对路径，适配GitHub Pages
  
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
      'crypto': path.resolve(__dirname, 'src/polyfills/crypto-shim.ts'),
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "~/styles/element/index.scss" as *;`,
      },
    },
  },

  plugins: [
    Vue(),

    Components({
      // allow auto load markdown components under `./src/components/`
      extensions: ['vue', 'md'],
      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass',
        }),
      ],
      dts: 'src/components.d.ts',
    }),

    // https://github.com/antfu/unocss
    // see uno.config.ts for config
    Unocss(),

    // Node.js polyfills for browser
    nodePolyfills({
      include: ['buffer', 'process', 'util', 'stream', 'crypto'],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),

    // 仅在单文件模式下启用 viteSingleFile 插件
    ...(isSingleFile ? [viteSingleFile()] : []),
  ],

  build: {
    target: 'esnext',
    outDir: isSingleFile ? 'docs/offline' : 'docs',
    assetsInlineLimit: isSingleFile ? 100000000 : 4096, // 单文件模式内联所有资源
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: !isSingleFile,
    rollupOptions: {
      output: {
        inlineDynamicImports: isSingleFile,
      },
    },
  },
})
