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
import { Skeleton } from '@/components/ui/skeleton';

import { latestWeatherPop } from '@/features/weather/lib/weather';
import { RegionalWeather } from '@/features/weather/types/weather';

type RegionalWeatherListProps = {
  forecasts: RegionalWeather[];
};

export const RegionalWeatherList = ({ forecasts }: RegionalWeatherListProps) => {
  return (
    <div className='flex flex-col items-center'>
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
        {forecasts.map((forecast) => {
          const pop = latestWeatherPop(forecast.weatherForecast);

          return (
            <Card key={forecast.regionCode} className='shadow-lg hover:shadow-xl flex flex-col'>
              <CardHeader>
                <CardTitle className='flex flex-row'>
                  <div className='basis-1/2'>
                    <Link key={forecast.regionCode} href={`/${forecast.regionCode}`}>
                      {forecast.regionName}
                      <span className='text-xs text-muted-foreground ml-2'>{forecast.weatherForecast.areaName}</span>
                    </Link>
                  </div>
                  {forecast.weatherForecast.liveChannel && (
                    <div className='basis-1/2 text-right text-xs text-blue-500 font-normal'>
                      <Dialog>
                        <DialogTrigger className='cursor-pointer'>取得元</DialogTrigger>
                        <DialogContent>
                          <DialogHeader className='w-full text-center'>
                            <DialogTitle>取得元</DialogTitle>
                            <DialogDescription asChild className='w-full h-auto'>
                              <div className='space-y-2 w-full'>
                                <Button type='button' variant='link' className='cursor-pointer w-full'>
                                  <a
                                    href={forecast.weatherForecast.liveChannel.url}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-wrap'
                                  >
                                    {forecast.weatherForecast.liveChannel.name}
                                  </a>
                                </Button>
                                {forecast.weatherForecast.liveDetectData && (
                                  <p className='text-center'>
                                    最終取得時間：
                                    {DateTime.fromISO(forecast.weatherForecast.liveDetectData.dateTime).toFormat(
                                      'yyyy/MM/dd HH:mm:ss'
                                    )}
                                  </p>
                                )}
                              </div>
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className='flex flex-col pt-2 px-4'>
                <Link key={forecast.regionCode} href={`/${forecast.regionCode}`}>
                  <div className='flex justify-start'>
                    <div className='w-20 flex flex-col items-center text-center'>
                      <Image
                        src={`/optimized/icons/weather/${forecast.weatherForecast.weatherCode.toString()}-36.png`}
                        alt={forecast.weatherForecast.weatherName}
                        width={36}
                        height={36}
                        className='text-primary my-1'
                      />
                      <p className='text-lg font-bold'>{forecast.weatherForecast.temp}°C</p>
                      <p className='text-xs text-muted-foreground'>{forecast.weatherForecast.weatherName}</p>
                    </div>
                    <div className='text-xs flex justify-center items-center w-30'>
                      <div className='space-y-1'>
                        <div className='flex items-center text-muted-foreground'>
                          <ThermometerSun className='w-3.5 h-3.5 mr-1 text-red-500' />
                          最高: {forecast.weatherForecast.tempMax}°C
                        </div>
                        <div className='flex items-center text-muted-foreground'>
                          <ThermometerSnowflake className='w-3.5 h-3.5 mr-1 text-blue-500' />
                          最低: {forecast.weatherForecast.tempMin}°C
                        </div>
                        <div className='flex items-center text-muted-foreground'>
                          <Umbrella className='w-3.5 h-3.5 mr-1' />
                          降水: {pop === -1 ? '-' : `${pop.toString()}%`}
                        </div>
                      </div>
                    </div>
                    <div className='text-xs flex justify-center items-center w-32'>
                      <div className='space-y-1'>
                        {forecast.weatherForecast.liveDetectData && (
                          <>
                            <div className='flex items-center text-muted-foreground'>
                              <Users className='w-3.5 h-3.5 mr-1.5 text-slate-600' />
                              <span>歩行者: {forecast.weatherForecast.liveDetectData.person}人</span>
                            </div>
                            <div className='flex items-center text-muted-foreground'>
                              <Umbrella className='w-3.5 h-3.5 mr-1.5 text-blue-600' />
                              <span>傘利用: {forecast.weatherForecast.liveDetectData.umbrella}人</span>
                            </div>
                            <div className='flex items-center text-muted-foreground'>
                              <Shirt className='w-3.5 h-3.5 mr-1.5 text-green-600' />
                              <span>
                                半袖: {forecast.weatherForecast.liveDetectData.tshirt}人<br />
                                長袖: {forecast.weatherForecast.liveDetectData.longSleeve}人
                              </span>
                            </div>
                          </>
                        )}
                        {!forecast.weatherForecast.liveDetectData && (
                          <div className='flex items-center justify-center text-muted-foreground'>---</div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export const RegionalWeatherListSkeleton = () => {
  return (
    <div className='flex flex-col items-center'>
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
        {Array.from({ length: 10 }).map((_, index) => (
          <Card key={index} className='shadow-lg flex flex-col'>
            <CardHeader>
              <div className='flex flex-row'>
                <div className='basis-1/2'>
                  <Skeleton className='h-5 w-32' />
                </div>
              </div>
            </CardHeader>
            <CardContent className='flex flex-col pt-2 px-4'>
              <div className='flex justify-start'>
                {/* 天気アイコンと気温エリア */}
                <div className='w-20 flex flex-col items-center text-center'>
                  <Skeleton className='w-8 h-8 rounded-full my-1' />
                  <Skeleton className='h-4 w-16 mt-1' />
                  <Skeleton className='h-3 w-16 mt-1' />
                </div>

                {/* 気温情報エリア */}
                <div className='text-xs flex justify-center items-center w-30'>
                  <div className='space-y-1'>
                    <div className='flex items-center'>
                      <Skeleton className='w-3.5 h-3.5 mr-1' />
                      <Skeleton className='h-3 w-16' />
                    </div>
                    <div className='flex items-center'>
                      <Skeleton className='w-3.5 h-3.5 mr-1' />
                      <Skeleton className='h-3 w-16' />
                    </div>
                    <div className='flex items-center'>
                      <Skeleton className='w-3.5 h-3.5 mr-1' />
                      <Skeleton className='h-3 w-16' />
                    </div>
                  </div>
                </div>

                {/* ライブデータエリア */}
                <div className='text-xs flex justify-center items-center w-32'>
                  <div className='space-y-1'>
                    <div className='flex items-center'>
                      <Skeleton className='w-3.5 h-3.5 mr-1.5' />
                      <Skeleton className='h-3 w-20' />
                    </div>
                    <div className='flex items-center'>
                      <Skeleton className='w-3.5 h-3.5 mr-1.5' />
                      <Skeleton className='h-3 w-20' />
                    </div>
                    <div className='flex items-center'>
                      <Skeleton className='w-3.5 h-3.5 mr-1.5' />
                      <div className='flex flex-col'>
                        <Skeleton className='h-3 w-16' />
                        <Skeleton className='h-3 w-16 mt-1' />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
