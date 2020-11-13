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
      isMissingImplementation: option(bool),
    };

    let t = json =>
      JsonStrict.{
        name: json |> field("name", string),
        nameAbbr: json |> field("nameAbbr", string),
        isMissingImplementation:
          json |> optionalField("isMissingImplementation", bool),
      };
  };

  module TranslationMap = TranslationMap.Make(Translation);

  type multilingual = {
    id: int,
    isCore: bool,
    isAdultContent: bool,
    isMissingImplementation: option(bool),
    translations: TranslationMap.t,
  };

  let multilingual = json =>
    JsonStrict.{
      id: json |> field("id", int),
      isCore: json |> field("isCore", bool),
      isAdultContent: json |> field("isAdultContent", bool),
      isMissingImplementation:
        json |> optionalField("isMissingImplementation", bool),
      translations: json |> field("translations", TranslationMap.Decode.t),
    };

  let resolveTranslations = (langs, x) =>
    Ley_Option.Infix.(
      x.translations
      |> TranslationMap.Decode.getFromLanguageOrderWith(
           ({isMissingImplementation, _}) =>
             Ley_Option.dis(isMissingImplementation),
           langs,
         )
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
    json
    |> multilingual
    |> (
      fun
      | {isMissingImplementation: Some(true), _} => None
      | x => resolveTranslations(langs, x)
    );

  let toAssoc = (x: t) => (x.id, x);

  let assoc = Decoder.decodeAssoc(t, toAssoc);
};
