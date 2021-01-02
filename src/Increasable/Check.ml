module IM = Ley_IntMap

type t = int * int * int

let getValues mp (a1, a2, a3) =
  let lookupValueDef mp id = IM.lookup id mp |> Attribute.Dynamic.getValueDef in
  (lookupValueDef mp a1, lookupValueDef mp a2, lookupValueDef mp a3)

(* let getAttributes (mp : Attribute.Static.t IM.t) (a1, a2, a3) =
  O.liftM3
    (fun a1 a2 a3 -> (a1, a2, a3))
    (IM.lookup a1 mp) (IM.lookup a2 mp) (IM.lookup a3 mp) *)

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
