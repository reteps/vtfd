import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'
import { resolve, dirname } from 'path'
import { globSync } from 'glob'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

/* https://stackoverflow.com/questions/52668243/having-vue-components-as-entry-point-instead-of-main-js */
function entryPointContent(importPath) {
  return `
import { createApp } from 'vue'
import App from '@/pages/${importPath}'
import '@/style.css'

createApp(App).mount('#app')  
  `.trim();
}

const pages = globSync("**/*.vue", { cwd: resolve(__dirname, "src", "pages") })
fs.rmSync(resolve(__dirname, "src/entries"), { recursive: true })

pages.forEach((page) => {
  const content = entryPointContent(page)
  const entryPoint = resolve(__dirname, "src/entries", page.replace(".vue", ".ts"))
  if (!fs.existsSync(dirname(entryPoint))) {
    fs.mkdirSync(dirname(entryPoint))
  }
  fs.writeFileSync(entryPoint, content)
});

const inputs = globSync("**/*.ts", { cwd: resolve(__dirname, "src", "entries") })
.reduce((acc, item) => {
  acc[item.replace(".ts", "")] = resolve(__dirname, "src/entries", item)
  return acc
}, {})

const themeRoot = '/themes/vtfd/static'

export default defineConfig({
  plugins: [cssInjectedByJsPlugin({
    jsAssetsFilterFunction(chunk) {
      // Inject CSS into entry points
      return chunk.name && Object.keys(inputs).includes(chunk.name);
  } }), vue()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src")
    }
  },
  base: themeRoot,
  build: {
    manifest: true,
    outDir: "static",
    rollupOptions: {
      // output: {
      //   assetFileNames: `${themeRoot}/assets/[name]-[hash][extname]`,
      // },
      input: inputs
    }
  }
})
