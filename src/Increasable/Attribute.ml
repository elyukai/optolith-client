module Static = struct
  type t = { id : int; name : string; nameAbbr : string }

  module Decode = Json_Decode_Static.Make (struct
    type nonrec t = t

    module Translation = struct
      type t = { name : string; nameAbbr : string }

      let t json =
        Json.Decode.
          {
            name = json |> field "name" string;
            nameAbbr = json |> field "nameAbbr" string;
          }

      let pred _ = true
    end

    type multilingual = {
      id : int;
      translations : Translation.t Json_Decode_TranslationMap.partial;
    }

    let multilingual decodeTranslations json =
      Json.Decode.
        {
          id = json |> field "id" int;
          translations = json |> field "translations" decodeTranslations;
        }

    let make _ (x : multilingual) (translation : Translation.t) =
      Some
        { id = x.id; name = translation.name; nameAbbr = translation.nameAbbr }

    module Accessors = struct
      let id (x : t) = x.id

      let translations multilingual = multilingual.translations
    end
  end)
end

module Dynamic = Increasable.Dynamic.Make (struct
  type static = Static.t

  let min_value = 8
end)
