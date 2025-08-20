'use client';

import { Thermometer } from 'lucide-react';
import { DateTime } from 'luxon';
import Image from 'next/image';
import type * as React from 'react';
import { useEffect, useRef } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

import { HourlyWeatherData } from '@/features/weather/types/weather';

type HourlyWeatherProps = {
  data: HourlyWeatherData[];
};

export const HourlyWeather = ({ data }: HourlyWeatherProps) => {
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
        <CardTitle className='font-headline'>3時間ごとの天気</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 && <div className='flex justify-center items-center h-full pt-2'>データがありません。</div>}
        {data.length > 0 && (
          <ScrollArea className='w-full whitespace-nowrap'>
            <div className='flex space-x-4 pb-3'>
              {data.map((item, index) => {
                const itemTime = DateTime.fromISO(item.dateTime);
                const now = DateTime.now();
                const isCurrentTime = Math.abs(now.diff(itemTime).as('hours')) < 1.5;

                return (
                  <Card
                    key={index}
                    ref={isCurrentTime ? currentTimeRef : null}
                    data-slot='card'
                    className={`min-w-[120px] h-[130px] flex-shrink-0 text-center bg-secondary/30 hover:shadow-md transition-shadow ${
                      isCurrentTime ? 'border-1 border-primary' : ''
                    }`}
                  >
                    <CardHeader className='pb-1'>
                      <p className='text-sm font-medium'>{DateTime.fromISO(item.dateTime).toFormat('HH:mm')}</p>
                    </CardHeader>
                    <CardContent className='flex flex-col items-center space-y-2'>
                      <Image
                        src={`/optimized/icons/weather/${item.weatherCode.toString()}-36.png`}
                        alt={item.weatherName}
                        width={36}
                        height={36}
                        className='text-primary'
                        priority={true}
                      />
                      <div className='flex items-center text-sm'>
                        <Thermometer className='w-4 h-4 mr-1' /> {item.temp}°C
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

export const HourlyWeatherSkeleton = () => {
  return (
    <Card className='w-full shadow-lg'>
      <CardHeader className='mb-1'>
        <CardTitle className='font-headline'>3時間ごとの天気</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className='w-full whitespace-nowrap'>
          <div className='flex space-x-4 pb-3'>
            {Array.from({ length: 8 }).map((_, index) => (
              <Card
                key={index}
                data-slot='card'
                className='min-w-[120px] h-[130px] flex-shrink-0 text-center bg-secondary/30 animate-pulse'
              >
                <CardHeader className='pb-1'>
                  <div className='h-4 bg-gray-300 rounded w-12 mx-auto'></div>
                </CardHeader>
                <CardContent className='flex flex-col items-center space-y-2'>
                  <div className='w-9 h-9 bg-gray-300 rounded'></div>
                  <div className='flex items-center text-sm'>
                    <div className='w-4 h-4 bg-gray-300 rounded mr-1'></div>
                    <div className='h-4 bg-gray-300 rounded w-8'></div>
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
