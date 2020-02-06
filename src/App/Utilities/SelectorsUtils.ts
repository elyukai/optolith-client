import { ident } from "../../Data/Function"
import { bindF, Maybe } from "../../Data/Maybe"
import { lookup, OrderedMap } from "../../Data/OrderedMap"
import { Record } from "../../Data/Record"
import { uncurryN3 } from "../../Data/Tuple/Curry"
import { AppState, AppStateRecord } from "../Models/AppState"
import { HeroModel, HeroModelRecord } from "../Models/Hero/HeroModel"
import { L10nRecord } from "../Models/Wiki/L10n"
import { getHeroProp, getLocaleAsProp } from "../Selectors/stateSelectors"
import { PSelectorWithKey } from "./createMapSelector"
import { createMaybeSelector } from "./createMaybeSelector"
import { pipe } from "./pipe"

export type MaybeSliceSelector<A> = (state: AppStateRecord) => Maybe<OrderedMap<string, A>>
export type SliceSelector<A, B extends any[]> = (...args: B) => OrderedMap<string, A>
export type SlicePropsSelector<A, P> = (state: AppStateRecord, props: P) => OrderedMap<string, A>

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
  (mapSelector: PSelectorWithKey<AppStateRecord, { l10n: L10nRecord; hero: HeroModelRecord }, R>) =>
  createMaybeSelector (
    ident as ident<AppStateRecord>,
    getHeroProp,
    getLocaleAsProp,
    uncurryN3 (state => hero => l10n => mapSelector (HeroModel.A.id (hero)) (state, { hero, l10n }))
  )
