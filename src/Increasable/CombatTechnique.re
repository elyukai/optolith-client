module Dynamic =
  Increasable.Dynamic({
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
    bpr: int,
    gr: int,
    src: list(PublicationRef.t),
    errata: list(Erratum.t),
  };

  module Translations = {
    type t = {
      name: string,
      special: option(string),
      errata: list(Erratum.t),
    };

    let decode = json =>
      JsonStrict.{
        name: json |> field("name", string),
        special: json |> optionalField("special", string),
        errata: json |> field("errata", Erratum.decodeList),
      };
  };

  module TranslationMap = TranslationMap.Make(Translations);

  type full = {
    id: int,
    ic: IC.t,
    primary: list(int),
    hasNoParry: bool,
    bpr: int,
    gr: int,
    src: list(PublicationRef.multilingual),
    translations: TranslationMap.t,
  };

  let decodeFull = json =>
    Json.Decode.{
      id: json |> field("id", int),
      ic: json |> field("ic", IC.Decode.t),
      primary: json |> field("primary", list(int)),
      hasNoParry: json |> field("hasNoParry", bool),
      bpr: json |> field("bpr", int),
      gr: json |> field("gr", int),
      src: json |> field("src", PublicationRef.decodeMultilingualList),
      translations: json |> field("translations", TranslationMap.decode),
    };

  let resolveTranslations = (langs, x) =>
    Ley_Option.Infix.(
      x.translations
      |> TranslationMap.getFromLanguageOrder(langs)
      <&> (
        translation => {
          id: x.id,
          name: translation.name,
          ic: x.ic,
          primary: x.primary,
          special: translation.special,
          hasNoParry: x.hasNoParry,
          bpr: x.bpr,
          gr: x.gr,
          src: PublicationRef.resolveTranslationsList(langs, x.src),
          errata: translation.errata,
        }
      )
    );

  let decode = (langs, json) =>
    json |> decodeFull |> resolveTranslations(langs);
};
