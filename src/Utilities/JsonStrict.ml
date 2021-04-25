open Json.Decode

external _stringify : Js.Json.t -> string = "JSON.stringify" [@@bs.val]

let optionalField key decode json =
  if
    Js.typeof json == "object"
    && (not (Js.Array.isArray json))
    && not ((Obj.magic json : 'a Js.null) == Js.null)
  then
    let dict : Js.Json.t Js.Dict.t = Obj.magic json in
    match Js.Dict.get dict key with
    | None -> None
    | Some value -> (
        try Some (decode value)
        with DecodeError msg ->
          raise (DecodeError (msg ^ "\n\tat field '" ^ key ^ "'")) )
  else raise (DecodeError ("Expected object, got " ^ _stringify json))
