export interface RegionMapInfo {
  id: string; // e.g., "hokkaido_region"
  name: string; // e.g., "北海道地方"
  representativePrefectureId: string; // e.g., "Hokkaido" for weather data, should match IDs in prefecturesList.ts
  mapPosition: { top: string; left: string }; // CSS position for overlay
}

export const japanRegions: RegionMapInfo[] = [
  {
    id: 'hokkaido',
    name: '北海道',
    representativePrefectureId: 'Hokkaido',
    mapPosition: { top: '2%', left: '43%' },
  },
  { id: 'tohoku', name: '東北', representativePrefectureId: 'Miyagi', mapPosition: { top: '32%', left: '72%' } },
  { id: 'kanto', name: '関東', representativePrefectureId: 'Tokyo', mapPosition: { top: '61%', left: '64%' } },
  { id: 'chubu', name: '中部', representativePrefectureId: 'Aichi', mapPosition: { top: '76%', left: '44%' } },
  { id: 'kansai', name: '関西', representativePrefectureId: 'Osaka', mapPosition: { top: '34%', left: '35%' } },
  {
    id: 'chugoku',
    name: '中国',
    representativePrefectureId: 'Hiroshima',
    mapPosition: { top: '41%', left: '17%' },
  },
  {
    id: 'shikoku',
    name: '四国',
    representativePrefectureId: 'Ehime',
    mapPosition: { top: '84%', left: '24.5%' },
  },
  {
    id: 'kyushu',
    name: '九州',
    representativePrefectureId: 'Fukuoka',
    mapPosition: { top: '56%', left: '0%' },
  },
  {
    id: 'okinawa',
    name: '沖縄',
    representativePrefectureId: 'Okinawa',
    mapPosition: { top: '93%', left: '5%' },
  },
];
