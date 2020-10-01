module LevelTranslations = {
  type t = {
    name: string,
    effect: string,
  };

  let decode = json =>
    JsonStrict.{
      name: json |> field("name", string),
      effect: json |> field("effect", string),
    };
};

module LevelTranslationMap = TranslationMap.Make(LevelTranslations);

module Level1 = {
  type t = {
    id: int,
    name: string,
    effect: string,
  };

  type multilingual = {
    id: int,
    translations: LevelTranslationMap.t,
  };

  let decodeMultilingual = json =>
    JsonStrict.{
      id: json |> field("id", int),
      translations: json |> field("translations", LevelTranslationMap.decode),
    };

  let resolveTranslations = (langs, x) =>
    Ley_Option.Functor.(
      x.translations
      |> LevelTranslationMap.getFromLanguageOrder(langs)
      <&> (
        translation => {
          id: x.id,
          name: translation.name,
          effect: translation.effect,
        }
      )
    );

  let decode = (langs, json) =>
    json |> decodeMultilingual |> resolveTranslations(langs);
};

module Level2 = {
  type t = {
    id: int,
    name: string,
    effect: string,
    requiresLevel1: bool,
  };

  type multilingual = {
    id: int,
    requiresLevel1: bool,
    translations: LevelTranslationMap.t,
  };

  let decodePrerequisite = json =>
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

  let decodeMultilingual = json =>
    JsonStrict.{
      id: json |> field("id", int),
      requiresLevel1:
        json
        |> optionalField("previousRequirement", decodePrerequisite)
        |> Ley_Option.isSome,
      translations: json |> field("translations", LevelTranslationMap.decode),
    };

  let resolveTranslations = (langs, x) =>
    Ley_Option.Functor.(
      x.translations
      |> LevelTranslationMap.getFromLanguageOrder(langs)
      <&> (
        translation => {
          id: x.id,
          name: translation.name,
          effect: translation.effect,
          requiresLevel1: x.requiresLevel1,
        }
      )
    );

  let decode = (langs, json) =>
    json |> decodeMultilingual |> resolveTranslations(langs);
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

  type multilingual = {
    id: int,
    requiresPrevious: option(prerequisite),
    translations: LevelTranslationMap.t,
  };

  let decodePrerequisite = json =>
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

  let decodeMultilingual = json =>
    JsonStrict.{
      id: json |> field("id", int),
      requiresPrevious:
        json |> optionalField("previousRequirement", decodePrerequisite),
      translations: json |> field("translations", LevelTranslationMap.decode),
    };

  let resolveTranslations = (langs, x) =>
    Ley_Option.Functor.(
      x.translations
      |> LevelTranslationMap.getFromLanguageOrder(langs)
      <&> (
        translation => {
          id: x.id,
          name: translation.name,
          effect: translation.effect,
          requiresPrevious: x.requiresPrevious,
        }
      )
    );

  let decode = (langs, json) =>
    json |> decodeMultilingual |> resolveTranslations(langs);
};

type t = {
  levels: (Level1.t, Level2.t, Level3.t),
  src: list(PublicationRef.t),
  errata: list(Erratum.t),
};

module Translations = {
  type t = {errata: list(Erratum.t)};

  let decode = json =>
    JsonStrict.{errata: json |> field("errata", Erratum.decodeList)};
};

module TranslationMap = TranslationMap.Make(Translations);

type multilingual = {
  levels: (Level1.multilingual, Level2.multilingual, Level3.multilingual),
  src: list(PublicationRef.multilingual),
  translations: TranslationMap.t,
};

let decodeMultilingual = json =>
  JsonStrict.{
    levels:
      json
      |> field(
           "levels",
           tuple3(
             Level1.decodeMultilingual,
             Level2.decodeMultilingual,
             Level3.decodeMultilingual,
           ),
         ),
    src: json |> field("src", PublicationRef.decodeMultilingualList),
    translations: json |> field("translations", TranslationMap.decode),
  };

let resolveTranslations = (langs, x) =>
  Ley_Option.Monad.(
    x.translations
    |> TranslationMap.getFromLanguageOrder(langs)
    >>= (
      translation => {
        let (level1, level2, level3) = x.levels;

        liftM3(
          (level1, level2, level3) =>
            {
              levels: (level1, level2, level3),
              src: PublicationRef.resolveTranslationsList(langs, x.src),
              errata: translation.errata,
            },
          Level1.resolveTranslations(langs, level1),
          Level2.resolveTranslations(langs, level2),
          Level3.resolveTranslations(langs, level3),
        );
      }
    )
  );
