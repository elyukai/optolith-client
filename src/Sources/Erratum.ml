type t = { date : Js.Date.t; description : string }

type nonrec list = t list

module Decode = struct
  let t json =
    Json.Decode.
      {
        date = json |> field "date" date;
        description = json |> field "description" string;
      }

  let list = Json.Decode.list t
end
