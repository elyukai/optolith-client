(** This module contains definitions and simple utility functions for experience
    levels. *)

type t = {
  id : Id.ExperienceLevel.t;
  name : string;
  ap : int;
  max_attribute_value : int;
  max_skill_rating : int;
  max_combat_technique_rating : int;
  max_attribute_total : int;
  max_number_spells_liturgical_chants : int;
  max_unfamiliar_spells : int;
}

module Decode : sig
  val make_assoc : (Id.ExperienceLevel.t, t) JsonStatic.make_assoc
end
