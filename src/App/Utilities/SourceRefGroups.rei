/**
 * `showSources staticData excludeSrcss srcss` converts a list of lists of
 * source refs `srcss` into a displayable string. If `excludeScrss` contains any
 * list with source refs, their referenced pages are excluded from the result.
 */
let showGroupedSources:
  (
    Static.t,
    list(list(Static.SourceRef.t)),
    list(list(Static.SourceRef.t))
  ) =>
  string;
