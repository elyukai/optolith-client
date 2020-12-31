type t = {
  id: int,
  name: string,
  prerequisites: Prerequisite.Collection.ArcaneTradition.t,
};

module Decode: {let assoc: Json_Decode_Static.decodeAssoc(t);};
