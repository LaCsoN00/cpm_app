import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Consulting Public Management",
    short_name: "CPM",
    description: "Le cabinet qui vous accompagne dans tous vos projets",
    start_url: "/",
    display: "standalone",
    theme_color: "#FFFFFF",
    background_color: "#FFFFFF",
    orientation: "portrait",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
      },
      {
        src: "/icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    screenshots: [
      {
        src: "/screenshot1.png",
        sizes: "1920x1078",
        type: "image/png",
        form_factor: "wide",
      },
      {
        src: "/screenshot2.png",
        sizes: "720x1600",
        type: "image/png",
        form_factor: "narrow",
      },
    ],
    display_override: ["window-controls-overlay"],
    protocol_handlers: [
      {
        protocol: "web+tea",
        url: "/tea?type=%s",
      },
      {
        protocol: "web+coffee",
        url: "/coffee?type=%s",
      },
    ],
  };
}
