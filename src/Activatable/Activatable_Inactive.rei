type t = {
  id: int,
  name: string,
  apValue: option(OneOrMany.t(int)),
  minLevel: option(int),
  maxLevel: option(int),
  selectOptions: list(SelectOption.t),
  heroEntry: option(Activatable_Dynamic.t),
  staticEntry: Static.activatable,
  customCostDisabled: bool,
  isAutomatic: bool,
};

type result =
  | Valid(t)
  | Invalid(Static.activatable);

/**
 * `getInactive cache staticData hero staticEntry maybeHeroEntry` validates an
 * inactive entry, filters possible options and then either returns a valid
 * entry with additional and filtered options or an invalid entry.
 *
 * This can be used to display valid as well as invalid entries in a single
 * list.
 */
let getInactive:
  (
    Activatable_Cache.t,
    Static.t,
    Hero.t,
    Static.activatable,
    option(Activatable_Dynamic.t)
  ) =>
  result;