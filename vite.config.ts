import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Use the new SVG logo
      includeAssets: ['favicon.ico', 'logo.svg'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
      devOptions: {
        enabled: true,
        type: 'module',
      },
      manifest: {
        name: 'Ekal Survey Application',
        short_name: 'EkalSurvey',
        description: 'An offline-capable survey application for the Ekal Foundation.',
        theme_color: '#FF6A00',
        background_color: '#ffffff',
        display_override: ["standalone", "fullscreen"],
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/logo.svg', // Point to the new SVG
            sizes: '192x192',
            type: 'image/svg+xml',
          },
          {
            src: '/logo.svg', // Point to the new SVG
            sizes: '512x512',
            type: 'image/svg+xml',
          },
          {
            src: '/logo.svg', // Point to the new SVG
            sizes: 'any',
            purpose: 'any maskable',
            type: 'image/svg+xml',
          },
        ],
      },
    }),
  ],
});
