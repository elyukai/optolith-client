type 'a t = { id : 'a; value : int }

module Decode = struct
  let t decoder json =
    Json.Decode.
      { id = json |> field "id" decoder; value = json |> field "value" int }

  let to_assoc { id : int; value } = (id, value)

  let assoc json = json |> t Json.Decode.int |> to_assoc
end
