module Dynamic = ActivatableSkill.Dynamic;

module Static = {
  type t = {
    id: int,
    name: string,
    check: SkillCheck.t,
    effect: string,
    duration: ActivatableSkill.MainParameter.t,
    cost: ActivatableSkill.MainParameter.t,
    musicTraditions: Ley_IntMap.t(string),
    property: int,
    ic: IC.t,
    src: list(PublicationRef.t),
    errata: list(Erratum.t),
  };

  module Decode = {
    module MusicTraditionTranslation = {
      type t = string;

      let t = json => JsonStrict.(json |> field("name", string));
    };

    module MusicTraditionTranslationMap =
      TranslationMap.Make(MusicTraditionTranslation);

    type musicTraditionMultilingual = {
      id: int,
      translations: MusicTraditionTranslationMap.t,
    };

    let musicTraditionMultilingual = json =>
      JsonStrict.{
        id: json |> field("id", int),
        translations:
          json |> field("translations", MusicTraditionTranslationMap.Decode.t),
      };

    let musicTraditionMultilingualAssoc = json =>
      json |> musicTraditionMultilingual |> (x => (x.id, x));

    module Translation = {
      type t = {
        name: string,
        effect: string,
        duration: ActivatableSkill.MainParameter.translation,
        cost: ActivatableSkill.MainParameter.translation,
        errata: option(list(Erratum.t)),
      };

      let t = json =>
        JsonStrict.{
          name: json |> field("name", string),
          effect: json |> field("effect", string),
          duration:
            json |> field("duration", ActivatableSkill.MainParameter.decode),
          cost: json |> field("cost", ActivatableSkill.MainParameter.decode),
          errata: json |> optionalField("errata", Erratum.Decode.list),
        };
    };

    module TranslationMap = TranslationMap.Make(Translation);

    type multilingual = {
      id: int,
      check: SkillCheck.t,
      musicTradition: Ley_IntMap.t(musicTraditionMultilingual),
      property: int,
      ic: IC.t,
      src: list(PublicationRef.Decode.multilingual),
      translations: TranslationMap.t,
    };

    let multilingual = json =>
      JsonStrict.{
        id: json |> field("id", int),
        check: json |> field("check", SkillCheck.Decode.t),
        property: json |> field("property", int),
        musicTradition:
          json
          |> field("musicTradition", list(musicTraditionMultilingualAssoc))
          |> Ley_IntMap.fromList,
        ic: json |> field("ic", IC.Decode.t),
        src: json |> field("src", PublicationRef.Decode.multilingualList),
        translations: json |> field("translations", TranslationMap.Decode.t),
      };

    let resolveTranslations = (langs, x: multilingual) =>
      Ley_Option.Infix.(
        x.translations
        |> TranslationMap.Decode.getFromLanguageOrder(langs)
        <&> (
          translation => {
            id: x.id,
            name: translation.name,
            check: x.check,
            effect: translation.effect,
            duration:
              ActivatableSkill.MainParameter.make(
                false,
                translation.duration,
              ),
            cost:
              ActivatableSkill.MainParameter.make(false, translation.cost),
            musicTraditions:
              x.musicTradition
              |> Ley_IntMap.mapMaybe(
                   (musicTradition: musicTraditionMultilingual) =>
                   musicTradition.translations
                   |> MusicTraditionTranslationMap.Decode.getFromLanguageOrder(
                        langs,
                      )
                 ),
            property: x.property,
            ic: x.ic,
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
