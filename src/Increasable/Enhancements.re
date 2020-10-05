module LevelTranslation = {
  type t = {
    name: string,
    effect: string,
  };

  let t = json =>
    JsonStrict.{
      name: json |> field("name", string),
      effect: json |> field("effect", string),
    };
};

module LevelTranslationMap = TranslationMap.Make(LevelTranslation);

module Level1 = {
  type t = {
    id: int,
    name: string,
    effect: string,
  };

  module Decode = {
    type multilingual = {
      id: int,
      translations: LevelTranslationMap.t,
    };

    let multilingual = json =>
      JsonStrict.{
        id: json |> field("id", int),
        translations:
          json |> field("translations", LevelTranslationMap.Decode.t),
      };

    let resolveTranslations = (langs, x) =>
      Ley_Option.Infix.(
        x.translations
        |> LevelTranslationMap.Decode.getFromLanguageOrder(langs)
        <&> (
          translation => {
            id: x.id,
            name: translation.name,
            effect: translation.effect,
          }
        )
      );
  };
};

module Level2 = {
  type t = {
    id: int,
    name: string,
    effect: string,
    requiresLevel1: bool,
  };

  module Decode = {
    type multilingual = {
      id: int,
      requiresLevel1: bool,
      translations: LevelTranslationMap.t,
    };

    let prerequisite = json =>
      JsonStrict.(
        json
        |> int
        |> (
          x =>
            switch (x) {
            | 1 => 1
            | y =>
              raise(
                DecodeError(
                  "Unknown level 2 prerequisite: " ++ Ley_Int.show(y),
                ),
              )
            }
        )
      );

    let multilingual = json =>
      JsonStrict.{
        id: json |> field("id", int),
        requiresLevel1:
          json
          |> optionalField("previousRequirement", prerequisite)
          |> Ley_Option.isSome,
        translations:
          json |> field("translations", LevelTranslationMap.Decode.t),
      };

    let resolveTranslations = (langs, x) =>
      Ley_Option.Infix.(
        x.translations
        |> LevelTranslationMap.Decode.getFromLanguageOrder(langs)
        <&> (
          translation => {
            id: x.id,
            name: translation.name,
            effect: translation.effect,
            requiresLevel1: x.requiresLevel1,
          }
        )
      );
  };
};

module Level3 = {
  type prerequisite =
    | First
    | Second;

  type t = {
    id: int,
    name: string,
    effect: string,
    requiresPrevious: option(prerequisite),
  };

  module Decode = {
    type multilingual = {
      id: int,
      requiresPrevious: option(prerequisite),
      translations: LevelTranslationMap.t,
    };

    let prerequisite = json =>
      JsonStrict.(
        json
        |> int
        |> (
          x =>
            switch (x) {
            | 1 => First
            | 2 => Second
            | y =>
              raise(
                DecodeError(
                  "Unknown level 3 prerequisite: " ++ Ley_Int.show(y),
                ),
              )
            }
        )
      );

    let multilingual = json =>
      JsonStrict.{
        id: json |> field("id", int),
        requiresPrevious:
          json |> optionalField("previousRequirement", prerequisite),
        translations:
          json |> field("translations", LevelTranslationMap.Decode.t),
      };

    let resolveTranslations = (langs, x) =>
      Ley_Option.Infix.(
        x.translations
        |> LevelTranslationMap.Decode.getFromLanguageOrder(langs)
        <&> (
          translation => {
            id: x.id,
            name: translation.name,
            effect: translation.effect,
            requiresPrevious: x.requiresPrevious,
          }
        )
      );
  };
};

type t = {
  levels: (Level1.t, Level2.t, Level3.t),
  src: list(PublicationRef.t),
  errata: list(Erratum.t),
};

module Decode = {
  module Translation = {
    type t = {errata: list(Erratum.t)};

    let t = json =>
      JsonStrict.{errata: json |> field("errata", Erratum.Decode.list)};
  };

  module TranslationMap = TranslationMap.Make(Translation);

  type multilingual = {
    levels: (
      Level1.Decode.multilingual,
      Level2.Decode.multilingual,
      Level3.Decode.multilingual,
    ),
    src: list(PublicationRef.Decode.multilingual),
    translations: TranslationMap.t,
  };

  let multilingual = json =>
    JsonStrict.{
      levels:
        json
        |> field(
             "levels",
             tuple3(
               Level1.Decode.multilingual,
               Level2.Decode.multilingual,
               Level3.Decode.multilingual,
             ),
           ),
      src: json |> field("src", PublicationRef.Decode.multilingualList),
      translations: json |> field("translations", TranslationMap.Decode.t),
    };

  let resolveTranslations = (langs, x) =>
    Ley_Option.Infix.(
      x.translations
      |> TranslationMap.Decode.getFromLanguageOrder(langs)
      >>= (
        translation => {
          let (level1, level2, level3) = x.levels;

          Ley_Option.liftM3(
            (level1, level2, level3) =>
              {
                levels: (level1, level2, level3),
                src:
                  PublicationRef.Decode.resolveTranslationsList(langs, x.src),
                errata: translation.errata,
              },
            Level1.Decode.resolveTranslations(langs, level1),
            Level2.Decode.resolveTranslations(langs, level2),
            Level3.Decode.resolveTranslations(langs, level3),
          );
        }
      )
    );
};
