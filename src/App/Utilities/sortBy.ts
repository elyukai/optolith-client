import { flip, on } from "../../Data/Function";
import { flength, List, sortBy } from "../../Data/List";
import { EQ, Ordering } from "../../Data/Ord";
import { fromDefault, Record, RecordIBase } from "../../Data/Record";
import { L10n, L10nRecord } from "../Models/Wiki/L10n";
import { compareLocale } from "./I18n";
import { pipe } from "./pipe";

export type CompareR<A extends RecordIBase<any>> = (x: Record<A>) => (y: Record<A>) => Ordering

export interface SortOption<A extends RecordIBase<any>> {
  compare: CompareR<A>
  reverse: boolean
}

export type SortOptions<A extends RecordIBase<any>> = (CompareR<A> | SortOption<A>)[]

/**
 * Sort a list based on the passed sort options array. A sort option can either
 * be a compare function or an object containing a compare function and if the
 * sort order should be reversed for the compare function. The first sort option
 * takes precedence over the second sort option and so on.
 */
export const sortRecordsBy =
  <A extends RecordIBase<any>>
  (sortOptions: SortOptions<A>) =>
  (xs: List<Record<A>>): List<Record<A>> => {
    if (flength (xs) < 2 || sortOptions .length === 0) {
      return xs
    }

    const sortFunctions =
      sortOptions .map (
        x =>
          typeof x === "function"
          ? x
          : x .reverse
          ? flip (x .compare)
          : x .compare
      )

    return sortBy<Record<A>> (a => b => {
                               for (const compare of sortFunctions) {
                                 const result = compare (a) (b)

                                 if (result !== EQ) {
                                   return result
                                 }
                               }

                               return EQ
                             })
                             (xs)
  }

export interface RecordWithName extends RecordIBase<any> {
  name: string
}

export const RecordWithName = fromDefault ("RecordWithName")
                                          <RecordWithName> ({ name: "" })

const { name } = RecordWithName.AL

const getLocaleId = (locale: string | L10nRecord) => L10n.is (locale) ? L10n.A.id (locale) : locale

/**
 * Sort the list of passed records by their `name` property in ascending order.
 */
export const sortRecordsByName = (
  (locale: string | L10nRecord) =>
    sortRecordsBy<RecordWithName> ([
      comparingR<RecordWithName, string> (name) (compareLocale (getLocaleId (locale))),
    ])
) as (locale: string | L10nRecord) =>
  <A extends RecordWithName> (xs: List<Record<A>>) => List<Record<A>>

/**
 * `comparingR :: Ord a => (a -> a -> Ordering) -> (b -> a) -> b -> b -> Ordering`
 *
 * Special version of `on` (from `Data.Function`) specialized to compare
 * functions for `Record`s. Takes a compare function and an accessor and returns
 * a comparison function that compares the values returned by the given
 * accessor.
 */
export const comparingR =
  <A extends RecordIBase<any>, B>
  (accessor: (x: Record<A>) => B) =>
  (compare: (x: B) => (y: B) => Ordering) =>
    on (compare) (accessor)

/**
 * `sortStrings locale xs` sorts a list of strings with respect to the passed
 * locale.
 */
export const sortStrings = pipe (compareLocale, sortBy)
