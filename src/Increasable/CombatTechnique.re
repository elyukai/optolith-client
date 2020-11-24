module Dynamic =
  Increasable.Dynamic.Make({
    let minValue = 6;
  });

module Static = {
  type t = {
    id: int,
    name: string,
    ic: IC.t,
    primary: list(int),
    special: option(string),
    hasNoParry: bool,
    breakingPointRating: int,
    gr: int,
    src: list(PublicationRef.t),
    errata: list(Erratum.t),
  };

  module Decode = {
    module Translation = {
      type t = {
        name: string,
        special: option(string),
        errata: option(list(Erratum.t)),
      };

      let t = json =>
        JsonStrict.{
          name: json |> field("name", string),
          special: json |> optionalField("special", string),
          errata: json |> optionalField("errata", Erratum.Decode.list),
        };
    };

    module TranslationMap = TranslationMap.Make(Translation);

    type multilingual = {
      id: int,
      ic: IC.t,
      primary: list(int),
      hasNoParry: bool,
      breakingPointRating: int,
      gr: int,
      src: list(PublicationRef.Decode.multilingual),
      translations: TranslationMap.t,
    };

    let multilingual = json =>
      Json.Decode.{
        id: json |> field("id", int),
        ic: json |> field("ic", IC.Decode.t),
        primary: json |> field("primary", list(int)),
        hasNoParry: json |> field("hasNoParry", bool),
        breakingPointRating: json |> field("breakingPointRating", int),
        gr: json |> field("gr", int),
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
            ic: x.ic,
            primary: x.primary,
            special: translation.special,
            hasNoParry: x.hasNoParry,
            breakingPointRating: x.breakingPointRating,
            gr: x.gr,
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
};
