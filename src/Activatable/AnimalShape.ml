type t = { id : int; name : string; path : int; size : int }

module Decode = Json_Decode_Static.Make (struct
  type nonrec t = t

  module Translation = struct
    type t = { name : string }

    let t json = Json.Decode.{ name = json |> field "name" string }

    let pred _ = true
  end

  type multilingual = {
    id : int;
    path : int;
    size : int;
    translations : Translation.t Json_Decode_TranslationMap.partial;
  }

  let multilingual decodeTranslations json =
    Json.Decode.
      {
        id = json |> field "id" int;
        path = json |> field "path" int;
        size = json |> field "size" int;
        translations = json |> field "translations" decodeTranslations;
      }

  let make _ (multilingual : multilingual) (translation : Translation.t) =
    Some
      {
        id = multilingual.id;
        name = translation.name;
        path = multilingual.path;
        size = multilingual.size;
      }

  module Accessors = struct
    let id (x : t) = x.id

    let translations x = x.translations
  end
end)

module Size = struct
  type t = { id : int; volume : int; apValue : int }

  module Decode = struct
    let t json =
      Some
        Json.Decode.
          {
            id = json |> field "id" int;
            volume = json |> field "volume" int;
            apValue = json |> field "apValue" int;
          }

    let toAssoc (x : t) = (x.id, x)

    let assoc (_ : Locale.Order.t) json =
      Ley_Option.Infix.(json |> t <&> toAssoc)
  end
end
