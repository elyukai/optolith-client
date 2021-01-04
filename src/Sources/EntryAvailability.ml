module L = Ley_List
module O = Ley_Option
module IM = Ley_IntMap
module IS = Ley_IntSet

let isPublicationActive staticPublications (rules : Hero.Rules.t) id =
  staticPublications |> IM.lookup id |> function
  | Some (p : Publication.t) ->
      p.isCore
      || (rules.areAllPublicationsActive && not p.isAdultContent)
      || IS.member id rules.activePublications
  | None -> false

let isAvailable acc staticPublications rules x =
  x |> acc
  |> L.any (fun { PublicationRef.id; _ } ->
         isPublicationActive staticPublications rules id)

let isAvailableNull acc staticPublications rules x =
  x |> acc |> function
  | [] -> true
  | refs ->
      L.any
        (fun { PublicationRef.id; _ } ->
          isPublicationActive staticPublications rules id)
        refs

let isAvailableNullPred acc pred staticPublications rules x =
  x |> acc |> function
  | [] -> true
  | refs ->
      pred x
      || L.any
           (fun { PublicationRef.id; _ } ->
             isPublicationActive staticPublications rules id)
           refs

let isFromCore acc staticPublications x =
  x |> acc
  |> L.any (fun { PublicationRef.id; _ } ->
         IM.lookup id staticPublications
         |> O.any (fun (p : Publication.t) -> p.isCore))

(* module Grouping = {
  (**
   * Converts a list of pages into a string.
   *)
  let showPages = pages =>
    pages
    |> L.map(
         fun
         | PublicationRef.Single(page) => I.show(page)
         | Range(first, last) =>
           I.show(first) ++ Chars.ndash ++ I.show(last),
       )
    |> L.intercalate(", ");

  (**
   * Converts a list of source refs into a string.
   *)
  let showGroupedRefs = (staticData: Static.t, srcs) =>
    srcs
    |> O.mapOption((src: PublicationRef.t) =>
         O.Infix.(
           IM.lookup(src.id, staticData.publications)
           <&> (book => (book.name, showPages(src.occurrences)))
         )
       )
    |> L.sortBy(on(AdvancedFiltering.compareLocale(staticData), fst))
    |> L.map(((name, pages)) => name ++ " " ++ pages)
    |> L.intercalate("; ");

  let areExcludesFilled = excludeSrcss =>
    L.any(L.Extra.notNull, excludeSrcss);

  (**
   * Removes the pages listed in the first map from the pages in the second
   * Removes a key entirely if no pages are left.
   *)
  let diffUniqueGroupedPages = (excludeMp, mp) =>
    IM.foldrWithKey(
      (key, excludePages) =>
        IM.alter(
          maybePages =>
            O.Infix.(
              maybePages
              >>= (
                pages =>
                  pages
                  |> flip(IS.difference, excludePages)
                  |> O.ensure(B.notP(IS.null))
              )
            ),
          key,
        ),
      mp,
      excludeMp,
    );

  (**
   * `showSources staticData excludeSrcss srcss` converts a list of lists of
   * source refs `srcss` into a displayable string. If `excludeScrss` contains any
   * list with source refs, their referenced pages are excluded from the result.
   *)
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
}; *)
