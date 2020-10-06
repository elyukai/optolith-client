type t = {
  id: int,
  name: string,
  nameAbbr: string,
  isCore: bool,
  isAdultContent: bool,
};

module Decode = {
  module Translation = {
    type t = {
      name: string,
      nameAbbr: string,
    };

    let t = json =>
      Json.Decode.{
        name: json |> field("name", string),
        nameAbbr: json |> field("nameAbbr", string),
      };
  };

  module TranslationMap = TranslationMap.Make(Translation);

  type multilingual = {
    id: int,
    isCore: bool,
    isAdultContent: bool,
    translations: TranslationMap.t,
  };

  let multilingual = json =>
    Json.Decode.{
      id: json |> field("id", int),
      isCore: json |> field("isCore", bool),
      isAdultContent: json |> field("isAdultContent", bool),
      translations: json |> field("translations", TranslationMap.Decode.t),
    };

  let resolveTranslations = (langs, x) =>
    Ley_Option.Infix.(
      x.translations
      |> TranslationMap.Decode.getFromLanguageOrder(langs)
      <&> (
        translation => {
          id: x.id,
          isCore: x.isCore,
          isAdultContent: x.isAdultContent,
          name: translation.name,
          nameAbbr: translation.nameAbbr,
        }
      )
    );

  let t = (langs, json) =>
    json |> multilingual |> resolveTranslations(langs);

  let toAssoc = (x: t) => (x.id, x);

  let assoc = Decoder.decodeAssoc(t, toAssoc);
};
