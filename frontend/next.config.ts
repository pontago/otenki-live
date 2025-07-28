import type { NextConfig } from 'next';
import { env } from './lib/env';

const nextConfig: NextConfig = {
  serverExternalPackages: ['pino-pretty', 'pino'],
};

export default nextConfig;
