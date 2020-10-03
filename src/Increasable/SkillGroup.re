type t = {
  id: int,
  check: SkillCheck.t,
  name: string,
  fullName: string,
};

module Translations = {
  type t = {
    name: string,
    fullName: string,
  };

  let decode = json =>
    Json.Decode.{
      name: json |> field("name", string),
      fullName: json |> field("fullName", string),
    };
};

module TranslationMap = TranslationMap.Make(Translations);

type multilingual = {
  id: int,
  check: SkillCheck.t,
  translations: TranslationMap.t,
};

let decodeMultilingual = json =>
  Json.Decode.{
    id: json |> field("id", int),
    check: json |> field("check", SkillCheck.decode),
    translations: json |> field("translations", TranslationMap.decode),
  };

let resolveTranslations = (langs, x) =>
  Ley_Option.Infix.(
    x.translations
    |> TranslationMap.getFromLanguageOrder(langs)
    <&> (
      translation => {
        id: x.id,
        check: x.check,
        name: translation.name,
        fullName: translation.fullName,
      }
    )
  );

let decode = (langs, json) =>
  json |> decodeMultilingual |> resolveTranslations(langs);
