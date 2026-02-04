import { MetadataRoute } from 'next';

/**
 * Web App Manifest для PWA
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Detailing Volgograd - Автомойка и детейлинг',
    short_name: 'Detailing VLG',
    description: 'Профессиональная автомойка и детейлинг в Волгограде. Онлайн запись на услуги.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#22d3ee',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
