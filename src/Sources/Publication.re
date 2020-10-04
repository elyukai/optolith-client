type t = {
  id: int,
  name: string,
  short: string,
  isCore: bool,
  isAdultContent: bool,
};

module Translations = {
  type t = {
    name: string,
    short: string,
  };

  let decode = json =>
    Json.Decode.{
      name: json |> field("name", string),
      short: json |> field("short", string),
    };
};

module TranslationMap = TranslationMap.Make(Translations);

type multilingual = {
  id: int,
  isCore: bool,
  isAdultContent: bool,
  translations: TranslationMap.t,
};

let decodeMultilingual = json =>
  Json.Decode.{
    id: json |> field("id", int),
    isCore: json |> field("isCore", bool),
    isAdultContent: json |> field("isAdultContent", bool),
    translations: json |> field("translations", TranslationMap.decode),
  };

let resolveTranslations = (langs, x) =>
  Ley_Option.Infix.(
    x.translations
    |> TranslationMap.getFromLanguageOrder(langs)
    <&> (
      translation => (
        x.id,
        {
          id: x.id,
          isCore: x.isCore,
          isAdultContent: x.isAdultContent,
          name: translation.name,
          short: translation.short,
        },
      )
    )
  );

let decode = (langs, json) =>
  json |> decodeMultilingual |> resolveTranslations(langs);
