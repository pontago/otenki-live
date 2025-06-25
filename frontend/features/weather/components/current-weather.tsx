import { Droplets, Wind, Cloud, Eye, Gauge, Sun } from 'lucide-react';
import Image from 'next/image';
import type * as React from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { WeatherForecast } from '@/features/weather/types/weather';

type CurrentWeatherProps = {
  forecast: WeatherForecast;
};

export const CurrentWeather = ({ forecast }: CurrentWeatherProps) => {
  return (
    <>
      <Card className='w-full shadow-lg'>
        <CardHeader>
          <CardTitle className='text-3xl font-headline'>{forecast.areaName}</CardTitle>
          <CardDescription>Current weather conditions</CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='flex flex-col items-center space-y-2 text-center'>
            <Image
              src='/icons/weather/100.png'
              alt='Weather Icon'
              width={36}
              height={36}
              className='text-primary my-1'
            />
            <p className='text-5xl font-bold'>{forecast.tempMax}°C</p>
            <p className='text-xl text-muted-foreground capitalize'>{forecast.weatherCode}</p>
            <p className='text-sm text-muted-foreground'>Feels like {forecast.tempMin}°C</p>
          </div>

          <div className='grid grid-cols-2 gap-4 text-sm'>
            <div className='flex items-center space-x-2 p-3 bg-secondary/50 rounded-md'>
              <Droplets className='w-5 h-5 text-primary' />
              <span>Humidity: -</span>
            </div>
            <div className='flex items-center space-x-2 p-3 bg-secondary/50 rounded-md'>
              <Wind className='w-5 h-5 text-primary' />
              <span>Wind: -</span>
            </div>
            <div className='flex items-center space-x-2 p-3 bg-secondary/50 rounded-md'>
              <Cloud className='w-5 h-5 text-primary' />
              <span>Cloud Cover: -</span>
            </div>
            <div className='flex items-center space-x-2 p-3 bg-secondary/50 rounded-md'>
              <Gauge className='w-5 h-5 text-primary' />
              <span>Pressure: -</span>
            </div>
            <div className='flex items-center space-x-2 p-3 bg-secondary/50 rounded-md'>
              <Eye className='w-5 h-5 text-primary' />
              <span>Visibility: -</span>
            </div>
            <div className='flex items-center space-x-2 p-3 bg-secondary/50 rounded-md'>
              <Sun className='w-5 h-5 text-primary' />
              <span>UV Index: -</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
