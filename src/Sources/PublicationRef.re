type page =
  | Single(int)
  | Range(int, int);

type t = {
  id: int,
  occurrences: list(page),
};

module Decode = {
  module Translation = {
    type t = list(page);

    let t = json =>
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

  module TranslationMap = TranslationMap.Make(Translation);

  type multilingual = {
    id: int,
    translations: TranslationMap.t,
  };

  let multilingual = json =>
    Json.Decode.{
      id: json |> field("id", int),
      translations: json |> field("translations", TranslationMap.Decode.t),
    };

  let multilingualList = Json.Decode.list(multilingual);

  let resolveTranslations = (langs, x) =>
    Ley_Option.Infix.(
      x.translations
      |> TranslationMap.Decode.getFromLanguageOrder(langs)
      <&> (translation => {id: x.id, occurrences: translation})
    );

  let resolveTranslationsList = (langs, xs) =>
    xs |> Ley_Option.mapOption(resolveTranslations(langs));
};
