(** This module contains definitions and simple utility functions for the
    regions of Aventuria. *)

type t = { id : Id.Region.t; name : string }
(** The region type. *)

module Decode : sig
  val make_assoc : (Id.Region.t, t) Parsing.make_assoc
end
