let pair x y = (x, y)

include (
  Bifunctor.Make (struct
    type nonrec ('a, 'b) t = 'a * 'b

    let bimap f g (x, y) = (f x, g y)
  end) :
    Bifunctor.T with type ('a, 'b) t := 'a * 'b )

(**
 * Extract the first component of a pair.
 *)
let fst (x, _) = x

(**
 * Extract the second component of a pair.
 *)
let snd (_, y) = y

(**
 * Swap the components of a pair.
 *)
let swap (x, y) = (y, x)
