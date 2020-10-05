module Static = {
  type t = {
    id: int,
    name: string,
    effect: string,
    range: string,
    duration: string,
    target: string,
    property: int,
    traditions: Ley_IntSet.t,
    activatablePrerequisites: option(list(Prerequisite.Activatable.t)),
    src: list(PublicationRef.t),
    errata: list(Erratum.t),
  };

  module Decode = {
    module Translation = {
      type t = {
        name: string,
        effect: string,
        range: string,
        duration: string,
        target: string,
        errata: list(Erratum.t),
      };

      let t = json =>
        JsonStrict.{
          name: json |> field("name", string),
          effect: json |> field("effect", string),
          range: json |> field("range", string),
          duration: json |> field("duration", string),
          target: json |> field("target", string),
          errata: json |> field("errata", Erratum.Decode.list),
        };
    };

    module TranslationMap = TranslationMap.Make(Translation);

    type multilingual = {
      id: int,
      property: int,
      traditions: Ley_IntSet.t,
      activatablePrerequisites: option(list(Prerequisite.Activatable.t)),
      src: list(PublicationRef.Decode.multilingual),
      translations: TranslationMap.t,
    };

    let multilingual = json =>
      JsonStrict.{
        id: json |> field("id", int),
        property: json |> field("property", int),
        traditions:
          json |> field("traditions", list(int)) |> Ley_IntSet.fromList,
        activatablePrerequisites:
          json
          |> optionalField(
               "activatablePrerequisites",
               list(Prerequisite.Activatable.Decode.t),
             ),
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
            effect: translation.effect,
            range: translation.range,
            duration: translation.duration,
            target: translation.target,
            property: x.property,
            traditions: x.traditions,
            activatablePrerequisites: x.activatablePrerequisites,
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
