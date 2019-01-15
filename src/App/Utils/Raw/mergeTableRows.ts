import { pipe } from "ramda";
import { bimap, Either, fromRight_, isLeft, maybeToEither, Right } from "../../../Data/Either";
import { appendStr } from "../../../Data/List";
import { bindF, ensure, fromJust, isJust, Just, Maybe, Nothing } from "../../../Data/Maybe";
import { lookup, lookupF, OrderedMap } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { show } from "../../../Data/Show";
import { isInteger } from "../RegexUtils";

/**
 * Lookup property `"id"` in passed line from universal table and returns an
 * error message if not found. Provide the name of the function to provide
 * additional help.
 */
const lookupId =
  (origin: string) =>
  (univ_row: OrderedMap<string, string>) =>
    pipe (
           lookup<string, string> ("id"),
           bindF (ensure (isInteger)),
           maybeToEither (`${origin}: key "id" is missing in ${show (univ_row)}`)
         )
         (univ_row)

type MergeRowsByIdFunction<A> =
  (id: string) =>
  (l10n_row: OrderedMap<string, string>) =>
  (univ_row: OrderedMap<string, string>) => Either<string, Record<A>>

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
  (l10n: OrderedMap<string, OrderedMap<string, string>>) =>
  (univ_row: OrderedMap<string, string>): Either<string, Maybe<Record<A>>> => {
    const either_id = lookupId (origin) (univ_row)

    if (isLeft (either_id)) {
      return either_id
    }

    const id = fromRight_ (either_id)

    const ml10n_row = lookupF (l10n) (id)

    if (isJust (ml10n_row)) {
      const l10n_row = fromJust (ml10n_row)

      return bimap<string, string, Record<A>, Maybe<Record<A>>>
        (appendStr (`${origin}: `))
        (Just)
        (f (id) (l10n_row) (univ_row))
    }

    return Right (Nothing)
  }
