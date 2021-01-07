type t

val values : Attribute.Dynamic.t Ley_IntMap.t -> t -> int * int * int
(**
 * Takes a skill check and returns it's values.
 *)

(* /**
 * Takes a skill check and returns it's attributes' names.
 */
let getAttributes:
  (Ley_IntMap.t(Attribute.t), t) =>
  option((Attribute.t, Attribute.t, Attribute.t)); *)

module Decode : sig
  val t : t Json.Decode.decoder
end

module Modifier : sig
  type t = Spirit | HalfOfSpirit | Toughness | GreaterOfBoth

  module Decode : sig
    val t : t Json.Decode.decoder
  end
end
