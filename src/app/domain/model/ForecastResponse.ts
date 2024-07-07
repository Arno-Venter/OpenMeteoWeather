import { HourlyForecast } from "./hourly-forecast";

export interface ForecastResponse {
  latitude: number;
  longitude: number;
  elevation: number;
  hourly: HourlyForecast;
}
