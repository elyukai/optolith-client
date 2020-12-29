type t = {
  id : int;
  name : string;
  maxLevel : int option;
  specializations : string Ley_IntMap.t;
  specializationInput : string option;
  continent : int;
  isExtinct : bool;
  src : PublicationRef.list;
  errata : Erratum.list;
}

module Decode = struct
  module Specialization = struct
    include Json_Decode_Static.Nested.Make (struct
      type t = int * string

      module Translation = struct
        type t = { name : string }

        let t json = Json_Decode_Strict.{ name = json |> field "name" string }

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
        Some (multilingual.id, translation.name)

      module Accessors = struct
        let id ((id, _) : t) = id

        let translations x = x.translations
      end
    end)
  end

  include Json_Decode_Static.Make (struct
    type nonrec t = t

    module Translation = struct
      type t = {
        name : string;
        specializationInput : string option;
        errata : Erratum.list option;
      }

      let t json =
        Json_Decode_Strict.
          {
            name = json |> field "name" string;
            specializationInput = json |> optionalField "description" string;
            errata = json |> optionalField "errata" Erratum.Decode.list;
          }

      let pred _ = true
    end

    type multilingual = {
      id : int;
      maxLevel : int option;
      specializations : Specialization.multilingual list option;
      continent : int;
      isExtinct : bool;
      src : PublicationRef.Decode.multilingual list;
      translations : Translation.t Json_Decode_TranslationMap.partial;
    }

    let multilingual decodeTranslations json =
      Json_Decode_Strict.
        {
          id = json |> field "id" int;
          maxLevel = json |> optionalField "maxLevel" int;
          specializations =
            json
            |> optionalField "specializations"
                 (list Specialization.multilingual);
          continent = json |> field "continent" int;
          isExtinct = json |> field "isExtinct" bool;
          src = json |> field "src" PublicationRef.Decode.multilingualList;
          translations = json |> field "translations" decodeTranslations;
        }

    let make langs (multilingual : multilingual) (translation : Translation.t) =
      Some
        {
          id = multilingual.id;
          name = translation.name;
          maxLevel = multilingual.maxLevel;
          specializations =
            multilingual.specializations
            |> Ley_Option.option []
                 (Ley_Option.mapOption
                    (Specialization.resolveTranslations langs))
            |> Ley_IntMap.fromList;
          specializationInput = translation.specializationInput;
          continent = multilingual.continent;
          isExtinct = multilingual.isExtinct;
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
