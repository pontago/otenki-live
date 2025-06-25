import { Thermometer } from 'lucide-react';
import { DateTime } from 'luxon';
import Image from 'next/image';
import type * as React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

import { HourlyWeatherData } from '@/features/weather/types/weather';

type HourlyWeatherProps = {
  data: HourlyWeatherData[];
};

export const HourlyWeather = ({ data }: HourlyWeatherProps) => {
  const dateTime = DateTime.fromISO(data[0].dateTime);
  const a = dateTime.isValid ? dateTime.toFormat('HH:mm') : '';
  console.log(a);

  return (
    <Card className='w-full shadow-lg'>
      <CardHeader className='mb-1'>
        <CardTitle className='font-headline'>これからの天気</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className='w-full whitespace-nowrap'>
          <div className='flex space-x-4 pb-1'>
            {data.map((item, index) => (
              <Card
                key={index}
                className='min-w-[120px] flex-shrink-0 text-center bg-secondary/30 hover:shadow-md transition-shadow'
              >
                <CardHeader className=''>
                  <p className='text-sm font-medium'>{DateTime.fromISO(item.dateTime).toFormat('HH:mm')}</p>
                </CardHeader>
                <CardContent className='flex flex-col items-center space-y-1'>
                  <Image
                    src='/icons/weather/100.png'
                    alt='Weather Icon'
                    width={36}
                    height={36}
                    className='text-primary my-3'
                  />
                  <div className='flex items-center text-sm'>
                    <Thermometer className='w-4 h-4 mr-1' /> {item.temp}°C
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
