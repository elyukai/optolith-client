/**
 * This module contains definitions and simple utility functions for both the
 * dynamic and the static parts of an attribute.
 */

module Dynamic: {
  type t = {
    id: int,
    value: int,
    dependencies: list(Increasable.dependency),
  };

  /**
   * `empty id` creates a new dynamic attribute instance from an attribute id.
   */
  let empty: int => t;

  /**
   * `isEmpty attr` checks if the passed attribute is empty.
   */
  let isEmpty: t => bool;

  /**
   * `getValueDef maybeAttr` takes an attribute's dynamic entry that might not
   * exist and returns the value of that attribute. If the attribute is not yet
   * defined, it's value is `8`.
   */
  let getValueDef: Ley_Option.t(t) => int;
};

module Static: {
  type t = {
    id: int,
    name: string,
    short: string,
  };

  let decode: (list(string), Js.Json.t) => Ley_Option.t(t);
};
