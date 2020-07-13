/**
 * Validate addition of inactive entries
 *
 * This module provides functions to determine if an (inactive) entry is allowed
 * to be bought/added.
 */

/**
 * `getActivePactGiftsCount pairs` returns the amount of active pact gifts based
 * on the given set of static/hero special ability entry pairs.
 */
let getActivePactGiftsCount:
  Ley_IntMap.t((SpecialAbility.t, option(Hero.Activatable.t))) => int;

/**
 * `isAdditionValid cache staticData hero maybeMaxLevel staticEntry
 * maybeHeroEntry` checks whether an activatable entry can be added/bought. The
 * `cache` contains computed values that are used for multiple entries so they
 * can be reused and thus improve performance for long lists of entries.
 */
let isAdditionValid:
  (
    Activatable_Cache.t,
    Static.t,
    Hero.t,
    option(int),
    Static.activatable,
    option(Hero.Activatable.t)
  ) =>
  bool;

/**
 * `getMaxLevel staticData staticEntry maybeHeroEntry` returns the maximum level based on the level prerequisites (excluding first level prerequisites) where the key is the level and the value the prerequisites that need to be met for the respective level as well as based on the registered `dependencies` of the entry.
 *
 * The return value is based on prerequisites *and* entry dependencies. To get
 * the max level only based on prerequisites, use
 * `Prerequisites.Validation.getMaxLevel`.
 */
let getMaxLevel:
  (Static.t, Hero.t, Static.activatable, option(Hero.Activatable.t)) =>
  option(int);
