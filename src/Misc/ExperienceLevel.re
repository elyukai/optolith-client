type t = {
  id: int,
  name: string,
  ap: int,
  maxAttributeValue: int,
  maxSkillRating: int,
  maxCombatTechniqueRating: int,
  maxTotalAttributeValues: int,
  maxSpellsLiturgicalChants: int,
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
    maxTotalAttributeValues: int,
    maxSpellsLiturgicalChants: int,
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
      maxTotalAttributeValues: json |> field("maxTotalAttributeValues", int),
      maxSpellsLiturgicalChants:
        json |> field("maxSpellsLiturgicalChants", int),
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
          maxTotalAttributeValues: x.maxTotalAttributeValues,
          maxSpellsLiturgicalChants: x.maxSpellsLiturgicalChants,
          maxUnfamiliarSpells: x.maxUnfamiliarSpells,
        }
      )
    );

  let t = (langs, json) =>
    json |> multilingual |> resolveTranslations(langs);

  let toAssoc = (x: t) => (x.id, x);

  let assoc = Decoder.decodeAssoc(t, toAssoc);
};
