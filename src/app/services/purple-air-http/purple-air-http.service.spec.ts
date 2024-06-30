import { TestBed } from "@angular/core/testing";

import { PurpleAirHttpService } from "./purple-air-http.service";
import { provideHttpClient } from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { firstValueFrom } from "rxjs";

fdescribe("PurpleAirHttpService", () => {
  let service: PurpleAirHttpService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PurpleAirHttpService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    httpTesting = TestBed.inject(HttpTestingController);
    service = TestBed.inject(PurpleAirHttpService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("getSensors should make a GET request", async () => {
    const response$ = service.getSensors();

    const response = firstValueFrom(response$);

    const testRequest = httpTesting.expectOne({
      method: "GET",
      url: "https://api.purpleair.com/v1/sensors?fields=sensor_index,last_seen,name,location_type,latitude,longitude,position_rating",
    });

    testRequest.flush({ peepee: "poopoo" });

    expect(await response).toEqual({ peepee: "poopoo" });

    httpTesting.verify();
  });
});
