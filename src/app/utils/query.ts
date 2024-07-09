import {
  Observable,
  OperatorFunction,
  catchError,
  filter,
  map,
  of,
  startWith,
  switchMap,
} from "rxjs";
import { ForecastResponse } from "../domain/model/ForecastResponse";

export enum QueryStatus {
  SUCCESS = "Success",
  FAILURE = "Failure",
  LOADING = "Loading",
  UNSTARTED = "Unstarted",
}

export type SuccessQuery<TData> = {
  status: QueryStatus.SUCCESS;
  data: TData;
};

export type FailedQuery<TError> = {
  status: QueryStatus.FAILURE;
  error: TError;
};

export type LoadingQuery = {
  status: QueryStatus.LOADING;
};

export type UnstartedQuery = {
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

export const extractSuccessData = <TData, TError>() => {
  return (obs: Observable<Query<TData, TError>>) => {
    return obs.pipe(
      filter(
        (query): query is SuccessQuery<TData> =>
          query.status === QueryStatus.SUCCESS,
      ),
      switchMap((query) => of(query.data)),
    );
  };
};

export const extractErrorMessage = <TData, TError>() => {
  return (obs: Observable<Query<TData, TError>>) => {
    return obs.pipe(
      filter(
        (query): query is FailedQuery<TError> =>
          query.status === QueryStatus.FAILURE,
      ),
      switchMap((query) => of(query.error)),
    );
  };
};
