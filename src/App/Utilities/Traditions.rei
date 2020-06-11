module Magical: {
  /**
   * `getHeroEntries` returns active special ability entries for all active
   * magical traditions.
   */
  [@genType]
  let getHeroEntries:
    (Static.t, Ley_IntMap.t(Hero.Activatable.t)) => list(Hero.Activatable.t);

  /**
   * `getStaticEntries` returns static special ability entries for all active
   * magical traditions.
   */
  [@genType]
  let getStaticEntries:
    (Static.t, Ley_IntMap.t(Hero.Activatable.t)) =>
    list(Static_SpecialAbility.t);

  /**
   * `getEntries` returns active and static special ability entries as well as
   * static tradition entries for active magical traditions.
   */
  [@genType]
  let getEntries:
    (Static.t, Ley_IntMap.t(Hero.Activatable.t)) =>
    list(
      (
        Static_SpecialAbility.t,
        Hero.Activatable.t,
        Static_MagicalTradition.t,
      ),
    );

  /**
   * `idToNumId staticData id` converts a magical tradition's special ability ID
   * into a numeric tradition ID used by spells and cantrips.
   */
  [@genType]
  let idToNumId: (Static.t, Ley_IntMap.key) => option(int);

  /**
   * `numIdToId staticData id` converts a numeric tradition ID used by spells
   * and cantrips into a magical tradition's special ability ID.
   */
  [@genType]
  let numIdToId: (Static.t, option(int)) => option(int);
};
module Blessed: {
  /**
   * `getHeroEntry` returns the active special ability entry for the active
   * blessed traditions.
   */
  [@genType]
  let getHeroEntry:
    (Static.t, Ley_IntMap.t(Hero.Activatable.t)) =>
    option(Hero.Activatable.t);

  /**
   * `getStaticEntry` returns the static special ability entry for the active
   * blessed traditions.
   */
  [@genType]
  let getStaticEntry:
    (Static.t, Ley_IntMap.t(Hero.Activatable.t)) =>
    option(Static_SpecialAbility.t);

  /**
   * `getEntry` returns the active and static special ability entry as well as
   * the static tradition entry for the active blessed traditions.
   */
  [@genType]
  let getEntry:
    (Static.t, Ley_IntMap.t(Hero.Activatable.t)) =>
    option(
      (
        Static_SpecialAbility.t,
        Hero.Activatable.t,
        Static_MagicalTradition.t,
      ),
    );

  /**
   * `idToNumId staticData id` converts a blessed tradition's special ability ID
   * into a numeric tradition ID used by chants and blessings.
   */
  [@genType]
  let idToNumId: (Static.t, Ley_IntMap.key) => option(int);

  /**
   * `numIdToId staticData id` converts a numeric tradition ID used by chants
   * and blessings into a blessed tradition's special ability ID.
   */
  [@genType]
  let numIdToId: (Static.t, int) => option(int);
};
