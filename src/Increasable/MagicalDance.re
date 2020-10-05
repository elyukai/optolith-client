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

  module Decode = {
    module Translation = {
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
        JsonStrict.(
          json |> field("id", int),
          json |> field("name", string),
        );

      let t = json =>
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
          errata: json |> field("errata", Erratum.Decode.list),
        };
    };

    module TranslationMap = TranslationMap.Make(Translation);

    type multilingual = {
      id: int,
      check: SkillCheck.t,
      musicTraditions: Ley_IntSet.t,
      property: int,
      ic: IC.t,
      src: list(PublicationRef.Decode.multilingual),
      translations: TranslationMap.t,
    };

    let multilingual = json =>
      JsonStrict.{
        id: json |> field("id", int),
        check: json |> field("check", SkillCheck.decode),
        property: json |> field("property", int),
        musicTraditions:
          json |> field("musicTraditions", list(int)) |> Ley_IntSet.fromList,
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
            nameByTradition: translation.nameByTradition,
            check: x.check,
            effect: translation.effect,
            duration:
              ActivatableSkill.MainParameter.make(
                false,
                translation.duration,
              ),
            cost:
              ActivatableSkill.MainParameter.make(false, translation.cost),
            musicTraditions: x.musicTraditions,
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
