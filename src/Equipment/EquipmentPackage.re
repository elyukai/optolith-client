type t = {
  id: int,
  name: string,
  items: Ley_IntMap.t(int),
  src: list(PublicationRef.t),
  errata: list(Erratum.t),
};

module Decode = {
  module Translation = {
    type t = {
      name: string,
      errata: list(Erratum.t),
    };

    let t = json =>
      Json.Decode.{
        name: json |> field("name", string),
        errata: json |> field("errata", Erratum.Decode.list),
      };
  };

  module TranslationMap = TranslationMap.Make(Translation);

  type multilingual = {
    id: int,
    items: Ley_IntMap.t(int),
    src: list(PublicationRef.Decode.multilingual),
    translations: TranslationMap.t,
  };

  let item = json =>
    JsonStrict.(
      json |> field("id", int),
      json |> optionalField("amount", int),
    );

  let multilingual = json =>
    Json.Decode.{
      id: json |> field("id", int),
      items:
        json
        |> field("items", list(item))
        |> Ley_IntMap.fromList
        |> Ley_IntMap.map(Ley_Option.fromOption(1)),
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
          items: x.items,
          src: PublicationRef.Decode.resolveTranslationsList(langs, x.src),
          errata: translation.errata,
        }
      )
    );

  let t = (langs, json) =>
    json |> multilingual |> resolveTranslations(langs);

  let toAssoc = (x: t) => (x.id, x);

  let assoc = Decoder.decodeAssoc(t, toAssoc);
};
