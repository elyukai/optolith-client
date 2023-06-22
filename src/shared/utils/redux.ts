import { Action, ActionReducerMapBuilder, AnyAction, OutputSelector, Reducer, createReducer, createSelector } from "@reduxjs/toolkit"

type Indexed = { [key: string | number]: any }

export const createPropertySelector = <S, O extends Indexed, K extends keyof O>(
  selector: (state: S) => O,
  property: K,
): OutputSelector<[typeof selector], O[K] | undefined, (obj: O) => O[K] | undefined> =>
  createSelector(selector, obj => obj[property])

export const reduceReducers = <S = any, A extends Action = AnyAction>(
  initialReducer: Reducer<S, A>,
  ...reducerBuilders: ((builder: ActionReducerMapBuilder<S>) => void)[]
): Reducer<S, A> => {
  let reducers: Reducer<S, A>[] | undefined = undefined

  return (state, action) => {
    const initialState = initialReducer(state, action)

    if (reducers === undefined) {
      reducers = reducerBuilders.map(builder => createReducer(initialState, builder))
    }

    return reducers.reduce(
      (newState, reducer) => reducer(newState, action),
      initialState,
    )
  }
}
