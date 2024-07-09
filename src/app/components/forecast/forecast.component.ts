import { Component } from "@angular/core";
import * as material from "@angular/material/table";
import { OpenMeteoHttpService } from "../../services/open-meteo-http/open-meteo-http.service";
import { ForecastRequest } from "../../domain/model/ForecaseRequest";
import { buildQuery, extractSuccessData, Query } from "../../utils/query";
import { CommonModule } from "@angular/common";
import { HttpClient, provideHttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { ForecastResponse } from "../../domain/model/ForecastResponse";

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: "Hydrogen", weight: 1.0079, symbol: "H" },
  { position: 2, name: "Helium", weight: 4.0026, symbol: "He" },
  { position: 3, name: "Lithium", weight: 6.941, symbol: "Li" },
  { position: 4, name: "Beryllium", weight: 9.0122, symbol: "Be" },
  { position: 5, name: "Boron", weight: 10.811, symbol: "B" },
  { position: 6, name: "Carbon", weight: 12.0107, symbol: "C" },
  { position: 7, name: "Nitrogen", weight: 14.0067, symbol: "N" },
  { position: 8, name: "Oxygen", weight: 15.9994, symbol: "O" },
  { position: 9, name: "Fluorine", weight: 18.9984, symbol: "F" },
  { position: 10, name: "Neon", weight: 20.1797, symbol: "Ne" },
];

@Component({
  selector: "app-forecast",
  standalone: true,
  imports: [CommonModule, material.MatTableModule],
  providers: [OpenMeteoHttpService],
  templateUrl: "./forecast.component.html",
  styleUrl: "./forecast.component.css",
})
export class ForecastComponent {
  displayedColumns: string[] = ["position", "name", "weight", "symbol"];
  dataSource = ELEMENT_DATA;

  forecastRequest: ForecastRequest = { latitude: 30, longitude: 30 };
  forecast$: Observable<Query<ForecastResponse, Error>> = this.service
    .getForecast(this.forecastRequest)
    .pipe(buildQuery());
  data$ = this.forecast$.pipe(
    extractSuccessData(),
    map((x) => x.hourly.temperature_2m),
  );

  constructor(private service: OpenMeteoHttpService) {}
}
