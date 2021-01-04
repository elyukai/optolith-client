type t = { id : int; name : string; check : Check.t }

module Decode = struct
  include Json_Decode_Static.Make (struct
    type nonrec t = t

    module Translation = struct
      type t = { name : string }

      let t json = Json.Decode.{ name = json |> field "name" string }

      let pred _ = true
    end

    type multilingual = {
      id : int;
      check : Check.t;
      translations : Translation.t Json_Decode_TranslationMap.partial;
    }

    let multilingual decodeTranslations json =
      Json.Decode.
        {
          id = json |> field "id" int;
          check = json |> field "check" Check.Decode.t;
          translations = json |> field "translations" decodeTranslations;
        }

    let make _ (multilingual : multilingual) (translation : Translation.t) =
      Some
        {
          id = multilingual.id;
          name = translation.name;
          check = multilingual.check;
        }

    module Accessors = struct
      let id (x : t) = x.id

      let translations x = x.translations
    end
  end)
end
