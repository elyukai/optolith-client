import { pipe } from "ramda";
import { filterRecordsBy, filterRecordsByE, filterRecordsByName } from "./filterBy";
import { RecordWithName, SortOptions, sortRecordsBy, sortRecordsByName } from "./sortBy";
import { List } from "./structures/List";
import { Record, RecordBase } from "./structures/Record";

/**
 * A combination of `filterRecordsBy` and `sortRecordsBy`.
 */
export const filterAndSortRecordsBy =
  (minFilterTextLength: number) =>
  <A extends RecordBase>
  (filterAccessors: ((x: Record<A>) => string)[]) =>
  (sortOptions: SortOptions<A>) =>
  (filterText: string) =>
    pipe (
      filterRecordsBy (minFilterTextLength)
                      (filterAccessors)
                      (filterText),
      sortRecordsBy (sortOptions),
    )

/**
 * A combination of `filterRecordsByE` and `sortRecordsBy`.
 */
export const filterEAndSortRecordsBy =
  <A extends RecordBase>
  (filterAccessors: ((x: Record<A>) => string)[]) =>
  (sortOptions: SortOptions<A>) =>
  (filterText: string) =>
    pipe (
      filterRecordsByE (filterAccessors)
                       (filterText),
      sortRecordsBy (sortOptions),
    )

/**
 * A combination of `filterRecordsByE` and `sortRecordsBy`.
 */
export const filterAndSortRecordsByName =
  (locale: string) =>
  (filterText: string) =>
  <A extends RecordWithName>
  (xs: List<Record<A>>) =>
    pipe (
           filterRecordsByName (filterText),
           sortRecordsByName (locale),
         )
         (xs)
