module L = Ley_List;
module O = Ley_Option;
module IM = Ley_IntMap;
module IS = Ley_IntSet;

/**
 * `isPublicationActive static rules id` checks if the publication with id `id`
 * is active for the hero with a set of rules `rules`.
 */
let isPublicationActive = (staticPublications, rules: Hero.Rules.t, id) =>
  staticPublications
  |> IM.lookup(id)
  |> (
    fun
    | Some((p: Publication.t)) =>
      p.isCore
      || rules.areAllPublicationsActive
      && !p.isAdultContent
      || IS.member(id, rules.activePublications)
    | None => false
  );

/**
 * `isAvailable acc staticPublications rules entry` returns if the given entry
 * `entry` is available based on the hero's set of active rules `rules`. The
 * accessor function `acc` returns all source refs for the entry.
 */
let isAvailable = (acc, staticPublications, rules, x) =>
  x
  |> acc
  |> L.any(({PublicationRef.id, _}) =>
       isPublicationActive(staticPublications, rules, id)
     );

/**
 * `isAvailableNull` is like `isAvailable`, but it returns `true` if the entry
 * has no source refs.
 */
let isAvailableNull = (acc, staticPublications, rules, x) =>
  x
  |> acc
  |> (
    fun
    | [] => true
    | refs =>
      L.any(
        ({PublicationRef.id, _}) =>
          isPublicationActive(staticPublications, rules, id),
        refs,
      )
  );

/**
 * `isAvailableNullPred acc pred staticPublications rules entry` is like
 * `isAvailableNull`, but it also returns `true` if the predicate `pred`,
 * applied to the entry, returns `true`.
 */
let isAvailableNullPred = (acc, pred, staticPublications, rules, x) =>
  x
  |> acc
  |> (
    refs =>
      switch (refs) {
      | [] => true
      | refs =>
        pred(x)
        || L.any(
             ({PublicationRef.id, _}) =>
               isPublicationActive(staticPublications, rules, id),
             refs,
           )
      }
  );

/**
 * `isFromCore acc staticPublications entry` returns if the given entry `entry`
 * is from a core publication. The accessor function `acc` returns all source
 * refs for the entry.
 */
let isFromCore = (acc, staticPublications, x) =>
  x
  |> acc
  |> L.any(({PublicationRef.id, _}) =>
       IM.lookup(id, staticPublications)
       |> O.any((p: Publication.t) => p.isCore)
     );

// module Grouping = {
//   /**
//    * Converts a list of pages into a string.
//    */
//   let showPages = pages =>
//     pages
//     |> L.map(
//          fun
//          | PublicationRef.Single(page) => I.show(page)
//          | Range(first, last) =>
//            I.show(first) ++ Chars.ndash ++ I.show(last),
//        )
//     |> L.intercalate(", ");
//
//   /**
//    * Converts a list of source refs into a string.
//    */
//   let showGroupedRefs = (staticData: Static.t, srcs) =>
//     srcs
//     |> O.mapOption((src: PublicationRef.t) =>
//          O.Infix.(
//            IM.lookup(src.id, staticData.publications)
//            <&> (book => (book.name, showPages(src.occurrences)))
//          )
//        )
//     |> L.sortBy(on(AdvancedFiltering.compareLocale(staticData), fst))
//     |> L.map(((name, pages)) => name ++ " " ++ pages)
//     |> L.intercalate("; ");
//
//   let areExcludesFilled = excludeSrcss =>
//     L.any(L.Extra.notNull, excludeSrcss);
//
//   /**
//    * Removes the pages listed in the first map from the pages in the second map.
//    * Removes a key entirely if no pages are left.
//    */
//   let diffUniqueGroupedPages = (excludeMp, mp) =>
//     IM.foldrWithKey(
//       (key, excludePages) =>
//         IM.alter(
//           maybePages =>
//             O.Infix.(
//               maybePages
//               >>= (
//                 pages =>
//                   pages
//                   |> flip(IS.difference, excludePages)
//                   |> O.ensure(B.notP(IS.null))
//               )
//             ),
//           key,
//         ),
//       mp,
//       excludeMp,
//     );
//
//   /**
//    * `showSources staticData excludeSrcss srcss` converts a list of lists of
//    * source refs `srcss` into a displayable string. If `excludeScrss` contains any
//    * list with source refs, their referenced pages are excluded from the result.
//    */
//   let showGroupedSources = (staticData, excludeSrcss, srcss) =>
//     srcss
//     |> getGroupedUniquePagesFromPublicationLists
//     |> (
//       areExcludesFilled(excludeSrcss)
//         ? excludeSrcss
//           |> getGroupedUniquePagesFromPublicationLists
//           |> diffUniqueGroupedPages
//         : id
//     )
//     |> getGroupedRefsFromGroupedUniquePages
//     |> showGroupedRefs(staticData);
// };
