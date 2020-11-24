type t =
  | Spirit
  | HalfOfSpirit
  | Toughness
  | GreaterOfBoth;

module Decode = {
  let t =
    Json.Decode.(
      string
      |> map(
           fun
           | "SPI" => Spirit
           | "SPI/2" => HalfOfSpirit
           | "TOU" => Toughness
           | "SPI/TOU" => GreaterOfBoth
           | scope =>
             raise(DecodeError("Unknown check modifier: " ++ scope)),
         )
    );
};
