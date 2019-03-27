import { any, elemF, filter, fnull, List } from "../../Data/List";
import { member, OrderedMap } from "../../Data/OrderedMap";
import { OrderedSet } from "../../Data/OrderedSet";
import { Record } from "../../Data/Record";
import { Book } from "../Models/Wiki/Book";
import { SourceLink } from "../Models/Wiki/sub/SourceLink";
import { pipe, pipe_ } from "./pipe";


// LOGIC

const { id } = SourceLink.A

const CoreBooks = List ("US25001", "US25002", "US25001EN", "US25002EN")

/**
 * Check if the passed `SourceLink` links to a core book.
 */
export const isCoreBook =
  (sourceLink: Record<SourceLink>) => pipe (id, elemF (CoreBooks)) (sourceLink)

/**
 * Returns if the given entry is available.
 * @param availablility The availability state.
 */
export const isAvailable =
  <A>
  (f: (x: A) => List<Record<SourceLink>>) =>
  (availablility: boolean | OrderedSet<string>) =>
  (x: A): boolean => {
    if (typeof availablility === "boolean") {
      return availablility
    }

    return pipe_ (
      x,
      f,
      any (s => OrderedSet.elemF (availablility) (id (s)) || isCoreBook (s))
    )
  }

/**
 * Returns if the given entry is from a core rule book.
 * @param a The entry.
 */
export const isEntryFromCoreBook =
  <A> (f: (x: A) => List<Record<SourceLink>>) => pipe (f, any (isCoreBook))

/**
 * Filters a list of `SourceLink`s by availability.
 */
export const filterByAvailability =
  <A>
  (f: (x: A) => List<Record<SourceLink>>) =>
  (availablility: boolean | OrderedSet<string>) =>
    filter<A> (e => fnull (f (e)) || isAvailable (f) (availablility) (e))

/**
 * Filters a list of `SourceLink`s by availability or by the given predicate (at
 * least one must be/return `True`).
 */
export const filterByAvailabilityAndPred =
  <A>
  (f: (x: A) => List<Record<SourceLink>>) =>
  (pred: (obj: A) => boolean) =>
  (availablility: boolean | OrderedSet<string>) =>
    filter<A> (e => fnull (f (e))
                    || isAvailable (f) (availablility) (e)
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
