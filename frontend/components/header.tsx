'use client';

import { CloudSun, Menu } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import { CONSTANTS } from '@/lib/constants';

export const Header = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const menuItems = [
    { href: '/', label: 'ホーム', external: false },
    { href: '/about', label: 'このサイトについて', external: false },
    { href: '/contact', label: 'お問い合わせ', external: false },
  ];

  return (
    <header className='mb-4 md:mb-8 w-full max-w-7xl'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center'>
          <CloudSun className='h-10 w-10 text-primary mr-3' />
          <h1 className='text-xl font-headline font-bold text-primary'>
            <Link href='/'>{CONSTANTS.APP_NAME}</Link>
          </h1>
        </div>

        {/* デスクトップメニュー */}
        <nav className='hidden md:flex items-center space-x-6'>
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noopener noreferrer' : undefined}
              className='hover:underline transition-colors duration-200'
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* モバイルメニュー */}
        <div className='md:hidden'>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <button className='text-gray-700' aria-label='メニューを開く'>
                <Menu className='h-6 w-6' />
              </button>
            </SheetTrigger>
            <SheetContent side='bottom' className='data-[state=closed]:duration-100 data-[state=open]:duration-100'>
              <SheetHeader>
                <SheetTitle></SheetTitle>
              </SheetHeader>
              <nav className='mb-4 mx-4'>
                <div className='flex flex-col space-y-4'>
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noopener noreferrer' : undefined}
                      className='hover:underline transition-colors text-normal'
                      onClick={() => {
                        setIsSheetOpen(false);
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
