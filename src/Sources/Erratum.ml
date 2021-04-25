type t = { date : Js.Date.t; description : string }

type nonrec list = t list

module Decode = struct
  open Json.Decode

  let t json =
    {
      date = json |> field "date" date;
      description = json |> field "description" string;
    }

  let list = list t
end
