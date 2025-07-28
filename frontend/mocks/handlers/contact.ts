import { http, HttpResponse } from 'msw';

import { ContactResponse } from '@/features/contact/types/contact';
import { sleep } from '@/lib/utils';

export const contactHandlers = [
  http.post<never, never, ContactResponse>('*/contact', async () => {
    await sleep(1000);
    return HttpResponse.json({ status: 'success' });
  }),
];
