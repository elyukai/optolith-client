type t = { id : int; name : string; check : Check.t }

module Decode : sig
  val assoc : t Json_Decode_Static.decodeAssoc
end
