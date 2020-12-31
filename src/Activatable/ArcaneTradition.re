type t = {
  id: int,
  name: string,
  prerequisites: Prerequisite.Collection.ArcaneTradition.t,
};

module Decode = {
  module Translation = {
    type t = {name: string};

    let t = json => Json_Decode_Strict.{name: json |> field("name", string)};
  };

  module TranslationMap = TranslationMap.Make(Translation);

  type multilingual = {
    id: int,
    prerequisites: Prerequisite.Collection.ArcaneTradition.Decode.multilingual,
    translations: TranslationMap.t,
  };

  let multilingual = json =>
    Json.Decode.{
      id: json |> field("id", int),
      prerequisites:
        json
        |> field(
             "prerequisites",
             Prerequisite.Collection.ArcaneTradition.Decode.multilingual,
           ),
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
          prerequisites:
            Prerequisite.Collection.ArcaneTradition.Decode.resolveTranslations(
              langs,
              x.prerequisites,
            ),
        }
      )
    );

  let t = (langs, json) =>
    json |> multilingual |> resolveTranslations(langs);

  let toAssoc = (x: t) => (x.id, x);

  let assoc = Decoder.decodeAssoc(t, toAssoc);
};
