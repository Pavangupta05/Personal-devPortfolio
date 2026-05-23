import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    open: true,
    host: true
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash][extname]',
        chunkFileNames: 'chunks/[name].[hash].js',
        entryFileNames: '[name].[hash].js',
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
