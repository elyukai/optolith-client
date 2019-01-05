import { pipe } from "ramda";
import { ActiveActivatable } from "../App/Models/View/ActiveActivatable";
import { Advantage } from "../App/Models/Wiki/Advantage";
import { Book } from "../App/Models/Wiki/Book";
import { SourceLink } from "../App/Models/Wiki/sub/SourceLink";
import { any, elem_, filter, fnull, List } from "../Data/List";
import { member, OrderedMap } from "../Data/OrderedMap";
import { elemF, OrderedSet } from "../Data/OrderedSet";
import { Record, RecordBase } from "../Data/Record";


// TYPES

export interface ObjectWithSource extends RecordBase {
  id: string
  src: List<Record<SourceLink>>
}

export interface ObjectWithWikiEntry<A extends ObjectWithSource> {
  wikiEntry: Record<A>
  [key: string]: any
}


// LOGIC

const { wikiEntry } = ActiveActivatable.A
const { src } = Advantage.A
const { id } = SourceLink.A

const CoreBooks =
  List.fromElements ("US25001", "US25002", "US25001EN", "US25002EN")

/**
 * Check if the passed `SourceLink` links to a core book.
 */
export const isCoreBook =
  (sourceLink: Record<SourceLink>) => pipe (id, elem_ (CoreBooks)) (sourceLink)

/**
 * Returns if the given entry is available.
 * @param availablility The availability state.
 */
export const isAvailable =
  <A extends ObjectWithSource>
  (availablility: boolean | OrderedSet<string>) =>
  (x: Record<A>): boolean => {
    if (typeof availablility === "boolean") {
      return availablility
    }

    return pipe (src, any (s => elemF (availablility) (id (s)) || isCoreBook (s)))
                (x)
  }

/**
 * Returns if the given entry is from a core rule book.
 * @param x The entry.
 */
export const isEntryFromCoreBook =
  <A extends ObjectWithSource> (x: Record<A>) => pipe (src, any (isCoreBook))
                                                      (x)

/**
 * Filters a list of `SourceLink`s by availability.
 */
export const filterByAvailability =
  <A extends ObjectWithSource>
  (availablility: boolean | OrderedSet<string>) =>
    filter<Record<A>> (e => fnull (src (e)) || isAvailable<A> (availablility) (e))

/**
 * Filters a list of `SourceLink`s by availability or by the given predicate (at
 * least one must be/return `True`).
 */
export const filterByAvailabilityAndPred =
  <A extends ObjectWithSource>
  (pred: (obj: Record<A>) => boolean) =>
  (availablility: boolean | OrderedSet<string>) =>
    filter<Record<A>> (e => fnull (src (e))
                            || isAvailable<A> (availablility) (e)
                            || pred (e))

const srcFromWikiEntry = pipe (wikiEntry, src)

/**
 * Filters a list of objects with an `wikiEntry` property containing
 * `SourceLink`s by availability.
 */
export const filterByWikiEntryPropertyAvailability =
  <A extends ObjectWithSource, A0 extends ObjectWithWikiEntry<A>>
  (availablility: boolean | OrderedSet<string>) =>
    filter<Record<A0>> (e => fnull (srcFromWikiEntry (e))
                             || isAvailable<A> (availablility) (wikiEntry (e)))

/**
 * Filters a list of objects with an `wikiEntry` property containing
 * `SourceLink`s by availability.
 */
export const filterByWikiEntryPropertyAvailabilityAndPred =
  <A extends ObjectWithSource, A0 extends ObjectWithWikiEntry<A>>
  (pred: (obj: Record<A0>) => boolean) =>
  (availablility: boolean | OrderedSet<string>) =>
    filter<Record<A0>> (e => fnull (srcFromWikiEntry (e))
                             || isAvailable<A> (availablility) (wikiEntry (e))
                             || pred (e))

/**
 * Returns if a book is currently enabled.
 */
export const isBookEnabled =
  (books: OrderedMap<string, Record<Book>>) =>
  (availableBooks: true | OrderedSet<string>) =>
  (x: string) =>
    availableBooks === true
    ? member (x) (books)
    : OrderedSet.member (x) (availableBooks)
