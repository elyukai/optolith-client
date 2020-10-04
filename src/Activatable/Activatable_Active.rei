type t = {
  naming: Activatable_Active_Name.combinedName,
  active: Activatable_Convert.singleWithId,
  apValue: int,
  isAutomatic: bool,
  validation: Activatable_Active_Validation.t,
  staticEntry: Static.activatable,
  heroEntry: Activatable_Dynamic.t,
};

/**
 * `getActive cache staticData hero staticEntry maybeHeroEntry` adds display
 * options to an active entry, such as calculated AP, combined/generated name or
 * if it's valid to remove it.
 */
let getActive:
  (
    ~isEntryToAdd: bool,
    ~addLevelToName: bool,
    Activatable_Cache.t,
    Static.t,
    Hero.t,
    Static.activatable,
    Activatable_Dynamic.t,
    Activatable_Convert.singleWithId
  ) =>
  t;
