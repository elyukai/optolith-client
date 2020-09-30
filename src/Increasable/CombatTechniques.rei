/**
 * Takes a combat technique's hero entry that might not exist and returns the
 * value of that combat technique. Note: If the combat technique is not yet
 * defined, it's value is `6`.
 */
let getValueDef: option(Skill.Dynamic.t) => int;

/**
 * `getAttack heroAttrs staticCt heroCt` returns the attack base value for the
 * passed combat technique.
 */
let getAttack:
  (
    Ley_IntMap.t(Hero.Attribute.t),
    CombatTechnique.Static.t,
    option(Skill.Dynamic.t)
  ) =>
  int;

/**
 * `getParry heroAttrs staticCt heroCt` returns the parry base value for the
 * passed combat technique if the combat technique can provide a parry value.
 */
let getParry:
  (
    Ley_IntMap.t(Hero.Attribute.t),
    CombatTechnique.Static.t,
    option(Skill.Dynamic.t)
  ) =>
  option(int);

/**
 * Returns the maximum combat technique rating for the passed combat technique.
 */
let getMax:
  (
    ~startEl: ExperienceLevel.t,
    ~phase: Id.Phase.t,
    ~heroAttrs: Ley_IntMap.t(Hero.Attribute.t),
    ~exceptionalCombatTechnique: option(Hero.Activatable.t),
    ~staticEntry: CombatTechnique.Static.t
  ) =>
  int;

/**
 * Returns if the passed combat technique's combat technique rating can be
 * increased.
 */
let isIncreasable:
  (
    ~startEl: ExperienceLevel.t,
    ~phase: Id.Phase.t,
    ~heroAttrs: Ley_IntMap.t(Hero.Attribute.t),
    ~exceptionalCombatTechnique: option(Hero.Activatable.t),
    ~staticEntry: CombatTechnique.Static.t,
    ~heroEntry: Skill.Dynamic.t
  ) =>
  bool;

/**
 * Returns the minimum combat technique rating for the passed combat technique.
 */
let getMin:
  (
    ~onlyOneCombatTechniqueForHunter: bool,
    ~heroCombatTechniques: Ley_IntMap.t(Skill.Dynamic.t),
    ~staticEntry: CombatTechnique.Static.t,
    ~heroEntry: Skill.Dynamic.t
  ) =>
  option(int);

/**
 * Returns if the passed combat technique's combat technique rating can be
 * decreased.
 */
let isDecreasable:
  (
    ~onlyOneCombatTechniqueForHunter: bool,
    ~heroCombatTechniques: Ley_IntMap.t(Skill.Dynamic.t),
    ~staticEntry: CombatTechnique.Static.t,
    ~heroEntry: Skill.Dynamic.t
  ) =>
  bool;
