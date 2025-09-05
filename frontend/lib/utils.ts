import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { env } from '@/lib/env';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const generateSignature = async (value: string) => {
  const crypto = await import('crypto');
  return crypto.createHmac('sha256', env.SECRET_KEY).update(value).digest('hex');
};

export const verifySignature = async (value: string, signature: string): Promise<boolean> => {
  const crypto = await import('crypto');
  const expected = await generateSignature(value);
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
};

export const generatePayloadHash = async (payload: string): Promise<string> => {
  const encoder = new TextEncoder();
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', encoder.encode(payload));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};
