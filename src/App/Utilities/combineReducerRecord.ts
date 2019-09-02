import { Action, AnyAction } from "redux";
import { over } from "../../Data/Lens";
import { foldr, OrderedSet } from "../../Data/OrderedSet";
import { fromDefault, makeLenses, Omit, Record, RecordBase, RecordIBase } from "../../Data/Record";

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
  (recordName: string) =>
  <S extends RecordIBase<Name>, A extends Action = any, Name extends string = S["@@name"]>
  (defaults: Required<Omit<S, "@@name">>) =>
  (reducers: Required<ReducerRecord<Omit<S, "@@name">>>) => {
    const x = fromDefault (recordName) (defaults)
    const xL = makeLenses (x)

    const reducer =
      (action: A) =>
      (mstate: Record<S>) =>
        foldr ((key: keyof Omit<S, "@@name">) => over (xL [key]) (reducers [key] (action)))
              (mstate)
              (x .keys as OrderedSet<keyof Omit<S, "@@name">>)

    reducer.default = x.default
    reducer.A = x.AL
    reducer.A_ = x.A
    reducer.L = xL

    return reducer
  }
