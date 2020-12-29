type 'a t = One of 'a | Many of 'a list

let to_list t = match t with One x -> [ x ] | Many xs -> xs

module Decode = struct
  let t decoder =
    Json.Decode.(
      oneOf
        [
          decoder |> map (fun x -> One x); list decoder |> map (fun x -> Many x);
        ])
end
