/**
 * Takes a liturgical chant's hero entry that might not exist and returns the
 * value of that liturgical chant. Note: If the liturgical chant is not yet
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
let isActive: option(Hero.ActivatableSkill.t) => bool;

/**
 * Returns the maximum skill rating for the passed spell.
 */
let getMax:
  (
    ~startEl: ExperienceLevel.t,
    ~phase: Id.phase,
    ~heroAttrs: Ley_IntMap.t(Hero.Attribute.t),
    ~exceptionalSkill: option(Hero.Activatable.t),
    ~aspectKnowledge: option(Hero.Activatable.t),
    ~staticEntry: LiturgicalChant.t
  ) =>
  int;

/**
 * Checks if the passed spell's skill rating can be increased.
 */
let isIncreasable:
  (
    ~startEl: ExperienceLevel.t,
    ~phase: Id.phase,
    ~heroAttrs: Ley_IntMap.t(Hero.Attribute.t),
    ~exceptionalSkill: option(Hero.Activatable.t),
    ~aspectKnowledge: option(Hero.Activatable.t),
    ~staticEntry: LiturgicalChant.t,
    ~heroEntry: Hero.ActivatableSkill.t
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
    ~aspectKnowledge: Hero.Activatable.t,
    ~staticLiturgicalChants: Ley_IntMap.t(LiturgicalChant.t),
    ~heroLiturgicalChants: Ley_IntMap.t(Hero.ActivatableSkill.t),
    ~staticEntry: LiturgicalChant.t,
    ~heroEntry: Hero.ActivatableSkill.t
  ) =>
  option(int);

/**
 * Returns if the passed spell's skill rating can be decreased.
 */
let isDecreasable:
  (
    ~aspectKnowledge: Hero.Activatable.t,
    ~staticLiturgicalChants: Ley_IntMap.t(LiturgicalChant.t),
    ~heroLiturgicalChants: Ley_IntMap.t(Hero.ActivatableSkill.t),
    ~staticEntry: LiturgicalChant.t,
    ~heroEntry: Hero.ActivatableSkill.t
  ) =>
  bool;

module AspectKnowledge: {
  /**
   * `getAvailableAspects staticChants heroChants` returns a list containing all
   * aspect ids of which at least 3 chants are on SR 10 or higher.
   */
  let getAvailableAspects:
    (
      Ley_IntMap.t(LiturgicalChant.t),
      Ley_IntMap.t(Hero.ActivatableSkill.t)
    ) =>
    list(int);
};