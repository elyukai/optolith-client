type t = { id : int; name : string }

module Decode : sig
  val assoc : t Json_Decode_Static.decodeAssoc
end
