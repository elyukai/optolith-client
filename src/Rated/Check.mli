(** The check and check modifier types and utility functions. *)

type t
(** The skill check definition. *)

val values : Attribute.Dynamic.t IntMap.t -> t -> int * int * int
(** Takes a skill check and returns it's corresponding attribute values. *)

module Decode : sig
  val t : t Json.Decode.decoder
end

(** Types and functions for check modifiers. *)
module Modifier : sig
  (** The check modifier type. *)
  type t = Spirit | HalfOfSpirit | Toughness | GreaterOfBoth

  module Decode : sig
    val t : t Json.Decode.decoder
  end
end
