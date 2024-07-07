import { TestScheduler } from "rxjs/testing";
import { ForecastResponse } from "../domain/model/ForecastResponse";
import { ForecastFactory } from "../test-helpers/forecast-factory";
import { QueryStatus, buildQuery } from "./query";

fdescribe("buildQuery", () => {
  let testScheduler: TestScheduler;

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it("transforms an observable of a response to an observable of a SuccessQuery", () => {
    testScheduler.run(({ cold, expectObservable }) => {
      const forecastResponse = ForecastFactory.buildForecastResponse(100);
      const response$ = cold<ForecastResponse>("--a", {
        a: forecastResponse,
      });
      const expectedMarble = "a-b";
      const expectedData = {
        a: { status: QueryStatus.LOADING },
        b: { status: QueryStatus.SUCCESS, data: forecastResponse },
      };

      const result$ = response$.pipe(buildQuery());

      expectObservable(result$).toBe(expectedMarble, expectedData);
    });
  });
});
