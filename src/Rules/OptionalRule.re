type t = {
  id: int,
  name: string,
  description: string,
  src: list(PublicationRef.t),
  errata: list(Erratum.t),
};

module Translations = {
  type t = {
    name: string,
    description: string,
    errata: list(Erratum.t),
  };

  let decode = json =>
    Json.Decode.{
      name: json |> field("name", string),
      description: json |> field("description", string),
      errata: json |> field("errata", Erratum.decodeList),
    };
};

module TranslationMap = TranslationMap.Make(Translations);

type multilingual = {
  id: int,
  src: list(PublicationRef.multilingual),
  translations: TranslationMap.t,
};

let decodeMultilingual = json =>
  Json.Decode.{
    id: json |> field("id", int),
    src: json |> field("src", PublicationRef.decodeMultilingualList),
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
        description: translation.description,
        src: PublicationRef.resolveTranslationsList(langs, x.src),
        errata: translation.errata,
      }
    )
  );

let decode = (langs, json) =>
  json |> decodeMultilingual |> resolveTranslations(langs);
