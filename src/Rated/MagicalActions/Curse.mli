(** This module contains definitions and simple utility functions for both the
    dynamic and the static parts of a curse. *)

module Static : sig
  type t = {
    id : Id.Curse.t;
    name : string;
    check : Check.t;
    check_mod : Check.Modifier.t option;
    effect : string;
    cost : Rated.Static.Activatable.MainParameter.t;
    duration : Rated.Static.Activatable.MainParameter.t;
    property : int;
    src : PublicationRef.list;
    errata : Erratum.list;
  }
  (** The curse type. *)

  module Decode : sig
    val make_assoc : (Id.Curse.t, t) Parsing.make_assoc
  end
end

module Dynamic :
  Rated.Dynamic.Activatable.S
    with type id = Id.Curse.t
     and type static = Static.t
