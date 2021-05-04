(** This module contains definitions and simple utility functions for both the
    dynamic and the static parts of a jester trick. *)

module Static : sig
  type t = {
    id : Id.JesterTrick.t;
    name : string;
    check : Check.t;
    check_mod : Check.Modifier.t option;
    effect : string;
    casting_time : Rated.Static.Activatable.MainParameter.t;
    cost : Rated.Static.Activatable.MainParameter.t;
    range : Rated.Static.Activatable.MainParameter.t;
    duration : Rated.Static.Activatable.MainParameter.t;
    target : string;
    property : int;
    ic : IC.t;
    src : PublicationRef.list;
    errata : Erratum.list;
  }
  (** The jester trick type. *)

  module Decode : sig
    val make_assoc : (Id.JesterTrick.t, t) JsonStatic.make_assoc
  end
end

module Dynamic :
  Rated.Dynamic.Activatable.S
    with type id = Id.JesterTrick.t
     and type static = Static.t
