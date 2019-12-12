import { List } from "../../Data/List";
import { Record, RecordIBase } from "../../Data/Record";
import { L10nRecord } from "../Models/Wiki/L10n";
import { FilterAccessor, filterByMulti, filterRecordsByE, filterRecordsByName } from "./filterBy";
import { pipe } from "./pipe";
import { RecordWithName, sortByMulti, SortOptions, sortRecordsByName } from "./sortBy";

/**
 * A combination of `filterRecordsBy` and `sortRecordsBy`.
 */
export const filterAndSortRecordsBy =
  (minFilterTextLength: number) =>
  <A>
  (filterAccessors: FilterAccessor<A>[]) =>
  (sortOptions: SortOptions<A>) =>
  (filterText: string) =>
    pipe (
      filterByMulti (minFilterTextLength)
                    (filterAccessors)
                    (filterText),
      sortByMulti (sortOptions)
    )

/**
 * A combination of `filterRecordsByE` and `sortRecordsBy`.
 */
export const filterEAndSortRecordsBy =
  <A extends RecordIBase<any>>
  (filterAccessors: ((x: Record<A>) => string)[]) =>
  (sortOptions: SortOptions<Record<A>>) =>
  (filterText: string) =>
    pipe (
      filterRecordsByE (filterAccessors)
                       (filterText),
      sortByMulti (sortOptions)
    )

/**
 * A combination of `filterRecordsByE` and `sortRecordsBy`.
 */
export const filterAndSortRecordsByName =
  (locale: L10nRecord) =>
  (filterText: string) =>
  <A extends RecordWithName>
  (xs: List<Record<A>>) =>
    pipe (
           filterRecordsByName (filterText) as (xs: List<Record<A>>) => List<Record<A>>,
           sortRecordsByName (locale)
         )
         (xs)
