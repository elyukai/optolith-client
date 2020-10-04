/**
 * Returns the maximum skill rating for the passed spell.
 */
let getMax:
  (
    ~startEl: ExperienceLevel.t,
    ~phase: Id.Phase.t,
    ~heroAttrs: Ley_IntMap.t(Attribute.Dynamic.t),
    ~exceptionalSkill: option(Activatable_Dynamic.t),
    ~propertyKnowledge: option(Activatable_Dynamic.t),
    ~staticEntry: Spell.Static.t
  ) =>
  int;

/**
 * Checks if the passed spell's skill rating can be increased.
 */
let isIncreasable:
  (
    ~startEl: ExperienceLevel.t,
    ~phase: Id.Phase.t,
    ~heroAttrs: Ley_IntMap.t(Attribute.Dynamic.t),
    ~exceptionalSkill: option(Activatable_Dynamic.t),
    ~propertyKnowledge: option(Activatable_Dynamic.t),
    ~staticEntry: Spell.Static.t,
    ~heroEntry: ActivatableSkill.Dynamic.t
  ) =>
  bool;

/**
 * Returns the minimum skill rating for the passed skill.
 *
 * Optimized for when the three first params are only called once in a loop,
 * as more expensive calculations are cached then.
 */
let getMin:
  (
    ~propertyKnowledge: Activatable_Dynamic.t,
    ~staticSpells: Ley_IntMap.t(Spell.Static.t),
    ~heroSpells: Ley_IntMap.t(ActivatableSkill.Dynamic.t),
    ~staticEntry: Spell.Static.t,
    ~heroEntry: ActivatableSkill.Dynamic.t
  ) =>
  option(int);

/**
 * Returns if the passed spell's skill rating can be decreased.
 */
let isDecreasable:
  (
    ~propertyKnowledge: Activatable_Dynamic.t,
    ~staticSpells: Ley_IntMap.t(Spell.Static.t),
    ~heroSpells: Ley_IntMap.t(ActivatableSkill.Dynamic.t),
    ~staticEntry: Spell.Static.t,
    ~heroEntry: ActivatableSkill.Dynamic.t
  ) =>
  bool;

module PropertyKnowledge: {
  /**
   * `getAvailableProperties staticSpells heroSpells` returns a list containing
   * all property ids of which at least 3 spells are on SR 10 or higher.
   */
  let getAvailableProperties:
    (
      Ley_IntMap.t(Spell.Static.t),
      Ley_IntMap.t(ActivatableSkill.Dynamic.t)
    ) =>
    list(int);
};
