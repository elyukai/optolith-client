module Dynamic: {
  type value =
    | One
    | Two
    | Three
    | Four;

  type t = {
    id: int,
    value,
  };
};

module Static: {
  type t = {
    id: int,
    name: string,
    description: option(string),
    levelDescription: option(string),
    levels: (string, string, string, string),
    src: list(PublicationRef.t),
    errata: list(Erratum.t),
  };

  module Decode: {let assoc: Decoder.assocDecoder(t);};
};