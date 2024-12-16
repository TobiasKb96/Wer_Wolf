import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "build",     // Clean output directory
    assetsDir: "assets", // Static assets go here
    emptyOutDir: true,   // Clear the 'build' directory before building
  },
})
