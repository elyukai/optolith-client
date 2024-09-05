import { Action, OutputSelector, UnknownAction, createSelector } from "@reduxjs/toolkit"
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
  selector: (state: S) => O | undefined,
  property: K,
): OutputSelector<[typeof selector], O[K] | undefined> =>
  createSelector(selector, obj => (obj as O | undefined)?.[property])

/**
 * A reducer type with possible additional parameters.
 */
export type Reducer<
  S,
  A extends Action = UnknownAction,
  P extends unknown[] = [],
  IS extends S | undefined = S,
> = (state: IS, action: A, ...additionalParams: P) => S

const isDraftT = <T>(state: T | Draft<T>): state is Draft<T> => isDraft(state)

const ensureDraftState = <S>(
  state: S,
  f: (draft: Draft<S>) => ValidReducerReturnType<Draft<S>>,
): S => {
  if (isDraftT(state)) {
    const result = f(state)
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
  <S, A extends Action = UnknownAction, P extends unknown[] = [], IS extends S | undefined = S>(
    initialReducer: Reducer<S, A, P, IS>,
    ...reducers: Reducer<S, A, P>[]
  ): Reducer<S, A, P, IS> =>
  (state, action, ...additionalParams) =>
    reducers.reduce(
      (oldState, reducer) => reducer(oldState, action, ...additionalParams),
      initialReducer(state, action, ...additionalParams),
    )

/**
 * A reducer type with possible additional parameters that uses Immer.
 */
export type DraftReducer<S, A extends Action = UnknownAction, P extends unknown[] = []> = (
  state: Draft<S>,
  action: A,
  ...additionalParams: P
) => void

/**
 * Chains multiple draft reducers together.
 */
export const reduceDraftReducers =
  <S, A extends Action = UnknownAction, P extends unknown[] = []>(
    ...reducers: DraftReducer<S, A, P>[]
  ): DraftReducer<S, A, P> =>
  (state, action, ...additionalParams) => {
    reducers.forEach(reducer => {
      reducer(state, action, ...additionalParams)
    })
  }

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
  <S, A extends Action = UnknownAction, P extends unknown[] = []>(
    reducer: (
      state: Draft<S>,
      action: A,
      ...additionalParams: P
    ) => ValidReducerReturnType<Draft<S>>,
  ): Reducer<S, A, P> =>
  (state, action, ...additionalParams) =>
    ensureDraftState(state, draft => reducer(draft, action, ...additionalParams))
