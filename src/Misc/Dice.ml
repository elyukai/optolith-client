type t = { amount : int; sides : int }

let rollDie sides =
  Js.Math.floor (Js.Math.random () *. Js.Int.toFloat sides) |> Ley_Int.inc

(** Subtract the second from the *absolute* value of the first while keeping
    it's sign.

    @example {[
      5 |- 2 == 3
      -5 |- 2 == -3
    ]}
    *)
let ( |- ) a b = if a >= 0 then a - b else a + b

let rollDice { amount; sides } =
  let rec aux ~amount ~sides =
    if Ley_Int.abs amount <= 1 then [ rollDie sides ]
    else rollDie sides :: aux ~amount:(amount |- 1) ~sides
  in
  aux ~amount ~sides

let rollDiceSum { amount; sides } =
  let rec aux ~amount ~sides =
    if Ley_Int.abs amount <= 1 then rollDie sides
    else rollDie sides + aux ~amount:(amount |- 1) ~sides
  in
  aux ~amount ~sides

let rollDiceSumMap f { amount; sides } =
  let rec aux ~map ~amount ~sides =
    if Ley_Int.abs amount <= 1 then rollDie sides |> map { amount; sides }
    else
      (rollDie sides |> map { amount; sides })
      + aux ~map ~amount:(amount |- 1) ~sides
  in
  aux ~map:f ~amount ~sides

module Decode = struct
  let t json =
    Json.Decode.
      { amount = json |> field "amount" int; sides = json |> field "sides" int }
end
