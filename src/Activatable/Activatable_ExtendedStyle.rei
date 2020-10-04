/**
 * Working with Style Special Abilties and their Extended Special Abilties.
 *
 * This module provides some functions for working with Style and Extended
 * Special Abilties, how to manage their dependencies and what is allowed to do
 * in that context.
 */

/**
 * Adds extended special ability dependencies if the passed entry is a style
 * special ability or adds the passed special ability's ID to a free slot of a
 * style dependency if it is an extended special ability.
 */
let addAllStyleRelatedDependencies:
  (SpecialAbility.Static.t, Hero.t) => Hero.t;

/**
 * Removes extended special ability dependencies if the passed entry is a
 * style special ability or removes the passed special ability's ID from a
 * used slot of a style dependency if it is an extended special ability.
 */
let removeAllStyleRelatedDependencies:
  (SpecialAbility.Static.t, Hero.t) => Hero.t;

/**
 * Calculates a list of available Extended Special Abilties. The availability is
 * only based on bought Style Special Abilities, so (other) prerequisites have
 * to be checked separately.
 */
let getAllAvailableExtendedSpecialAbilities:
  list(list(Hero.styleDependency)) => list(int);

/**
 * Checks if the passed special ability is a style and if it is valid to
 * remove based on registered active extended special abilities.
 */
let isStyleValidToRemove: (Hero.t, SpecialAbility.Static.t) => bool;
