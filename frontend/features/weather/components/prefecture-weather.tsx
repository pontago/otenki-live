import { Shirt, ThermometerSnowflake, ThermometerSun, Umbrella, Users } from 'lucide-react';
import { DateTime } from 'luxon';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { latestWeatherPop } from '@/features/weather/lib/weather';
import { WeatherForecast } from '@/features/weather/types/weather';

type PrefectureWeatherProps = {
  forecast: WeatherForecast;
  region: string;
};

export const PrefectureWeather = ({ forecast, region }: PrefectureWeatherProps) => {
  const pop = latestWeatherPop(forecast);

  return (
    <Card className='shadow-lg hover:shadow-xl transition-shadow duration-300 h-fit'>
      <CardHeader className='pt-4'>
        <CardTitle className='text-xl font-headline text-center'>
          <Link key={forecast.areaCode} href={`/${region}/${forecast.areaCode}`} passHref>
            {forecast.areaName}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Link key={forecast.areaCode} href={`/${region}/${forecast.areaCode}`} passHref>
          <div className='flex flex-col items-center text-center py-2 justify-around'>
            <Image
              src={`/icons/weather/${forecast.weatherCode.toString()}.png`}
              alt='Weather Icon'
              width={36}
              height={36}
              className='text-primary my-1'
            />
            <p className='text-3xl font-bold mt-1'>{forecast.tempMax}°C</p>
            <p className='text-sm text-muted-foreground capitalize'>{forecast.weatherName}</p>

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
                降水確率: {pop}%
              </div>
            </div>

            {forecast.liveDetectData && (
              <div className='mt-3 space-y-1 text-xs w-full px-2 border-t border-border/50 pt-2'>
                <div className='flex items-center justify-center text-muted-foreground'>
                  <Users className='w-3.5 h-3.5 mr-1.5 text-slate-600' />
                  <span>歩行者: {forecast.liveDetectData.person}人</span>
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
            )}
          </div>
        </Link>
        {forecast.liveChannel && forecast.liveDetectData && (
          <div className='text-right text-xs mt-4 w-full text-blue-500 font-normal'>
            <Dialog>
              <DialogTrigger className='cursor-pointer'>取得元</DialogTrigger>
              <DialogContent>
                <DialogHeader className='w-full text-center'>
                  <DialogTitle>取得元</DialogTitle>
                  <DialogDescription asChild className='w-full h-auto'>
                    <div className='space-y-2 w-full'>
                      <Button type='button' variant='link' className='cursor-pointer w-full'>
                        <a
                          href={forecast.liveChannel.url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-wrap'
                        >
                          {forecast.liveChannel.name}
                        </a>
                      </Button>
                      <p className='text-center'>
                        最終取得時間：
                        {DateTime.fromISO(forecast.liveDetectData.dateTime).toFormat('yyyy/MM/dd HH:mm:ss')}
                      </p>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
