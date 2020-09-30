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

/**
 * Has at least one active skill from the specified domain.
 */
let hasActiveSkillEntries: (t, Hero.t) => bool;
