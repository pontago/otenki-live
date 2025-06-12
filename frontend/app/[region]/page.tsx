type RegionPageProps = {
  params: {
    region: string;
  };
};

import { prefecturesList } from '@/features/weather/libs/prefectures';
import { WeatherData } from '@/types/weather';
import { Card } from '@radix-ui/themes';
import { AlertTriangle } from 'lucide-react';

interface PrefectureWeatherInfo {
  id: string;
  name: string;
  data: WeatherData | null;
  error?: string | null;
}

export default async function RegionPage({ params }: RegionPageProps) {
  const { region } = await params;
  const prefectureWeatherData = prefecturesList
    .filter((prefInfo) => prefInfo.region.toString() === region)
    .map((p) => ({ id: p.id, name: p.name, data: null, error: null }));

  return (
    <main className='w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
      {prefectureWeatherData.map((prefInfo) => {
        return (
          <Card key={prefInfo.id} className='border-destructive shadow-md'>
            <Card className='pb-2 pt-4'>
              <Card className='text-xl font-headline text-center'>{prefInfo.name}</Card>
            </Card>
            <Card className='flex flex-col items-center text-center pt-2 pb-4'>
              <AlertTriangle className='w-10 h-10 text-destructive my-2' />
              <p className='text-sm text-destructive'>読み込みエラー</p>
              <p className='text-xs text-muted-foreground mt-1'>{prefInfo.error}</p>
            </Card>
          </Card>
        );
      })}
    </main>
  );
}
