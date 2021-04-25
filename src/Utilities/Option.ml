type 'a t = 'a option

include (
  Functor.Make (struct
    type nonrec 'a t = 'a t

    let fmap f mx = match mx with Some x -> x |. f |. Some | None -> None
  end) :
    Functor.T with type 'a t := 'a t )

include (
  Applicative.Make (struct
    type nonrec 'a t = 'a t

    let pure x = Some x

    let fmap = fmap

    let ap mf mx = match mf with Some f -> fmap f mx | None -> None
  end) :
    Applicative.T with type 'a t := 'a t )

include (
  Applicative.Alternative.Make (struct
    type nonrec 'a t = 'a t

    let empty = None

    let alt mx my = match mx with None -> my | x -> x
  end) :
    Applicative.Alternative.T with type 'a t := 'a t )

include (
  Monad.Make (struct
    type nonrec 'a t = 'a t

    let pure = pure

    let fmap = fmap

    let bind f mx = match mx with Some x -> f x | None -> None
  end) :
    Monad.T with type 'a t := 'a t )

include (
  Foldable.Make (struct
    type nonrec 'a t = 'a t

    let foldr f init mx = match mx with Some x -> f x init | None -> init

    let foldl f init mx = match mx with Some x -> f init x | None -> init

    let equal = ( == )
  end) :
    Foldable.T with type 'a t := 'a t )

let sappend mxs mys =
  match mxs with
  | Some xs -> (
      match mys with Some ys -> Some (List.append xs ys) | None -> mxs )
  | None -> mxs

let isSome m = match m with Some _ -> true | None -> false

let isNone m = match m with Some _ -> false | None -> true

let fromSome = function
  | Some x -> x
  | None -> invalid_arg "Cannot unwrap None."

let fromOption def mx = match mx with Some x -> x | None -> def

let option def f mx = match mx with Some x -> f x | None -> def

let listToOption xs = match xs with x :: _ -> Some x | [] -> None

let optionToList = toList

let catOptions xs =
  List.fold_right (option Function.id (fun x xs -> x :: xs)) xs []

let mapOption f xs =
  List.fold_right
    (fun x -> x |> f |> option Function.id (fun x xs -> x :: xs))
    xs []

let ensure pred x = match pred x with true -> Some x | false -> None

let rec imapOptionAux f index xs =
  match xs with
  | [] -> []
  | x :: xs -> (
      match f index x with
      | Some y -> y :: imapOptionAux f (index + 1) xs
      | None -> imapOptionAux f (index + 1) xs )

let imapOption f xs = imapOptionAux f 0 xs

let liftDef f x = match f x with Some y -> y | None -> x

module Infix = struct
  include (
    Functor.MakeInfix (struct
      type nonrec 'a t = 'a t

      let fmap = fmap
    end) :
      Functor.Infix with type 'a t := 'a t )

  include (
    Applicative.MakeInfix (struct
      type nonrec 'a t = 'a t

      let pure x = Some x

      let fmap = ( <$> )

      let ap mf mx = match mf with Some f -> f <$> mx | None -> None
    end) :
      Applicative.Infix with type 'a t := 'a t )

  include (
    Applicative.Alternative.MakeInfix (struct
      type nonrec 'a t = 'a t

      let empty = None

      let alt mx my = match mx with None -> my | x -> x
    end) :
      Applicative.Alternative.Infix with type 'a t := 'a t )

  include (
    Monad.MakeInfix (struct
      type nonrec 'a t = 'a t

      let pure = pure

      let fmap = fmap

      let bind f mx = match mx with Some x -> f x | None -> None
    end) :
      Monad.Infix with type 'a t := 'a t )
end
