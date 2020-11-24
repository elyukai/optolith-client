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
    module TypeTranslation = {
      type t = {name: string};

      let t = json => JsonStrict.{name: json |> field("name", string)};
    };

    module TypeTranslationMap = TranslationMap.Make(TypeTranslation);

    type typeMultilingual = {
      id: int,
      translations: TypeTranslationMap.t,
    };

    let typeMultilingual = json =>
      JsonStrict.{
        id: json |> field("id", int),
        translations:
          json |> field("translations", TypeTranslationMap.Decode.t),
      };

    module DomainTranslation = {
      type t = {name: string};

      let t = json => JsonStrict.{name: json |> field("name", string)};
    };

    module DomainTranslationMap = TranslationMap.Make(DomainTranslation);

    type domainMultilingual = {
      id: int,
      translations: DomainTranslationMap.t,
    };

    let domainMultilingual = (json): domainMultilingual =>
      JsonStrict.{
        id: json |> field("id", int),
        translations:
          json |> field("translations", DomainTranslationMap.Decode.t),
      };

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
      types: list(typeMultilingual),
      domains: list(domainMultilingual),
      src: list(PublicationRef.Decode.multilingual),
      translations: TranslationMap.t,
    };

    let multilingual = json =>
      JsonStrict.{
        id: json |> field("id", int),
        types: json |> field("types", list(typeMultilingual)),
        domains: json |> field("domains", list(domainMultilingual)),
        src: json |> field("src", PublicationRef.Decode.multilingualList),
        translations: json |> field("translations", TranslationMap.Decode.t),
      };

    let resolveTranslations = (langs, x: multilingual) =>
      Ley_Option.Infix.(
        x.translations
        |> TranslationMap.Decode.getFromLanguageOrder(langs)
        <&> (
          translation => {
            id: x.id,
            name: translation.name,
            types:
              x.types
              |> Ley_List.foldl(
                   (mp, type_: typeMultilingual) =>
                     type_.translations
                     |> TypeTranslationMap.Decode.getFromLanguageOrder(langs)
                     |> Ley_Option.option(
                          mp, (typeTranslation: TypeTranslation.t) =>
                          Ley_IntMap.insert(
                            type_.id,
                            typeTranslation.name,
                            mp,
                          )
                        ),
                   Ley_IntMap.empty,
                 ),
            domains:
              x.domains
              |> Ley_List.foldl(
                   (mp, domain: domainMultilingual) =>
                     domain.translations
                     |> DomainTranslationMap.Decode.getFromLanguageOrder(
                          langs,
                        )
                     |> Ley_Option.option(
                          mp, (domainTranslation: DomainTranslation.t) =>
                          Ley_IntMap.insert(
                            domain.id,
                            domainTranslation.name,
                            mp,
                          )
                        ),
                   Ley_IntMap.empty,
                 ),
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
