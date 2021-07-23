(** This module contains definitions and simple utility functions for patrons and its categories. *)

(** Definitions and simple utility functions for patron categories. *)
module Category : sig
  type t = {
    id : int;
    name : string;
    primary_patron_cultures : Id.Culture.Set.t;
  }
  (** The patron category type. *)

  module Decode : sig
    val make_assoc : (int, t) Parsing.make_assoc
  end
end

(** The patron is only available to a certain set of cultures. It may be
    available to all, it may be available to only specific ones and it may be
    available to all except specific ones to the listed cultures. *)
type culture = All | Only of Id.Culture.Set.t | Except of Id.Culture.Set.t

(** The target value of a combat power. *)
type combat_value =
  | Attack
  | Parry
  | RangedCombat
  | Dodge
  | DamagePoints
  | Protection

(** A power specific animal powers can grant. *)
type power =
  | Advantage of {
      id : Id.Advantage.t;
      level : int option;
      option : int option;
    }
  | Skill of { id : Id.Skill.t; value : int }
  | Combat of { combat_value : combat_value; value : int }
  | Attribute of { id : Id.Attribute.t; value : int }

type t = {
  id : int;
  name : string;
  category : int;
  skills : Id.Skill.t * Id.Skill.t * Id.Skill.t;
  culture : culture;
  powers : power NonEmptyList.t list;
      (** The list represents the powers for different levels of an animal power
          that grants them based on the primary patron. So the powers at index 0
          are granted by the animal power level 1, at index 1 for level 2 and so
          on. *)
  cost : int option;
      (** An animal power might derive its cost from the primary patron. *)
  ic : ImprovementCost.t option;
      (** An animal power might derive its improvement cost from the primary
          patron. *)
}
(** The patron type. *)

module Decode : sig
  val make_assoc : (int, t) Parsing.make_assoc
end
