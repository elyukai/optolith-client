module Dynamic =
  Increasable.Dynamic.Make({
    let minValue = 8;
  });

module Static = {
  type t = {
    id: int,
    name: string,
    short: string,
  };

  module Decode = {
    module Translation = {
      type t = {
        name: string,
        short: string,
      };

      let t = json =>
        Json.Decode.{
          name: json |> field("name", string),
          short: json |> field("short", string),
        };
    };

    module TranslationMap = TranslationMap.Make(Translation);

    type multilingual = {
      id: int,
      translations: TranslationMap.t,
    };

    let multilingual = json =>
      Json.Decode.{
        id: json |> field("id", int),
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
            short: translation.short,
          }
        )
      );

    let t = (langs, json) =>
      json |> multilingual |> resolveTranslations(langs);

    let toAssoc = (x: t) => (x.id, x);

    let assoc = Decoder.decodeAssoc(t, toAssoc);
  };
};
