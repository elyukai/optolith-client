type t = {
  id: int,
  check: SkillCheck.t,
  name: string,
  fullName: string,
};

module Decode = {
  module Translation = {
    type t = {
      name: string,
      fullName: string,
    };

    let t = json =>
      Json.Decode.{
        name: json |> field("name", string),
        fullName: json |> field("fullName", string),
      };
  };

  module TranslationMap = TranslationMap.Make(Translation);

  type multilingual = {
    id: int,
    check: SkillCheck.t,
    translations: TranslationMap.t,
  };

  let multilingual = json =>
    Json.Decode.{
      id: json |> field("id", int),
      check: json |> field("check", SkillCheck.Decode.t),
      translations: json |> field("translations", TranslationMap.Decode.t),
    };

  let resolveTranslations = (langs, x) =>
    Ley_Option.Infix.(
      x.translations
      |> TranslationMap.Decode.getFromLanguageOrder(langs)
      <&> (
        translation => {
          id: x.id,
          check: x.check,
          name: translation.name,
          fullName: translation.fullName,
        }
      )
    );

  let t = (langs, json) =>
    json |> multilingual |> resolveTranslations(langs);

  let toAssoc = (x: t) => (x.id, x);

  let assoc = Decoder.decodeAssoc(t, toAssoc);
};
