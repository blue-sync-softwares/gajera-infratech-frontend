/** @type {import('next').NextConfig} */
const basePath = "";

const nextConfig = {
  output: 'standalone',
  basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  
};

export default nextConfig;
