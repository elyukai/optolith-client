(** This module contains definitions and simple utility functions for both the
    dynamic and the static parts of a ceremony. *)

module Static : sig
  type t = {
    id : Id.Ceremony.t;
    name : string;
    name_short : string option;
    check : Check.t;
    check_mod : Check.Modifier.t option;
    effect : string;
    casting_time : Rated.Static.Activatable.MainParameter.t;
    cost : Rated.Static.Activatable.MainParameter.t;
    range : Rated.Static.Activatable.MainParameter.t;
    duration : Rated.Static.Activatable.MainParameter.t;
    target : string;
    traditions : Id.BlessedTradition.Set.t;
    aspects : Id.Aspect.Set.t;
    ic : IC.t;
    prerequisites : Prerequisite.Collection.Liturgy.t;
    enhancements : Enhancement.t IntMap.t;
    src : PublicationRef.list;
    errata : Erratum.list;
  }
  (** The ceremony type. *)

  module Decode : sig
    val make_assoc : (Id.Ceremony.t, t) JsonStatic.make_assoc
  end
end

module Dynamic :
  Rated.Dynamic.Activatable.WithEnhancements.S
    with type id = Id.Ceremony.t
     and type static = Static.t