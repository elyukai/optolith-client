module Dynamic = {
  type domain =
    | Predefined(int)
    | Custom(string);

  type t = {
    category: int,
    level: int,
    type_: int,
    domain,
    name: string,
  };
};

module Static = {
  type t = {
    id: int,
    name: string,
    types: Ley_IntMap.t(string),
    domains: Ley_IntMap.t(string),
    src: list(PublicationRef.t),
    errata: list(Erratum.t),
  };

  module Decode = {
    module Translation = {
      type t = {
        name: string,
        types: Ley_IntMap.t(string),
        domains: Ley_IntMap.t(string),
        errata: list(Erratum.t),
      };

      let type_ = json =>
        JsonStrict.(
          json |> field("id", int),
          json |> field("name", string),
        );

      let domain = json =>
        JsonStrict.(
          json |> field("id", int),
          json |> field("name", string),
        );

      let t = json =>
        JsonStrict.{
          name: json |> field("name", string),
          types: json |> field("types", list(type_)) |> Ley_IntMap.fromList,
          domains:
            json |> field("domains", list(domain)) |> Ley_IntMap.fromList,
          errata: json |> field("errata", Erratum.Decode.list),
        };
    };

    module TranslationMap = TranslationMap.Make(Translation);

    type multilingual = {
      id: int,
      src: list(PublicationRef.Decode.multilingual),
      translations: TranslationMap.t,
    };

    let multilingual = json =>
      JsonStrict.{
        id: json |> field("id", int),
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
            types: translation.types,
            domains: translation.domains,
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
};
