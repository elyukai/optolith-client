/**
 * This module contains definitions and simple utility functions for both the
 * dynamic and the static parts of a combat technique.
 */

module Dynamic: {
  type t = {
    id: int,
    value: int,
    dependencies: list(Increasable.dependency),
  };

  /**
   * `empty id` creates a new dynamic combat technique instance from a combat
   * technique id.
   */
  let empty: int => t;

  /**
   * `isEmpty ct` checks if the passed combat technique is empty.
   */
  let isEmpty: t => bool;

  /**
   * `getValueDef maybeAttr` takes a combat technique's dynamic entry that might
   * not exist and returns the value of that combat technique. If the combat
   * technique is not yet defined, it's value is `6`.
   */
  let getValueDef: option(t) => int;
};

module Static: {
  type t = {
    id: int,
    name: string,
    ic: IC.t,
    primary: list(int),
    special: option(string),
    hasNoParry: bool,
    bpr: int,
    gr: int,
    src: list(PublicationRef.t),
    errata: list(Erratum.t),
  };

  let decode: (list(string), Js.Json.t) => option(t);
};
