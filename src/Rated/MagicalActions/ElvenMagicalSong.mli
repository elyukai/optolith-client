(** This module contains definitions and simple utility functions for both the
    dynamic and the static parts of an Elven magical song. *)

module Static : sig
  type t = {
    id : Id.ElvenMagicalSong.t;
    name : string;
    check : Check.t;
    check_mod : Check.Modifier.t option;
    effect : string;
    cost : Rated.Static.Activatable.MainParameter.t;
    skill : Id.Skill.t NonEmptyList.t;
        (** The skill(s) that can be used with this entry. *)
    property : int;
    ic : IC.t;
    src : PublicationRef.list;
    errata : Erratum.list;
  }
  (** The Elven magical song type. *)

  module Decode : sig
    val make_assoc : (Id.ElvenMagicalSong.t, t) JsonStatic.make_assoc
  end
end

module Dynamic : Rated.Dynamic.Activatable.S with type static = Static.t
