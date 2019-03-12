import { pipe } from "ramda";
import { bindF, Maybe } from "../../Data/Maybe";
import { lookup, OrderedMap } from "../../Data/OrderedMap";
import { AppState } from "../Reducers/appReducer";

export type MaybeSliceSelector<A> = (state: AppState) => Maybe<OrderedMap<string, A>>
export type SliceSelector<A> = (state: AppState) => OrderedMap<string, A>

/**
 * Takes a selector for the app's state, an `id` and the app's state and returns
 * the value at key `id` of the map returned by the selector. Returns `Nothing`
 * if the selector returns `Nothing` of if the map has no matching key.
 */
export const mapGetToMaybeSlice =
  <A> (sliceSelector: MaybeSliceSelector<A>) => (id: string) =>
    pipe (
      sliceSelector,
      bindF (lookup (id))
    )

/**
 * Takes a selector for the app's state, an `id` and the app's state and returns
 * the value at key `id` of the map returned by the selector. Returns `Nothing`
 * if the map has no matching key.
 */
export const mapGetToSlice =
  <A> (sliceSelector: SliceSelector<A>) => (id: string) =>
    pipe (sliceSelector, lookup (id))
