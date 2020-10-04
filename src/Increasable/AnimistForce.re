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

  module Translations = {
    type t = {
      name: string,
      effect: string,
      cost: ActivatableSkill.MainParameter.translation,
      duration: ActivatableSkill.MainParameter.translation,
      errata: list(Erratum.t),
    };

    let decode = json =>
      JsonStrict.{
        name: json |> field("name", string),
        effect: json |> field("effect", string),
        cost: json |> field("cost", ActivatableSkill.MainParameter.decode),
        duration:
          json |> field("duration", ActivatableSkill.MainParameter.decode),
        errata: json |> field("errata", Erratum.decodeList),
      };
  };

  module TranslationMap = TranslationMap.Make(Translations);

  type multilingual = {
    id: int,
    check: SkillCheck.t,
    costNoMod: bool,
    durationNoMod: bool,
    tribes: Ley_IntSet.t,
    property: int,
    ic: IC.t,
    src: list(PublicationRef.multilingual),
    translations: TranslationMap.t,
  };

  let decodeMultilingual = json =>
    JsonStrict.{
      id: json |> field("id", int),
      check: json |> field("check", SkillCheck.decode),
      costNoMod: json |> field("costNoMod", bool),
      durationNoMod: json |> field("durationNoMod", bool),
      tribes: json |> field("tribes", list(int)) |> Ley_IntSet.fromList,
      property: json |> field("property", int),
      ic: json |> field("ic", IC.Decode.t),
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
            src: PublicationRef.resolveTranslationsList(langs, x.src),
            errata: translation.errata,
          },
        )
      )
    );

  let decode = (langs, json) =>
    json |> decodeMultilingual |> resolveTranslations(langs);
};
