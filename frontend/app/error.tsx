'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className='flex flex-col items-center justify-center mt-10'>
      <h1 className='text-xl font-bold'>エラーが発生しました</h1>
      <p className='text-lg mt-4'>{error.message}</p>
      <button className='mt-10 text-blue-500  cursor-pointer' onClick={reset}>
        再読み込み
      </button>
    </div>
  );
}
