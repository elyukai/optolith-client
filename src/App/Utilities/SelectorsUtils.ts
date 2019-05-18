import { bindF, Maybe } from "../../Data/Maybe";
import { lookup, OrderedMap } from "../../Data/OrderedMap";
import { Record } from "../../Data/Record";
import { AppState } from "../Reducers/appReducer";
import { pipe } from "./pipe";

export type MaybeSliceSelector<A> = (state: Record<AppState>) => Maybe<OrderedMap<string, A>>
export type SliceSelector<A> = (state: Record<AppState>) => OrderedMap<string, A>
export type SlicePropsSelector<A, P> = (state: Record<AppState>, props: P) => OrderedMap<string, A>

// type Args<A> = A extends (...args: infer B) => any ? B : never

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

/**
 * Takes a selector for the app's state, an `id` and the app's state and returns
 * the value at key `id` of the map returned by the selector. Returns `Nothing`
 * if the map has no matching key.
 */
export const mapGetToSliceWithProps =
  <A, P> (sliceSelector: SlicePropsSelector<A, P>) =>
  (id: string) =>
  (state: Record<AppState>, props: P) =>
    lookup (id) (sliceSelector (state, props))
