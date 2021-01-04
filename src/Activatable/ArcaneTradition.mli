type t = {
  id : int;
  name : string;
  prerequisites : Prerequisite.Collection.ArcaneTradition.t;
}

module Decode : sig
  val assoc : t Json_Decode_Static.decodeAssoc
end
