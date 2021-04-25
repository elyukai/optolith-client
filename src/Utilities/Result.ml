type ('a, 'e) t = ('a, 'e) result

module Extra = struct
  let fromError def x = match x with Error l -> l | Ok _ -> def

  let fromOk def x = match x with Error _ -> def | Ok r -> r

  let fromResult x = match x with Error l -> l | Ok r -> r

  let fromError' x =
    match x with
    | Error l -> l
    | Ok _ -> invalid_arg "fromError': Cannot extract a Error value out of a Ok"

  let fromOk' x =
    match x with
    | Error _ -> invalid_arg "fromOk': Cannot extract a Ok value out of a Error"
    | Ok r -> r

  let resultToOption x = match x with Error _ -> None | Ok r -> Some r

  let optionToResult error x =
    match x with None -> Error error | Some r -> Ok r

  let optionToResult' error x =
    match x with None -> Error (error ()) | Some r -> Ok r
end

include (
  Bifunctor.Make (struct
    type nonrec ('a, 'e) t = ('a, 'e) t

    let bimap fOk fError mx =
      match mx with Error l -> Error (fError l) | Ok r -> Ok (fOk r)
  end) :
    Bifunctor.T with type ('a, 'e) t := ('a, 'e) t )

module type Error = sig
  type t
end

module WithError (E : Error) = struct
  include (
    Functor.Make (struct
      type nonrec 'a t = ('a, E.t) t

      let fmap f mx = match mx with Error e -> Error e | Ok x -> Ok (f x)
    end) :
      Functor.T with type 'a t := ('a, E.t) t )

  include (
    Applicative.Make (struct
      type nonrec 'a t = ('a, E.t) t

      let pure x = Ok x

      let fmap = fmap

      let ap mf mx = match mf with Ok f -> fmap f mx | Error e -> Error e
    end) :
      Applicative.T with type 'a t := ('a, E.t) t )

  include (
    Monad.Make (struct
      type nonrec 'a t = ('a, E.t) t

      let pure = pure

      let fmap = fmap

      let bind f mx = match mx with Ok x -> f x | Error e -> Error e
    end) :
      Monad.T with type 'a t := ('a, E.t) t )

  include (
    Foldable.Make (struct
      type nonrec 'a t = ('a, E.t) t

      let foldr f init mx = match mx with Ok x -> f x init | Error _ -> init

      let foldl f init mx = match mx with Ok x -> f init x | Error _ -> init

      let equal = ( == )
    end) :
      Foldable.T with type 'a t := ('a, E.t) t )
end

let result fOk fError x = match x with Error l -> fError l | Ok r -> fOk r

let errors xs =
  List.fold_right
    (fun x acc -> match x with Error e -> e :: acc | Ok _ -> acc)
    xs []

let oks xs =
  List.fold_right
    (fun x acc -> match x with Error _ -> acc | Ok x -> x :: acc)
    xs []

let partitionResults xs =
  List.fold_right
    (fun x (oks, errors) ->
      match x with Error e -> (oks, e :: errors) | Ok x -> (x :: oks, errors))
    xs ([], [])

let swap = function Ok x -> Error x | Error x -> Ok x
