import { TestScheduler } from "rxjs/testing";
import { ForecastResponse } from "../domain/model/ForecastResponse";
import { ForecastFactory } from "../test-helpers/forecast-factory";
import {
  FailedQuery,
  Query,
  QueryStatus,
  SuccessQuery,
  buildQuery,
  extractSuccessData,
} from "./query";

describe("buildQuery operator", () => {
  let testScheduler: TestScheduler;

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it("transforms an observable of a response to an observable of a SuccessQuery", () => {
    testScheduler.run(({ cold, expectObservable }) => {
      const forecastResponse = ForecastFactory.buildForecastResponse(100);
      const response$ = cold("--a", {
        a: forecastResponse,
      });
      const expectedMarble = "a-b";
      const expectedBody = {
        a: { status: QueryStatus.LOADING },
        b: { status: QueryStatus.SUCCESS, data: forecastResponse },
      };

      const result$ = response$.pipe(buildQuery());

      expectObservable(result$).toBe(expectedMarble, expectedBody);
    });
  });

  it("transforms an errored observable into an observable of a FailedQuery", () => {
    testScheduler.run(({ cold, expectObservable }) => {
      const testError = new Error("This is an error");

      const response$ = cold<never>("--#", {}, testError);

      const expectedMarble = "a-(b|)";
      const expectedBody = {
        a: { status: QueryStatus.LOADING },
        b: { status: QueryStatus.FAILURE, error: testError },
      };

      const result$ = response$.pipe(buildQuery());

      expectObservable(result$).toBe(expectedMarble, expectedBody);
    });
  });
});

describe("extractSuccessData", () => {
  let testScheduler: TestScheduler;

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it("transforms an observable of SuccessQuery into an observable of TData", () => {
    testScheduler.run(({ cold, expectObservable }) => {
      let forecastResponse = ForecastFactory.buildForecastResponse(100);
      let successQuery = {
        data: forecastResponse,
        status: QueryStatus.SUCCESS,
      };

      let response$ = cold<SuccessQuery<ForecastResponse>>("--a", {
        a: successQuery as SuccessQuery<ForecastResponse>,
      });

      let expectedMarble = "--a";
      let expectedData = { a: forecastResponse };

      const result$ = response$.pipe(extractSuccessData());

      expectObservable(result$).toBe(expectedMarble, expectedData);
    });
  });

  it("emits nothing with an observable of a non SuccessQuery", () => {
    testScheduler.run(({ cold, expectObservable }) => {
      let failedQuery = {
        status: QueryStatus.FAILURE,
        error: new Error("This is an error"),
      };

      let response$ = cold<FailedQuery<Error>>("--a", {
        a: failedQuery as FailedQuery<Error>,
      });

      let expectedMarble = "---";

      const result$ = response$.pipe(extractSuccessData());

      expectObservable(result$).toBe(expectedMarble);
    });
  });
});
