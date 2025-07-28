import { ContactFormData, ContactResponse, ValidationError } from '@/features/contact/types/contact';
import { ValidationErrors } from '@/lib/exceptions';
import { env } from '@/lib/env';
import camelcaseKeys from 'camelcase-keys';

export const sendContact = async (data: ContactFormData): Promise<ContactResponse> => {
  const response = await fetch(`${env.NEXT_PUBLIC_API_BASE_URL}/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    if (response.status === 422 && responseData.detail) {
      const errors: ValidationError[] = responseData.detail.map((err: any) => ({
        field: err.loc[1],
        message: err.msg,
      }));
      throw new ValidationErrors(errors);
    }
    throw new Error(`Unexpected status: ${response.statusText}`);
  }

  return camelcaseKeys(responseData, { deep: true });
};
