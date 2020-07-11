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
  options: list(Id.Activatable.Option.t),
  level: option(int),
  customCost: option(int),
};

/**
 * Converts an Activatable hero entry into a "flattened" list of it's
 * activations.
 */
let heroEntryToSingles: Hero.Activatable.t => list(singleWithId);

let singleToSingleWithId:
  (Hero.Activatable.t, Hero.Activatable.single) => singleWithId;

let activatableOptionToSelectOptionId:
  Id.Activatable.Option.t => option(Id.SelectOption.t);
