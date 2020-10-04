module Category = {
  type t = {
    id: int,
    name: string,
    primaryPatronCultures: Ley_IntSet.t,
  };

  module Translations = {
    type t = {name: string};

    let decode = json => JsonStrict.{name: json |> field("name", string)};
  };

  module TranslationMap = TranslationMap.Make(Translations);

  type multilingual = {
    id: int,
    primaryPatronCultures: Ley_IntSet.t,
    translations: TranslationMap.t,
  };

  let decodeMultilingual = json =>
    JsonStrict.{
      id: json |> field("id", int),
      primaryPatronCultures:
        json
        |> field("primaryPatronCultures", list(int))
        |> Ley_IntSet.fromList,
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
          primaryPatronCultures: x.primaryPatronCultures,
        }
      )
    );

  let decode = (langs, json) =>
    json |> decodeMultilingual |> resolveTranslations(langs);
};

type t = {
  id: int,
  name: string,
  category: int,
  skills: (int, int, int),
  limitedToCultures: Ley_IntSet.t,
  isLimitedToCulturesReverse: bool,
};

module Translations = {
  type t = {name: string};

  let decode = json => JsonStrict.{name: json |> field("name", string)};
};

module TranslationMap = TranslationMap.Make(Translations);

type multilingual = {
  id: int,
  category: int,
  skills: (int, int, int),
  limitedToCultures: Ley_IntSet.t,
  isLimitedToCulturesReverse: bool,
  translations: TranslationMap.t,
};

let decodeMultilingual = json =>
  JsonStrict.{
    id: json |> field("id", int),
    category: json |> field("category", int),
    skills: json |> field("skills", tuple3(int, int, int)),
    limitedToCultures:
      json |> field("limitedToCultures", list(int)) |> Ley_IntSet.fromList,
    isLimitedToCulturesReverse:
      json |> field("isLimitedToCulturesReverse", bool),
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
          category: x.category,
          skills: x.skills,
          limitedToCultures: x.limitedToCultures,
          isLimitedToCulturesReverse: x.isLimitedToCulturesReverse,
        },
      )
    )
  );

let decode = (langs, json) =>
  json |> decodeMultilingual |> resolveTranslations(langs);
