import { Shirt, ThermometerSnowflake, ThermometerSun, Umbrella, Users } from 'lucide-react';
import Image from 'next/image';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { WeatherForecast } from '@/features/weather/types/weather';

type PrefectureWeatherProps = {
  forecast: WeatherForecast;
};

export const PrefectureWeather = ({ forecast }: PrefectureWeatherProps) => {
  return (
    <Card className='shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full cursor-pointer'>
      <CardHeader className='pt-4'>
        <CardTitle className='text-xl font-headline text-center'>{forecast.areaName}</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col items-center text-center pt-2 pb-4 flex-grow justify-around'>
        <Image src='/icons/weather/100.png' alt='Weather Icon' width={36} height={36} className='text-primary my-1' />
        <p className='text-3xl font-bold mt-1'>{forecast.tempMax}°C</p>
        <p className='text-sm text-muted-foreground capitalize'>晴れ</p>

        <div className='mt-3 space-y-1 text-xs w-full px-2'>
          <div className='flex items-center justify-center text-muted-foreground'>
            <ThermometerSun className='w-3.5 h-3.5 mr-1 text-red-500' />
            最高: {forecast.tempMax}°C
          </div>
          <div className='flex items-center justify-center text-muted-foreground'>
            <ThermometerSnowflake className='w-3.5 h-3.5 mr-1 text-blue-500' />
            最低: {forecast.tempMin}°C
          </div>
          <div className='flex items-center justify-center text-muted-foreground'>
            <Umbrella className='w-3.5 h-3.5 mr-1' />
            降水確率: {forecast.pops[0].pop}%
          </div>
        </div>

        <div className='mt-3 space-y-1 text-xs w-full px-2 border-t border-border/50 pt-2'>
          <div className='flex items-center justify-center text-muted-foreground'>
            <Users className='w-3.5 h-3.5 mr-1.5 text-slate-600' />
            <span>総人数: {forecast.liveDetectData.person}人</span>
          </div>
          <div className='flex items-center justify-center text-muted-foreground'>
            <Umbrella className='w-3.5 h-3.5 mr-1.5 text-blue-600' />
            <span>傘利用: {forecast.liveDetectData.umbrella}人</span>
          </div>
          <div className='flex items-center justify-center text-muted-foreground'>
            <Shirt className='w-3.5 h-3.5 mr-1.5 text-green-600' />
            <span>
              半袖: {forecast.liveDetectData.tshirt}人 / 長袖: {forecast.liveDetectData.longSleeve}人
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
