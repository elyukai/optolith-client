type t =
  | Spirit
  | HalfOfSpirit
  | Toughness
  | GreaterOfBoth;

let decode: Json.Decode.decoder(t);
