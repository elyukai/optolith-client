type 'a partial = Js.Json.t Js.Dict.t

module type EntityTranslation = sig
  type t

  val t : t Json.Decode.decoder

  val pred : t -> bool
end

module Make (E : EntityTranslation) = struct
  type t = E.t partial

  let t = Json.Decode.(dict id)

  let getFromLanguageOrder langs (x : t) =
    langs |> Locale.toList
    |> Ley_List.foldl
         (fun acc lang ->
           Ley_Option.Infix.(
             acc <|> (Js.Dict.get x lang <&> E.t) >>= Ley_Option.ensure E.pred))
         None
end
