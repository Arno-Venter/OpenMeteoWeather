import { TestBed } from "@angular/core/testing";

import { OpenMeteoHttpService } from "./open-meteo-http.service";
import { provideHttpClient } from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { firstValueFrom } from "rxjs";
import { ForecastFactory } from "../../test-helpers/forecast-factory";
import { ForecastRequest } from "../../domain/model/ForecaseRequest";

describe("PurpleAirHttpService", () => {
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
    const expectedResponse = ForecastFactory.buildForecastResponse(100);
    const forecastRequest: ForecastRequest = {
      latitude: expectedResponse.latitude,
      longitude: expectedResponse.longitude,
    };

    const response$ = service.getForecast(forecastRequest);
    const response = firstValueFrom(response$);

    const testRequest = httpTesting.expectOne({
      method: "GET",
      url: `https://api.open-meteo.com/v1/forecast?latitude=${expectedResponse.latitude}&longitude=${expectedResponse.longitude}&hourly=temperature_2m,apparent_temperature,precipitation_probability,relative_humidity_2m`,
    });

    testRequest.flush(expectedResponse);

    expect(await response).toEqual(expectedResponse);

    httpTesting.verify();
  });
});
