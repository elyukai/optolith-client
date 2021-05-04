(** This module contains definitions and simple utility functions for both the
    dynamic and the static parts of a geode ritual. *)

module Static : sig
  type t = {
    id : Id.GeodeRitual.t;
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
    prerequisites : Prerequisite.Collection.Spellwork.t;
    src : PublicationRef.list;
    errata : Erratum.list;
  }
  (** The spell type. *)

  module Decode : sig
    val make_assoc : (Id.GeodeRitual.t, t) JsonStatic.make_assoc
  end
end

module Dynamic :
  Rated.Dynamic.Activatable.S
    with type id = Id.GeodeRitual.t
     and type static = Static.t
