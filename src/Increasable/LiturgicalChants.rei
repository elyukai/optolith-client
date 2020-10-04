/**
 * Returns the maximum skill rating for the passed spell.
 */
let getMax:
  (
    ~startEl: ExperienceLevel.t,
    ~phase: Id.Phase.t,
    ~heroAttrs: Ley_IntMap.t(Attribute.Dynamic.t),
    ~exceptionalSkill: option(Activatable_Dynamic.t),
    ~aspectKnowledge: option(Activatable_Dynamic.t),
    ~staticEntry: LiturgicalChant.Static.t
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
    ~aspectKnowledge: option(Activatable_Dynamic.t),
    ~staticEntry: LiturgicalChant.Static.t,
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
    ~aspectKnowledge: Activatable_Dynamic.t,
    ~staticLiturgicalChants: Ley_IntMap.t(LiturgicalChant.Static.t),
    ~heroLiturgicalChants: Ley_IntMap.t(ActivatableSkill.Dynamic.t),
    ~staticEntry: LiturgicalChant.Static.t,
    ~heroEntry: ActivatableSkill.Dynamic.t
  ) =>
  option(int);

/**
 * Returns if the passed spell's skill rating can be decreased.
 */
let isDecreasable:
  (
    ~aspectKnowledge: Activatable_Dynamic.t,
    ~staticLiturgicalChants: Ley_IntMap.t(LiturgicalChant.Static.t),
    ~heroLiturgicalChants: Ley_IntMap.t(ActivatableSkill.Dynamic.t),
    ~staticEntry: LiturgicalChant.Static.t,
    ~heroEntry: ActivatableSkill.Dynamic.t
  ) =>
  bool;

module AspectKnowledge: {
  /**
   * `getAvailableAspects staticChants heroChants` returns a list containing all
   * aspect ids of which at least 3 chants are on SR 10 or higher.
   */
  let getAvailableAspects:
    (
      Ley_IntMap.t(LiturgicalChant.Static.t),
      Ley_IntMap.t(ActivatableSkill.Dynamic.t)
    ) =>
    list(int);
};
