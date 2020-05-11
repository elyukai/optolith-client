import { ident } from "../../Data/Function"
import { bindF, Maybe } from "../../Data/Maybe"
import { lookup } from "../../Data/OrderedMap"
import { Record } from "../../Data/Record"
import { uncurryN } from "../../Data/Tuple/Curry"
import { AppState, AppStateRecord } from "../Models/AppState"
import { HeroModel, HeroModelRecord } from "../Models/Hero/HeroModel"
import { getHeroProp } from "../Selectors/stateSelectors"
import { PSelectorWithKey } from "./createMapSelector"
import { createMaybeSelector } from "./createMaybeSelector"
import { pipe } from "./pipe"

export type MaybeSliceSelector<A> = (state: AppStateRecord) => Maybe<StrMap<A>>
export type SliceSelector<A, B extends any[]> = (...args: B) => StrMap<A>
export type SlicePropsSelector<A, P> = (state: AppStateRecord, props: P) => StrMap<A>

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
  <A, B extends any[]> (sliceSelector: SliceSelector<A, B>) => (id: string) =>
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

export const mapCurrentHero =
  <R>
  (mapSelector: PSelectorWithKey<AppStateRecord, { hero: HeroModelRecord }, R>) =>
  createMaybeSelector (
    ident as ident<AppStateRecord>,
    getHeroProp,
    uncurryN (state => hero => mapSelector (HeroModel.A.id (hero)) (state, { hero }))
  )
