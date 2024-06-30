import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class PurpleAirHttpService {
  private readonly API_KEY = "241A4A4A-36C8-11EF-95CB-42010A80000E";

  constructor(private http: HttpClient) {}

  getSensors() {
    const params = new HttpParams().set(
      "fields",
      "sensor_index,last_seen,name,location_type,latitude,longitude,position_rating",
    );

    return this.http.get("https://api.purpleair.com/v1/sensors", {
      params: params,
      headers: { "X-API-KEY": this.API_KEY },
    });
  }
}
