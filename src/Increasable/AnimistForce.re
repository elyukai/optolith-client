module Dynamic = ActivatableSkill.Dynamic;

module Static = {
  type t = {
    id: int,
    name: string,
    check: SkillCheck.t,
    effect: string,
    cost: ActivatableSkill.MainParameter.t,
    duration: ActivatableSkill.MainParameter.t,
    tribes: Ley_IntSet.t,
    property: int,
    ic: IC.t,
    src: list(PublicationRef.t),
    errata: list(Erratum.t),
  };

  module Decode = {
    module Translation = {
      type t = {
        name: string,
        effect: string,
        cost: ActivatableSkill.MainParameter.translation,
        duration: ActivatableSkill.MainParameter.translation,
        errata: list(Erratum.t),
      };

      let t = json =>
        JsonStrict.{
          name: json |> field("name", string),
          effect: json |> field("effect", string),
          cost: json |> field("cost", ActivatableSkill.MainParameter.decode),
          duration:
            json |> field("duration", ActivatableSkill.MainParameter.decode),
          errata: json |> field("errata", Erratum.Decode.list),
        };
    };

    module TranslationMap = TranslationMap.Make(Translation);

    type multilingual = {
      id: int,
      check: SkillCheck.t,
      costNoMod: bool,
      durationNoMod: bool,
      tribes: Ley_IntSet.t,
      property: int,
      ic: IC.t,
      src: list(PublicationRef.Decode.multilingual),
      translations: TranslationMap.t,
    };

    let multilingual = json =>
      JsonStrict.{
        id: json |> field("id", int),
        check: json |> field("check", SkillCheck.decode),
        costNoMod: json |> field("costNoMod", bool),
        durationNoMod: json |> field("durationNoMod", bool),
        tribes: json |> field("tribes", list(int)) |> Ley_IntSet.fromList,
        property: json |> field("property", int),
        ic: json |> field("ic", IC.Decode.t),
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
            effect: translation.effect,
            cost:
              ActivatableSkill.MainParameter.make(
                x.costNoMod,
                translation.cost,
              ),
            duration:
              ActivatableSkill.MainParameter.make(
                x.durationNoMod,
                translation.duration,
              ),
            tribes: x.tribes,
            property: x.property,
            ic: x.ic,
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
