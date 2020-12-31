type t = A | B | C | D | E

let show ic =
  match ic with A -> "A" | B -> "B" | C -> "C" | D -> "D" | E -> "E"

let toIndex ic = match ic with A -> 0 | B -> 1 | C -> 2 | D -> 3 | E -> 4

let getBase ic = match ic with A -> 1 | B -> 2 | C -> 3 | D -> 4 | E -> 15

let getFirstValueWithGrowth ic = match ic with A | B | C | D -> 13 | E -> 15

let getBaseModifier ic sr = sr - getFirstValueWithGrowth ic |> Js.Math.max_int 1

let getApForSingleIncrease ic sr = getBase ic * getBaseModifier ic sr

let sumWith f = List.fold_left (fun acc x -> acc + f x) 0

let getApForBounds ic (l, u) =
  Ley_Ix.range (l + 1, u) |> sumWith (getApForSingleIncrease ic)

let getApForRange ic ~before ~after =
  getApForBounds ic (Ley_Int.minmax before after)

let getApTotalForValue ic sr = getApForBounds ic (0, sr)

let getApForIncrease ic from = getApForSingleIncrease ic (from + 1)

let getApForDecrease ic from = -getApForSingleIncrease ic from

let getApForActivation = getBase
