import { ThemeSwitch } from '@/components/theme-switch';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className='w-full mt-12 text-sm mb-12'>
      <ul className='w-full flex gap-4 mb-4 justify-end items-center'>
        <li className='hover:underline'>
          <Link href='/credits'>クレジット</Link>
        </li>
        <li className='hover:underline'>
          <a href='https://github.com/pontago/otenki-live' target='_blank' rel='noopener noreferrer'>
            GitHub
          </a>
        </li>
        <li>
          <ThemeSwitch />
        </li>
      </ul>
      <p className='text-center'>
        &copy; {new Date().getFullYear()}{' '}
        <a href='https://greenstudio.jp' target='_blank' rel='noopener noreferrer' className='hover:underline'>
          GREENSTUDIO
        </a>{' '}
        All rights reserved.
      </p>
    </footer>
  );
};
