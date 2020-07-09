module L = Ley_List;
module O = Ley_Option;

let getLevel = (maybeEntry: option(Hero.Activatable.t)) =>
  O.Monad.(
    maybeEntry
    >>= (entry => entry.active |> O.listToOption)
    >>= (active => active.level)
    |> O.Foldable.sum
  );

/**
 * `modifyByLevel value inc dec` modifies a base `value` by the active level of
 * the passed entries. The `inc` entry's level increases the value while the
 * `dec` entry's level decreases the value.
 */
let modifyByLevel = (value, inc, dec) =>
  value + getLevel(inc) - getLevel(dec);

/**
 * `modifyByLevelM value inc dec` modifies a base `value` by the active level of
 * the passed entries. The `inc` entry's level increases the value while the
 * `dec` entry's level decreases the value. If `value` is `Nothing`, this
 * function always returns `0`.
 */
let modifyByLevelM = (value, inc, dec) =>
  O.option(0, value => modifyByLevel(value, inc, dec), value);

/**
 * `getModifierByActiveLevel value inc dec` adjusts the given base `value`. If
 * the entry `inc`, that should increase the base, is active, it adds `1` to the
 * base. If the entry `dec`, that should decrease the base, is active, it
 * subtracts `1` from the base. If the passed base is `Nothing`, this function
 * always returns `0`.
 */
let getModifierByIsActive = (value, inc, dec) =>
  O.option(
    0,
    value =>
      Activatable_Accessors.isActiveM(inc)
        ? value + 1 : Activatable_Accessors.isActiveM(dec) ? value - 1 : value,
    value,
  );

/**
 * `getModifierByActiveLevels value incs decs` adjusts the given base `value` by
 * summing all active entries that should increase the base (`incs`) and all
 * active entries that should decrease the base (`decs`).
 */
let getModifierByIsActives = (value, incs, decs) =>
  O.option(
    0,
    value =>
      value
      + L.countBy(Activatable_Accessors.isActiveM, incs)
      - L.countBy(Activatable_Accessors.isActiveM, decs),
    value,
  );
