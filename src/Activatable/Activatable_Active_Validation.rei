type t = {
  minLevel: option(int),
  maxLevel: option(int),
  disabled: bool,
};

/**
 * `getMinLevelForIncreaseEntry defaultAmount currentAmount` returns the minimum
 * level for an "increase entry", which is an entry that allows to get more
 * specific values or entries than usually allowed. `currentAmount` is the
 * current amount of specific values or entries used and `defaultAmount` the
 * default amount allowed.
 */
let getMinLevelForIncreaseEntry: (int, int) => option(int);

/**
 * `getMaxLevelForDecreaseEntry defaultAmount currentAmount` returns the maximum
 * level for a "decrease entry", which is an entry that disallows to get as many
 * specific values or entries as usually allowed. `currentAmount` is the current
 * amount of specific values or entries used and `defaultAmount` the default
 * amount allowed.
 */
let getMaxLevelForDecreaseEntry: (int, int) => int;

/**
 * `isRemovalOrModificationValid cache staticData hero staticEntry heroEntry
 * singleEntry` checks if the given active entry can be removed or if it's level
 * can be changed.
 */
let isRemovalOrModificationValid:
  (
    Activatable_Cache.t,
    Static.t,
    Hero.t,
    Static.activatable,
    Activatable_Dynamic.t,
    Activatable_Convert.singleWithId
  ) =>
  t;
