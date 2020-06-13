type t =
  | A
  | B
  | C
  | D
  | E;

/**
 * `getAPRange ic fromSr toSr` returns the AP cost for the given Skill Point
 * range with the given `ic`.
 */
let getAPForRange: (t, int, int) => int;

/**
 * `getAPForInc ic sr` returns the AP cost for adding one Skill Point to
 * `fromSr` with the given `ic`.
 */
let getAPForInc: (t, int) => int;

/**
 * `getAPForDec ic sr` returns the AP cost for removing one Skill Point from
 * `fromSr` with the given `ic`.
 */
let getAPForDec: (t, int) => int;

/**
 * `getAPForActivatation ic` returns the AP cost for activating an entry with
 * the given `ic`.
 */
let getAPForActivatation: t => int;

/**
 * Returns the name of the passed Improvement Cost.
 */
let icToStr: t => string;

/**
 * Returns an index used for getting the IC-based cost for an Activatable entry.
 */
let icToIx: t => int;

module Decode: {let t: Js.Json.t => t;};
