open Js.Promise

type nonrec 'a t = 'a t

let rec traverse f = function
  | [] -> resolve []
  | x :: xs ->
      x |> f
      |> then_ (fun x' ->
             traverse f xs |> then_ (fun xs' -> x' :: xs' |> resolve))

let traversei f xs =
  let rec aux i = function
    | [] -> resolve []
    | x :: xs ->
        x |> f i
        |> then_ (fun x' ->
               aux (i + 1) xs |> then_ (fun xs' -> x' :: xs' |> resolve))
  in
  aux 0 xs

module Infix = struct
  include (
    Functor.MakeInfix (struct
      type nonrec 'a t = 'a t

      let fmap f x = x |> then_ (fun x' -> x' |> f |> resolve)
    end) :
      Functor.Infix with type 'a t := 'a t)

  include (
    Monad.MakeInfix (struct
      type nonrec 'a t = 'a t

      let pure = resolve

      let fmap = ( <$> )

      let bind f x = x |> then_ f
    end) :
      Monad.Infix with type 'a t := 'a t)
end
