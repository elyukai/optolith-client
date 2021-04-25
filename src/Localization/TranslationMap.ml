type 'a t = 'a Js.Dict.t

let preferred localeOrder (x : 'a t) =
  localeOrder |> Locale.Order.to_list
  |> List.fold_left
       (fun acc lang -> Option.Infix.(acc <|> Js.Dict.get x lang))
       None

module Decode = struct
  let t = Json.Decode.dict

  let t_opt decoder json =
    t decoder json |> Js.Dict.entries |> Array.to_list
    |> Option.mapOption (function
         | key, Some x -> Some (key, x)
         | _, None -> None)
    |> Js.Dict.fromList
end
