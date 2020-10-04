type t = {
  id: int,
  name: string,
  items: Ley_IntMap.t(int),
  src: list(PublicationRef.t),
  errata: list(Erratum.t),
};

module Translations = {
  type t = {
    name: string,
    errata: list(Erratum.t),
  };

  let decode = json =>
    Json.Decode.{
      name: json |> field("name", string),
      errata: json |> field("errata", Erratum.decodeList),
    };
};

module TranslationMap = TranslationMap.Make(Translations);

type multilingual = {
  id: int,
  items: Ley_IntMap.t(int),
  src: list(PublicationRef.multilingual),
  translations: TranslationMap.t,
};

let decodeItem = json =>
  JsonStrict.(
    json |> field("id", int),
    json |> optionalField("amount", int),
  );

let decodeMultilingual = json =>
  Json.Decode.{
    id: json |> field("id", int),
    items:
      json
      |> field("items", list(decodeItem))
      |> Ley_IntMap.fromList
      |> Ley_IntMap.map(Ley_Option.fromOption(1)),
    src: json |> field("src", PublicationRef.decodeMultilingualList),
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
          name: translation.name,
          items: x.items,
          src: PublicationRef.resolveTranslationsList(langs, x.src),
          errata: translation.errata,
        },
      )
    )
  );

let decode = (langs, json) =>
  json |> decodeMultilingual |> resolveTranslations(langs);
