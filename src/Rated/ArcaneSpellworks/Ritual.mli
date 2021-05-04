(** This module contains definitions and simple utility functions for both the
    dynamic and the static parts of a ritual. *)

module Static : sig
  type t = {
    id : Id.Ritual.t;
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
    traditions : Id.MagicalTradition.Set.t;
    ic : IC.t;
    prerequisites : Prerequisite.Collection.Spellwork.t;
    enhancements : Enhancement.t IntMap.t;
    src : PublicationRef.list;
    errata : Erratum.list;
  }
  (** The ritual type. *)

  module Decode : sig
    val make_assoc : (Id.Ritual.t, t) JsonStatic.make_assoc
  end
end

module Dynamic :
  Rated.Dynamic.Activatable.WithEnhancements.ByMagicalTradition.S
    with type id = Id.Ritual.t
     and type static = Static.t
