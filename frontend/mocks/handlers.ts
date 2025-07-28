import { detailedForecastHandlers, prefectureForecastHandlers, regionalForecastHandlers } from './handlers/forecast';
import { contactHandlers } from './handlers/contact';

export const handlers = [
  ...regionalForecastHandlers,
  ...prefectureForecastHandlers,
  ...detailedForecastHandlers,
  ...contactHandlers,
];
