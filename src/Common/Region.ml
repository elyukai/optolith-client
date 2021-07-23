type t = { id : Id.Region.t; name : string }

module Decode = struct
  open Decoders_bs.Decode

  type translation = { name : string }

  let translation = field "name" string >>= fun name -> succeed { name }

  type multilingual = {
    id : Id.Region.t;
    translations : translation TranslationMap.t;
  }

  let multilingual =
    field "id" Id.Region.Decode.t
    >>= fun id ->
    field "translations" (TranslationMap.Decode.t translation)
    >>= fun translations -> succeed { id; translations }

  let make_assoc locale_order =
    let open Option.Infix in
    multilingual
    >|= fun multilingual ->
    multilingual.translations
    |> TranslationMap.preferred locale_order
    <&> fun translation ->
    (multilingual.id, { id = multilingual.id; name = translation.name })
end
