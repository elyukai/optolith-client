import { ReducerM } from "./combineReducerRecord"

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
  ): (previous: S | undefined, action: A) => S
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

/**
 * `reduceReducersC :: (...(a -> s -> s)) -> a -> s -> s`
 *
 * Reduces a list of curried state reducers from left to right by building a
 * combined reducer. Each reducer is passed to the result from the previous
 * reducer and the current action. The result of the last reducer is returned
 * from the combined reducer.
 */
export const reduceReducersC =
  <S, A extends Action>
  (combineReducer: ReducerM<S, A>, ...crossSliceReducers: ReducerM<S, A>[]) =>
  (action: A) =>
  (state: S): S =>
    crossSliceReducers
      .reduce (
        (inter, f) => f (action) (inter),
        combineReducer (action) (state)
      )

/**
 * `reduceReducersCWithInter :: (a -> s -> s, ...(s -> a -> s -> s)) -> a -> s -> s`
 *
 * Reduces a list of curried state reducers from left to right by building a
 * combined reducer. Each reducer is passed to the result from the previous
 * reducer, the current action and the original state. The first reducer does
 * not get the same state twice, so it only gets the action and the original
 * state. The result of the last reducer is returned from the combined reducer.
 */
export const reduceReducersCWithInter =
  <S, A extends Action>
  (combineReducer: ReducerM<S, A>, ...crossSliceReducers: ((previous: S) => ReducerM<S, A>)[]) =>
  (action: A) =>
  (state: S): S =>
    crossSliceReducers
      .reduce (
        (inter, f) => f (state) (action) (inter),
        combineReducer (action) (state)
      )
