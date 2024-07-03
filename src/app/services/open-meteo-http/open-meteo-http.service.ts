import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class OpenMeteoHttpService {
  constructor(private http: HttpClient) {}

  getForecast() {
    const params = new HttpParams()
      .set("latitude", 52.52)
      .set("longitude", 13.41)
      .set(
        "hourly",
        "temperature_2m,apparent_temperature,precipitation_probability,relative_humidity_2m",
      );

    return this.http.get("https://api.open-meteo.com/v1/forecast", {
      params: params,
    });
  }
}
