type t = Spirit | HalfOfSpirit | Toughness | GreaterOfBoth

module Decode = struct
  let t =
    Json.Decode.(
      string
      |> map (function
           | "SPI" -> Spirit
           | "SPI/2" -> HalfOfSpirit
           | "TOU" -> Toughness
           | "SPI/TOU" -> GreaterOfBoth
           | scope -> raise (DecodeError ("Unknown check modifier: " ^ scope))))
end
