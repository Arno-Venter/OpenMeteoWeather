import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { OpenMeteoHttpService } from "../../services/open-meteo-http/open-meteo-http.service";
import { ForecastRequest } from "../../domain/model/ForecaseRequest";
import { buildQuery, extractSuccessData, Query } from "../../utils/query";
import { CommonModule } from "@angular/common";
import { HttpClient, provideHttpClient } from "@angular/common/http";
import { map, Observable, of, Subscription, switchMap, tap } from "rxjs";
import { ForecastResponse } from "../../domain/model/ForecastResponse";
import {
  HourlyForecast,
  HourlyForecastRow,
} from "../../domain/model/hourly-forecast";

interface DailyForecastRow {
  date: string;
  max_temp: number;
  min_temp: number;
  precip: number;
  humidity: number;
}

@Component({
  selector: "app-forecast",
  standalone: true,
  imports: [CommonModule, MatTableModule, MatFormFieldModule, MatInputModule],
  providers: [OpenMeteoHttpService],
  templateUrl: "./forecast.component.html",
  styleUrl: "./forecast.component.css",
})
export class ForecastComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ["time", "temp", "feels", "precip", "humidity"];
  dataSource = new MatTableDataSource<DailyForecastRow>();

  forecastRequest: ForecastRequest = { latitude: 30, longitude: 30 };
  request$ = this.service.getForecast(this.forecastRequest);

  forecast$: Observable<Query<ForecastResponse, Error>> =
    this.request$.pipe(buildQuery());
  data$: Observable<ForecastResponse> = this.forecast$.pipe(
    extractSuccessData(),
    tap((data) => {
      console.log(data);
      this.dataSource.data = this.transformData(data.hourly);
      console.log(this.dataSource.data);
    }),
  );

  subscriptions: Subscription[] = [];

  constructor(private service: OpenMeteoHttpService) {}
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
  ngOnInit(): void {
    this.subscriptions.push(this.data$.subscribe());
  }

  private transformData(data: HourlyForecast): DailyForecastRow[] {
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
}
