module Translations = {
  type t = {name: string};

  let decode = json => Json.Decode.{name: json |> field("name", string)};
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

let resolveTranslations = (langs, x) =>
  Ley_Option.Infix.(
    x.translations
    |> TranslationMap.getFromLanguageOrder(langs)
    <&> (translation => (x.id, translation.name))
  );

let decode = (langs, json) =>
  json |> decodeMultilingual |> resolveTranslations(langs);
