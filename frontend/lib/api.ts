import logger from '@/lib/logger';

export const apiFetch = async (url: string) => {
  try {
    // await sleep(3000);
    return await fetch(url, {
      // cache: 'no-store',
      next: {
        revalidate: 10,
      },
    });
  } catch (error) {
    logger.error(error);
    throw new Error('APIリクエストエラー');
  }
};
