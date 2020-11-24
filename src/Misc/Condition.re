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
    levelDescription: option(string),
    levels: (string, string, string, string),
    src: list(PublicationRef.t),
    errata: list(Erratum.t),
  };

  module Decode = {
    module Translation = {
      type t = {
        name: string,
        description: option(string),
        levelDescription: option(string),
        levels: (string, string, string, string),
        errata: option(list(Erratum.t)),
      };

      let t = json =>
        JsonStrict.{
          name: json |> field("name", string),
          description: json |> optionalField("description", string),
          levelDescription: json |> optionalField("levelDescription", string),
          levels:
            json |> field("levels", tuple4(string, string, string, string)),
          errata: json |> optionalField("errata", Erratum.Decode.list),
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
            levelDescription: translation.levelDescription,
            levels: translation.levels,
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
