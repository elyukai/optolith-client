type t = int * int * int

let values mp (a1, a2, a3) =
  let lookup_value mp id =
    IntMap.lookup id mp |> Attribute.Dynamic.value_of_option
  in
  (lookup_value mp a1, lookup_value mp a2, lookup_value mp a3)

module Decode = struct
  let t = Json.Decode.(tuple3 int int int)
end

module Modifier = struct
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
end
