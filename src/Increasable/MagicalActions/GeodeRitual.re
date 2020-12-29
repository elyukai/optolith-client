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
    prerequisites: Prerequisite.Collection.Activatable.t,
    src: list(PublicationRef.t),
    errata: list(Erratum.t),
  };

  module Decode = {
    module Translation = {
      type t = {
        name: string,
        effect: string,
        castingTime: ActivatableSkill.MainParameter.translation,
        cost: ActivatableSkill.MainParameter.translation,
        range: ActivatableSkill.MainParameter.translation,
        duration: ActivatableSkill.MainParameter.translation,
        target: string,
        errata: option(list(Erratum.t)),
      };

      let t = json =>
        JsonStrict.{
          name: json |> field("name", string),
          effect: json |> field("effect", string),
          castingTime:
            json
            |> field("castingTime", ActivatableSkill.MainParameter.decode),
          cost: json |> field("cost", ActivatableSkill.MainParameter.decode),
          range:
            json |> field("range", ActivatableSkill.MainParameter.decode),
          duration:
            json |> field("duration", ActivatableSkill.MainParameter.decode),
          target: json |> field("target", string),
          errata: json |> optionalField("errata", Erratum.Decode.list),
        };
    };

    module TranslationMap = TranslationMap.Make(Translation);

    type multilingual = {
      id: int,
      check: SkillCheck.t,
      checkMod: option(CheckModifier.t),
      property: int,
      prerequisites:
        option(Prerequisite.Collection.Activatable.Decode.multilingual),
      src: list(PublicationRef.Decode.multilingual),
      translations: TranslationMap.t,
    };

    let multilingual = json =>
      JsonStrict.{
        id: json |> field("id", int),
        check: json |> field("check", SkillCheck.Decode.t),
        checkMod: json |> optionalField("checkMod", CheckModifier.Decode.t),
        property: json |> field("property", int),
        prerequisites:
          json
          |> optionalField(
               "prerequisites",
               Prerequisite.Collection.Activatable.Decode.multilingual,
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
            prerequisites:
              x.prerequisites
              |> Ley_Option.option(
                   [],
                   Prerequisite.Collection.Activatable.Decode.resolveTranslations(
                     langs,
                   ),
                 ),
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
