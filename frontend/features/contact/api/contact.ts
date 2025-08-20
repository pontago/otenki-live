import camelcaseKeys from 'camelcase-keys';

import { ContactFormData, ContactResponse, ValidationError } from '@/features/contact/types/contact';
import { env } from '@/lib/env';
import { ValidationErrors } from '@/lib/exceptions';

type ApiErrorResponse = {
  detail?: {
    loc: [string, string];
    msg: string;
  }[];
  status?: string;
  message?: string;
};

export const sendContact = async (data: ContactFormData, token: string): Promise<ContactResponse> => {
  const response = await fetch(`${env.NEXT_PUBLIC_API_BASE_URL}/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...data, recaptcha_token: token }),
  });

  const responseData: ApiErrorResponse = await response.json();

  if (!response.ok) {
    if (response.status === 422 && responseData.detail) {
      const errors: ValidationError[] = responseData.detail.map((err) => ({
        field: err.loc[1],
        message: err.msg,
      }));
      throw new ValidationErrors(errors);
    }
    throw new Error(`Unexpected status: ${response.statusText}`);
  }

  if (responseData.status === 'error') {
    throw new Error(responseData.message ?? 'Unknown error');
  }

  return camelcaseKeys(responseData as Record<string, unknown>, { deep: true }) as ContactResponse;
};
