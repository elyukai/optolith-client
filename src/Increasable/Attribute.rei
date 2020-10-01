/**
 * This module contains definitions and simple utility functions for both the
 * dynamic and the static parts of an attribute.
 */

module Dynamic: Increasable.Dynamic;

module Static: {
  type t = {
    id: int,
    name: string,
    short: string,
  };

  let decode: (list(string), Js.Json.t) => option(t);
};
