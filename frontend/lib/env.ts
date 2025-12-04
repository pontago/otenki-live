import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  client: {},
  server: {
    SECRET_KEY: z.string(),
  },
  shared: {
    NODE_ENV: z.enum(['development', 'production', 'test']),
    NEXT_PUBLIC_BASE_URL: z.string().url(),
    NEXT_PUBLIC_API_BASE_URL: z.string().url(),
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: z.string().optional(),
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: z.string(),
    USE_MSW: z
      .string()
      .transform((val) => val === 'true')
      .default(false),
  },
  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
    USE_MSW: process.env.USE_MSW,
  },
});
