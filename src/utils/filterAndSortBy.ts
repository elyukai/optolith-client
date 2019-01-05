import { pipe } from "ramda";
import { List } from "../Data/List";
import { Record, RecordBase } from "../Data/Record";
import { filterRecordsBy, filterRecordsByE, filterRecordsByName } from "./filterBy";
import { RecordWithName, SortOptions, sortRecordsBy, sortRecordsByName } from "./sortBy";

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
      sortRecordsBy (sortOptions)
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
      sortRecordsBy (sortOptions)
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
           filterRecordsByName (filterText) as (xs: List<Record<A>>) => List<Record<A>>,
           sortRecordsByName (locale)
         )
         (xs)
