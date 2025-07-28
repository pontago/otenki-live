'use client';

import { env } from '@/lib/env';
import { use } from 'react';

const mockingEnabledPromise =
  typeof window !== 'undefined' && env.USE_MSW === true
    ? import('@/mocks/browser').then(async ({ worker }) => {
        await worker.start({
          onUnhandledRequest(request, print) {
            if (request.url.includes('_next')) {
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
