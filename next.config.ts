// next.config.ts (o next.config.mjs / .js)
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**', // Permite cualquier ruta dentro de Cloudinary
      },
    ],
  },
};

export default nextConfig;
