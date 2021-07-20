type 'a t = NonEmpty of 'a * 'a list

let one x = NonEmpty (x, [])

let make x xs = NonEmpty (x, xs)

include (
  Functor.Make (struct
    type nonrec 'a t = 'a t

    let fmap f xs =
      match xs with NonEmpty (x, xs) -> make (f x) (List.map f xs)
  end) :
    Functor.T with type 'a t := 'a t)

include (
  Foldable.Make (struct
    type nonrec 'a t = 'a t

    let foldr f initial (NonEmpty (x, xs)) = f x (List.fold_right f xs initial)

    let foldl f initial (NonEmpty (x, xs)) = List.fold_left f (f initial x) xs

    let equal = ( == )
  end) :
    Foldable.T with type 'a t := 'a t)

let at index (NonEmpty (x, xs)) =
  if index < 0 then None
  else if index == 0 then Some x
  else ListX.Safe.atMay xs (index - 1)

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
      (hd, match tl with [] -> None | x :: xs -> Some (NonEmpty (x, xs))))

let to_list (NonEmpty (hd, tl)) = hd :: tl

let from_list = function [] -> None | hd :: tl -> Some (NonEmpty (hd, tl))

let take n (NonEmpty (x, xs)) = ListX.take n (x :: xs)

module Index = struct
  let setAt index e xs =
    if index < 0 then xs
    else
      let (NonEmpty (x, xs)) = xs in
      if index == 0 then NonEmpty (e, x :: xs)
      else NonEmpty (x, ListX.Index.setAt (index - 1) e xs)

  let modifyAt index f xs =
    if index < 0 then xs
    else
      let (NonEmpty (x, xs)) = xs in
      if index == 0 then NonEmpty (f x, xs)
      else NonEmpty (x, ListX.Index.modifyAt (index - 1) f xs)

  let insertAt index e xs =
    if index < 0 then xs
    else
      let (NonEmpty (x, xs)) = xs in
      if index == 0 then NonEmpty (e, xs)
      else NonEmpty (x, ListX.Index.insertAt (index - 1) e xs)

  let imap f (NonEmpty (x, xs)) =
    let rec aux f i = function
      | [] -> []
      | x :: xs -> f i x :: aux f (i + 1) xs
    in
    NonEmpty (f 0 x, aux f 1 xs)
end

module Decode = struct
  open Decoders_bs.Decode

  let t_safe decoder = list decoder >|= from_list

  let t decoder =
    t_safe decoder
    >>= function
    | None -> fail "Non-empty list cannot be created from empty list"
    | Some xs -> succeed xs

  let one_or_many decoder =
    one_of
      [ ("Many", decoder |> map (Function.flip make [])); ("One", t decoder) ]

  let one_or_many_safe decoder =
    one_of
      [
        ("Many", decoder |> map (Function.flip make []) |> map Option.pure);
        ("One", t_safe decoder);
      ]
end
