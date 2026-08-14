import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'images/*', 'videos/*', 'fonts/*'],
      manifest: {
        name: '\uB9C8\uC74C \uCC59\uAE40 - \uC624\uB298\uC758 \uBA85\uC0C1',
        short_name: '\uB9C8\uC74C \uCC59\uAE40',
        description: '\uC2DC\uAC04\uACFC \uBD84\uC704\uAE30\uC5D0 \uB9DE\uB294 \uBA85\uC0C1',
        theme_color: '#121c17',
        background_color: '#121c17',
        display: 'standalone',
        start_url: '/',
        lang: 'ko',
        icons: [
          {
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
  server: {
    host: true,
    port: 5173,
  },
})
