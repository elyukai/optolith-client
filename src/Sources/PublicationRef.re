type page =
  | Single(int)
  | Range(int, int);

type t = {
  id: int,
  occurrences: list(page),
};

module Translations = {
  type t = list(page);

  let decode = json =>
    JsonStrict.(
      json
      |> field(
           "occurrences",
           OneOrMany.Decode.t(json => {
             let first = json |> field("firstPage", int);
             let maybeLast = json |> optionalField("lastPage", int);

             Ley_Option.option(
               Single(first),
               last => Range(first, last),
               maybeLast,
             );
           }),
         )
      |> (
        fun
        | One(x) => [x]
        | Many(xs) => xs
      )
    );
};

module TranslationMap = TranslationMap.Make(Translations);

type multilingual = {
  id: int,
  translations: TranslationMap.t,
};

let decodeMultilingual = json =>
  Json.Decode.{
    id: json |> field("id", int),
    translations: json |> field("translations", TranslationMap.decode),
  };

let decodeMultilingualList = Json.Decode.list(decodeMultilingual);

let resolveTranslations = (langs, x) =>
  Ley_Option.Functor.(
    x.translations
    |> TranslationMap.getFromLanguageOrder(langs)
    <&> (translation => {id: x.id, occurrences: translation})
  );

let resolveTranslationsList = (langs, xs) =>
  xs |> Ley_Option.mapOption(resolveTranslations(langs));
