/**
 * A single active Activatable.
 */
type singleWithId = {
  id: int,
  options: list(Hero.Activatable.option),
  level: Maybe.t(int),
  customCost: Maybe.t(int),
};

/**
 * Is an Activatable entry active?
 */
let isActive: Hero.Activatable.t => bool;

/**
 * Is an Activatable, where the entry may not be created, active?
 */
let isActiveM: Maybe.t(Hero.Activatable.t) => bool;

module Convert: {
  /**
   * Converts an Activatable hero entry containing all of it's activations into
   * a "flattened" list of it's activations.
   */
  let heroEntryToSingles: Hero.Activatable.t => list(singleWithId);
};

module Accessors: {
  let name: Static.activatable => string;
  let selectOptions: Static.activatable => Static.SelectOption.map;
  let input: Static.activatable => Maybe.t(string);
};

module SelectOptions: {
  /**
   * Get a select option with the given id from given static entry. Returns
   * `Nothing` if not found.
   */
  let getSelectOption:
    (Static.activatable, Hero.Activatable.option) =>
    Maybe.t(Static.SelectOption.t);

  /**
   * Get a select option's name with the given id from given static entry.
   * Returns `Nothing` if not found.
   */
  let getSelectOptionName:
    (Static.activatable, Hero.Activatable.option) => Maybe.t(string);

  /**
   * Get a select option's cost with the given id from given static entry.
   * Returns `Nothing` if not found.
   */
  let getSelectOptionCost:
    (Static.activatable, Hero.Activatable.option) => Maybe.t(int);

  /**
   * Get all first select option IDs from the given entry.
   */
  let getActiveSelections:
    Hero.Activatable.t => list(Hero.Activatable.option);
};

module Names: {
  /**
   * The generated name for an Activatable activation. Contains the generated
   * name and it's parts: The base entry name, the generated addition and the
   * converted level name.
   */
  type combinedName = {
    name: string,
    baseName: string,
    addName: Maybe.t(string),
    levelName: Maybe.t(string),
  };

  /**
   * Returns name, splitted and combined, of advantage/disadvantage/special
   * ability as a Maybe (in case the wiki entry does not exist).
   */
  let getName:
    (~addLevelToName: bool, Static.t, Static.activatable, singleWithId) =>
    combinedName;
};

module AdventurePoints: {
  /**
   * Returns the AP you get when removing the passed entry.
   *
   * @param isEntryToAdd `true` if `entry` has not been added to the list of
   * active entries yet, otherwise `false`.
   * @param automaticAdvantages List of automatic advantage IDs.
   */
  let getCost:
    (
      ~isEntryToAdd: bool,
      ~automaticAdvantages: list(int),
      Static.t,
      Hero.t,
      Static.activatable,
      Hero.Activatable.t,
      singleWithId
    ) =>
    (int, bool);
};
