module Category = {
  type t = {
    id: int,
    name: string,
    primaryPatronCultures: Ley_IntSet.t,
  };

  module Translation = {
    type t = {name: string};

    let t = json => Json_Decode_Strict.{name: json |> field("name", string)};
  };

  module TranslationMap = TranslationMap.Make(Translation);

  type multilingual = {
    id: int,
    primaryPatronCultures: Ley_IntSet.t,
    translations: TranslationMap.t,
  };

  let multilingual = json =>
    Json_Decode_Strict.{
      id: json |> field("id", int),
      primaryPatronCultures:
        json
        |> field("primaryPatronCultures", list(int))
        |> Ley_IntSet.fromList,
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
          primaryPatronCultures: x.primaryPatronCultures,
        }
      )
    );

  let t = (langs, json) =>
    json |> multilingual |> resolveTranslations(langs);
};

type t = {
  id: int,
  name: string,
  category: int,
  skills: (int, int, int),
  limitedToCultures: Ley_IntSet.t,
  isLimitedToCulturesReverse: bool,
};

module Decode = {
  module Translation = {
    type t = {name: string};

    let t = json => Json_Decode_Strict.{name: json |> field("name", string)};
  };

  module TranslationMap = TranslationMap.Make(Translation);

  type multilingual = {
    id: int,
    category: int,
    skills: (int, int, int),
    limitedToCultures: Ley_IntSet.t,
    isLimitedToCulturesReverse: bool,
    translations: TranslationMap.t,
  };

  let multilingual = json =>
    Json_Decode_Strict.{
      id: json |> field("id", int),
      category: json |> field("category", int),
      skills: json |> field("skills", tuple3(int, int, int)),
      limitedToCultures:
        json |> field("limitedToCultures", list(int)) |> Ley_IntSet.fromList,
      isLimitedToCulturesReverse:
        json |> field("isLimitedToCulturesReverse", bool),
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
          category: x.category,
          skills: x.skills,
          limitedToCultures: x.limitedToCultures,
          isLimitedToCulturesReverse: x.isLimitedToCulturesReverse,
        }
      )
    );

  let t = (langs, json) =>
    json |> multilingual |> resolveTranslations(langs);

  let toAssoc = (x: t) => (x.id, x);

  let assoc = Decoder.decodeAssoc(t, toAssoc);
};
