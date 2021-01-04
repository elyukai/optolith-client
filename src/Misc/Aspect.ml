type t = { id : int; name : string; masterOfAspectSuffix : string option }

module Decode = struct
  include Json_Decode_Static.Make (struct
    type nonrec t = t

    module Translation = struct
      type t = { name : string; masterOfAspectSuffix : string option }

      let t json =
        Json_Decode_Strict.
          {
            name = json |> field "name" string;
            masterOfAspectSuffix =
              json |> optionalField "masterOfAspectSuffix" string;
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

    let make _ (multilingual : multilingual) (translation : Translation.t) =
      Some
        {
          id = multilingual.id;
          name = translation.name;
          masterOfAspectSuffix = translation.masterOfAspectSuffix;
        }

    module Accessors = struct
      let id (x : t) = x.id

      let translations x = x.translations
    end
  end)
end
