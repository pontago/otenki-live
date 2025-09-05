import { Shirt, Thermometer, Umbrella, Users, Wind } from 'lucide-react';
import { DateTime } from 'luxon';
import Image from 'next/image';
import type * as React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { WeatherForecast } from '@/features/weather/types/weather';

type CurrentWeatherProps = {
  forecast: WeatherForecast;
};

export const CurrentWeather = ({ forecast }: CurrentWeatherProps) => {
  const popHours = [0, 6, 12, 18];
  const pops: Record<number, number> = popHours.reduce<Record<number, number>>((acc, hour) => {
    acc[hour] = forecast.pops.find((pop) => DateTime.fromISO(pop.dateTime).hour === hour)?.pop ?? -1;
    return acc;
  }, {});

  return (
    <>
      <Card className='w-full shadow-lg'>
        <CardHeader>
          <CardTitle className='text-3xl font-headline'>{forecast.areaName}</CardTitle>
          <CardDescription>{DateTime.now().toFormat('yyyy年M月d日')} 現在の天気</CardDescription>
        </CardHeader>
        <CardContent className='space-y-6 pt-2'>
          <div className='flex flex-col items-center space-y-2 text-center'>
            <Image
              src={`/optimized/icons/weather/${forecast.weatherCode.toString()}-128.png`}
              alt={forecast.weatherName}
              width={128}
              height={128}
              className='text-primary'
            />
            <p className='text-5xl font-bold'>{forecast.temp}°C</p>
            <p className='text-xl text-muted-foreground'>{forecast.weatherName}</p>
          </div>

          <div className='grid grid-cols-2 gap-4 text-sm'>
            <div className='flex items-center space-x-2 p-3 bg-secondary/50 rounded-md'>
              <Thermometer className='w-5 h-5 text-red-500' />
              <span>最高気温: {forecast.tempMax}°C</span>
            </div>
            <div className='flex items-center space-x-2 p-3 bg-secondary/50 rounded-md'>
              <Thermometer className='w-5 h-5 text-blue-500' />
              <span>最低気温: {forecast.tempMin}°C</span>
            </div>
            <div className='flex items-center space-x-2 p-3 bg-secondary/50 rounded-md col-span-2'>
              <Umbrella className='w-5 h-5 text-primary' />
              <div className='grid grid-cols-4 gap-4 text-sm w-full'>
                {popHours.map((hour) => (
                  <div key={hour} className='flex flex-col items-center space-y-2'>
                    <div>
                      {hour}-{hour + 6}
                    </div>
                    <div>{pops[hour] >= 0 ? `${pops[hour].toString()}%` : '-'}</div>
                  </div>
                ))}
              </div>
            </div>
            {forecast.wind && (
              <div className='flex items-center space-x-2 p-3 bg-secondary/50 rounded-md col-span-2'>
                <Wind className='w-7 h-7 text-primary' />
                <span>{forecast.wind}</span>
              </div>
            )}
            {forecast.liveDetectData && (
              <>
                <div className='flex items-center space-x-2 p-3 bg-secondary/50 rounded-md'>
                  <Users className='w-3.5 h-3.5 mr-1.5 text-slate-600' />
                  <span>歩行者: {forecast.liveDetectData.person}人</span>
                </div>
                <div className='flex items-center space-x-2 p-3 bg-secondary/50 rounded-md'>
                  <Umbrella className='w-3.5 h-3.5 mr-1.5 text-blue-600' />
                  <span>傘利用: {forecast.liveDetectData.umbrella}人</span>
                </div>
                <div className='flex items-center space-x-2 p-3 bg-secondary/50 rounded-md'>
                  <Shirt className='w-3.5 h-3.5 mr-1.5 text-green-600' />
                  <span>
                    半袖: {forecast.liveDetectData.tshirt}人<br />
                  </span>
                </div>
                <div className='flex items-center space-x-2 p-3 bg-secondary/50 rounded-md'>
                  <Shirt className='w-3.5 h-3.5 mr-1.5 text-red-600' />
                  <span>長袖: {forecast.liveDetectData.longSleeve}人</span>
                </div>
                {forecast.liveChannel && (
                  <div className='flex items-center justify-end space-x-2 rounded-md col-span-2 w-full text-xs px-3 text-blue-500'>
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
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export const CurrentWeatherSkeleton = () => {
  return (
    <>
      <Card className='w-full shadow-lg'>
        <CardHeader>
          <div className='h-8 bg-gray-200 rounded animate-pulse w-3/4'></div>
          <div className='h-4 bg-gray-200 rounded animate-pulse w-1/2'></div>
        </CardHeader>
        <CardContent className='space-y-6 pt-2'>
          <div className='flex flex-col items-center space-y-2 text-center'>
            <div className='w-20 h-20 bg-gray-200 rounded-full animate-pulse'></div>
            <div className='h-12 bg-gray-200 rounded animate-pulse w-20'></div>
            <div className='h-6 bg-gray-200 rounded animate-pulse w-24'></div>
          </div>

          <div className='grid grid-cols-2 gap-4 text-sm'>
            <div className='flex items-center space-x-2 p-3 bg-secondary/50 rounded-md'>
              <div className='w-5 h-5 bg-gray-200 rounded animate-pulse'></div>
              <div className='h-4 bg-gray-200 rounded animate-pulse w-20'></div>
            </div>
            <div className='flex items-center space-x-2 p-3 bg-secondary/50 rounded-md'>
              <div className='w-5 h-5 bg-gray-200 rounded animate-pulse'></div>
              <div className='h-4 bg-gray-200 rounded animate-pulse w-20'></div>
            </div>
            <div className='flex items-center space-x-2 p-3 bg-secondary/50 rounded-md col-span-2'>
              <div className='w-5 h-5 bg-gray-200 rounded animate-pulse'></div>
              <div className='grid grid-cols-4 gap-4 text-sm w-full'>
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className='flex flex-col items-center space-y-2'>
                    <div className='h-4 bg-gray-200 rounded animate-pulse w-8'></div>
                    <div className='h-4 bg-gray-200 rounded animate-pulse w-6'></div>
                  </div>
                ))}
              </div>
            </div>
            <div className='flex items-center space-x-2 p-3 bg-secondary/50 rounded-md col-span-2'>
              <div className='w-7 h-7 bg-gray-200 rounded animate-pulse'></div>
              <div className='h-4 bg-gray-200 rounded animate-pulse w-32'></div>
            </div>
            <div className='flex items-center space-x-2 p-3 bg-secondary/50 rounded-md'>
              <div className='w-3.5 h-3.5 bg-gray-200 rounded animate-pulse'></div>
              <div className='h-4 bg-gray-200 rounded animate-pulse w-16'></div>
            </div>
            <div className='flex items-center space-x-2 p-3 bg-secondary/50 rounded-md'>
              <div className='w-3.5 h-3.5 bg-gray-200 rounded animate-pulse'></div>
              <div className='h-4 bg-gray-200 rounded animate-pulse w-16'></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
