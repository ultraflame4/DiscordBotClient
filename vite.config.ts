import fs from 'fs'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'
import pkg from './package.json'



// https://vitejs.dev/config/
export default defineConfig(({ command }) => {

  const isServe = command === 'serve'
  const isBuild = command === 'build'
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG

  return {
    plugins: [
      vue(),
      electron([
        {
          // Main-Process entry file of the Electron App.
          entry: 'electron/app.ts',
          vite: {
            build: {
              sourcemap,
              minify: isBuild,
              outDir: 'dist-electron',
              rollupOptions: {
                external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
              },
              emptyOutDir: false,
            },
          },
        },
        {
          entry: 'electron/preload/preload.ts',
          onstart(options) {
            // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete, 
            // instead of restarting the entire Electron App.
            options.reload()
          },
          vite: {
            build: {
              sourcemap: sourcemap ? 'inline' : undefined, // #332
              minify: isBuild,
              outDir: 'dist-electron/preload',
              emptyOutDir: true,
              rollupOptions: {
                external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
              },
            },
          },
        }
      ])
    ],


    clearScreen: false,
  }
})
