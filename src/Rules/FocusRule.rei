module Static: {
  type t = {
    id: int,
    name: string,
    level: int,
    subject: int,
    description: string,
    src: list(PublicationRef.t),
    errata: list(Erratum.t),
  };

  module Decode: {let assoc: Decoder.assocDecoder(t);};
};
