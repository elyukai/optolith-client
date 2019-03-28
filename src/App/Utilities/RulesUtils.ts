import { any, filter, fnull, List } from "../../Data/List";
import { fromJust, isJust, Maybe } from "../../Data/Maybe";
import { lookup, lookupF } from "../../Data/OrderedMap";
import { member } from "../../Data/OrderedSet";
import { fst, snd } from "../../Data/Pair";
import { Record } from "../../Data/Record";
import { Rules } from "../Models/Hero/Rules";
import { Book } from "../Models/Wiki/Book";
import { SourceLink } from "../Models/Wiki/sub/SourceLink";
import { WikiModel } from "../Models/Wiki/WikiModel";
import { EnabledSourceBooks } from "../Selectors/rulesSelectors";
import { pipe, pipe_ } from "./pipe";


const RA = Rules.A_
const BA = Book.A_
const SLA = SourceLink.A_

/**
 * Returns if a book is currently enabled.
 */
export const isBookEnabled =
  (availability: EnabledSourceBooks) =>
  (id: string): boolean => {
    const mb = lookup (id) (fst (availability))

    if (isJust (mb)) {
      const b = fromJust (mb)

      if (BA.isCore (b)) {
        return true
      }

      if (RA.enableAllRuleBooks (snd (availability))) {
        if (BA.isAdultContent (b)) {
          return member (id) (RA.enabledRuleBooks (snd (availability)))
        }

        return true
      }
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
  (x: A): boolean => {
    if (typeof availablility === "boolean") {
      return availablility
    }

    return pipe_ (
      x,
      f,
      any (pipe (SLA.id, isBookEnabled (availablility)))
    )
  }

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
