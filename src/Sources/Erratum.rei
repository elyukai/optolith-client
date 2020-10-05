/**
 * A erratum for a static entry. It is set to the date of when that erratum was
 * official and describes what has changed.
 */
type t = {
  date: Js.Date.t,
  description: string,
};

module Decode: {let list: Json.Decode.decoder(list(t));};
