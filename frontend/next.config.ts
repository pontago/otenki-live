import type { NextConfig } from 'next';

// eslint-disable-next-line unused-imports/no-unused-imports, @typescript-eslint/no-unused-vars
import { env } from './lib/env';

const nextConfig: NextConfig = {
  // msw 3 (ESM-only) は SSR でバンドルされると msw/node の読み込みで
  // ERR_INVALID_ARG_TYPE になるため、Node.js から直接読み込ませる。
  serverExternalPackages: ['pino-pretty', 'pino', 'msw'],
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  experimental: {
    isrFlushToDisk: false,
  },
};

export default nextConfig;
