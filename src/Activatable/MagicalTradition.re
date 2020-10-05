type t = {
  id: int,
  name: string,
  numId: option(int),
  primary: option(int),
  aeMod: option(float),
  canLearnCantrips: bool,
  canLearnSpells: bool,
  canLearnRituals: bool,
  allowMultipleTraditions: bool,
  isDisAdvAPMaxHalved: bool,
  areDisAdvRequiredApplyToMagActionsOrApps: bool,
};

module Decode = {
  module Translation = {
    type t = {name: string};

    let t = json => JsonStrict.{name: json |> field("name", string)};
  };

  module TranslationMap = TranslationMap.Make(Translation);

  type multilingual = {
    id: int,
    numId: option(int),
    primary: option(int),
    aeMod: option(float),
    canLearnCantrips: bool,
    canLearnSpells: bool,
    canLearnRituals: bool,
    allowMultipleTraditions: bool,
    isDisAdvAPMaxHalved: bool,
    areDisAdvRequiredApplyToMagActionsOrApps: bool,
    translations: TranslationMap.t,
  };

  let multilingual = json =>
    JsonStrict.{
      id: json |> field("id", int),
      numId: json |> optionalField("numId", int),
      primary: json |> optionalField("primary", int),
      aeMod: json |> optionalField("aeMod", Json.Decode.float),
      canLearnCantrips: json |> field("canLearnCantrips", bool),
      canLearnSpells: json |> field("canLearnSpells", bool),
      canLearnRituals: json |> field("canLearnRituals", bool),
      allowMultipleTraditions: json |> field("allowMultipleTraditions", bool),
      isDisAdvAPMaxHalved: json |> field("isDisAdvAPMaxHalved", bool),
      areDisAdvRequiredApplyToMagActionsOrApps:
        json |> field("areDisAdvRequiredApplyToMagActionsOrApps", bool),
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
          aeMod: x.aeMod,
          canLearnCantrips: x.canLearnCantrips,
          canLearnSpells: x.canLearnSpells,
          canLearnRituals: x.canLearnRituals,
          allowMultipleTraditions: x.allowMultipleTraditions,
          isDisAdvAPMaxHalved: x.isDisAdvAPMaxHalved,
          areDisAdvRequiredApplyToMagActionsOrApps:
            x.areDisAdvRequiredApplyToMagActionsOrApps,
        }
      )
    );

  let t = (langs, json) =>
    json |> multilingual |> resolveTranslations(langs);

  let toAssoc = (x: t) => (x.id, x);

  let assoc = Decoder.decodeAssoc(t, toAssoc);
};
