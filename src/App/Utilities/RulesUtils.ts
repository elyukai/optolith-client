import { any, filter, fnull, List } from "../../Data/List";
import { fromJust, isJust, Maybe } from "../../Data/Maybe";
import { lookup, lookupF, OrderedMap } from "../../Data/OrderedMap";
import { member, OrderedSet } from "../../Data/OrderedSet";
import { Record } from "../../Data/Record";
import { fst, snd, Tuple } from "../../Data/Tuple";
import { uncurry3 } from "../../Data/Tuple/Curry";
import { Rules } from "../Models/Hero/Rules";
import { Book } from "../Models/Wiki/Book";
import { SourceLink } from "../Models/Wiki/sub/SourceLink";
import { WikiModel } from "../Models/Wiki/WikiModel";
import { EnabledSourceBooks } from "../Selectors/rulesSelectors";
import { pipe } from "./pipe";

const RA = Rules.A
const BA = Book.A
const SLA = SourceLink.A

export const sourceBooksPairToTuple =
  (x: EnabledSourceBooks) =>
    Tuple (fst (x), RA.enabledRuleBooks (snd (x)), RA.enableAllRuleBooks (snd (x)))

/**
 * Returns if a book is currently enabled.
 */
export const isBookEnabled =
  (booksMap: OrderedMap<string, Record<Book>>) =>
  (enabledRuleBooks: OrderedSet<string>) =>
  (areAllRuleBooksEnabled: boolean) =>
  (id: string): boolean => {
    const mb = lookup (id) (booksMap)

    if (isJust (mb)) {
      const b = fromJust (mb)

      return BA.isCore (b)
        || areAllRuleBooksEnabled && !BA.isAdultContent (b)
        || member (id) (enabledRuleBooks)
    }

    return false
  }

/**
 * Returns if the given entry is available.
 * @param availablility The availability state.
 */
export const isAvailable =
  <A>
  (f: (x: A) => List<Record<SourceLink>>) =>
  (availablility: EnabledSourceBooks) =>
    pipe (f, any (pipe (SLA.id, uncurry3 (isBookEnabled) (sourceBooksPairToTuple (availablility)))))

export const isAvailableF =
  (booksMap: OrderedMap<string, Record<Book>>) =>
  (enabledRuleBooks: OrderedSet<string>) =>
  (areAllRuleBooksEnabled: boolean) =>
  <A>
  (f: (x: A) => List<Record<SourceLink>>) =>
    pipe (f, any (pipe (SLA.id, isBookEnabled (booksMap)
                                              (enabledRuleBooks)
                                              (areAllRuleBooksEnabled))))

/**
 * Returns if the given entry is from a core rule book.
 * @param a The entry.
 */
export const isEntryFromCoreBook =
  <A>
  (f: (x: A) => List<Record<SourceLink>>) =>
  (bs: WikiModel["books"]):
  (x: A) => boolean =>
    pipe (f, any (pipe (SLA.id, lookupF (bs), Maybe.any (BA.isCore))))

/**
 * Filters a list of `SourceLink`s by availability.
 */
export const filterByAvailability =
  <A>
  (f: (x: A) => List<Record<SourceLink>>) =>
  (availablility: EnabledSourceBooks) =>
    filter<A> (e => fnull (f (e)) || isAvailable (f) (availablility) (e))

export const isEntryAvailable =
  (booksMap: OrderedMap<string, Record<Book>>) =>
  (enabledRuleBooks: OrderedSet<string>) =>
  (areAllRuleBooksEnabled: boolean) =>
  <A> (f: (x: A) => List<Record<SourceLink>>) =>
  (x: A) =>
    fnull (f (x))
    || isAvailableF (booksMap) (enabledRuleBooks) (areAllRuleBooksEnabled) (f) (x)

export const filterByAvailabilityF =
  (booksMap: OrderedMap<string, Record<Book>>) =>
  (enabledRuleBooks: OrderedSet<string>) =>
  (areAllRuleBooksEnabled: boolean) =>
  <A> (f: (x: A) => List<Record<SourceLink>>) =>
    filter (isEntryAvailable (booksMap) (enabledRuleBooks) (areAllRuleBooksEnabled) (f))

/**
 * Filters a list of `SourceLink`s by availability or by the given predicate (at
 * least one must be/return `True`).
 */
export const filterByAvailabilityAndPred =
  <A>
  (f: (x: A) => List<Record<SourceLink>>) =>
  (pred: (obj: A) => boolean) =>
  (availablility: EnabledSourceBooks) =>
    filter<A> (e => fnull (f (e))
                    || isAvailable (f) (availablility) (e)
                    || pred (e))
