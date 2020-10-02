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
    traditions: Ley_IntSet.t,
    ic: IC.t,
    increasablePrerequisites: option(list(Prerequisite.Increasable.t)),
    gr: int,
    enhancements: option(Enhancements.t),
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
    castingTimeNoMod: bool,
    costNoMod: bool,
    rangeNoMod: bool,
    durationNoMod: bool,
    property: int,
    traditions: Ley_IntSet.t,
    ic: IC.t,
    increasablePrerequisites: option(list(Prerequisite.Increasable.t)),
    gr: int,
    enhancements: option(Enhancements.multilingual),
    src: list(PublicationRef.multilingual),
    translations: TranslationMap.t,
  };

  let decodeMultilingual = json =>
    JsonStrict.{
      id: json |> field("id", int),
      check: json |> field("check", SkillCheck.decode),
      checkMod: json |> optionalField("checkMod", CheckModifier.decode),
      castingTimeNoMod: json |> field("castingTimeNoMod", bool),
      costNoMod: json |> field("costNoMod", bool),
      rangeNoMod: json |> field("rangeNoMod", bool),
      durationNoMod: json |> field("durationNoMod", bool),
      property: json |> field("property", int),
      traditions:
        json |> field("traditions", list(int)) |> Ley_IntSet.fromList,
      ic: json |> field("ic", IC.Decode.t),
      increasablePrerequisites:
        json
        |> optionalField(
             "increasablePrerequisites",
             list(Prerequisite.Increasable.decode),
           ),
      gr: json |> field("gr", int),
      enhancements:
        json |> optionalField("enhancements", Enhancements.decodeMultilingual),
      src: json |> field("src", PublicationRef.decodeMultilingualList),
      translations: json |> field("translations", TranslationMap.decode),
    };

  let resolveTranslations = (langs, x) =>
    Ley_Option.Functor.(
      x.translations
      |> TranslationMap.getFromLanguageOrder(langs)
      <&> (
        translation => {
          id: x.id,
          name: translation.name,
          check: x.check,
          checkMod: x.checkMod,
          effect: translation.effect,
          castingTime:
            ActivatableSkill.MainParameter.make(
              x.castingTimeNoMod,
              translation.castingTime,
            ),
          cost:
            ActivatableSkill.MainParameter.make(
              x.costNoMod,
              translation.cost,
            ),
          range:
            ActivatableSkill.MainParameter.make(
              x.rangeNoMod,
              translation.range,
            ),
          duration:
            ActivatableSkill.MainParameter.make(
              x.durationNoMod,
              translation.duration,
            ),
          target: translation.target,
          property: x.property,
          traditions: x.traditions,
          ic: x.ic,
          increasablePrerequisites: x.increasablePrerequisites,
          gr: x.gr,
          enhancements:
            Ley_Option.Monad.(
              x.enhancements >>= Enhancements.resolveTranslations(langs)
            ),
          src: PublicationRef.resolveTranslationsList(langs, x.src),
          errata: translation.errata,
        }
      )
    );

  let decode = (langs, json) =>
    json |> decodeMultilingual |> resolveTranslations(langs);
};
