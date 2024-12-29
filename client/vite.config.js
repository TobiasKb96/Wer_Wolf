import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import fs from "fs";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  plugins: [react()],
  build: {
    outDir: "build",     // Clean output directory
    assetsDir: "assets", // Static assets go here
    emptyOutDir: true,   // Clear the 'build' directory before building
  },
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, './certs/cert.key')),
      cert: fs.readFileSync(path.resolve(__dirname, './certs/cert.crt')),
    }
  }
})
