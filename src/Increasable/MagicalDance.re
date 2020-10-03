module Dynamic = ActivatableSkill.Dynamic;

module Static = {
  type t = {
    id: int,
    name: string,
    nameByTradition: Ley_IntMap.t(string),
    check: SkillCheck.t,
    effect: string,
    duration: ActivatableSkill.MainParameter.t,
    cost: ActivatableSkill.MainParameter.t,
    musicTraditions: Ley_IntSet.t,
    property: int,
    ic: IC.t,
    src: list(PublicationRef.t),
    errata: list(Erratum.t),
  };

  module Translations = {
    type t = {
      name: string,
      nameByTradition: Ley_IntMap.t(string),
      effect: string,
      duration: ActivatableSkill.MainParameter.translation,
      cost: ActivatableSkill.MainParameter.translation,
      target: string,
      errata: list(Erratum.t),
    };

    let nameByTradition = json =>
      JsonStrict.(json |> field("id", int), json |> field("name", string));

    let decode = json =>
      JsonStrict.{
        name: json |> field("name", string),
        nameByTradition:
          json
          |> field("nameByTradition", list(nameByTradition))
          |> Ley_IntMap.fromList,
        effect: json |> field("effect", string),
        duration:
          json |> field("duration", ActivatableSkill.MainParameter.decode),
        cost: json |> field("cost", ActivatableSkill.MainParameter.decode),
        target: json |> field("target", string),
        errata: json |> field("errata", Erratum.decodeList),
      };
  };

  module TranslationMap = TranslationMap.Make(Translations);

  type multilingual = {
    id: int,
    check: SkillCheck.t,
    musicTraditions: Ley_IntSet.t,
    property: int,
    ic: IC.t,
    src: list(PublicationRef.multilingual),
    translations: TranslationMap.t,
  };

  let decodeMultilingual = json =>
    JsonStrict.{
      id: json |> field("id", int),
      check: json |> field("check", SkillCheck.decode),
      property: json |> field("property", int),
      musicTraditions:
        json |> field("musicTraditions", list(int)) |> Ley_IntSet.fromList,
      ic: json |> field("ic", IC.Decode.t),
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
          nameByTradition: translation.nameByTradition,
          check: x.check,
          effect: translation.effect,
          duration:
            ActivatableSkill.MainParameter.make(false, translation.duration),
          cost: ActivatableSkill.MainParameter.make(false, translation.cost),
          musicTraditions: x.musicTraditions,
          property: x.property,
          ic: x.ic,
          src: PublicationRef.resolveTranslationsList(langs, x.src),
          errata: translation.errata,
        }
      )
    );

  let decode = (langs, json) =>
    json |> decodeMultilingual |> resolveTranslations(langs);
};
