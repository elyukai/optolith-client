/**
 * A single active Activatable.
 */
[@genType]
[@genType.as "ActivatableSingleWithId"]
type singleWithId = {
  id: int,
  options: list(Hero.Activatable.optionId),
  level: option(int),
  customCost: option(int),
};

/**
 * Is an Activatable entry active?
 */
[@genType]
let isActive: Hero.Activatable.t => bool;

/**
 * Is an Activatable, where the entry may not have been created, active?
 */
[@genType]
let isActiveM: option(Hero.Activatable.t) => bool;

module Convert: {
  /**
   * Converts an Activatable hero entry containing all of it's activations into
   * a "flattened" list of it's activations.
   */
  [@genType]
  let heroEntryToSingles: Hero.Activatable.t => list(singleWithId);

  let activatableOptionToSelectOptionId:
    Hero.Activatable.optionId => option(Id.selectOption);
};

module Accessors: {
  let name: Static.activatable => string;
  let selectOptions: Static.activatable => Static.SelectOption.map;
  let input: Static.activatable => option(string);
};

module SelectOptions: {
  /**
   * Get a select option with the given id from given static entry. Returns
   * `Nothing` if not found.
   */
  [@genType]
  let getSelectOption:
    (Static.activatable, Hero.Activatable.optionId) =>
    option(Static_SelectOption.t);

  /**
   * Get a select option's name with the given id from given static entry.
   * Returns `Nothing` if not found.
   */
  [@genType]
  let getSelectOptionName:
    (Static.activatable, Hero.Activatable.optionId) => option(string);

  /**
   * Get a select option's cost with the given id from given static entry.
   * Returns `Nothing` if not found.
   */
  [@genType]
  let getSelectOptionCost:
    (Static.activatable, Hero.Activatable.optionId) => option(int);

  /**
   * Get all first select option IDs from the given entry.
   */
  [@genType]
  let getActiveSelections:
    Hero.Activatable.t => list(Hero.Activatable.optionId);
};

let getOption: (int, singleWithId) => option(Hero.Activatable.optionId);

let getOption1: singleWithId => option(Hero.Activatable.optionId);

let getOption2: singleWithId => option(Hero.Activatable.optionId);

let getOption3: singleWithId => option(Hero.Activatable.optionId);

let getCustomInput: Hero.Activatable.optionId => option(string);

let getGenericId: Hero.Activatable.optionId => option(int);

module Names: {
  /**
   * The generated name for an Activatable. Contains the generated name and it's
   * parts: The base entry name, the generated addition and the converted level
   * name.
   */
  [@genType]
  [@genType.as "CombinedName"]
  type combinedName = {
    name: string,
    baseName: string,
    addName: option(string),
    levelName: option(string),
  };

  /**
   * `getName addLevelToName staticData staticActivatable singleEntry` returns
   * the name, splitted and combined, of the passed `singleEntry`.
   */
  [@genType]
  let getName:
    (~addLevelToName: bool, Static.t, Static.activatable, singleWithId) =>
    combinedName;
};

module AdventurePoints: {
  /**
   * The generated AP value for an Activatable. Contains the generated AP value
   * as well as if the entry is automatically added by the race, in which case
   * no additional AP from the hero are needed.
   */
  type combinedApValue = {
    apValue: int,
    isAutomatic: bool,
  };

  /**
   * `getApValue isEntryToAdd automaticAdvantages staticData hero
   * staticActivatable heroActivatable singleEntry` returns the AP you get when
   * removing the passed `singleEntry`. It also returns if the entry has been
   * automatically granted by the race.
   *
   * `isEntryToAdd` has to be `true` if `singleEntry` has not been added
   * to the list of active entries yet, otherwise `false`. `automaticAdvantages`
   * is the list of automatic advantage IDs.
   */
  [@genType]
  let getApValue:
    (
      ~isEntryToAdd: bool,
      ~automaticAdvantages: list(int),
      Static.t,
      Hero.t,
      Static.activatable,
      Hero.Activatable.t,
      singleWithId
    ) =>
    combinedApValue;
};
