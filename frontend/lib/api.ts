import logger from '@/lib/logger';

export const apiFetch = async (url: string) => {
  try {
    return await fetch(url, {
      cache: 'no-store',
    });
  } catch (error) {
    logger.error(error);
    throw new Error('APIリクエストエラー');
  }
};
