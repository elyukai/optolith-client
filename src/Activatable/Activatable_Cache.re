/**
 * A set of values to validate `Weg der Schreiberin`.
 */
type matchingLanguagesScripts = {
  isEntryActiveRequiringMatch: bool,
  languagesWithMatchingScripts: list(int),
  scriptsWithMatchingLanguages: list(int),
};

/**
 * The cache of computed values to optimize performance of activatable list
 * generation.
 */
type t = {
  startExperienceLevel: ExperienceLevel.t,
  combatStyleCombination: option(Activatable_Dynamic.t),
  armedCombatStylesCount: int,
  unarmedCombatStylesCount: int,
  magicalStylesCount: int,
  isBlessedStyleActive: bool,
  isSkillStyleActive: bool,
  magicalStyleCombination: option(Activatable_Dynamic.t),
  dunklesAbbild: option(Activatable_Dynamic.t),
  activePactGiftsCount: int,
  matchingLanguagesScripts,
  validExtendedSpecialAbilities: list(int),
  requiredApplyToMagicalActions: bool,
  specialAbilityPairs:
    Ley_IntMap.t((SpecialAbility.Static.t, option(Activatable_Dynamic.t))),
  combatTechniquePairs:
    Ley_IntMap.t((CombatTechnique.Static.t, option(Skill.Dynamic.t))),
  adventurePoints: AdventurePoints.categories,
  magicalTraditions: list(Tradition.Magical.fullTradition),
  blessedTradition: option(Tradition.Blessed.fullTradition),
  automaticAdvantages: list(int),
};
