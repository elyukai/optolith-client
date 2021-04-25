let id x = x

let const x _ = x

let flip f x y = f y x

let negate f x = f x |> not

let on b u x y = b (u x) (u y)
