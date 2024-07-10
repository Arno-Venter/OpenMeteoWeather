import { Component, OnInit } from "@angular/core";
import * as material from "@angular/material/table";
import { OpenMeteoHttpService } from "../../services/open-meteo-http/open-meteo-http.service";
import { ForecastRequest } from "../../domain/model/ForecaseRequest";
import { buildQuery, extractSuccessData, Query } from "../../utils/query";
import { CommonModule } from "@angular/common";
import { HttpClient, provideHttpClient } from "@angular/common/http";
import { map, Observable, of, switchMap, tap } from "rxjs";
import { ForecastResponse } from "../../domain/model/ForecastResponse";
import {
  HourlyForecast,
  HourlyForecastRow,
} from "../../domain/model/hourly-forecast";

@Component({
  selector: "app-forecast",
  standalone: true,
  imports: [CommonModule, material.MatTableModule],
  providers: [OpenMeteoHttpService],
  templateUrl: "./forecast.component.html",
  styleUrl: "./forecast.component.css",
})
export class ForecastComponent implements OnInit {
  displayedColumns: string[] = ["time", "temp", "feels", "precip", "humidity"];
  dataSource = new material.MatTableDataSource<HourlyForecastRow>();

  forecastRequest: ForecastRequest = { latitude: 30, longitude: 30 };
  request$ = this.service.getForecast(this.forecastRequest);
  forecast$: Observable<Query<ForecastResponse, Error>> =
    this.request$.pipe(buildQuery());
  data$: Observable<ForecastResponse> = this.forecast$.pipe(
    extractSuccessData(),
    tap((data) => {
      this.dataSource.data = this.transformData(data.hourly);
      console.log(this.dataSource.data);
    }),
  );

  constructor(private service: OpenMeteoHttpService) {}
  ngOnInit(): void {
    this.data$.subscribe();
  }

  private transformData(data: HourlyForecast): HourlyForecastRow[] {
    return data.time.map((time, index) => ({
      time:
        new Date(time).toLocaleDateString() +
        " " +
        new Date(time).toLocaleTimeString(),
      temperature_2m: data.temperature_2m[index],
      apparent_temperature: data.apparent_temperature[index],
      precipitation_probability: data.precipitation_probability[index],
      relative_humidity_2m: data.relative_humidity_2m[index],
    }));
  }
}
