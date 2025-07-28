import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center mt-10'>
      <h1 className='text-4xl font-bold'>404 - Page Not Found</h1>
      <p className='text-lg mt-4'>お探しのページが見つかりません。</p>
      <p className='mt-10 text-blue-500'>
        <Link href='/'>トップページ</Link>
      </p>
    </div>
  );
}
