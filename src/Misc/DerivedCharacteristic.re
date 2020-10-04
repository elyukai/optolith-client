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
    short: string,
    calc: string,
    calcHalfPrimary: option(string),
    calcNoPrimary: option(string),
  };

  module Translations = {
    type t = {
      name: string,
      short: string,
      calc: string,
      calcHalfPrimary: option(string),
      calcNoPrimary: option(string),
    };

    let decode = json =>
      JsonStrict.{
        name: json |> field("name", string),
        short: json |> field("short", string),
        calc: json |> field("calc", string),
        calcHalfPrimary: json |> optionalField("calcHalfPrimary", string),
        calcNoPrimary: json |> optionalField("calcNoPrimary", string),
      };
  };

  module TranslationMap = TranslationMap.Make(Translations);

  type multilingual = {
    id: int,
    translations: TranslationMap.t,
  };

  let decodeMultilingual = json =>
    JsonStrict.{
      id: json |> field("id", int),
      translations: json |> field("translations", TranslationMap.decode),
    };

  let resolveTranslations = (langs, x) =>
    Ley_Option.Infix.(
      x.translations
      |> TranslationMap.getFromLanguageOrder(langs)
      <&> (
        translation => (
          x.id,
          {
            id: x.id,
            name: translation.name,
            short: translation.short,
            calc: translation.calc,
            calcHalfPrimary: translation.calcHalfPrimary,
            calcNoPrimary: translation.calcNoPrimary,
          },
        )
      )
    );

  let decode = (langs, json) =>
    json |> decodeMultilingual |> resolveTranslations(langs);
};
