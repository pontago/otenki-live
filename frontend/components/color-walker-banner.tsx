import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Card } from '@/components/ui/card';

import { CONSTANTS } from '@/lib/constants';
import { cn } from '@/lib/utils';

type ColorWalkerBannerProps = {
  className?: string;
};

export const ColorWalkerBanner = ({ className }: ColorWalkerBannerProps) => {
  return (
    <Link
      href={CONSTANTS.COLOR_WALKER.URL}
      target='_blank'
      rel='noopener noreferrer'
      className={cn(
        'group block w-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
    >
      <Card className='flex-row items-center gap-3 p-3 md:p-4 shadow-sm hover:shadow-lg transition-shadow duration-300'>
        <Image
          src='/optimized/images/colorwalker-icon-112.png'
          alt={`${CONSTANTS.COLOR_WALKER.NAME} アプリアイコン`}
          width={112}
          height={112}
          className='size-12 md:size-14 rounded-xl shrink-0'
        />
        <div className='min-w-0 flex-1'>
          <p className='text-sm md:text-base font-bold text-card-foreground'>{CONSTANTS.COLOR_WALKER.HEADLINE}</p>
          <p className='text-xs md:text-sm text-muted-foreground'>{CONSTANTS.COLOR_WALKER.DESCRIPTION}</p>
          <p className='hidden sm:block text-xs text-muted-foreground mt-0.5'>{CONSTANTS.COLOR_WALKER.PLATFORM}</p>
        </div>
        <ChevronRight className='size-5 text-muted-foreground shrink-0 transition-transform group-hover:translate-x-0.5' />
      </Card>
    </Link>
  );
};
