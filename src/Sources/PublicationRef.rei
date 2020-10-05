type page =
  | Single(int)
  | Range(int, int);

/**
 * A reference for a static entry it occurs in a certain publication, defined by
 * `id` on a set of pages.
 */
type t = {
  id: int,
  occurrences: list(page),
};

module Decode: {
  type multilingual;

  let multilingualList: Json.Decode.decoder(list(multilingual));

  let resolveTranslationsList: (Locale.order, list(multilingual)) => list(t);
};
