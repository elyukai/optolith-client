type t = { id : int; name : string; masterOfAspectSuffix : string option }

module Decode : sig
  val assoc : t Json_Decode_Static.decodeAssoc
end
