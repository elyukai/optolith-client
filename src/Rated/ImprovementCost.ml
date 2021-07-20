type t = A | B | C | D | E

let show ic =
  match ic with A -> "A" | B -> "B" | C -> "C" | D -> "D" | E -> "E"

let to_index ic = match ic with A -> 0 | B -> 1 | C -> 2 | D -> 3 | E -> 4

let ap_base ic = match ic with A -> 1 | B -> 2 | C -> 3 | D -> 4 | E -> 15

(**
 * Get the value above which the AP values increase linearly. The AP value is
 * constant until the returned value.
 *)
let constant_threshold_value ic = match ic with A | B | C | D -> 12 | E -> 14

let base_multiplier ic value =
  Js.Math.max_int 1 (value - constant_threshold_value ic + 1)

let ap_value ic value = ap_base ic * base_multiplier ic value

let ap_for_bounds ic (l, u) =
  Ix.range (l + 1, u)
  |> List.fold_left (fun sum value -> sum + ap_value ic value) 0

let ap_for_range ic ~from_value ~to_value =
  if from_value == to_value then 0
  else
    ap_for_bounds ic (Int.minmax from_value to_value)
    * if from_value > to_value then -1 else 1

let ap_for_increase ic from_value = ap_value ic (from_value + 1)

let ap_for_decrease ic from_value = -ap_value ic from_value

let ap_for_activation = ap_base

module Decode = struct
  open Decoders_bs.Decode

  let t =
    string
    >>= function
    | "A" -> succeed A
    | "B" -> succeed B
    | "C" -> succeed C
    | "D" -> succeed D
    | "E" -> succeed E
    | _ -> fail "Expected an improvement cost"
end
