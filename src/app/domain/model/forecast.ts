import { HourlyForecast } from "./hourly-forecast";

export interface Forecast {
  latitude: number;
  longitude: number;
  elevation: number;
  hourly: HourlyForecast;
}
