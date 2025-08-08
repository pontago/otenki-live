import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import crypto from 'crypto';
import { env } from '@/lib/env';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const generateSignature = (value: string) => {
  return crypto.createHmac('sha256', env.SECRET_KEY).update(value).digest('hex');
};

export const verifySignature = (value: string, signature: string): boolean => {
  const expected = generateSignature(value);
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
};
