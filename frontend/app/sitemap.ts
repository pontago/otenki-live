import { env } from '@/lib/env';
import type { MetadataRoute } from 'next';
import { areas } from '@/features/weather/api/forecast';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const areasResponse = await areas();
  const areaMaps = areasResponse.data.map((area) => ({
    url: `${env.NEXT_PUBLIC_BASE_URL}/${area.regionCode}/${area.areaCode}`,
    lastModified: new Date(),
  }));

  return [
    {
      url: `${env.NEXT_PUBLIC_BASE_URL}`,
      lastModified: new Date(),
    },
    {
      url: `${env.NEXT_PUBLIC_BASE_URL}/contact`,
      lastModified: new Date(),
    },
    {
      url: `${env.NEXT_PUBLIC_BASE_URL}/about`,
      lastModified: new Date(),
    },
    {
      url: `${env.NEXT_PUBLIC_BASE_URL}/credits`,
      lastModified: new Date(),
    },
    ...areaMaps,
  ];
}
