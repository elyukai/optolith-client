type 'a t = NonEmpty of 'a * 'a list

let make x xs = NonEmpty (x, xs)

include (
  Functor.Make (struct
    type nonrec 'a t = 'a t

    let fmap f xs =
      match xs with NonEmpty (x, xs) -> make (f x) (List.map f xs)
  end) :
    Functor.T with type 'a t := 'a t )

let length = function NonEmpty (_, tl) -> List.length tl + 1

let head = function NonEmpty (hd, _) -> hd

let tail = function NonEmpty (_, tl) -> tl

let last = function
  | NonEmpty (hd, tl) -> if ListX.null tl then hd else ListX.last tl

let init = function
  | NonEmpty (hd, tl) -> hd :: (if ListX.null tl then [] else ListX.init tl)

let cons x = function NonEmpty (hd, tl) -> NonEmpty (x, hd :: tl)

let uncons = function
  | NonEmpty (hd, tl) -> (
      (hd, match tl with [] -> None | x :: xs -> Some (NonEmpty (x, xs))) )

let to_list (NonEmpty (hd, tl)) = hd :: tl

let from_list = function [] -> None | hd :: tl -> Some (NonEmpty (hd, tl))

module Decode = struct
  let t_safe decoder json = json |> Json.Decode.list decoder |> from_list

  let t decoder json =
    json |> t_safe decoder |> function
    | None ->
        raise
          (Json.Decode.DecodeError
             "Non-empty list cannot be created from empty list")
    | Some xs -> xs

  let one_or_many decoder =
    Json.Decode.oneOf
      [ decoder |> Json.Decode.map (Function.flip make []); t decoder ]

  let one_or_many_safe decoder =
    Json.Decode.oneOf
      [
        decoder
        |> Json.Decode.map (Function.flip make [])
        |> Json.Decode.map Option.pure;
        t_safe decoder;
      ]
end
