/**
 * This module contains definitions and simple utility functions for both the
 * dynamic and the static parts of an attribute.
 */

module Dynamic: Increasable.Dynamic.T;

module Static: {
  type t = {
    id: int,
    name: string,
    short: string,
  };

  module Decode: {let assoc: Decoder.assocDecoder(t);};
};
