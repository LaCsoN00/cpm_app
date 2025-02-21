import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Consulting Public Management',
    short_name: 'Cpm',
    description: 'Une entreprise qui vous accompagne dans vos projets',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/public/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/public/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/public/icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
      },
      {
        src: '/public/icon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
      },
      {
        src: '/public/icon-72x72.png',
        sizes: '72x72',
        type: 'image/png',
      },
      {
        src: '/public/icon-48x48.png',
        sizes: '48x48',
        type: 'image/png',
      },
      {
        src: '/public/icon-36x36.png',
        sizes: '36x36',
        type: 'image/png',
      },
      {
        src: '/public/maskable-192x19.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      
    ],
  }
}