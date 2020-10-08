type t = {
  id: int,
  name: string,
  prerequisites: Prerequisite.Collection.ArcaneTradition.t,
};

module Decode: {let assoc: Decoder.assocDecoder(t);};
