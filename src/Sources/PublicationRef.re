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

    let t =
      JsonStrict.(
        OneOrMany.Decode.t(json => {
          let first = json |> field("firstPage", int);
          let maybeLast = json |> optionalField("lastPage", int);

          Ley_Option.option(
            Single(first),
            last => Range(first, last),
            maybeLast,
          );
        })
        |> map(
             fun
             | OneOrMany.One(x) => [x]
             | Many(xs) => xs,
           )
      );
  };

  module TranslationMap = TranslationMap.Make(Translation);

  type multilingual = {
    id: int,
    occurrences: TranslationMap.t,
  };

  let multilingual = (json): multilingual =>
    Json.Decode.{
      id: json |> field("id", int),
      occurrences: json |> field("occurrences", TranslationMap.Decode.t),
    };

  let multilingualList = Json.Decode.list(multilingual);

  let resolveTranslations = (langs, x: multilingual) =>
    Ley_Option.Infix.(
      x.occurrences
      |> TranslationMap.Decode.getFromLanguageOrder(langs)
      <&> ((occurrences) => ({id: x.id, occurrences}: t))
    );

  let resolveTranslationsList = (langs, xs) =>
    xs |> Ley_Option.mapOption(resolveTranslations(langs));
};
