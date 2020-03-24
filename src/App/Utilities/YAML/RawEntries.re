type yamlData = {
  advantagesL10n: Js.Json.t,
  advantagesUniv: Js.Json.t,
  animistForcesL10n: Js.Json.t,
  animistForcesUniv: Js.Json.t,
  arcaneBardTraditionsL10n: Js.Json.t,
  arcaneDancerTraditionsL10n: Js.Json.t,
  armorTypesL10n: Js.Json.t,
  aspectsL10n: Js.Json.t,
  attributesL10n: Js.Json.t,
  blessedTraditionsL10n: Js.Json.t,
  blessedTraditionsUniv: Js.Json.t,
  blessingsL10n: Js.Json.t,
  blessingsUniv: Js.Json.t,
  booksL10n: Js.Json.t,
  brewsL10n: Js.Json.t,
  cantripsL10n: Js.Json.t,
  cantripsUniv: Js.Json.t,
  combatSpecialAbilityGroupsL10n: Js.Json.t,
  combatTechniqueGroupsL10n: Js.Json.t,
  combatTechniquesL10n: Js.Json.t,
  combatTechniquesUniv: Js.Json.t,
  conditionsL10n: Js.Json.t,
  culturesL10n: Js.Json.t,
  culturesUniv: Js.Json.t,
  cursesL10n: Js.Json.t,
  cursesUniv: Js.Json.t,
  derivedCharacteristicsL10n: Js.Json.t,
  disadvantagesL10n: Js.Json.t,
  disadvantagesUniv: Js.Json.t,
  dominationRitualsL10n: Js.Json.t,
  dominationRitualsUniv: Js.Json.t,
  elvenMagicalSongsL10n: Js.Json.t,
  elvenMagicalSongsUniv: Js.Json.t,
  equipmentL10n: Js.Json.t,
  equipmentUniv: Js.Json.t,
  equipmentGroupsL10n: Js.Json.t,
  equipmentPackagesL10n: Js.Json.t,
  equipmentPackagesUniv: Js.Json.t,
  experienceLevelsL10n: Js.Json.t,
  experienceLevelsUniv: Js.Json.t,
  eyeColorsL10n: Js.Json.t,
  focusRulesL10n: Js.Json.t,
  focusRulesUniv: Js.Json.t,
  geodeRitualsL10n: Js.Json.t,
  geodeRitualsUniv: Js.Json.t,
  hairColorsL10n: Js.Json.t,
  liturgicalChantEnhancementsL10n: Js.Json.t,
  liturgicalChantEnhancementsUniv: Js.Json.t,
  liturgicalChantGroupsL10n: Js.Json.t,
  liturgicalChantsL10n: Js.Json.t,
  liturgicalChantsUniv: Js.Json.t,
  magicalDancesL10n: Js.Json.t,
  magicalDancesUniv: Js.Json.t,
  magicalMelodiesL10n: Js.Json.t,
  magicalMelodiesUniv: Js.Json.t,
  magicalTraditionsL10n: Js.Json.t,
  magicalTraditionsUniv: Js.Json.t,
  optionalRulesL10n: Js.Json.t,
  pactsL10n: Js.Json.t,
  professionsL10n: Js.Json.t,
  professionsUniv: Js.Json.t,
  professionVariantsL10n: Js.Json.t,
  professionVariantsUniv: Js.Json.t,
  propertiesL10n: Js.Json.t,
  racesL10n: Js.Json.t,
  racesUniv: Js.Json.t,
  raceVariantsL10n: Js.Json.t,
  raceVariantsUniv: Js.Json.t,
  reachesL10n: Js.Json.t,
  rogueSpellsL10n: Js.Json.t,
  rogueSpellsUniv: Js.Json.t,
  skillGroupsL10n: Js.Json.t,
  skillsL10n: Js.Json.t,
  skillsUniv: Js.Json.t,
  socialStatusesL10n: Js.Json.t,
  specialAbilitiesL10n: Js.Json.t,
  specialAbilitiesUniv: Js.Json.t,
  specialAbilityGroupsL10n: Js.Json.t,
  spellEnhancementsL10n: Js.Json.t,
  spellEnhancementsUniv: Js.Json.t,
  spellGroupsL10n: Js.Json.t,
  spellsL10n: Js.Json.t,
  spellsUniv: Js.Json.t,
  statesL10n: Js.Json.t,
  subjectsL10n: Js.Json.t,
  tribesL10n: Js.Json.t,
  uiL10n: Js.Json.t,
  zibiljaRitualsL10n: Js.Json.t,
  zibiljaRitualsUniv: Js.Json.t,
};

module AspectsL10n = {
  open Json.Decode;

  let%private aspectL10n = json => (
    json |> field("id", int),
    json |> field("name", string),
  );

  let%private aspectsL10n = list(aspectL10n);

  let fromYaml = yaml => yaml.aspectsL10n |> aspectsL10n;
};

module ExperienceLevelsL10n = {
  open Json.Decode;

  type t = {
    id: int,
    name: string,
  };

  let%private experienceLevelL10n = json => {
    id: json |> field("id", int),
    name: json |> field("name", string),
  };

  let%private experienceLevelsL10n = list(experienceLevelL10n);

  let fromYaml = yaml => yaml.experienceLevelsL10n |> experienceLevelsL10n;
};

module ExperienceLevelsUniv = {
  open Json.Decode;

  type t = {
    id: int,
    ap: int,
    maxAttributeValue: int,
    maxSkillRating: int,
    maxCombatTechniqueRating: int,
    maxTotalAttributeValues: int,
    maxSpellsLiturgicalChants: int,
    maxUnfamiliarSpells: int,
  };

  let%private experienceLevelUniv = json => {
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

  let%private experienceLevelsUniv = list(experienceLevelUniv);

  let fromYaml = yaml => yaml.experienceLevelsUniv |> experienceLevelsUniv;
};
