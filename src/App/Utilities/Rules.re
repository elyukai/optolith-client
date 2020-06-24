// export const sourceBooksPairToTuple =
//   (x: EnabledSourceBooks) =>
//     Tuple (fst (x), RA.enabledRuleBooks (snd (x)), RA.enableAllRuleBooks (snd (x)))
//
// /**
//  * Returns if a book is currently enabled.
//  */
// export const isBookEnabled =
//   (booksMap: StrMap<Record<Book>>) =>
//   (enabledRuleBooks: OrderedSet<string>) =>
//   (areAllRuleBooksEnabled: boolean) =>
//   (id: string): boolean => {
//     const mb = lookup (id) (booksMap)
//
//     if (isJust (mb)) {
//       const b = fromJust (mb)
//
//       return BA.isCore (b)
//         || (areAllRuleBooksEnabled && !BA.isAdultContent (b))
//         || member (id) (enabledRuleBooks)
//     }
//
//     return false
//   }
//
// /**
//  * Returns if the given entry is available.
//  * @param availablility The availability state.
//  */
// export const isAvailable =
//   <A>
//   (f: (x: A) => List<Record<SourceLink>>) =>
//   (availablility: EnabledSourceBooks) =>
//     pipe (f, any (pipe (SLA.id, uncurry3 (isBookEnabled) (sourceBooksPairToTuple (availablility)))))
//
// export const isAvailableF =
//   (booksMap: StrMap<Record<Book>>) =>
//   (enabledRuleBooks: OrderedSet<string>) =>
//   (areAllRuleBooksEnabled: boolean) =>
//   <A>
//   (f: (x: A) => List<Record<SourceLink>>) =>
//     pipe (f, any (pipe (SLA.id, isBookEnabled (booksMap)
//                                               (enabledRuleBooks)
//                                               (areAllRuleBooksEnabled))))
//
// /**
//  * Returns if the given entry is from a core rule book.
//  * @param a The entry.
//  */
// export const isEntryFromCoreBook =
//   <A>
//   (f: (x: A) => List<Record<SourceLink>>) =>
//   (bs: StaticData["books"]):
//   (x: A) => boolean =>
//     pipe (f, any (pipe (SLA.id, lookupF (bs), Maybe.any (BA.isCore))))
//
// /**
//  * Filters a list of `SourceLink`s by availability.
//  */
// export const filterByAvailability =
//   <A>
//   (f: (x: A) => List<Record<SourceLink>>) =>
//   (availablility: EnabledSourceBooks) =>
//     filter<A> (e => fnull (f (e)) || isAvailable (f) (availablility) (e))
//
// export const isEntryAvailable =
//   (booksMap: StrMap<Record<Book>>) =>
//   (enabledRuleBooks: OrderedSet<string>) =>
//   (areAllRuleBooksEnabled: boolean) =>
//   <A> (f: (x: A) => List<Record<SourceLink>>) =>
//   (x: A) =>
//     fnull (f (x))
//     || isAvailableF (booksMap) (enabledRuleBooks) (areAllRuleBooksEnabled) (f) (x)
//
// export const filterByAvailabilityF =
//   (booksMap: StrMap<Record<Book>>) =>
//   (enabledRuleBooks: OrderedSet<string>) =>
//   (areAllRuleBooksEnabled: boolean) =>
//   <A> (f: (x: A) => List<Record<SourceLink>>) =>
//     filter (isEntryAvailable (booksMap) (enabledRuleBooks) (areAllRuleBooksEnabled) (f))
//
// /**
//  * Filters a list of `SourceLink`s by availability or by the given predicate (at
//  * least one must be/return `True`).
//  */
// export const filterByAvailabilityAndPred =
//   <A>
//   (f: (x: A) => List<Record<SourceLink>>) =>
//   (pred: (obj: A) => boolean) =>
//   (availablility: EnabledSourceBooks) =>
//     filter<A> (e => fnull (f (e))
//                     || isAvailable (f) (availablility) (e)
//                     || pred (e))
