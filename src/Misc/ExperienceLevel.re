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

module Translations = {
  type t = {name: string};

  let decode = json => JsonStrict.{name: json |> field("name", string)};
};

module TranslationMap = TranslationMap.Make(Translations);

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

let decodeMultilingual = json =>
  JsonStrict.{
    id: json |> field("id", int),
    ap: json |> field("ap", int),
    maxAttributeValue: json |> field("maxAttributeValue", int),
    maxSkillRating: json |> field("maxSkillRating", int),
    maxCombatTechniqueRating: json |> field("maxCombatTechniqueRating", int),
    maxTotalAttributeValues: json |> field("maxTotalAttributeValues", int),
    maxSpellsLiturgicalChants:
      json |> field("maxSpellsLiturgicalChants", int),
    maxUnfamiliarSpells: json |> field("maxUnfamiliarSpells", int),
    translations: json |> field("translations", TranslationMap.decode),
  };

let resolveTranslations = (langs, x) =>
  Ley_Option.Infix.(
    x.translations
    |> TranslationMap.getFromLanguageOrder(langs)
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

let decode = (langs, json) =>
  json |> decodeMultilingual |> resolveTranslations(langs);
