import { contactHandlers } from './handlers/contact';
import {
  areasHandlers,
  detailedForecastHandlers,
  liveChannelsHandlers,
  prefectureForecastHandlers,
  regionalForecastHandlers,
} from './handlers/forecast';

export const handlers = [
  ...regionalForecastHandlers,
  ...prefectureForecastHandlers,
  ...detailedForecastHandlers,
  ...liveChannelsHandlers,
  ...areasHandlers,
  ...contactHandlers,
];
