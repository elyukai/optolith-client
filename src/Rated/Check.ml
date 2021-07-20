type t = Id.Attribute.t * Id.Attribute.t * Id.Attribute.t

let values mp (a1, a2, a3) =
  let lookup_value mp id =
    Id.Attribute.Map.lookup id mp |> Attribute.Dynamic.value_of_option
  in
  (lookup_value mp a1, lookup_value mp a2, lookup_value mp a3)

module Decode = struct
  open Decoders_bs.Decode

  let t =
    Parsing.Infix.(
      Id.Attribute.Decode.t
      >>=:: fun id1 ->
      Id.Attribute.Decode.t
      >>=:: fun id2 ->
      Id.Attribute.Decode.t >>=:: fun id3 -> succeed (id1, id2, id3))
end

module Modifier = struct
  type t = Spirit | HalfOfSpirit | Toughness | GreaterOfBoth

  module Decode = struct
    open Decoders_bs.Decode

    let t =
      string
      >>= function
      | "SPI" -> succeed Spirit
      | "SPI/2" -> succeed HalfOfSpirit
      | "TOU" -> succeed Toughness
      | "SPI/TOU" -> succeed GreaterOfBoth
      | _ -> fail "Expected check modifier"
  end
end
