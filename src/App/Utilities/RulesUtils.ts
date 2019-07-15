import { any, filter, fnull, List } from "../../Data/List";
import { fromJust, isJust, Maybe } from "../../Data/Maybe";
import { lookup, lookupF } from "../../Data/OrderedMap";
import { member } from "../../Data/OrderedSet";
import { Record } from "../../Data/Record";
import { fst, snd } from "../../Data/Tuple";
import { Rules } from "../Models/Hero/Rules";
import { Book } from "../Models/Wiki/Book";
import { SourceLink } from "../Models/Wiki/sub/SourceLink";
import { WikiModel } from "../Models/Wiki/WikiModel";
import { EnabledSourceBooks } from "../Selectors/rulesSelectors";
import { pipe } from "./pipe";

const RA = Rules.A
const BA = Book.A
const SLA = SourceLink.A

/**
 * Returns if a book is currently enabled.
 */
export const isBookEnabled =
  (availability: EnabledSourceBooks) => {
    const books = fst (availability)
    const rules = snd (availability)

    return (id: string): boolean => {
      const mb = lookup (id) (books)

      if (isJust (mb)) {
        const b = fromJust (mb)

        return BA.isCore (b)
          || RA.enableAllRuleBooks (rules) && !BA.isAdultContent (b)
          || member (id) (RA.enabledRuleBooks (rules))
      }

      return false
    }
  }

/**
 * Returns if the given entry is available.
 * @param availablility The availability state.
 */
export const isAvailable =
  <A>
  (f: (x: A) => List<Record<SourceLink>>) =>
  (availablility: EnabledSourceBooks) =>
    pipe (f, any (pipe (SLA.id, isBookEnabled (availablility))))

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
