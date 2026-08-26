import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  
  
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png'],
      manifest: {
        name: 'Skycast — Weather',
        short_name: 'Skycast',
        description: 'Forecasts, conditions and saved cities, powered by OpenWeatherMap.',
        theme_color: '#0b1220',
        background_color: '#0b1220',
        display: 'standalone',
        start_url: '.',
        icons: [
          { src: 'icons/clear.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,woff2}'],
        runtimeCaching: [
          {
            
            urlPattern: /^https:\/\/api\.openweathermap\.org\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'owm-api',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
});
