export interface HourlyForecast {
  time: Date[];
  temperature_2m: number[];
  apparent_temperature: number[];
  precipitation_probability: number[];
  relative_humidity_2m: number[];
}

export interface HourlyForecastRow {
  time: string;
  temperature_2m: number;
  apparent_temperature: number;
  precipitation_probability: number;
  relative_humidity_2m: number;
}
