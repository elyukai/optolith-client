import { pipe } from "ramda";
import { compareLocale } from "./I18n";
import { on } from "./structures/Function";
import { length, List, sortBy } from "./structures/List";
import { EQ, Ordering, reverseCompare } from "./structures/Ord";
import { fromDefault, Record, RecordBase } from "./structures/Record";

export type CompareR<A> = (x: Record<A>) => (y: Record<A>) => Ordering

export interface SortOption<A extends RecordBase> {
  compare: CompareR<A>
  reverse: boolean
}

export type SortOptions<A extends RecordBase> = (CompareR<A> | SortOption<A>)[]

/**
 * Sort a list based on the passed sort options array. A sort option can either
 * be a compare function or an object containing a compare function and if the
 * sort order should be reversed for the compare function. The first sort option
 * takes precedence over the second sort option and so on.
 */
export const sortRecordsBy =
  <A extends RecordBase>
  (sortOptions: SortOptions<A>) =>
  (xs: List<Record<A>>): List<Record<A>> => {
    if (length (xs) < 2 || sortOptions .length === 0) {
      return xs
    }

    const sortFunctions =
      sortOptions .map (
        x =>
          typeof x === "function"
          ? x
          : x .reverse
          ? reverseCompare (x .compare)
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

export interface RecordWithName extends RecordBase {
  name: string
}

export const RecordWithName = fromDefault<RecordWithName> ({ name: "" })

const { name } = RecordWithName.A

/**
 * Sort the list of passed records by their `name` property in ascending order.
 */
export const sortRecordsByName = (
  (locale: string) =>
    sortRecordsBy<RecordWithName> ([
      comparingR<RecordWithName, string> (name) (compareLocale (locale))
    ])
) as (locale: string) => <A extends RecordWithName> (xs: List<Record<A>>) => List<Record<A>>

/**
 * `comparingR :: Ord a => (a -> a -> Ordering) -> (b -> a) -> b -> b -> Ordering`
 *
 * Special version of `on` (from `Data.Function`) specialized to compare
 * functions for `Record`s. Takes a compare function and an accessor and returns
 * a comparison function that compares the values returned by the given
 * accessor.
 */
export const comparingR =
  <A extends RecordBase, B>
  (accessor: (x: Record<A>) => B) =>
  (compare: (x: B) => (y: B) => Ordering) =>
    on<Record<A>, B, Ordering> (compare) (accessor)

/**
 * `sortStrings locale xs` sorts a list of strings with respect to the passed
 * locale.
 */
export const sortStrings = pipe (compareLocale, sortBy)
