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

module Translations = {
  type t = {name: string};

  let decode = json => JsonStrict.{name: json |> field("name", string)};
};

module TranslationMap = TranslationMap.Make(Translations);

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

let decodeMultilingual = json =>
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
        },
      )
    )
  );

let decode = (langs, json) =>
  json |> decodeMultilingual |> resolveTranslations(langs);
