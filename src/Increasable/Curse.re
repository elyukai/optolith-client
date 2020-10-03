module Dynamic = ActivatableSkill.Dynamic;

module Static = {
  type t = {
    id: int,
    name: string,
    check: SkillCheck.t,
    checkMod: option(CheckModifier.t),
    effect: string,
    cost: ActivatableSkill.MainParameter.t,
    duration: ActivatableSkill.MainParameter.t,
    property: int,
    src: list(PublicationRef.t),
    errata: list(Erratum.t),
  };

  module Translations = {
    type t = {
      name: string,
      effect: string,
      cost: ActivatableSkill.MainParameter.translation,
      duration: ActivatableSkill.MainParameter.translation,
      target: string,
      errata: list(Erratum.t),
    };

    let decode = json =>
      JsonStrict.{
        name: json |> field("name", string),
        effect: json |> field("effect", string),
        cost: json |> field("cost", ActivatableSkill.MainParameter.decode),
        duration:
          json |> field("duration", ActivatableSkill.MainParameter.decode),
        target: json |> field("target", string),
        errata: json |> field("errata", Erratum.decodeList),
      };
  };

  module TranslationMap = TranslationMap.Make(Translations);

  type multilingual = {
    id: int,
    check: SkillCheck.t,
    checkMod: option(CheckModifier.t),
    property: int,
    src: list(PublicationRef.multilingual),
    translations: TranslationMap.t,
  };

  let decodeMultilingual = json =>
    JsonStrict.{
      id: json |> field("id", int),
      check: json |> field("check", SkillCheck.decode),
      checkMod: json |> optionalField("checkMod", CheckModifier.decode),
      property: json |> field("property", int),
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
          check: x.check,
          checkMod: x.checkMod,
          effect: translation.effect,
          cost: ActivatableSkill.MainParameter.make(false, translation.cost),
          duration:
            ActivatableSkill.MainParameter.make(false, translation.duration),
          property: x.property,
          src: PublicationRef.resolveTranslationsList(langs, x.src),
          errata: translation.errata,
        }
      )
    );

  let decode = (langs, json) =>
    json |> decodeMultilingual |> resolveTranslations(langs);
};
