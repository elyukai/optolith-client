open Activatable_Convert;

/**
 * The generated name for an Activatable. Contains the generated name and it's
 * parts: The base entry name, the generated addition and the converted level
 * name.
 */
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
let getName:
  (~addLevelToName: bool, Static.t, Static.activatable, singleWithId) =>
  combinedName;
