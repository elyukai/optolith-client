import { bimap, Either, first, fromRight_, isLeft, maybeToEither, Right } from "../../../Data/Either";
import { appendStr, find, List, notNullStr } from "../../../Data/List";
import { bindF, elem, ensure, fromJust, isJust, Just, Maybe, Nothing } from "../../../Data/Maybe";
import { lookup, lookupF, OrderedMap } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { show } from "../../../Data/Show";
import { toInt } from "../NumberUtils";
import { pipe, pipe_ } from "../pipe";

/**
 * Lookup property `"id"` in passed line from universal table and returns an
 * error message if not found. Provide the name of the function to provide
 * additional help.
 */
const lookupId =
  (origin: string) =>
  <A extends string | number>
  (ensure_f: (x: string) => Maybe<A>) =>
  (key: string) =>
  (univ_row: OrderedMap<string, string>): Either<string, A> =>
    pipe_ (
            univ_row,
            lookup (key),
            bindF (ensure_f),
            maybeToEither (`${origin}: key ${show (key)} is missing in ${show (univ_row)}`)
          )

type MergeRowsByIdFunction<A> =
  (id: number) =>
  (lookup_l10n: (key: string) => Maybe<string>) =>
  (lookup_univ: (key: string) => Maybe<string>) => Either<string, A>

/**
 * Receives the name of the origin function (how it would be called), a function
 * that takes the id, the matched l10n row and the universal row from the
 * tables and returns the built record wrapped in `Right (Just)`,
 * `Right Nothing` if no matching l10n row could be found or a `Left`
 * containing an error message.
 */
export const mergeRowsById =
  (origin: string) =>
  <A> (f: MergeRowsByIdFunction<A>) =>
  (l10n: List<OrderedMap<string, string>>) =>
  (univ_row: OrderedMap<string, string>): Either<string, Maybe<A>> => {
    const either_id = lookupId (origin) (toInt) ("id") (univ_row)

    if (isLeft (either_id)) {
      return either_id
    }

    const id = fromRight_ (either_id)

    const ml10n_row =
      find<OrderedMap<string, string>> (pipe (lookup ("id"), elem (show (id))))
                                       (l10n)

    if (isJust (ml10n_row)) {
      const l10n_row = fromJust (ml10n_row)

      const x = bimap<string, string, A, Maybe<A>>
        (appendStr (`${origin} at id ${id}: `))
        (Just)
        (f (id) (lookupF (l10n_row)) (lookupF (univ_row)))

      return x
    }

    return Right (Nothing)
  }

type MergeRowsByIdAndMainIdFunction<A> =
  (mainId: number) =>
  (id: number) =>
  (lookup_l10n: (key: string) => Maybe<string>) =>
  (lookup_univ: (key: string) => Maybe<string>) => Either<string, A>

/**
 * Receives the name of the origin function (how it would be called), a function
 * that takes the id, the matched l10n row and the universal row from the
 * tables and returns the built record wrapped in `Right (Just)`,
 * `Right Nothing` if no matching l10n row could be found or a `Left`
 * containing an error message.
 */
export const mergeRowsByIdAndMainId =
  (origin: string) =>
  <A> (f: MergeRowsByIdAndMainIdFunction<A>) =>
  (l10n: List<OrderedMap<string, string>>) =>
  (univ_row: OrderedMap<string, string>): Either<string, Maybe<A>> => {
    const either_main_id = lookupId (origin) (toInt) ("mainId") (univ_row)
    const either_id = lookupId (origin) (toInt) ("id") (univ_row)

    if (isLeft (either_main_id)) {
      return either_main_id
    }

    if (isLeft (either_id)) {
      return either_id
    }

    const mainId = fromRight_ (either_main_id)
    const id = fromRight_ (either_id)

    const sameMainId =
      pipe (
        lookup ("mainId") as (x: OrderedMap<string, string>) => Maybe<string>,
        elem (show (mainId))
      )

    const sameId =
      pipe (
        lookup ("id") as (x: OrderedMap<string, string>) => Maybe<string>,
        elem (show (id))
      )

    const ml10n_row =
      find<OrderedMap<string, string>> (e => sameMainId (e) && sameId (e))
                                       (l10n)

    if (isJust (ml10n_row)) {
      const l10n_row = fromJust (ml10n_row)

      return bimap<string, string, A, Maybe<A>>
        (appendStr (`${origin} at main_id ${mainId} at id ${id}: `))
        (Just)
        (f (mainId) (id) (lookupF (l10n_row)) (lookupF (univ_row)))
    }

    return Right (Nothing)
  }

type FromRowFunction<A> =
  (id: string) =>
  (lookup_l10n: (key: string) => Maybe<string>) => Either<string, Record<A>>

/**
 * Receives the name of the origin function (how it would be called), a function
 * that takes the id, the l10n row from the *able and returns the built record
 * wrapped in `Right (Just)` or a `Left` containing an error message.
 */
export const fromRow =
  (origin: string) =>
  <A> (f: FromRowFunction<A>) =>
  (l10n_row: OrderedMap<string, string>): Either<string, Record<A>> => {
    const either_id = lookupId (origin) (ensure (notNullStr)) ("id") (l10n_row)

    if (isLeft (either_id)) {
      return either_id
    }

    const id = fromRight_ (either_id)

    return first<string, string, Record<A>>
      (appendStr (`${origin}: `))
      (f (id) (lookupF (l10n_row)))
  }
