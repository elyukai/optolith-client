type t = {
  id: int,
  name: string,
  path: int,
  size: int,
};

module Decode = {
  module Translation = {
    type t = {name: string};

    let t = json => Json.Decode.{name: json |> field("name", string)};
  };

  module TranslationMap = TranslationMap.Make(Translation);

  type multilingual = {
    id: int,
    path: int,
    size: int,
    translations: TranslationMap.t,
  };

  let multilingual = json =>
    Json.Decode.{
      id: json |> field("id", int),
      path: json |> field("path", int),
      size: json |> field("size", int),
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
          path: x.path,
          size: x.size,
        }
      )
    );

  let t = (langs, json) =>
    json |> multilingual |> resolveTranslations(langs);

  let toAssoc = (x: t) => (x.id, x);

  let assoc = Decoder.decodeAssoc(t, toAssoc);
};

module Size = {
  type t = {
    id: int,
    volume: int,
    apValue: int,
  };

  module Decode = {
    let t = (_: Locale.Order.t, json) =>
      Some(
        Json.Decode.{
          id: json |> field("id", int),
          volume: json |> field("volume", int),
          apValue: json |> field("apValue", int),
        },
      );

    let toAssoc = (x: t) => (x.id, x);

    let assoc = Decoder.decodeAssoc(t, toAssoc);
  };
};
