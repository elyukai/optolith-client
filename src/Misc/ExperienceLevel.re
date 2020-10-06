type t = {
  id: int,
  name: string,
  ap: int,
  maxAttributeValue: int,
  maxSkillRating: int,
  maxCombatTechniqueRating: int,
  maxAttributeTotal: int,
  maxNumberSpellsLiturgicalChants: int,
  maxUnfamiliarSpells: int,
};

module Decode = {
  module Translation = {
    type t = {name: string};

    let t = json => JsonStrict.{name: json |> field("name", string)};
  };

  module TranslationMap = TranslationMap.Make(Translation);

  type multilingual = {
    id: int,
    ap: int,
    maxAttributeValue: int,
    maxSkillRating: int,
    maxCombatTechniqueRating: int,
    maxAttributeTotal: int,
    maxNumberSpellsLiturgicalChants: int,
    maxUnfamiliarSpells: int,
    translations: TranslationMap.t,
  };

  let multilingual = json =>
    JsonStrict.{
      id: json |> field("id", int),
      ap: json |> field("ap", int),
      maxAttributeValue: json |> field("maxAttributeValue", int),
      maxSkillRating: json |> field("maxSkillRating", int),
      maxCombatTechniqueRating:
        json |> field("maxCombatTechniqueRating", int),
      maxAttributeTotal: json |> field("maxAttributeTotal", int),
      maxNumberSpellsLiturgicalChants:
        json |> field("maxNumberSpellsLiturgicalChants", int),
      maxUnfamiliarSpells: json |> field("maxUnfamiliarSpells", int),
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
          ap: x.ap,
          maxAttributeValue: x.maxAttributeValue,
          maxSkillRating: x.maxSkillRating,
          maxCombatTechniqueRating: x.maxCombatTechniqueRating,
          maxAttributeTotal: x.maxAttributeTotal,
          maxNumberSpellsLiturgicalChants: x.maxNumberSpellsLiturgicalChants,
          maxUnfamiliarSpells: x.maxUnfamiliarSpells,
        }
      )
    );

  let t = (langs, json) =>
    json |> multilingual |> resolveTranslations(langs);

  let toAssoc = (x: t) => (x.id, x);

  let assoc = Decoder.decodeAssoc(t, toAssoc);
};
