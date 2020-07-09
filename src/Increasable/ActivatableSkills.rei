/**
 * Takes an activatable skill's hero entry that might not exist and returns the
 * value of that activatable skill. Note: If the activatable skill is not yet
 * defined, it's value is `Inactive`.
 */
let getValueDef:
  option(Hero.ActivatableSkill.t) => Hero.ActivatableSkill.value;

/**
 * Converts the liturgical chant value to an int, where `Inactive` results in
 * `0`.
 */
let valueToInt: Hero.ActivatableSkill.value => int;

/**
 * Checks if the liturgical chant is active.
 */
let isActive: Hero.ActivatableSkill.t => bool;

/**
 * Checks if the liturgical chant is active.
 */
let isActiveM: option(Hero.ActivatableSkill.t) => bool;

type t =
  | Spells
  | LiturgicalChants;

/**
 * Get all active hero entries from the specified domain.
 */
let getActiveSkillEntries:
  (t, Hero.t) => Ley_IntMap.t(Hero.ActivatableSkill.t);

/**
 * Count all active skills from the specified domain.
 */
let countActiveSkillEntries: (t, Hero.t) => int;
