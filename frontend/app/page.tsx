import { Shirt, ThermometerSnowflake, ThermometerSun, Umbrella, Users } from 'lucide-react';
import Image from 'next/image';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { regionalForecasts } from '@/features/weather/api/forecast';
import { RegionalWeatherMap } from '@/features/weather/components/regional-weather-map';

export default async function IndexPage() {
  const forecasts = await regionalForecasts();

  return (
    <div className='w-full grid grid-cols-1 lg:grid-cols-2 gap-4'>
      <section aria-labelledby='regional-weather-map-heading' className='lg:col-span-1 space-y-6'>
        <RegionalWeatherMap forecasts={forecasts} />
      </section>
      <section aria-labelledby='forecast-heading' className='lg:col-span-1 space-y-6 mt-10 lg:mt-0 max-w-120'>
        <h2 id='forecast-heading' className=''>
          Weather Forecasts
        </h2>
        <Card className='shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col cursor-pointer'>
          <CardHeader>
            <CardTitle>北海道</CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col pt-2'>
            <div className='flex justify-start'>
              <div className='w-24 flex flex-col items-center text-center'>
                <Image
                  src='/icons/weather/100.png'
                  alt='Weather Icon'
                  width={36}
                  height={36}
                  className='text-primary my-1'
                />
                <p className='text-xl font-bold'>10°C</p>
                <p className='text-sm text-muted-foreground capitalize'>晴れ</p>
              </div>
              <div className='text-xs flex justify-center items-center w-40'>
                <div className='space-y-1'>
                  <div className='flex items-center justify-center text-muted-foreground'>
                    <ThermometerSun className='w-3.5 h-3.5 mr-1 text-red-500' />
                    最高: 20°C
                  </div>
                  <div className='flex items-center justify-center text-muted-foreground'>
                    <ThermometerSnowflake className='w-3.5 h-3.5 mr-1 text-blue-500' />
                    最低: 10°C
                  </div>
                  <div className='flex items-center justify-center text-muted-foreground'>
                    <Umbrella className='w-3.5 h-3.5 mr-1' />
                    降水確率: 10%
                  </div>
                </div>
              </div>
              <div className='text-xs flex justify-center items-center w-44'>
                <div className='space-y-1'>
                  <div className='flex items-center justify-center text-muted-foreground'>
                    <Users className='w-3.5 h-3.5 mr-1.5 text-slate-600' />
                    <span>総人数: 100人</span>
                  </div>
                  <div className='flex items-center justify-center text-muted-foreground'>
                    <Umbrella className='w-3.5 h-3.5 mr-1.5 text-blue-600' />
                    <span>傘利用: 10人</span>
                  </div>
                  <div className='flex items-center justify-center text-muted-foreground'>
                    <Shirt className='w-3.5 h-3.5 mr-1.5 text-green-600' />
                    <span>半袖: 10人 / 長袖: 10人</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
