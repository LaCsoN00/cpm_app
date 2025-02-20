import type { NextConfig } from "next";
import withPWA from 'next-pwa';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    buildExcludes: [/middleware-manifest.json$/],
  },

};

export default withPWA(nextConfig);
