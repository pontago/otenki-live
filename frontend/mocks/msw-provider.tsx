'use client';

import { use } from 'react';

import { env } from '@/lib/env';

const mockingEnabledPromise =
  typeof window !== 'undefined' && env.USE_MSW
    ? import('@/mocks/browser').then(async ({ worker }) => {
        await worker.start({
          onUnhandledFrame({ frame, defaults }) {
            // msw 3 の公開型では frame.data が unknown のため、protocol で判定してから型を付ける。
            if (frame.protocol === 'http') {
              const { url } = (frame.data as { request: Request }).request;
              if (url.includes('_next') || url.startsWith('/mocks') || url.startsWith('/optimized')) {
                return;
              }
            }
            defaults.warn();
          },
        });
      })
    : Promise.resolve();

function MSWProviderWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  use(mockingEnabledPromise);
  return children;
}

export const MSWProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <MSWProviderWrapper>{children}</MSWProviderWrapper>;
};
