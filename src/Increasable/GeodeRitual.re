module Dynamic = ActivatableSkill.Dynamic;

module Static = {
  type t = {
    id: int,
    name: string,
    check: SkillCheck.t,
    checkMod: option(CheckModifier.t),
    effect: string,
    castingTime: ActivatableSkill.MainParameter.t,
    cost: ActivatableSkill.MainParameter.t,
    range: ActivatableSkill.MainParameter.t,
    duration: ActivatableSkill.MainParameter.t,
    target: string,
    property: int,
    activatablePrerequisites: option(list(Prerequisite.Activatable.t)),
    src: list(PublicationRef.t),
    errata: list(Erratum.t),
  };

  module Translations = {
    type t = {
      name: string,
      effect: string,
      castingTime: ActivatableSkill.MainParameter.translation,
      cost: ActivatableSkill.MainParameter.translation,
      range: ActivatableSkill.MainParameter.translation,
      duration: ActivatableSkill.MainParameter.translation,
      target: string,
      errata: list(Erratum.t),
    };

    let decode = json =>
      JsonStrict.{
        name: json |> field("name", string),
        effect: json |> field("effect", string),
        castingTime:
          json |> field("castingTime", ActivatableSkill.MainParameter.decode),
        cost: json |> field("cost", ActivatableSkill.MainParameter.decode),
        range: json |> field("range", ActivatableSkill.MainParameter.decode),
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
    activatablePrerequisites: option(list(Prerequisite.Activatable.t)),
    src: list(PublicationRef.multilingual),
    translations: TranslationMap.t,
  };

  let decodeMultilingual = json =>
    JsonStrict.{
      id: json |> field("id", int),
      check: json |> field("check", SkillCheck.decode),
      checkMod: json |> optionalField("checkMod", CheckModifier.decode),
      property: json |> field("property", int),
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
            check: x.check,
            checkMod: x.checkMod,
            effect: translation.effect,
            castingTime:
              ActivatableSkill.MainParameter.make(
                false,
                translation.castingTime,
              ),
            cost:
              ActivatableSkill.MainParameter.make(false, translation.cost),
            range:
              ActivatableSkill.MainParameter.make(false, translation.range),
            duration:
              ActivatableSkill.MainParameter.make(
                false,
                translation.duration,
              ),
            target: translation.target,
            property: x.property,
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
