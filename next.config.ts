import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import maplibre from 'maplibre-gl/package.json' with { type: 'json' };

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // La versió de MapLibre, per trobar la còpia del seu worker a public/vendor.
  env: { NEXT_PUBLIC_MAPLIBRE_VERSION: maplibre.version },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Les fotos del catàleg al magatzem públic de la plataforma (vegeu src/lib/imatges.ts).
    remotePatterns: [{ protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/public/**' }],
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default createNextIntlPlugin('./src/i18n/request.ts')(nextConfig);
