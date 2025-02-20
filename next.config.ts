import type { NextConfig } from 'next';
import withPWA from 'next-pwa';

const nextConfig: NextConfig = {
  reactStrictMode: true, 
  pwa: {
    dest: 'public', 
    disable: process.env.NODE_ENV === 'development',
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/your-api\.com\//,
        handler: 'NetworkFirst', 
        options: {
          cacheName: 'api-cache',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 24 * 60 * 60,
          },
        },
      },
    ],
  },
};

export default withPWA(nextConfig);
