import { z } from 'zod';
import { createEnv } from '@t3-oss/env-nextjs';

export const env = createEnv({
  client: {},
  server: {},
  shared: {
    NODE_ENV: z.enum(['development', 'production', 'test']),
    NEXT_PUBLIC_API_BASE_URL: z.string().url(),
    USE_MSW: z
      .string()
      .transform((val) => val === 'true')
      .default('false'),
  },
  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    USE_MSW: process.env.USE_MSW,
  },
});
