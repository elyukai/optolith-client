type page = Single of int | Range of int * int

type t = { id : int; occurrences : page list }

module Decode = struct
  include Json_Decode_Static.Nested.Make (struct
    type nonrec t = t

    module Translation = struct
      type t = page list

      let t =
        Json_Decode_Strict.(
          OneOrMany.Decode.t (fun json ->
              let first = json |> field "firstPage" int in
              let maybeLast = json |> optionalField "lastPage" int in
              Ley_Option.option (Single first)
                (fun last -> Range (first, last))
                maybeLast)
          |> map OneOrMany.to_list)

      let pred _ = true
    end

    type multilingual = {
      id : int;
      occurrences : Translation.t Json_Decode_TranslationMap.partial;
    }

    let multilingual decodeTranslations json : multilingual =
      Json.Decode.
        {
          id = json |> field "id" int;
          occurrences = json |> field "occurrences" decodeTranslations;
        }

    let make _ (multilingual : multilingual) translation =
      Some ({ id = multilingual.id; occurrences = translation } : t)

    module Accessors = struct
      let id (x : t) = x.id

      let translations (x : multilingual) = x.occurrences
    end
  end)

  let multilingualList = Json.Decode.list multilingual

  let resolveTranslationsList langs xs =
    xs |> Ley_Option.mapOption (resolveTranslations langs)
end

type nonrec list = t list
