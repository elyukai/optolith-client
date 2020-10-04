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

  module Translations = {
    type t = {
      name: string,
      effect: string,
      range: string,
      duration: string,
      target: string,
      errata: list(Erratum.t),
    };

    let decode = json =>
      JsonStrict.{
        name: json |> field("name", string),
        effect: json |> field("effect", string),
        range: json |> field("range", string),
        duration: json |> field("duration", string),
        target: json |> field("target", string),
        errata: json |> field("errata", Erratum.decodeList),
      };
  };

  module TranslationMap = TranslationMap.Make(Translations);

  type multilingual = {
    id: int,
    property: int,
    traditions: Ley_IntSet.t,
    activatablePrerequisites: option(list(Prerequisite.Activatable.t)),
    src: list(PublicationRef.multilingual),
    translations: TranslationMap.t,
  };

  let decodeMultilingual = json =>
    JsonStrict.{
      id: json |> field("id", int),
      property: json |> field("property", int),
      traditions:
        json |> field("traditions", list(int)) |> Ley_IntSet.fromList,
      activatablePrerequisites:
        json
        |> optionalField(
             "activatablePrerequisites",
             list(Prerequisite.Activatable.decode),
           ),
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
            effect: translation.effect,
            range: translation.range,
            duration: translation.duration,
            target: translation.target,
            property: x.property,
            traditions: x.traditions,
            activatablePrerequisites: x.activatablePrerequisites,
            src: PublicationRef.resolveTranslationsList(langs, x.src),
            errata: translation.errata,
          },
        )
      )
    );

  let decode = (langs, json) =>
    json |> decodeMultilingual |> resolveTranslations(langs);
};
