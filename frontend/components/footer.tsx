import Link from 'next/link';

import { ThemeSwitch } from '@/components/theme-switch';

import { CONSTANTS } from '@/lib/constants';

export const Footer = () => {
  return (
    <footer className='w-full mt-12 text-sm mb-12'>
      <div className='w-full flex items-start justify-between gap-4 mb-4 sm:items-center'>
        <ul className='flex flex-col items-start gap-3 sm:flex-1 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-4'>
          <li className='hover:underline'>
            <Link href='/credits'>クレジット</Link>
          </li>
          <li className='hover:underline'>
            <a href={CONSTANTS.COLOR_WALKER.URL} target='_blank' rel='noopener noreferrer'>
              {CONSTANTS.COLOR_WALKER.LINK_TEXT}
            </a>
          </li>
          <li className='hover:underline'>
            <a href='https://github.com/pontago/otenki-live' target='_blank' rel='noopener noreferrer'>
              GitHub
            </a>
          </li>
        </ul>
        <ThemeSwitch />
      </div>
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
