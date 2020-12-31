type t = {
  id: int,
  name: string,
  numId: int,
  primary: int,
  aspects: option((int, int)),
  restrictedBlessings: list(int),
};

module Decode: {let assoc: Json_Decode_Static.decodeAssoc(t);};
