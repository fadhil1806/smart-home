// next.config.mjs
import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve('./'); // Mengatur alias '@' ke root project
    return config;
  },
};

export default nextConfig;
