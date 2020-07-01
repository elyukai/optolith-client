open Static;
open Static.SourceRef;
open Ley.Function;

module B = Ley.Bool;
module I = Ley.Int;
module L = Ley.List;
module O = Ley.Option;
module SM = Ley.StrMap;
module SS = Ley.StrSet;
module IS = Ley.IntSet;

/**
 * `isPublicationActive static rules id` checks if the publication with id `id`
 * is active for the hero with a set of rules `rules`.
 */
let isPublicationActive = (staticPublications, rules: Hero.Rules.t, id) =>
  staticPublications
  |> SM.lookup(id)
  |> (
    fun
    | Some((p: Static.Publication.t)) =>
      p.isCore
      || rules.areAllPublicationsActive
      && !p.isAdultContent
      || SS.member(id, rules.activePublications)
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
  |> L.Foldable.any(({id}) =>
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
      L.Foldable.any(
        ({id}) => isPublicationActive(staticPublications, rules, id),
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
        || L.Foldable.any(
             ({id}) => isPublicationActive(staticPublications, rules, id),
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
  |> L.Foldable.any(({id}) =>
       SM.lookup(id, staticPublications)
       |> O.Foldable.any((p: Static.Publication.t) => p.isCore)
     );

module Grouping = {
  type page =
    | Single(int)
    | Range(int, int);

  type groupedSourceRef = {
    id: string,
    pages: list(page),
  };

  /**
   * `insertPages p s` inserts all pages derived from the ref's page definition
   * `p` into the passed set `s`.
   */
  let insertPages = ((fst, lst)) =>
    fst === lst
      ? IS.insert(fst)
      : flip(L.Foldable.foldr(IS.insert), Ley.Ix.range((fst, lst)));

  /**
   * `insertPagesByPublication ref mp` inserts the unfolded pages from the passed
   * ref `ref` into the passed map `mp` by the ref's id.
   */
  let insertPagesByPublication = ({id, page}) =>
    SM.alter(
      maybeExistingPages =>
        maybeExistingPages
        |> O.fromOption(IS.empty)
        |> insertPages(page)
        |> (s => Some(s)),
      id,
    );

  /**
   * Combines adjacent integers into ranges. Leaves the other ints as they are.
   * The result is sorted in ascending order.
   *
   * ```reason
   * groupRanges([1, 3, 4, 5, 7, 9, 10, 12])
   * == [Single(1), Range(3, 5), Single(7), Range(9, 10), Single(12)]
   * ```
   */
  let groupRanges = pages =>
    Ley.List.Foldable.foldr(
      (page, groupedReversedPages) =>
        switch (groupedReversedPages) {
        | [] => [Single(page)]
        | [Single(prevPage), ...previousGrouped] =>
          // if current page is equal to previous page, don't change anything
          page === prevPage
            ? groupedReversedPages
            // if the current page is the page directly after the previous page,
            // create a range from both pages
            : page === prevPage + 1
                ? [Range(prevPage, page), ...previousGrouped]
                // Otherwise just add as a separate page
                : [Single(page), ...groupedReversedPages]
        | [Range(prevFirstPage, prevLastPage), ...previousGrouped] =>
          // if current page is equal to last page in the previous range, don't
          // change anything
          page === prevLastPage
            ? groupedReversedPages
            // if the current page is the page directly after the last page in
            // the previous range, expand the range to include the current page
            : page === prevLastPage + 1
                ? [Range(prevFirstPage, page), ...previousGrouped]
                // Otherwise just add as a separate page
                : [Single(page), ...groupedReversedPages]
        },
      [],
      pages,
    )
    |> Ley.List.reverse;

  /**
   * Group unique pages from a list of list of source refs by publication id.
   */
  let getGroupedUniquePagesFromPublicationLists =
    L.Foldable.foldr(
      flip(L.Foldable.foldr(insertPagesByPublication)),
      SM.empty,
    );

  /**
   * Creates a list of grouped source refs from a map with the publication id as
   * the key and the set of pages as it's value.
   */
  let getGroupedRefsFromGroupedUniquePages =
    SM.foldrWithKey(
      (id, uniquePages) =>
        L.cons({
          id,
          // `uniquePages` doesnt need to be sorted since the IntSet already
          // output sorted values
          pages: uniquePages |> IS.Foldable.toList |> groupRanges,
        }),
      [],
    );

  /**
   * Converts a list of pages into a string.
   */
  let showPages = pages =>
    pages
    |> L.map(
         fun
         | Single(page) => I.show(page)
         | Range(first, last) =>
           I.show(first) ++ Chars.ndash ++ I.show(last),
       )
    |> L.intercalate(", ");

  /**
   * Converts a list of source refs into a string.
   */
  let showGroupedRefs = (staticData, srcs) =>
    srcs
    |> O.mapOption(src =>
         O.Functor.(
           SM.lookup(src.id, staticData.publications)
           <&> (book => (book.name, showPages(src.pages)))
         )
       )
    |> L.sortBy(on(AdvancedFiltering.compareLocale(staticData), fst))
    |> L.map(((name, pages)) => name ++ " " ++ pages)
    |> L.intercalate("; ");

  let areExcludesFilled = excludeSrcss =>
    L.Foldable.any(L.Extra.notNull, excludeSrcss);

  /**
   * Removes the pages listed in the first map from the pages in the second map.
   * Removes a key entirely if no pages are left.
   */
  let diffUniqueGroupedPages = (excludeMp, mp) =>
    SM.foldrWithKey(
      (key, excludePages) =>
        SM.alter(
          maybePages =>
            O.Monad.(
              maybePages
              >>= (
                pages =>
                  pages
                  |> flip(IS.difference, excludePages)
                  |> O.ensure(B.notP(IS.Foldable.null))
              )
            ),
          key,
        ),
      mp,
      excludeMp,
    );

  /**
   * `showSources staticData excludeSrcss srcss` converts a list of lists of
   * source refs `srcss` into a displayable string. If `excludeScrss` contains any
   * list with source refs, their referenced pages are excluded from the result.
   */
  let showGroupedSources = (staticData, excludeSrcss, srcss) =>
    srcss
    |> getGroupedUniquePagesFromPublicationLists
    |> (
      areExcludesFilled(excludeSrcss)
        ? excludeSrcss
          |> getGroupedUniquePagesFromPublicationLists
          |> diffUniqueGroupedPages
        : id
    )
    |> getGroupedRefsFromGroupedUniquePages
    |> showGroupedRefs(staticData);
};
