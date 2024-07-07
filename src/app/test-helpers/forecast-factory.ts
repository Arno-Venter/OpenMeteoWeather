import { ForecastResponse } from "../domain/model/ForecastResponse";
import { HourlyForecast } from "../domain/model/hourly-forecast";

export class ForecastFactory {
  private static formatDateToISO(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  private static generateSequentialDateTimes(length: number): string[] {
    const dateArray: string[] = [];
    let currentDate = new Date();

    for (let i = 0; i < length; i++) {
      dateArray.push(this.formatDateToISO(currentDate));
      currentDate.setMinutes(currentDate.getMinutes() + 60);
    }

    return dateArray;
  }

  private static getRandomNumber() {
    return Math.floor(Math.random() * 100);
  }

  private static buildRandomNumberArray(length: number): number[] {
    return Array.from({ length }, () => this.getRandomNumber());
  }

  static buildHourlyForecast(hoursAmount: number): HourlyForecast {
    return {
      apparent_temperature: this.buildRandomNumberArray(hoursAmount),
      precipitation_probability: this.buildRandomNumberArray(hoursAmount),
      relative_humidity_2m: this.buildRandomNumberArray(hoursAmount),
      temperature_2m: this.buildRandomNumberArray(hoursAmount),
      time: this.generateSequentialDateTimes(hoursAmount),
    };
  }

  static buildForecastResponse(hoursAmount: number): ForecastResponse {
    return {
      elevation: this.getRandomNumber(),
      hourly: this.buildHourlyForecast(hoursAmount),
      latitude: this.getRandomNumber(),
      longitude: this.getRandomNumber(),
    };
  }
}
