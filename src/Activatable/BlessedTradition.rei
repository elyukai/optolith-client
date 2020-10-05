type t = {
  id: int,
  name: string,
  numId: int,
  primary: int,
  aspects: option((int, int)),
};

module Decode: {let assoc: Decoder.assocDecoder(t);};
