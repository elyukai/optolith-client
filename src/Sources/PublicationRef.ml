type page = Single of int | Range of int * int

type t = { id : int; occurrences : page list }

module Decode = struct
  open Json.Decode
  open JsonStrict

  type translation = page list

  let translation json =
    let range json =
      let first = json |> field "firstPage" int in
      let maybeLast = json |> optionalField "lastPage" int in
      Option.fold ~none:(Single first)
        ~some:(fun last -> Range (first, last))
        maybeLast
    in
    ListX.Decode.one_or_many range json

  type multilingual = { id : int; occurrences : translation TranslationMap.t }

  let multilingual json : multilingual =
    {
      id = json |> field "id" int;
      occurrences =
        json |> field "occurrences" (TranslationMap.Decode.t translation);
    }

  let make locale_order json =
    let open Option.Infix in
    json |> multilingual
    |> fun multilingual ->
    multilingual.occurrences
    |> TranslationMap.preferred locale_order
    <&> fun translation : t ->
    { id = multilingual.id; occurrences = translation }

  let make_list locale_order json =
    list (make locale_order) json |> Option.catOptions
end

type nonrec list = t list
