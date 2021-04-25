(** Calculate adventure points based on improvement costs. *)

(** The improvement cost type. *)
type t = A | B | C | D | E

val show : t -> string
(**
 * Returns the name of the passed Improvement Cost.
 *)

val toIndex : t -> int
(**
 * Returns an index used for getting the IC-based cost for an Activatable entry.
 *)

val getApForRange : t -> fromValue:int -> toValue:int -> int
(**
 * `getApForRange ic fromSr toSr` returns the AP cost for the given Skill Point
 * range with the given `ic`.
 *)

val getApForIncrease : t -> int -> int
(**
 * `getApForIncrease ic sr` returns the AP cost for adding one Skill Point to
 * `fromSr` with the given `ic`.
 *)

val getApForDecrease : t -> int -> int
(**
 * `getAPForDec ic sr` returns the AP cost for removing one Skill Point from
 * `fromSr` with the given `ic`.
 *)

val getApForActivatation : t -> int
(**
 * `getAPForActivatation ic` returns the AP cost for activating an entry with
 * the given `ic`.
 *)

module Decode : sig
  val t : Js.Json.t -> t
end
