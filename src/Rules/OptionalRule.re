module Static = {
  type t = {
    id: int,
    name: string,
    description: string,
    isPrerequisite: bool,
    src: list(PublicationRef.t),
    errata: list(Erratum.t),
  };

  module Decode = {
    module Translation = {
      type t = {
        name: string,
        description: string,
        errata: list(Erratum.t),
      };

      let t = json =>
        Json.Decode.{
          name: json |> field("name", string),
          description: json |> field("description", string),
          errata: json |> field("errata", Erratum.Decode.list),
        };
    };

    module TranslationMap = TranslationMap.Make(Translation);

    type multilingual = {
      id: int,
      isPrerequisite: bool,
      src: list(PublicationRef.Decode.multilingual),
      translations: TranslationMap.t,
    };

    let multilingual = json =>
      Json.Decode.{
        id: json |> field("id", int),
        isPrerequisite: json |> field("isPrerequisite", bool),
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
            isPrerequisite: x.isPrerequisite,
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
