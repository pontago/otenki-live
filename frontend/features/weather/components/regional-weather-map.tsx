import Image from 'next/image';
import Link from 'next/link';

import { Card } from '@/components/ui/card';

import { latestWeatherPop } from '@/features/weather/lib/weather';
import { PrefectureCode, RegionalWeather, RegionCode, WeatherForecast } from '@/features/weather/types/weather';

type WeatherOverlayProps = {
  regionName: string;
  weatherForecast: WeatherForecast;
};

type RegionalWeatherProps = {
  forecasts: RegionalWeather[];
};

const mapOverlayPositions: Partial<Record<RegionCode, { top: string; left: string }>> = {
  hokkaido: {
    top: '2%',
    left: '43%',
  },
  tohoku: {
    top: '32%',
    left: '72%',
  },
  kanto: {
    top: '52%',
    left: '66%',
  },
  hokuriku: {
    top: '30%',
    left: '37%',
  },
  tokai: {
    top: '72%',
    left: '57%',
  },
  kinki: {
    top: '78%',
    left: '40%',
  },
  chugoku: {
    top: '41%',
    left: '19%',
  },
  shikoku: {
    top: '84%',
    left: '22.5%',
  },
  kyushu: {
    top: '56%',
    left: '0%',
  },
  okinawa: {
    top: '93%',
    left: '5%',
  },
};

const WeatherOverlay = ({ regionName, weatherForecast }: WeatherOverlayProps) => {
  const pop = latestWeatherPop(weatherForecast);
  return (
    <Card className='p-1 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 w-16 text-center flex flex-col items-center backdrop-blur-sm gap-0'>
      <div className='text-[9px] font-semibold text-card-foreground mb-1 truncate w-full' title={regionName}>
        {regionName}
      </div>
      <Image
        src={`/icons/weather/${weatherForecast.weatherCode.toString()}.png`}
        alt={weatherForecast.weatherName}
        width={28}
        height={28}
        className='text-primary'
      />
      <p className='text-[9px] font-bold text-card-foreground'>{weatherForecast.tempMax}°C</p>
      <p className='text-[9px] text-muted-foreground capitalize truncate w-full'>
        {pop === -1 ? '-' : `${pop.toString()}%`}
      </p>
    </Card>
  );
};

export const RegionalWeatherMap = ({ forecasts }: RegionalWeatherProps) => {
  return (
    <div className='flex flex-col items-center'>
      <div className='w-full max-w-4xl h-full items-center flex flex-col'>
        <div className='relative items-center flex flex-col'>
          <Image src='/images/map.png' alt='日本地図' width={400} height={400} />
          {forecasts.map((forecast) => {
            const position = mapOverlayPositions[forecast.regionCode];

            return (
              position && (
                <div
                  key={forecast.regionCode}
                  className='absolute'
                  style={{
                    top: position.top,
                    left: position.left,
                  }}
                >
                  <Link href={`/${forecast.regionCode}`}>
                    <WeatherOverlay regionName={forecast.regionName} weatherForecast={forecast.weatherForecast} />
                  </Link>
                </div>
              )
            );
          })}
        </div>
      </div>
    </div>
  );
};
