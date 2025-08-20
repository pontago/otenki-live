import type { NextConfig } from 'next';

// eslint-disable-next-line unused-imports/no-unused-imports, @typescript-eslint/no-unused-vars
import { env } from './lib/env';

const nextConfig: NextConfig = {
  serverExternalPackages: ['pino-pretty', 'pino'],
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  experimental: {
    isrFlushToDisk: false,
  },
};

export default nextConfig;
