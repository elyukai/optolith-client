(** This module contains definitions and simple utility functions for both the
    dynamic and the static parts of a magical melody. *)

module Static : sig
  type t = {
    id : Id.MagicalMelody.t;
    name : string;
    check : Check.t;
    effect : string;
    duration : Rated.Static.Activatable.MainParameter.t;
    cost : Rated.Static.Activatable.MainParameter.t;
    skill : Id.Skill.t NonEmptyList.t;
        (** The skill(s) that can be used with this entry. *)
    music_tradition : string Id.MagicalTradition.ArcaneBardTradition.Map.t;
        (** The keys represent the arcane traditions the entry is available for
            and the associated value is the name of this entry used in the
            respective arcane tradition. *)
    property : int;
    ic : IC.t;
    src : PublicationRef.list;
    errata : Erratum.list;
  }
  (** The magical melody type. *)

  module Decode : sig
    val make_assoc : (Id.MagicalMelody.t, t) JsonStatic.make_assoc
  end
end

module Dynamic : Rated.Dynamic.Activatable.S with type static = Static.t
