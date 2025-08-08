import { notFound } from 'next/navigation';

import { BreadcrumbNav } from '@/components/breadcrumb-nav';

import { prefectureForecasts } from '@/features/weather/api/forecast';
import { PrefectureWeather } from '@/features/weather/components/prefecture-weather';
import { RegionCode, WeathersResponse } from '@/features/weather/types/weather';
import { NotFoundError } from '@/lib/exceptions';
import { Metadata } from 'next';
import { generateSignature } from '@/lib/utils';

export async function generateMetadata({ params }: { params: Promise<RegionPageProps> }) {
  const { region } = await params;
  let title: string;

  try {
    const forecasts = await prefectureForecasts(region as RegionCode);
    title = `${forecasts.meta.regionName}の天気`;
  } catch (e) {
    title = `${region}の天気`;
  }

  const description = `${title}をライブストリームから取得した情報で確認できます`;
  const signature = generateSignature(title);
  return {
    title,
    description,
    openGraph: {
      images: [`/og?title=${title}&hash=${signature}`],
      title,
      description,
    },
  };
}

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
