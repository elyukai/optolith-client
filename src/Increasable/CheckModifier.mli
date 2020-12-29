type t = Spirit | HalfOfSpirit | Toughness | GreaterOfBoth

module Decode : sig
  val t : t Json.Decode.decoder
end
