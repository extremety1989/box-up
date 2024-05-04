import { defineConfig } from 'vite'
import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
  base: '/box-up/',
    server: {
        https: true,
        host: true
      },
  plugins: [ mkcert() ]
})