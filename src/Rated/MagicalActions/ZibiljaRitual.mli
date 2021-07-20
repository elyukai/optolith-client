(** This module contains definitions and simple utility functions for both the
    dynamic and the static parts of a zibilja ritual. *)

module Static : sig
  type t = {
    id : Id.ZibiljaRitual.t;
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
    ic : ImprovementCost.t;
    src : PublicationRef.list;
    errata : Erratum.list;
  }
  (** The zibilja ritual type. *)

  module Decode : sig
    val make_assoc : (Id.ZibiljaRitual.t, t) Parsing.make_assoc
  end
end

module Dynamic :
  Rated.Dynamic.Activatable.S
    with type id = Id.ZibiljaRitual.t
     and type static = Static.t
