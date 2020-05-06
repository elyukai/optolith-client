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
  open Json.Decode;

  type tL10n = {
    id: int,
    name: string,
  };

  let tL10n = json => {
    id: json |> field("id", int),
    name: json |> field("name", string),
  };

  type tUniv = {
    id: int,
    ap: int,
    maxAttributeValue: int,
    maxSkillRating: int,
    maxCombatTechniqueRating: int,
    maxTotalAttributeValues: int,
    maxSpellsLiturgicalChants: int,
    maxUnfamiliarSpells: int,
  };

  let tUniv = json => {
    id: json |> field("id", int),
    ap: json |> field("ap", int),
    maxAttributeValue: json |> field("maxAttributeValue", int),
    maxSkillRating: json |> field("maxSkillRating", int),
    maxCombatTechniqueRating: json |> field("maxCombatTechniqueRating", int),
    maxTotalAttributeValues: json |> field("maxTotalAttributeValues", int),
    maxSpellsLiturgicalChants:
      json |> field("maxSpellsLiturgicalChants", int),
    maxUnfamiliarSpells: json |> field("maxUnfamiliarSpells", int),
  };

  let t = (univ, l10n) => (
    univ.id,
    {
      id: univ.id,
      name: l10n.name,
      ap: univ.ap,
      maxAttributeValue: univ.maxAttributeValue,
      maxSkillRating: univ.maxSkillRating,
      maxCombatTechniqueRating: univ.maxCombatTechniqueRating,
      maxTotalAttributeValues: univ.maxTotalAttributeValues,
      maxSpellsLiturgicalChants: univ.maxSpellsLiturgicalChants,
      maxUnfamiliarSpells: univ.maxUnfamiliarSpells,
    },
  );

  let all = (yamlData: Yaml_Raw.yamlData) =>
    Yaml_Zip.zipBy(
      Int.show,
      t,
      x => x.id,
      x => x.id,
      yamlData.experienceLevelsUniv |> list(tUniv),
      yamlData.experienceLevelsL10n |> list(tL10n),
    )
    |> IntMap.fromList;
};
