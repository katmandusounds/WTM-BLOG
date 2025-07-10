/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://ifuno.uk' : '',
};

module.exports = nextConfig;
