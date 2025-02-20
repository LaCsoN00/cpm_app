import type { NextConfig } from 'next';
import withPWA from 'next-pwa';

const nextConfig: NextConfig = {
  reactStrictMode: true, // Mise en place de React Strict Mode au niveau de Next.js
  pwa: {
    dest: 'public', // Dossier où seront générés les fichiers PWA
    disable: process.env.NODE_ENV === 'development', // Désactiver PWA en mode développement
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/your-api\.com\//, // Exemple d'API à mettre en cache
        handler: 'NetworkFirst', // Stratégie de mise en cache
        options: {
          cacheName: 'api-cache',
          expiration: {
            maxEntries: 10, // Nombre maximum d'entrées dans le cache
            maxAgeSeconds: 24 * 60 * 60, // Expiration après 24h
          },
        },
      },
    ],
  },
};

export default withPWA(nextConfig);
