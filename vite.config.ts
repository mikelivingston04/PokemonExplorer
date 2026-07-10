import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // GitHub Pages serves this project from /PokemonExplorer/, not the domain
  // root — only applied to the production build so local dev still runs at "/".
  base: command === 'build' ? '/PokemonExplorer/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    modules: {
      // Keeps class names traceable in devtools, e.g. `.card` in
      // Button.module.scss becomes `button__card` in the DOM — inspect an
      // element, read the class, know exactly which file to open.
      generateScopedName: '[name]__[local]',
    },
    preprocessorOptions: {
      scss: {
        // Lets any .scss file write `@use 'styles/mixins' as *;` regardless
        // of how deep it's nested, instead of counting `../../..`.
        loadPaths: [path.resolve(__dirname, './src')],
      },
    },
  },
}))
