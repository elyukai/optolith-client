type t = {
  id: int,
  name: string,
  apValue: int,
  languages: list(int),
  continent: int,
  isExtinct: bool,
  src: list(PublicationRef.t),
  errata: list(Erratum.t),
};

module Decode = {
  module Translation = {
    type t = {
      name: string,
      errata: option(list(Erratum.t)),
    };

    let t = json =>
      JsonStrict.{
        name: json |> field("name", string),
        errata: json |> optionalField("errata", Erratum.Decode.list),
      };
  };

  module TranslationMap = TranslationMap.Make(Translation);

  type multilingual = {
    id: int,
    apValue: int,
    languages: list(int),
    continent: int,
    isExtinct: bool,
    src: list(PublicationRef.Decode.multilingual),
    translations: TranslationMap.t,
  };

  let multilingual = json =>
    Json.Decode.{
      id: json |> field("id", int),
      apValue: json |> field("apValue", int),
      languages: json |> field("languages", list(int)),
      continent: json |> field("continent", int),
      isExtinct: json |> field("isExtinct", bool),
      src: json |> field("src", PublicationRef.Decode.multilingualList),
      translations: json |> field("translations", TranslationMap.Decode.t),
    };

  let resolveTranslations = (langs, x) =>
    Ley_Option.Infix.(
      x.translations
      |> TranslationMap.Decode.getFromLanguageOrder(langs)
      <&> (
        translation => {
          id: x.id,
          name: translation.name,
          apValue: x.apValue,
          languages: x.languages,
          continent: x.continent,
          isExtinct: x.isExtinct,
          src: PublicationRef.Decode.resolveTranslationsList(langs, x.src),
          errata: translation.errata |> Ley_Option.fromOption([]),
        }
      )
    );

  let t = (langs, json) =>
    json |> multilingual |> resolveTranslations(langs);

  let toAssoc = (x: t) => (x.id, x);

  let assoc = Decoder.decodeAssoc(t, toAssoc);
};
