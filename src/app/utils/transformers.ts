import { DailyForecastRow } from "../components/forecast/forecast.component";
import { HourlyForecast } from "../domain/model/hourly-forecast";

export function transformData(data: HourlyForecast): DailyForecastRow[] {
  let rows: DailyForecastRow[] = [];

  const amountOfDays = Math.ceil(data.time.length / 24);

  for (let i = 0; i < amountOfDays; i++) {
    const dayIndexStart = i * 24;
    const dayIndexEnd = i * 24 + 24;
    const day: HourlyForecast = {
      time: data.time.slice(dayIndexStart, dayIndexEnd),
      apparent_temperature: data.apparent_temperature.slice(
        dayIndexStart,
        dayIndexEnd,
      ),
      precipitation_probability: data.precipitation_probability.slice(
        dayIndexStart,
        dayIndexEnd,
      ),
      relative_humidity_2m: data.relative_humidity_2m.slice(
        dayIndexStart,
        dayIndexEnd,
      ),
      temperature_2m: data.temperature_2m.slice(dayIndexStart, dayIndexEnd),
    };

    const getAverage = (array: number[]) =>
      Math.round(array.reduce((sum, value) => sum + value, 0) / array.length);

    const row: DailyForecastRow = {
      date: new Date(day.time[0]).toDateString(),
      max_temp: Math.max(...day.temperature_2m),
      min_temp: Math.min(...day.temperature_2m),
      precip: getAverage(day.precipitation_probability),
      humidity: getAverage(day.relative_humidity_2m),
    };

    rows.push(row);
  }

  return rows;
}
