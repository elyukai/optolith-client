import { pipe } from "ramda";
import { thrush } from "../../Data/Function";
import { filter, isSubsequenceOf, List, lower } from "../../Data/List";
import { Record, RecordBase } from "../../Data/Record";
import { RecordWithName } from "./sortBy";

/**
 * The default minimum filter text length for more efficient filtering of long
 * lists.
 */
const PERF_MIN = 3

/**
 * `filterRecordsBy min accs text xs` filters a list of records `xs` by checking
 * if the given `text` matches any of the results of the provided accessor
 * functions (`accs`). If the provided filter text's length is lower than `min`,
 * the original list will be returned.
 */
export const filterRecordsBy =
  (minFilterTextLength: number) =>
  <A extends RecordBase>
  (filterAccessors: ((x: Record<A>) => string)[]) =>
  (filterText: string) =>
  (xs: List<Record<A>>): List<Record<A>> => {
    if (
      filterText .length < minFilterTextLength
      || filterAccessors .length === 0
    ) {
      return xs
    }

    return filter<Record<A>>
      (x => filterAccessors
        .some (pipe (thrush (x), lower, isSubsequenceOf (lower (filterText)))))
      (xs)
  }

/**
 * Same as `filterRecordsBy` but with a set minimum filter text length of `3`.
 */
export const filterRecordsByE = filterRecordsBy (PERF_MIN)

/**
 * Same as `filterRecordsBy` but with a set minimum filter text length of `0`.
 */
export const filterRecordsByA = filterRecordsBy (0) // A => always

const { name } = RecordWithName.A

/**
 * Filters a list of records by their `name` property.
 */
export const filterRecordsByName =
  filterRecordsBy (0) ([name]) as
    (filterText: string) => <A extends RecordWithName> (xs: List<Record<A>>) => List<Record<A>>

/**
 * Filters a long list of records by their `name` property.
 */
export const filterRecordsByNameE =
  filterRecordsBy (PERF_MIN) ([name]) as
    (filterText: string) => <A extends RecordWithName> (xs: List<Record<A>>) => List<Record<A>>
