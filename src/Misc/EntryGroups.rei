/**
 * `getFromGroup getGroup group pairs` gets entries from a certain `group`.
 * `getGroup` returns the group from the static entry, which the `group` is
 * checked against and `pairs` is a list of pairs, where the first element is
 * the static entry and the second element the corresponding hero entry, if
 * available.
 */
let getFromGroup:
  ('a => int, int, Ley_IntMap.t(('a, 'b))) => Ley_IntMap.t(('a, 'b));

/**
 * `getActiveFromGroup isActive getGroup group pairs` gets entries from a
 * certain `group`. `isActive` is a function to check if the hero entry is
 * active, `getGroup` returns the group from the static entry, which the `group`
 * is checked against and `pairs` is a list of pairs, where the first element is
 * the static entry and the second element the corresponding hero entry, if
 * available.
 */
let getActiveFromGroup:
  ('a => bool, 'b => int, int, Ley_IntMap.t(('b, option('a)))) =>
  Ley_IntMap.t(('b, option('a)));

/**
 * `countActiveFromGroup isActive getGroup group pairs` counts active entries
 * from a certain `group`. `isActive` is a function to check if the hero entry
 * is active, `getGroup` returns the group from the static entry, which the
 * `group` is checked against and `pairs` is a list of pairs, where the first
 * element is the static entry and the second element the corresponding hero
 * entry, if available.
 */
let countActiveFromGroup:
  ('a => bool, 'b => int, int, Ley_IntMap.t(('b, option('a)))) => int;

/**
 * `countActiveFromGroups isActive getGroup groups pairs` counts active entries
 * from certain `groups`. `isActive` is a function to check if the hero entry is
 * active, `getGroup` returns the group from the static entry, which the
 * `groups` are checked against and `pairs` is a list of pairs, where the first
 * element is the static entry and the second element the corresponding hero
 * entry, if available.
 */
let countActiveFromGroups:
  ('a => bool, 'b => int, list(int), Ley_IntMap.t(('b, option('a)))) => int;

/**
 * `hasActiveFromGroup isActive getGroup group pairs` checks if there is at
 * least one active entry from a certain `group`. `isActive` is a function to
 * check if the hero entry is active, `getGroup` returns the group from the
 * static entry, which the `group` is checked against and `pairs` is a list of
 * pairs, where the first element is the static entry and the second element the
 * corresponding hero entry, if available.
 */
let hasActiveFromGroup:
  ('b => bool, 'a => int, int, Ley_IntMap.t(('a, option('b)))) => bool;

/**
 * `hasActiveFromGroups isActive getGroup groups pairs` checks if there is at
 * least one active entry from certain `groups`. `isActive` is a function to
 * check if the hero entry is active, `getGroup` returns the group from the
 * static entry, which the `groups` are checked against and `pairs` is a list of
 * pairs, where the first element is the static entry and the second element the
 * corresponding hero entry, if available.
 */
let hasActiveFromGroups:
  ('b => bool, 'a => int, list(int), Ley_IntMap.t(('a, option('b)))) =>
  bool;

module CombatTechnique: {
  /**
   * `getFromGroup`, specialized to combat techniques.
   */
  let getFromGroup:
    (
      Id.CombatTechnique.Group.t,
      Ley_IntMap.t((CombatTechnique.Static.t, option(Skill.Dynamic.t)))
    ) =>
    Ley_IntMap.t((CombatTechnique.Static.t, option(Skill.Dynamic.t)));
};

module SpecialAbility: {
  /**
   * `getFromGroup`, specialized to special abilities.
   */
  let getFromGroup:
    (
      Id.SpecialAbility.Group.t,
      Ley_IntMap.t((SpecialAbility.t, option(Hero.Activatable.t)))
    ) =>
    Ley_IntMap.t((SpecialAbility.t, option(Hero.Activatable.t)));

  /**
   * `countActiveFromGroup`, specialized to special abilities.
   */
  let countActiveFromGroup:
    (
      Id.SpecialAbility.Group.t,
      Ley_IntMap.t((SpecialAbility.t, option(Hero.Activatable.t)))
    ) =>
    int;

  /**
   * `countActiveFromGroups`, specialized to special abilities.
   */
  let countActiveFromGroups:
    (
      list(Id.SpecialAbility.Group.t),
      Ley_IntMap.t((SpecialAbility.t, option(Hero.Activatable.t)))
    ) =>
    int;

  /**
   * `hasActiveFromGroup`, specialized to special abilities.
   */
  let hasActiveFromGroup:
    (
      Id.SpecialAbility.Group.t,
      Ley_IntMap.t((SpecialAbility.t, option(Hero.Activatable.t)))
    ) =>
    bool;

  /**
   * `hasActiveFromGroups`, specialized to special abilities.
   */
  let hasActiveFromGroups:
    (
      list(Id.SpecialAbility.Group.t),
      Ley_IntMap.t((SpecialAbility.t, option(Hero.Activatable.t)))
    ) =>
    bool;
};
