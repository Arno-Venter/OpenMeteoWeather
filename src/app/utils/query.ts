import { OperatorFunction, catchError, map, of, startWith } from "rxjs";
import { ForecastResponse } from "../domain/model/ForecastResponse";

export enum QueryStatus {
  SUCCESS = "Success",
  FAILURE = "Failure",
  LOADING = "Loading",
  UNSTARTED = "Unstarted",
}

type SuccessQuery<TData> = {
  status: QueryStatus.SUCCESS;
  data: TData;
};

type FailedQuery<TError> = {
  status: QueryStatus.FAILURE;
  error: TError;
};

type LoadingQuery = {
  status: QueryStatus.LOADING;
};

type UnstartedQuery = {
  status: QueryStatus.UNSTARTED;
};

export type Query<TData, TError> =
  | SuccessQuery<TData>
  | FailedQuery<TError>
  | LoadingQuery
  | UnstartedQuery;

export const buildQuery = <TData, TError>(): OperatorFunction<
  ForecastResponse,
  Query<TData, TError>
> => {
  return (source$) =>
    source$.pipe(
      map(
        (response) =>
          ({
            status: QueryStatus.SUCCESS,
            data: response,
          }) as Query<TData, TError>,
      ),
      catchError((error) => {
        const failedQuery: FailedQuery<TError> = {
          status: QueryStatus.FAILURE,
          error: error as TError,
        };
        return of(failedQuery as FailedQuery<TError>);
      }),
      startWith({ status: QueryStatus.LOADING } as LoadingQuery),
    );
};
