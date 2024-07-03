import { TestBed } from "@angular/core/testing";

import { OpenMeteoHttpService } from "./open-meteo-http.service";
import { provideHttpClient } from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { firstValueFrom } from "rxjs";
import { ForecastFactory } from "../../test-helpers/forecast-factory";

fdescribe("PurpleAirHttpService", () => {
  let service: OpenMeteoHttpService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OpenMeteoHttpService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    httpTesting = TestBed.inject(HttpTestingController);
    service = TestBed.inject(OpenMeteoHttpService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("getForecast should make a GET request", async () => {
    const response$ = service.getForecast();

    const response = firstValueFrom(response$);

    const testRequest = httpTesting.expectOne({
      method: "GET",
      url: "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m,apparent_temperature,precipitation_probability,relative_humidity_2m",
    });

    testRequest.flush({ peepee: "poopoo" });

    expect(await response).toEqual({ peepee: "poopoo" });

    httpTesting.verify();
    console.log(ForecastFactory.buildForecast(100));
  });
});
