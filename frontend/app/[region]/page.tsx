import { Suspense } from 'react';

import { BreadcrumbNav } from '@/components/breadcrumb-nav';

import { prefectureForecasts } from '@/features/weather/api/forecast';
import { PrefectureWeather, PrefectureWeatherSkeleton } from '@/features/weather/components/prefecture-weather';
import { RegionCode } from '@/features/weather/types/weather';
import { generateSignature } from '@/lib/utils';

export async function generateMetadata({ params }: { params: Promise<RegionPageProps> }) {
  const { region } = await params;
  let title: string;

  try {
    const forecasts = await prefectureForecasts(region as RegionCode);
    title = `${forecasts.meta.regionName}の天気`;
  } catch {
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

  return (
    <div>
      <Suspense
        fallback={
          <>
            <BreadcrumbNav items={[]} />
            <PrefectureWeatherSkeleton />
          </>
        }
      >
        <PrefectureWeatherWrapper region={region} />
      </Suspense>
    </div>
  );
}

const PrefectureWeatherWrapper = async ({ region }: { region: string }) => {
  const forecasts = await prefectureForecasts(region as RegionCode);
  return (
    <>
      <BreadcrumbNav items={[{ name: forecasts.meta.regionName }]} />
      <PrefectureWeather forecasts={forecasts.data} region={region} />
    </>
  );
};
