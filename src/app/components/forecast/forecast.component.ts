import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { Observable, Subscription, tap } from "rxjs";
import { ForecastRequest } from "../../domain/model/ForecaseRequest";
import { ForecastResponse } from "../../domain/model/ForecastResponse";
import { OpenMeteoHttpService } from "../../services/open-meteo-http/open-meteo-http.service";
import { buildQuery, extractSuccessData, Query } from "../../utils/query";
import { transformData } from "../../utils/transformers";

export interface DailyForecastRow {
  date: string;
  max_temp: number;
  min_temp: number;
  precip: number;
  humidity: number;
}

@Component({
  selector: "app-forecast",
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  providers: [OpenMeteoHttpService],
  templateUrl: "./forecast.component.html",
  styleUrl: "./forecast.component.css",
})
export class ForecastComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ["time", "temp", "feels", "precip", "humidity"];
  dataSource = new MatTableDataSource<DailyForecastRow>();

  locationForm = new FormGroup({
    latitude: new FormControl<number>(0, { nonNullable: true }),
    longitude: new FormControl<number>(0, { nonNullable: true }),
  });

  forecastRequest: ForecastRequest = {
    latitude: this.locationForm.controls.latitude.value,
    longitude: this.locationForm.controls.longitude.value,
  };
  request$ = this.service.getForecast(this.forecastRequest);

  forecast$: Observable<Query<ForecastResponse, Error>> =
    this.request$.pipe(buildQuery());
  data$: Observable<ForecastResponse> = this.forecast$.pipe(
    extractSuccessData(),
    tap((data) => {
      this.dataSource.data = transformData(data.hourly);
    }),
  );

  subscriptions: Subscription[] = [];

  constructor(private service: OpenMeteoHttpService) {}
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition((position) => {
      this.locationForm.patchValue({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });

    this.subscriptions.push(this.data$.subscribe());
  }
}
