module Static: {
  type t = {
    id: int,
    name: string,
    effect: string,
    range: string,
    duration: string,
    target: string,
    src: list(PublicationRef.t),
    errata: list(Erratum.t),
  };

  module Decode: {let assoc: Decoder.assocDecoder(t);};
};
