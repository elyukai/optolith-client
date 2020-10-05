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

  module Decode = {
    module Translation = {
      type t = {
        name: string,
        description: option(string),
        levelColumnDescription: option(string),
        levelDescriptions: (string, string, string, string),
        errata: list(Erratum.t),
      };

      let t = json =>
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
            description: translation.description,
            levelColumnDescription: translation.levelColumnDescription,
            levelDescriptions: translation.levelDescriptions,
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
