/**
 * Functions for working on adventure point values for Activatable entries.
 *
 * This module provides types and functions for calculating and keeping
 * adventure point value calculations in genereal and specific to certain
 * entries.
 */

open Activatable_Convert;

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
let getApValueDifferenceOnChange:
  (
    ~isEntryToAdd: bool,
    ~automaticAdvantages: list(int),
    Static.t,
    Hero.t,
    Static.activatable,
    Activatable_Dynamic.t,
    singleWithId
  ) =>
  combinedApValue;
