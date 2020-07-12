/**
 * A set of values to validate `Weg der Schreiberin`.
 */
type matchingLanguagesScripts = {
  isEntryActiveRequiringMatch: bool,
  languagesWithMatchingScripts: list(int),
  scriptsWithMatchingLanguages: list(int),
};

/**
 * The cache of computed values to optimize performance of `isAdditionValid`.
 */
type t = {
  combatStyleCombination: option(Hero.Activatable.t),
  armedCombatStylesCount: int,
  unarmedCombatStylesCount: int,
  magicalStylesCount: int,
  isBlessedStyleActive: bool,
  isSkillStyleActive: bool,
  magicalStyleCombination: option(Hero.Activatable.t),
  dunklesAbbild: option(Hero.Activatable.t),
  activePactGiftsCount: int,
  matchingLanguagesScripts,
  validExtendedSpecialAbilities: list(int),
  requiredApplyToMagicalActions: bool,
  specialAbilityPairs:
    Ley_IntMap.t((SpecialAbility.t, option(Hero.Activatable.t))),
  combatTechniquePairs:
    Ley_IntMap.t((CombatTechnique.t, option(Hero.Skill.t))),
  adventurePoints: AdventurePoints.categories,
  magicalTraditions: list(Tradition.Magical.fullTradition),
  blessedTradition: option(Tradition.Blessed.fullTradition),
  automaticAdvantages: list(int),
};
