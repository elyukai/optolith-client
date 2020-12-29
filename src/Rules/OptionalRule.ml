module Static = struct
  type t = {
    id : int;
    name : string;
    description : string;
    isPrerequisite : bool;
    src : PublicationRef.list;
    errata : Erratum.list;
  }

  module Decode = Json_Decode_Static.Make (struct
    type nonrec t = t

    module Translation = struct
      type t = {
        name : string;
        description : string;
        errata : Erratum.t list option;
      }

      let t json =
        Json_Decode_Strict.
          {
            name = json |> field "name" string;
            description = json |> field "description" string;
            errata = json |> optionalField "errata" Erratum.Decode.list;
          }

      let pred _ = true
    end

    type multilingual = {
      id : int;
      isPrerequisite : bool;
      src : PublicationRef.Decode.multilingual list;
      translations : Translation.t Json_Decode_TranslationMap.partial;
    }

    let multilingual decodeTranslations json =
      let open Json.Decode in
      {
        id = json |> field "id" int;
        isPrerequisite = json |> field "isPrerequisite" bool;
        src = json |> field "src" PublicationRef.Decode.multilingualList;
        translations = json |> field "translations" decodeTranslations;
      }

    let make langs (multilingual : multilingual) (translation : Translation.t) =
      Some
        {
          id = multilingual.id;
          name = translation.name;
          description = translation.description;
          isPrerequisite = multilingual.isPrerequisite;
          src =
            PublicationRef.Decode.resolveTranslationsList langs multilingual.src;
          errata = translation.errata |> Ley_Option.fromOption [];
        }

    module Accessors = struct
      let id (x : t) = x.id

      let translations x = x.translations
    end
  end)
end
