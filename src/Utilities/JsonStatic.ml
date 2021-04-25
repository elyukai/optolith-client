let raise_unknown_variant ~variant_name ~invalid =
  raise
    (Json.Decode.DecodeError
       ("Unknown variant tag of variant \"" ^ variant_name ^ "\": " ^ invalid))

type 'a make_assoc = Locale.Order.t -> (int * 'a) option Json.Decode.decoder
