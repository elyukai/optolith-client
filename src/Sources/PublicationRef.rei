type page =
  | Single(int)
  | Range(int, int);

type t = {
  id: int,
  occurrences: list(page),
};

type multilingual;

let decodeMultilingualList: Json.Decode.decoder(list(multilingual));

let resolveTranslationsList: (Locale.order, list(multilingual)) => list(t);
