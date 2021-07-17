(** Calculate adventure points based on improvement costs. *)

(** The improvement cost type. *)
type t = A | B | C | D | E

val show : t -> string
(** Returns the name of the passed Improvement Cost. *)

val to_index : t -> int
(** Returns an index used for getting the IC-based cost for an Activatable
    entry. *)

val ap_for_range : t -> from_value:int -> to_value:int -> int
(** [ap_for_range ic ~from_value ~to_value] returns the AP cost for the given
    Skill Point range with the given [ic]. *)

val ap_for_increase : t -> int -> int
(** [ap_for_increase ic sr] returns the AP cost for adding one Skill Point to [sr] with the given [ic]. *)

val ap_for_decrease : t -> int -> int
(** [ap_for_decrease ic sr] returns the AP cost for removing one Skill Point from [sr] with the given [ic]. *)

val ap_for_activation : t -> int
(** `ap_for_activation ic` returns the AP cost for activating an entry with the given [ic]. *)

module Decode : sig
  val t : Js.Json.t -> t
end
