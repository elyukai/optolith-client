interface Action {
  type: any
  payload?: object
}

export type Reducer<S, A extends Action> =
  (state: S | undefined, action: A) => S

export type NoInitialReducer<S, A extends Action> =
  (state: S, action: A) => S

export interface CrossSliceReducer<S, A extends Action> {
  (intermediateState: S, action: A, previousState: S | undefined): S
}

export interface CrossSliceNoInitialReducer<S, A extends Action> {
  (intermediateState: S, action: A, previousState: S): S
}

interface ReduceReducers {
  <S, A extends Action>(
    combinedReducer: Reducer<S, A>,
    ...crossSlicereducers: CrossSliceReducer<S, A>[]
  ): (previous: S | undefined, action: A) => S,
  <S, A extends Action>(
    combinedReducer: NoInitialReducer<S, A>,
    ...crossSlicereducers: CrossSliceNoInitialReducer<S, A>[]
  ): (previous: S, action: A) => S
}

export const reduceReducers: ReduceReducers = <S, A extends Action>(
  combinedReducer: Reducer<S, A>,
  ...crossSlicereducers: CrossSliceReducer<S, A>[]
) => (previous: S | undefined, action: A) =>
  crossSlicereducers.reduce (
    (intermediateState, reducer) => reducer (intermediateState, action, previous),
    combinedReducer (previous, action)
  )
