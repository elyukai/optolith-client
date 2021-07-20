(** This module contains definitions and simple utility functions for both the
    dynamic and the static parts of a magical dance. *)

module Static : sig
  type t = {
    id : Id.MagicalDance.t;
    name : string;
    check : Check.t;
    effect : string;
    duration : Rated.Static.Activatable.MainParameter.t;
    cost : Rated.Static.Activatable.MainParameter.t;
    music_tradition : string Id.MagicalTradition.ArcaneDancerTradition.Map.t;
        (** The keys represent the arcane traditions the entry is available for
            and the associated value is the name of this entry used in the
            respective arcane tradition. *)
    property : int;
    ic : ImprovementCost.t;
    src : PublicationRef.list;
    errata : Erratum.list;
  }
  (** The magical dance type. *)

  module Decode : sig
    val make_assoc : (Id.MagicalDance.t, t) Parsing.make_assoc
  end
end

module Dynamic :
  Rated.Dynamic.Activatable.S
    with type id = Id.MagicalDance.t
     and type static = Static.t
