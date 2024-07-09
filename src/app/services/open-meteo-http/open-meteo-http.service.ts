import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ForecastRequest } from "../../domain/model/ForecaseRequest";
import { ForecastResponse } from "../../domain/model/ForecastResponse";

@Injectable()
export class OpenMeteoHttpService {
  constructor(private http: HttpClient) {}

  getForecast(forecastRequest: ForecastRequest) {
    const params = new HttpParams()
      .set("latitude", forecastRequest.latitude)
      .set("longitude", forecastRequest.longitude)
      .set(
        "hourly",
        "temperature_2m,apparent_temperature,precipitation_probability,relative_humidity_2m",
      );

    return this.http.get<ForecastResponse>(
      "https://api.open-meteo.com/v1/forecast",
      {
        params: params,
      },
    );
  }
}
