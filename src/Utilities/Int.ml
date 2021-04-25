type t = int

let neg (x : int) = -x

let succ (x : int) = x + 1

let pred (x : int) = x - 1

let abs (x : int) = if x < 0 then -x else x

let compare (x : int) y = if x < y then -1 else if x > y then 1 else 0

let max (x : int) y = if x > y then x else y

let min (x : int) y = if x < y then x else y

let minmax (x : int) y = if x < y then (x, y) else (y, x)

let even (x : int) = x mod 2 == 0

let odd (x : int) = x mod 2 == 1

let gcd x y =
  let rec modUntilNoRemainder x div =
    let rem = x mod div in
    if rem == 0 then abs div else modUntilNoRemainder div rem
  in
  match (x, y) with
  | 0, 0 -> raise (invalid_arg "gcd: Both inputs cannot be 0.")
  | 0, a | a, 0 -> a
  | a, b ->
      let lower, upper = minmax a b in
      modUntilNoRemainder lower upper

let lcm x y =
  match (x, y) with
  | 0, 0 -> raise (invalid_arg "lcm: Both inputs cannot be 0.")
  | 0, _ | _, 0 -> 0
  | a, b -> a * b / gcd a b

let signum x = if x < 0 then -1 else if x > 0 then 1 else 0
