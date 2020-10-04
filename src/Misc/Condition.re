module Dynamic = {
  type value =
    | One
    | Two
    | Three
    | Four;

  type t = {
    id: int,
    value,
  };
};

module Static = {
  type t = {
    id: int,
    name: string,
    description: option(string),
    levelColumnDescription: option(string),
    levelDescriptions: (string, string, string, string),
    src: list(PublicationRef.t),
    errata: list(Erratum.t),
  };

  module Translations = {
    type t = {
      name: string,
      description: option(string),
      levelColumnDescription: option(string),
      levelDescriptions: (string, string, string, string),
      errata: list(Erratum.t),
    };

    let decode = json =>
      JsonStrict.{
        name: json |> field("name", string),
        description: json |> optionalField("description", string),
        levelDescriptions: (
          json |> field("level1", string),
          json |> field("level2", string),
          json |> field("level3", string),
          json |> field("level4", string),
        ),
        levelColumnDescription:
          json |> optionalField("levelDescription", string),
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
            description: translation.description,
            levelColumnDescription: translation.levelColumnDescription,
            levelDescriptions: translation.levelDescriptions,
            src: PublicationRef.resolveTranslationsList(langs, x.src),
            errata: translation.errata,
          },
        )
      )
    );

  let decode = (langs, json) =>
    json |> decodeMultilingual |> resolveTranslations(langs);
};
