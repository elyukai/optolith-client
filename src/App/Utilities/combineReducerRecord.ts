import { Action, AnyAction } from "redux";
import { over } from "../../Data/Lens";
import { foldr } from "../../Data/OrderedSet";
import { fromDefault, makeLenses, Record, RecordBase } from "../../Data/Record";

export type ReducerM<S = any, A extends Action = AnyAction> = (action: A) => (mstate: S) => S

type ReducerRecord<S extends RecordBase, A extends Action = any> = {
  [K in keyof S]: ReducerM<S[K], A>
}

/**
 * `combineReducerRecord :: { ...def } -> { ...reducers } -> (a -> s -> s)`
 *
 * Combines multiples state reducers into one state reducer. The resulting state
 * will be a Record. The keys are the names of the different state slices and
 * the values at those keys are the values returned by the different reducers.
 * The resulting Record will only be updated (and thus get a new reference) if
 * at least one of the reducers passed return a new reference.
 *
 * The returned reducer has got three additional properties for accessing and
 * modifying the created state record:
 *
 * - `default`: The state Record with default values.
 * - `A`: Accessors for all slices.
 * - `L`: Lenses for all slices.
 */
export const combineReducerRecord =
  <S extends RecordBase, A extends Action = any>
  (defaults: Required<S>) =>
  (reducers: Required<ReducerRecord<S>>) => {
    const x = fromDefault (defaults)
    const xL = makeLenses (x)

    const reducer =
      (action: A) =>
      (mstate: Record<S>) =>
        foldr ((key: keyof S) => over (xL [key]) (reducers [key] (action)))
              (mstate)
              (x .keys)

    reducer.default = x.default
    reducer.A = x.AL
    reducer.A_ = x.A
    reducer.L = xL

    return reducer
  }
