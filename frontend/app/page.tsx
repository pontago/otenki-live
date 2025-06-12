import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { japanRegions } from '@/features/weather/libs/japan-regions';
import { WeatherData } from '@/types/weather';
import { Card, Skeleton } from '@radix-ui/themes';
import { AlertTriangle } from 'lucide-react';
import Image from 'next/image';

const WeatherOverlay: React.FC<{ regionName: string }> = ({ regionName }) => (
  // <div className='p-2 bg-card/80 rounded-lg shadow-lg flex flex-col items-center w-28 text-center backdrop-blur-sm'>
  <Card className='p-1 rounded-lg shadow-lg w-16 text-center flex flex-col items-center backdrop-blur-sm'>
    <p className='text-[9px] font-semibold text-card-foreground mb-0.5 truncate w-full' title={regionName}>
      {regionName}
    </p>
    <Image src='/icons/weather/100.png' alt='Weather Icon' width={28} height={28} className='text-primary' />
    <p className='text-[9px] font-bold text-card-foreground'>10°C</p>
    <p className='text-[9px] text-muted-foreground capitalize truncate w-full'>晴れ</p>
  </Card>
  // </div>
);

const OverlaySkeleton: React.FC<{ regionName: string }> = ({ regionName }) => (
  <div className='p-2 bg-card/70 rounded-lg shadow-lg flex flex-col items-center w-28 text-center backdrop-blur-sm'>
    <p className='text-xs font-semibold text-card-foreground mb-0.5 truncate w-full' title={regionName}>
      {regionName}
    </p>
    <Skeleton className='w-7 h-7 rounded-full my-0.5' />
    <Skeleton className='h-5 w-10 my-0.5' />
    <Skeleton className='h-3 w-16' />
  </div>
);

const OverlayError: React.FC<{ regionName: string }> = ({ regionName }) => (
  <div className='p-2 bg-destructive/70 rounded-lg shadow-lg flex flex-col items-center w-28 text-center backdrop-blur-sm'>
    <p className='text-xs font-semibold text-destructive-foreground mb-0.5 truncate w-full' title={regionName}>
      {regionName}
    </p>
    <AlertTriangle className='w-7 h-7 text-destructive-foreground my-1' />
    <p className='text-xs text-destructive-foreground'>Error</p>
  </div>
);

export default function IndexPage() {
  return (
    <main className='w-full max-w-4xl'>
      <div className='w-full h-full items-center flex flex-col'>
        <div className='relative items-center flex flex-col'>
          <Image src='/images/map.png' alt='日本地図' width={400} height={400} />
          {japanRegions.map((region) => (
            <div
              key={region.id}
              className='absolute'
              style={{ top: region.mapPosition.top, left: region.mapPosition.left }}
            >
              <WeatherOverlay regionName={region.name} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
