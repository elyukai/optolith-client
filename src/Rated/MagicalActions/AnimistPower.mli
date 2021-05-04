(** This module contains definitions and simple utility functions for both the
    dynamic and the static parts of an animist power. *)

module Static : sig
  (** The animist-power-specific improvement cost. It may be fixed or derived.
      *)
  type ic =
    | DeriveFromPrimaryPatron
        (** Derive the improvement cost from the selected primary patron. *)
    | Fixed of IC.t
        (** The improvement cost no matter which primary patron is selected. *)

  type level = {
    level : int;
    effect : string;  (** An additional effect description for this level. *)
    src : PublicationRef.list;
  }

  type t = {
    id : Id.AnimistPower.t;
    name : string;
    check : Check.t;
    effect : string;
    cost : Rated.Static.Activatable.MainParameter.t;
    cost_from_primary_patron : string option;
        (** This property is defined if the AE cost should be derived from the
            primary patron. A placeholder ("{0}") can be used to fill in the
            patron-specific cost. Another placeholder ("{1}") to fill in half
            that value, if needed. *)
    duration : Rated.Static.Activatable.MainParameter.t;
    tribes : IntSet.t;
    property : int;
    ic : ic;
    prerequisites : Prerequisite.Collection.AnimistPower.t;
    prerequisites_text : string option;
    levels : level IntMap.t;
        (** The animist power can have multiple levels. Each level is skilled
            separately. A previous level must be on at least 10 so that the next
            higher level can be activated and skilled. A higher level cannot be
            skilled higher than a lower level. Each level also adds an effect
            text to the text of the first level.*)
    src : PublicationRef.list;
    errata : Erratum.list;
  }
  (** The animist power type. *)

  module Decode : sig
    val make_assoc : (Id.AnimistPower.t, t) JsonStatic.make_assoc
  end
end

module Dynamic :
  Rated.Dynamic.Activatable.S
    with type id = Id.AnimistPower.t
     and type static = Static.t
