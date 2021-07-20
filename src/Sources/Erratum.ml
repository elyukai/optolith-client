type t = { date : Js.Date.t; description : string }

type nonrec list = t list

module Decode = struct
  open Decoders_bs.Decode

  let date =
    string
    >>= fun str ->
    try succeed (Js.Date.fromString str)
    with _ -> fail "Expected an RFC 2822 or ISO 8601 date string"

  let t =
    field "date" date
    >>= fun date ->
    field "description" string
    >>= fun description -> succeed { date; description }

  let list = list t
end
