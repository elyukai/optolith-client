let pair x y = (x, y)

include (
  Bifunctor.Make (struct
    type nonrec ('a, 'b) t = 'a * 'b

    let bimap f g (x, y) = (f x, g y)
  end) :
    Bifunctor.T with type ('a, 'b) t := 'a * 'b)

let fst (x, _) = x

let snd (_, y) = y

let curry f a b = f (a, b)

let uncurry f (a, b) = f a b

let swap (x, y) = (y, x)
