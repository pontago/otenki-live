import Link from 'next/link';

import { BreadcrumbNav } from '@/components/breadcrumb-nav';

import { prefectureForecasts } from '@/features/weather/api/forecast';
import { PrefectureWeather } from '@/features/weather/components/prefecture-weather';
import { RegionCode } from '@/features/weather/types/weather';

type RegionPageProps = {
  region: string;
};
// import { WeatherData } from '@/types/weather';

// type PrefectureWeatherInfo = {
//   id: string;
//   name: string;
//   data: WeatherData | null;
//   error?: string | null;
// };

export default async function RegionPage({ params }: { params: Promise<RegionPageProps> }) {
  const { region } = await params;
  const forecasts = await prefectureForecasts(region as RegionCode);

  return (
    <div>
      <BreadcrumbNav items={[{ name: region }]} />
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
        {forecasts.map((forecast) => (
          <Link key={forecast.areaCode} href={`/${region}/${forecast.areaCode}`} passHref>
            <PrefectureWeather forecast={forecast} />
          </Link>
        ))}
      </div>
    </div>
  );
}
