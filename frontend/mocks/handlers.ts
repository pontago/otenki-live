import { detailedForecastHandlers, prefectureForecastHandlers, regionalForecastHandlers } from './handlers/forecast';

export const handlers = [...regionalForecastHandlers, ...prefectureForecastHandlers, ...detailedForecastHandlers];
