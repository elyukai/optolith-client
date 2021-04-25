let rec range (l, u) =
  if l > u then [] else if l == u then [ u ] else l :: range (l + 1, u)

let inRange (l, u) (x : int) = l <= x && x <= u

let index p x =
  if inRange p x then x - fst p
  else raise (invalid_arg "Ix.index: Index out of range.")

let rangeSize (l, u) = if l <= u then u - l + 1 else 0
