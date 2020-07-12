/**
 * Validate addition of inactive entries
 *
 * This module provides functions to determine if an (inactive) entry is allowed
 * to be bought/added.
 */

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
type inactiveValidationCache = {
  specialAbilityPairs:
    Ley_IntMap.t((SpecialAbility.t, option(Hero.Activatable.t))),
  combatStyleCombination: option(Hero.Activatable.t),
  magicalStyleCombination: option(Hero.Activatable.t),
  dunklesAbbild: option(Hero.Activatable.t),
  activePactGiftsCount: int,
  matchingLanguagesScripts,
  validExtendedSpecialAbilities: list(int),
  requiredApplyToMagicalActions: bool,
};

/**
 * `getActivePactGiftsCount pairs` returns the amount of active pact gifts based
 * on the given set of static/hero special ability entry pairs.
 */
let getActivePactGiftsCount:
  Ley_IntMap.t((SpecialAbility.t, option(Hero.Activatable.t))) => int;

/**
 * `isAdditionValid cache staticData hero staticEntry maybeHeroEntry` checks
 * whether an activatable entry can be added/bought. The `cache` contains
 * computed values that are used for multiple entries so they can be reused and
 * thus improve performance for long lists of entries.
 */
let isAdditionValid:
  (
    inactiveValidationCache,
    Static.t,
    Hero.t,
    Static.activatable,
    option(Hero.Activatable.t)
  ) =>
  bool;
