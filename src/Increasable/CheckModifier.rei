type t =
  | Spirit
  | HalfOfSpirit
  | Toughness
  | GreaterOfBoth;

module Decode: {let t: Json.Decode.decoder(t);};
