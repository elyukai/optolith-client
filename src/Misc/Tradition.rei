module Magical: {
  /**
   * `isTraditionId staticData id` checks if `id` is the special ability id of
   * a magical tradition.
   */
  let isTraditionId: (Static.t, int) => bool;

  /**
   * `getHeroEntries` returns active special ability entries for all active
   * magical traditions.
   */
  let getHeroEntries:
    (Static.t, Ley_IntMap.t(Hero.Activatable.t)) => list(Hero.Activatable.t);

  /**
   * `getStaticEntries` returns static special ability entries for all active
   * magical traditions.
   */
  let getStaticEntries:
    (Static.t, Ley_IntMap.t(Hero.Activatable.t)) => list(SpecialAbility.t);

  type fullTradition = (
    SpecialAbility.t,
    Hero.Activatable.t,
    MagicalTradition.t,
  );

  /**
   * `getEntries` returns active and static special ability entries as well as
   * static tradition entries for active magical traditions.
   */
  let getEntries:
    (Static.t, Ley_IntMap.t(Hero.Activatable.t)) => list(fullTradition);

  /**
   * `idToNumId staticData id` converts a magical tradition's special ability ID
   * into a numeric tradition ID used by spells and cantrips.
   */
  let idToNumId: (Static.t, Ley_IntMap.key) => option(int);

  /**
   * `numIdToId staticData id` converts a numeric tradition ID used by spells
   * and cantrips into a magical tradition's special ability ID.
   */
  let numIdToId: (Static.t, option(int)) => option(int);

  /**
   * Returns the primary attribute ID for the currently active magical
   * tradition.
   */
  let getPrimaryAttributeId:
    (Static.t, Ley_IntMap.t(Hero.Activatable.t)) => option(int);
};
module Blessed: {
  /**
   * `isTraditionId staticData id` checks if `id` is the special ability id of
   * a blessed tradition.
   */
  let isTraditionId: (Static.t, int) => bool;

  /**
   * `getHeroEntry` returns the active special ability entry for the active
   * blessed traditions.
   */
  let getHeroEntry:
    (Static.t, Ley_IntMap.t(Hero.Activatable.t)) =>
    option(Hero.Activatable.t);

  /**
   * `getStaticEntry` returns the static special ability entry for the active
   * blessed traditions.
   */
  let getStaticEntry:
    (Static.t, Ley_IntMap.t(Hero.Activatable.t)) => option(SpecialAbility.t);

  type fullTradition = (
    SpecialAbility.t,
    Hero.Activatable.t,
    BlessedTradition.t,
  );

  /**
   * `getEntry` returns the active and static special ability entry as well as
   * the static tradition entry for the active blessed traditions.
   */
  let getEntry:
    (Static.t, Ley_IntMap.t(Hero.Activatable.t)) => option(fullTradition);

  /**
   * `idToNumId staticData id` converts a blessed tradition's special ability ID
   * into a numeric tradition ID used by chants and blessings.
   */
  let idToNumId: (Static.t, Ley_IntMap.key) => option(int);

  /**
   * `numIdToId staticData id` converts a numeric tradition ID used by chants
   * and blessings into a blessed tradition's special ability ID.
   */
  let numIdToId: (Static.t, int) => option(int);

  /**
   * Returns the primary attribute ID for the currently active blessed
   * tradition.
   */
  let getPrimaryAttributeId:
    (Static.t, Ley_IntMap.t(Hero.Activatable.t)) => option(int);
};
