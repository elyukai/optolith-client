module Dynamic = {
  type state =
    | Inactive
    | Basic({
        value: int,
        base: int,
      })
    | Energy({
        value: int,
        base: int,
        modifier: int,
        currentAdded: int,
        maxAddable: int,
        permanentLost: int,
      })
    | EnergyWithBoughtBack({
        value: int,
        base: int,
        modifier: int,
        currentAdded: int,
        maxAddable: int,
        permanentLost: int,
        permanentBoughtBack: int,
      });

  type t = {
    id: int,
    calc: string,
    state,
  };
};

module Static = {
  type t = {
    id: int,
    name: string,
    nameAbbr: string,
    calc: string,
    calcHalfPrimary: option(string),
    calcNoPrimary: option(string),
  };

  module Decode = {
    module Translation = {
      type t = {
        name: string,
        nameAbbr: string,
        calc: string,
        calcHalfPrimary: option(string),
        calcNoPrimary: option(string),
      };

      let t = json =>
        JsonStrict.{
          name: json |> field("name", string),
          nameAbbr: json |> field("nameAbbr", string),
          calc: json |> field("calc", string),
          calcHalfPrimary: json |> optionalField("calcHalfPrimary", string),
          calcNoPrimary: json |> optionalField("calcNoPrimary", string),
        };
    };

    module TranslationMap = TranslationMap.Make(Translation);

    type multilingual = {
      id: int,
      translations: TranslationMap.t,
    };

    let multilingual = json =>
      JsonStrict.{
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
            nameAbbr: translation.nameAbbr,
            calc: translation.calc,
            calcHalfPrimary: translation.calcHalfPrimary,
            calcNoPrimary: translation.calcNoPrimary,
          }
        )
      );

    let t = (langs, json) =>
      json |> multilingual |> resolveTranslations(langs);

    let toAssoc = (x: t) => (x.id, x);

    let assoc = Decoder.decodeAssoc(t, toAssoc);
  };
};
