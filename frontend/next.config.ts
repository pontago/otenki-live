import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['pino-pretty', 'pino'],
};

export default nextConfig;
