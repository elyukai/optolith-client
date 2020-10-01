type t = {
  id: int,
  name: string,
  numId: int,
  primary: int,
  aspects: option((int, int)),
};

module Translations = {
  type t = {name: string};

  let decode = json => JsonStrict.{name: json |> field("name", string)};
};

module TranslationMap = TranslationMap.Make(Translations);

type multilingual = {
  id: int,
  numId: int,
  primary: int,
  aspects: option((int, int)),
  translations: TranslationMap.t,
};

let decodeMultilingual = json =>
  JsonStrict.{
    id: json |> field("id", int),
    numId: json |> field("numId", int),
    primary: json |> field("primary", int),
    aspects: json |> optionalField("aspects", tuple2(int, int)),
    translations: json |> field("translations", TranslationMap.decode),
  };

let resolveTranslations = (langs, x) =>
  Ley_Option.Functor.(
    x.translations
    |> TranslationMap.getFromLanguageOrder(langs)
    <&> (
      translation => {
        id: x.id,
        name: translation.name,
        numId: x.numId,
        primary: x.primary,
        aspects: x.aspects,
      }
    )
  );

let decode = (langs, json) =>
  json |> decodeMultilingual |> resolveTranslations(langs);
