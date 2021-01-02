(** This module contains definitions and simple utility functions for both the
    dynamic and the static parts of an attribute. *)

module Static : sig
  type t = { id : int; name : string; nameAbbr : string }

  module Decode : sig
    val assoc : t Json_Decode_Static.decodeAssoc
  end
end

module Dynamic : Increasable.Dynamic.S with type static = Static.t
