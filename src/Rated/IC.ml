type t = A | B | C | D | E

let show ic =
  match ic with A -> "A" | B -> "B" | C -> "C" | D -> "D" | E -> "E"

let toIndex ic = match ic with A -> 0 | B -> 1 | C -> 2 | D -> 3 | E -> 4

let getApBase ic = match ic with A -> 1 | B -> 2 | C -> 3 | D -> 4 | E -> 15

(**
 * Get the value above which the AP values increase linearly. The AP value is
 * constant until the returned value.
 *)
let getConstantThresholdValue ic = match ic with A | B | C | D -> 12 | E -> 14

let getBaseMultiplier ic value =
  Js.Math.max_int 1 (value - getConstantThresholdValue ic + 1)

let getApValue ic value = getApBase ic * getBaseMultiplier ic value

let getApForBounds ic (l, u) =
  Ix.range (l + 1, u)
  |> List.fold_left (fun sum value -> sum + getApValue ic value) 0

let getApForRange ic ~fromValue ~toValue =
  if fromValue == toValue then 0
  else
    getApForBounds ic (Int.minmax fromValue toValue)
    * if fromValue > toValue then -1 else 1

let getApForIncrease ic fromValue = getApValue ic (fromValue + 1)

let getApForDecrease ic fromValue = -getApValue ic fromValue

let getApForActivatation = getApBase

module Decode = struct
  open Json.Decode

  let t =
    string
    |> map (function
         | "A" -> A
         | "B" -> B
         | "C" -> C
         | "D" -> D
         | "E" -> E
         | str -> raise (DecodeError ("Unknown improvement cost: " ^ str)))
end
