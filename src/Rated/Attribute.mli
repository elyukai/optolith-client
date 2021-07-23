(** This module contains definitions and simple utility functions for both the
    dynamic and the static parts of an attribute. *)

module Static : sig
  type t = {
    id : Id.Attribute.t;
    name : string;
    abbreviation : string;
    description : string;
  }
  (** The attribute type. *)

  module Decode : sig
    val make_assoc : (Id.Attribute.t, t) Parsing.make_assoc
  end
end

module Dynamic :
  Rated.Dynamic.S with type id = Id.Attribute.t and type static = Static.t
