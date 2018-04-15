interface Action {
  type: any;
  payload?: object;
}

export type Reducer<S, A extends Action> =
  (state: S | undefined, action: A) => S;

export type NoInitialReducer<S, A extends Action> =
  (state: S, action: A) => S;

export interface CrossSliceReducer<S, A extends Action> {
  // tslint:disable-next-line:callable-types
  (intermediateState: S, action: A, previousState: S | undefined): S;
}

export interface CrossSliceNoInitialReducer<S, A extends Action> {
  // tslint:disable-next-line:callable-types
  (intermediateState: S, action: A, previousState: S): S;
}

export function reduceReducers<S, A extends Action>(
  combinedReducer: Reducer<S, A>,
  ...crossSlicereducers: CrossSliceReducer<S, A>[]
) {
  return (previous: S | undefined, action: A) =>
    crossSlicereducers.reduce(
      (intermediateState, reducer) => {
        return reducer(intermediateState, action, previous);
      },
      combinedReducer(previous, action)
    );
}

export function reduceNoInitialReducers<S, A extends Action>(
  combinedReducer: NoInitialReducer<S, A>,
  ...crossSlicereducers: CrossSliceNoInitialReducer<S, A>[]
) {
  return (previous: S, action: A) =>
    crossSlicereducers.reduce(
      (intermediateState, reducer) => {
        return reducer(intermediateState, action, previous);
      },
      combinedReducer(previous, action)
    );
}
