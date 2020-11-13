module Static: {
  type t = {
    id: int,
    name: string,
    description: string,
    isPrerequisite: bool,
    src: list(PublicationRef.t),
    errata: list(Erratum.t),
  };

  module Decode: {let assoc: Decoder.assocDecoder(t);};
};