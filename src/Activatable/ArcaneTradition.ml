type t = {
  id : int;
  name : string;
  prerequisites : Prerequisite.Collection.ArcaneTradition.t;
}

module Decode = Json_Decode_Static.Make (struct
  type nonrec t = t

  module Translation = struct
    type t = { name : string }

    let t json = Json_Decode_Strict.{ name = json |> field "name" string }

    let pred _ = true
  end

  type multilingual = {
    id : int;
    prerequisites : Prerequisite.Collection.ArcaneTradition.Decode.multilingual;
    translations : Translation.t Json_Decode_TranslationMap.partial;
  }

  let multilingual decodeTranslations json =
    Json.Decode.
      {
        id = json |> field "id" int;
        prerequisites =
          json
          |> field "prerequisites"
               Prerequisite.Collection.ArcaneTradition.Decode.multilingual;
        translations = json |> field "translations" decodeTranslations;
      }

  let make langs (multilingual : multilingual) (translation : Translation.t) =
    Some
      {
        id = multilingual.id;
        name = translation.name;
        prerequisites =
          Prerequisite.Collection.ArcaneTradition.Decode.resolveTranslations
            langs multilingual.prerequisites;
      }

  module Accessors = struct
    let id (x : t) = x.id

    let translations x = x.translations
  end
end)
