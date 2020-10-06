/**
 * A publication. It contains the name, the abbreviation and some configuration
 * options.
 */
type t = {
  id: int,
  name: string,
  nameAbbr: string,
  isCore: bool,
  isAdultContent: bool,
};

module Decode: {let assoc: Decoder.assocDecoder(t);};
