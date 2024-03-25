import path  from "path"
import react from "@vitejs/plugin-react"
import { defineConfig }  from "vite"
import { fileURLToPath } from 'url';

// https resolver
import mkcert from 'vite-plugin-mkcert'



// because __dirname was showing undefined
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

export default defineConfig({
  server: { https: true }, // Not needed for Vite 5+
  plugins: [react() ],
  plugins: [react(), mkcert() ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
})


// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
