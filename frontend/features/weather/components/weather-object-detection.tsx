'use client';

import { Shirt, Umbrella, Users } from 'lucide-react';
import { DateTime } from 'luxon';
import type * as React from 'react';
import { useEffect, useRef } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

import { LiveDetectData } from '../types/weather';

type WeatherObjectDetectionProps = {
  data: LiveDetectData[];
};

export const WeatherObjectDetection = ({ data }: WeatherObjectDetectionProps) => {
  const currentTimeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data.length) return;

    if (currentTimeRef.current) {
      currentTimeRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [data]);

  return (
    <Card className='w-full shadow-lg'>
      <CardHeader className='mb-1'>
        <CardTitle className='font-headline'>ライブストリームからの天気情報</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 && <div className='flex justify-center items-center h-full pt-2'>データがありません。</div>}
        {data.length > 0 && (
          <ScrollArea className='w-full whitespace-nowrap'>
            <div className='flex space-x-4 pb-3'>
              {data.map((item, index) => {
                const itemTime = DateTime.fromISO(item.dateTime);
                const now = DateTime.now();
                const isCurrentTime = Math.abs(now.diff(itemTime).as('minutes')) < 20;

                return (
                  <Card
                    key={index}
                    ref={isCurrentTime ? currentTimeRef : null}
                    className={`min-w-[120px] h-[150px] flex-shrink-0 text-center bg-secondary/30 hover:shadow-md transition-shadow ${
                      isCurrentTime ? 'border-1 border-primary' : ''
                    }`}
                  >
                    <CardHeader className='pb-1'>
                      <p className='text-sm font-medium'>{DateTime.fromISO(item.dateTime).toFormat('HH:mm')}</p>
                    </CardHeader>
                    <CardContent className='flex flex-col items-center space-y-2'>
                      <div className='text-xs flex justify-center items-center w-32'>
                        <div className='space-y-1'>
                          <div className='flex items-center text-muted-foreground'>
                            <Users className='w-3.5 h-3.5 mr-1.5 text-slate-600' />
                            <span>歩行者: {item.person}人</span>
                          </div>
                          <div className='flex items-center text-muted-foreground'>
                            <Umbrella className='w-3.5 h-3.5 mr-1.5 text-blue-600' />
                            <span>傘利用: {item.umbrella}人</span>
                          </div>
                          <div className='flex items-center text-muted-foreground'>
                            <Shirt className='w-3.5 h-3.5 mr-1.5 text-green-600' />
                            <span>
                              半袖: {item.tshirt}人<br />
                              長袖: {item.longSleeve}人
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <ScrollBar orientation='horizontal' />
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export const WeatherObjectDetectionSkeleton = () => {
  return (
    <Card className='w-full shadow-lg'>
      <CardHeader className='mb-1'>
        <CardTitle className='font-headline'>ライブストリームからの天気情報</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className='w-full whitespace-nowrap'>
          <div className='flex space-x-4 pb-3'>
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className='min-w-[120px] h-[150px] flex-shrink-0 text-center bg-secondary/30'>
                <CardHeader className='pb-1'>
                  <Skeleton className='h-4 w-12 mx-auto' />
                </CardHeader>
                <CardContent className='flex flex-col items-center space-y-2'>
                  <div className='text-xs flex justify-center items-center w-32'>
                    <div className='space-y-1 w-full'>
                      <div className='flex items-center justify-center space-x-1'>
                        <Skeleton className='w-3.5 h-3.5' />
                        <Skeleton className='h-3 w-16' />
                      </div>
                      <div className='flex items-center justify-center space-x-1'>
                        <Skeleton className='w-3.5 h-3.5' />
                        <Skeleton className='h-3 w-16' />
                      </div>
                      <div className='flex items-center justify-center space-x-1'>
                        <Skeleton className='w-3.5 h-3.5' />
                        <div className='space-y-0.5'>
                          <Skeleton className='h-3 w-12' />
                          <Skeleton className='h-3 w-12' />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <ScrollBar orientation='horizontal' />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
