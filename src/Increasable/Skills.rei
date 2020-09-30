/**
 * Takes a skill's hero entry that might not exist and returns the value of
 * that skill. Note: If the skill is not yet defined, it's value is `0`.
 */
let getValueDef: option(Skill.Dynamic.t) => int;

/**
 * `getExceptionalSkillBonus exceptionalSkill skillId` return the SR maximum
 * bonus from an active Exceptional Skill advantage for the passed skill id.
 */
let getExceptionalSkillBonus:
  (option(Hero.Activatable.t), Id.Activatable.SelectOption.t) => int;

/**
 * `getMaxSrByCheckAttrs heroAttrs check` creates the base for a list for
 * calculating the maximum of a skill based on the skill check's attributes'
 * values. It takes the map of attribute hero entries and the skill check
 * attribute ids `check`.
 */
let getMaxSrByCheckAttrs:
  (Ley_IntMap.t(Attribute.Dynamic.t), (int, int, int)) => int;

/**
 * `getMaxSrFromEl el phase` returns the maximum SR defined in the selected
 * experience levele `el`, if applicable.
 */
let getMaxSrFromEl: (ExperienceLevel.t, Id.Phase.t) => option(int);

/**
 * Returns the maximum skill rating for the passed skill.
 */
let getMax:
  (
    ~startEl: ExperienceLevel.t,
    ~phase: Id.Phase.t,
    ~heroAttrs: Ley_IntMap.t(Hero.Attribute.t),
    ~exceptionalSkill: option(Hero.Activatable.t),
    ~staticEntry: Skill.Static.t
  ) =>
  int;

/**
 * Returns if the passed skill's skill rating can be increased.
 */
let isIncreasable:
  (
    ~startEl: ExperienceLevel.t,
    ~phase: Id.Phase.t,
    ~heroAttrs: Ley_IntMap.t(Hero.Attribute.t),
    ~exceptionalSkill: option(Hero.Activatable.t),
    ~staticEntry: Skill.Static.t,
    ~heroEntry: Skill.Dynamic.t
  ) =>
  bool;

/**
 * Returns the minimum skill rating for the passed skill.
 */
let getMin:
  (
    ~craftInstruments: option(Hero.Activatable.t),
    ~heroSkills: Ley_IntMap.t(Skill.Dynamic.t),
    ~staticEntry: Skill.Static.t,
    ~heroEntry: Skill.Dynamic.t
  ) =>
  option(int);

/**
 * Returns if the passed skill's skill rating can be decreased.
 */
let isDecreasable:
  (
    ~craftInstruments: option(Hero.Activatable.t),
    ~heroSkills: Ley_IntMap.t(Skill.Dynamic.t),
    ~staticEntry: Skill.Static.t,
    ~heroEntry: Skill.Dynamic.t
  ) =>
  bool;

module Routine: {
  /**
   * `getMinCheckModForRoutine check sr` returns the minimum check modifier from
   * which a routine check is possible for the passed skill rating `sr` and the
   * passed check attribute values `check`. Returns `None` if no routine check
   * is possible, otherwise a `Some` of a pair, where the first value is the
   * minimum check modifier and the second a boolean, where `True` states that
   * the minimum check modifier is only valid when using the optional rule for
   * routine checks, thus otherwise a routine check would not be possible.
   */
  let getMinCheckModForRoutine:
    ((int, int, int), int) => option((int, bool));
};
