'use client';

import { use } from 'react';

import { env } from '@/lib/env';

const mockingEnabledPromise =
  typeof window !== 'undefined' && env.USE_MSW
    ? import('@/mocks/browser').then(async ({ worker }) => {
        await worker.start({
          onUnhandledRequest(request, print) {
            if (
              request.url.includes('_next') ||
              request.url.startsWith('/mocks') ||
              request.url.startsWith('/optimized')
            ) {
              return;
            }
            print.warning();
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
