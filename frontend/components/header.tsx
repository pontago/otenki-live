import { CloudSun } from 'lucide-react';

export const Header = () => {
  return (
    <header className='mb-8 w-full max-w-7xl'>
      <div className='flex items-center'>
        <CloudSun className='h-10 w-10 text-primary mr-3' />
        <h1 className='text-xl font-headline font-bold text-primary'>お天気ライブ</h1>
      </div>
    </header>
  );
};
