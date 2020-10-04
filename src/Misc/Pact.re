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

  module Translations = {
    type t = {
      name: string,
      types: Ley_IntMap.t(string),
      domains: Ley_IntMap.t(string),
      errata: list(Erratum.t),
    };

    let type_ = json =>
      JsonStrict.(json |> field("id", int), json |> field("name", string));

    let domain = json =>
      JsonStrict.(json |> field("id", int), json |> field("name", string));

    let decode = json =>
      JsonStrict.{
        name: json |> field("name", string),
        types: json |> field("types", list(type_)) |> Ley_IntMap.fromList,
        domains:
          json |> field("domains", list(domain)) |> Ley_IntMap.fromList,
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
    JsonStrict.{
      id: json |> field("id", int),
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
            types: translation.types,
            domains: translation.domains,
            src: PublicationRef.resolveTranslationsList(langs, x.src),
            errata: translation.errata,
          },
        )
      )
    );

  let decode = (langs, json) =>
    json |> decodeMultilingual |> resolveTranslations(langs);
};
