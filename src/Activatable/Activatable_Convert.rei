/**
 * Convert specific values to be able to easier work with them.
 *
 * This function provides some utility functions to convert some types from the
 * state into smaller chuncks that are more usable for working with single
 * entries.
 */

/**
 * A single active Activatable.
 */
type singleWithId = {
  id: int,
  index: int,
  options: list(Id.Activatable.Option.t),
  level: option(int),
  customCost: option(int),
};

/**
 * Converts an Activatable hero entry into a "flattened" list of it's
 * activations.
 */
let heroEntryToSingles: Activatable_Dynamic.t => list(singleWithId);

let singleToSingleWithId:
  (Activatable_Dynamic.t, int, Activatable_Dynamic.single) => singleWithId;

let activatableOptionToSelectOptionId:
  Id.Activatable.Option.t => option(Id.Activatable.SelectOption.t);

let singleWithIdToSingle: singleWithId => Activatable_Dynamic.single;
