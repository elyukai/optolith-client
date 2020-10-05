type t = {
  id: int,
  name: string,
  numId: int,
  primary: int,
  aspects: option((int, int)),
};

module Decode = {
  module Translation = {
    type t = {name: string};

    let t = json => JsonStrict.{name: json |> field("name", string)};
  };

  module TranslationMap = TranslationMap.Make(Translation);

  type multilingual = {
    id: int,
    numId: int,
    primary: int,
    aspects: option((int, int)),
    translations: TranslationMap.t,
  };

  let multilingual = json =>
    JsonStrict.{
      id: json |> field("id", int),
      numId: json |> field("numId", int),
      primary: json |> field("primary", int),
      aspects: json |> optionalField("aspects", tuple2(int, int)),
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
          numId: x.numId,
          primary: x.primary,
          aspects: x.aspects,
        }
      )
    );

  let t = (langs, json) =>
    json |> multilingual |> resolveTranslations(langs);

  let toAssoc = (x: t) => (x.id, x);

  let assoc = Decoder.decodeAssoc(t, toAssoc);
};
