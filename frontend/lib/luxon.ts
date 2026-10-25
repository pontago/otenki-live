import { Settings } from 'luxon';

// luxon の既定のタイムゾーン・ロケールは、このモジュールを読み込んだ環境ごとに設定される。
// Next.js では RSC・クライアントコンポーネントの SSR・ブラウザでモジュールが別々に評価されるため、
// layout.tsx だけで設定すると SSR (Lambda は UTC) とブラウザで表示がずれてハイドレーションエラーになる。
// DateTime は必ずこのモジュールから import すること。
Settings.defaultZone = 'Asia/Tokyo';
Settings.defaultLocale = 'ja-JP';

export { DateTime } from 'luxon';
