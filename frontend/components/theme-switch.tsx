'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

export const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted || theme === undefined) {
    return null;
  }

  return (
    <Button
      size='sm'
      variant='outline'
      className='size-8 rounded-full cursor-pointer'
      onClick={() => {
        setTheme(theme === 'light' ? 'dark' : 'light');
      }}
    >
      {theme === 'light' ? (
        <Moon className='h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
      ) : (
        <Sun className='h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
      )}
    </Button>
  );
};
