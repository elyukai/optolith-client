import { Action, AnyAction, OutputSelector, createSelector } from "@reduxjs/toolkit"
import { Draft, isDraft, nothing, produce } from "immer"

type Indexed = { [key: string | number]: unknown }

/**
 * Creates a selector from an object-selecting selector that selects only a
 * property of the object.
 * @param selector The selector function that selects an object.
 * @param property A possible property of the object.
 * @returns A selector that selects the property of the object.
 */
export const createPropertySelector = <S, O extends Indexed, K extends keyof O>(
  selector: (state: S) => O,
  property: K,
): OutputSelector<[typeof selector], O[K] | undefined, (obj: O) => O[K] | undefined> =>
  createSelector(selector, obj => obj[property])

/**
 * A reducer type with possible additional parameters.
 */
export type Reducer<
  S,
  A extends Action = AnyAction,
  P extends unknown[] = [],
  IS extends S | undefined = S,
> = (state: IS, action: A, ...additionalParams: P) => S

const isDraftT = <T, U>(state: T | Draft<U>): state is Draft<U> => isDraft(state)

const ensureDraftState = <S>(
  state: S,
  f: (draft: Draft<S>) => ValidReducerReturnType<Draft<S>>,
): S => {
  if (isDraftT(state)) {
    const result = f(state as Draft<S>)
    return result === undefined ? state : (result as S)
  } else {
    return produce(state, f)
  }
}

/**
 * Chains multiple reducers together. The first reducer must provide an initial
 * state.
 */
export const reduceReducers =
  <S, A extends Action = AnyAction, P extends unknown[] = [], IS extends S | undefined = S>(
    initialReducer: Reducer<S, A, P, IS>,
    ...reducers: Reducer<S, A, P>[]
  ): Reducer<S, A, P, IS> =>
  (state, action, ...additionalParams) =>
    reducers.reduce(
      (newState, reducer) => reducer(newState, action, ...additionalParams),
      initialReducer(state, action, ...additionalParams),
    )

type ValidReducerReturnType<State> =
  | State
  | void
  | undefined
  | (State extends undefined ? typeof nothing : never)

/**
 * Enhance a reducing function with Immer.
 * @param reducer The reducing function.
 * @returns The enhanced reducing function.
 */
export const createImmerReducer =
  <S, A extends Action = AnyAction, P extends unknown[] = []>(
    reducer: (
      state: Draft<S>,
      action: A,
      ...additionalParams: P
    ) => ValidReducerReturnType<Draft<S>>,
  ): Reducer<S, A, P> =>
  (state, action, ...additionalParams) =>
    ensureDraftState(state, draft => reducer(draft, action, ...additionalParams))
