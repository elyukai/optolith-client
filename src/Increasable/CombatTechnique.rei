/**
 * This module contains definitions and simple utility functions for both the
 * dynamic and the static parts of a combat technique.
 */

module Dynamic: Increasable.Dynamic;

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
