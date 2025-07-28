import { notFound } from 'next/navigation';

import { BreadcrumbNav } from '@/components/breadcrumb-nav';

import { prefectureForecasts } from '@/features/weather/api/forecast';
import { PrefectureWeather } from '@/features/weather/components/prefecture-weather';
import { RegionCode, WeathersResponse } from '@/features/weather/types/weather';
import { NotFoundError } from '@/lib/exceptions';

type RegionPageProps = {
  region: string;
};

export default async function RegionPage({ params }: { params: Promise<RegionPageProps> }) {
  const { region } = await params;
  let forecasts: WeathersResponse;
  try {
    forecasts = await prefectureForecasts(region as RegionCode);
  } catch (e) {
    if (e instanceof NotFoundError) {
      notFound();
    }
    throw e;
  }

  return (
    <div>
      <BreadcrumbNav items={[{ name: forecasts.meta.regionName }]} />
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
        {forecasts.data.map((forecast) => (
          <PrefectureWeather key={forecast.areaCode} forecast={forecast} region={region} />
        ))}
      </div>
    </div>
  );
}
