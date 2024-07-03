enum QueryStatus {
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
