type 'a t = 'a * 'a list

(* Construction *)

let from_list = function [] -> None | head :: tail -> Some (head, tail)

let to_list (head, tail) = head :: tail

module Decode = struct
  let t decoder =
    Json.Decode.(
      list decoder
      |> map (function
           | [] ->
               raise
                 (DecodeError
                    "Expected a non-empty list but the list was empty.")
           | head :: tail -> (head, tail)))

  let one_or_many decoder =
    Json.Decode.(oneOf [ decoder |> map (fun x -> (x, [])); t decoder ])
end
