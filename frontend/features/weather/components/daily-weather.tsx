import { Thermometer, Umbrella } from 'lucide-react';
import { DateTime } from 'luxon';
import Image from 'next/image';
import type * as React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

import { WeatherForecast } from '@/features/weather/types/weather';

type DailyForecastProps = {
  data: WeatherForecast[];
};

export const DailyWeather = ({ data }: DailyForecastProps) => {
  return (
    <Card className='w-full shadow-lg'>
      <CardHeader className='mb-1'>
        <CardTitle className='font-headline'>今後の天気</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 && <div className='flex justify-center items-center h-full pt-2'>データがありません。</div>}
        <ScrollArea className='w-full whitespace-nowrap'>
          <div className='flex space-x-4 pb-1'>
            {data.map((item) => (
              <Card
                key={item.date}
                className='min-w-[150px] flex-shrink-0 text-center bg-secondary/30 hover:shadow-md transition-shadow'
              >
                <CardHeader className=''>
                  <p className='text-sm font-medium'>{DateTime.fromISO(item.date).toFormat('EEE')}</p>
                  <p className='text-xs text-muted-foreground'>{DateTime.fromISO(item.date).toFormat('M/d')}</p>
                </CardHeader>
                <CardContent className='flex flex-col items-center space-y-1'>
                  <Image
                    src={`/optimized/icons/weather/${item.weatherCode.toString()}-36.png`}
                    alt={item.weatherName}
                    width={36}
                    height={36}
                    className='text-primary my-3'
                  />
                  <div className='flex items-center text-sm'>
                    <Thermometer className='w-4 h-4 mr-1 text-red-500' /> {item.tempMax}°C
                  </div>
                  <div className='flex items-center text-xs text-muted-foreground'>
                    <Thermometer className='w-3 h-3 mr-1 text-blue-500' /> {item.tempMin}°C
                  </div>
                  {item.pops.length > 0 && (
                    <div className='flex items-center text-xs text-muted-foreground pt-1'>
                      <Umbrella className='w-3 h-3 mr-1' /> {item.pops[0].pop}%
                    </div>
                  )}
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

export const DailyWeatherSkeleton = () => {
  return (
    <Card className='w-full shadow-lg'>
      <CardHeader className='mb-1'>
        <CardTitle className='font-headline'>今後の天気</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className='w-full whitespace-nowrap'>
          <div className='flex space-x-4 pb-1'>
            {Array.from({ length: 7 }).map((_, index) => (
              <Card key={index} className='min-w-[150px] flex-shrink-0 text-center bg-secondary/30'>
                <CardHeader className=''>
                  <Skeleton className='h-4 w-8 mx-auto' />
                  <Skeleton className='h-3 w-6 mx-auto mt-1' />
                </CardHeader>
                <CardContent className='flex flex-col items-center space-y-1'>
                  <Skeleton className='w-9 h-9 rounded-full my-3' />
                  <div className='flex items-center text-sm'>
                    <Skeleton className='w-4 h-4 mr-1' />
                    <Skeleton className='h-4 w-8' />
                  </div>
                  <div className='flex items-center text-xs'>
                    <Skeleton className='w-3 h-3 mr-1' />
                    <Skeleton className='h-3 w-6' />
                  </div>
                  <div className='flex items-center text-xs pt-1'>
                    <Skeleton className='w-3 h-3 mr-1' />
                    <Skeleton className='h-3 w-6' />
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
