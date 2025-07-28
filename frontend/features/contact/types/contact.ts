import { z } from 'zod';

import { contactFormSchema } from '@/features/contact/schemas/contact';
import { BaseResponse } from '@/types/api';

export type ContactFormData = z.infer<typeof contactFormSchema>;

export type ValidationError = {
  field: string;
  message: string;
};

export type ContactResponse = BaseResponse;
