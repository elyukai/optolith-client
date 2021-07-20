type page = Single of int | Range of int * int

type t = { id : int; occurrences : page list }

module Decode = struct
  open Decoders_bs.Decode

  type translation = page list

  let translation =
    let range =
      field "firstPage" int
      >>= fun first ->
      field_opt "lastPage" int
      >>= fun maybeLast ->
      Option.fold ~none:(Single first)
        ~some:(fun last -> Range (first, last))
        maybeLast
      |> succeed
    in
    ListX.Decode.one_or_many range

  type multilingual = { id : int; occurrences : translation TranslationMap.t }

  let multilingual =
    field "id" int
    >>= fun id ->
    field "occurrences" (TranslationMap.Decode.t translation)
    >>= fun occurrences -> succeed ({ id; occurrences } : multilingual)

  let make locale_order =
    let open Option.Infix in
    multilingual
    >|= fun multilingual ->
    multilingual.occurrences
    |> TranslationMap.preferred locale_order
    <&> fun translation : t ->
    { id = multilingual.id; occurrences = translation }

  let make_list locale_order = list (make locale_order) >|= Option.catOptions
end

type nonrec list = t list
