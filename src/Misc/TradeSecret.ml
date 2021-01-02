type t = {
  id : int;
  name : string;
  description : string option;
  apValue : int;
  isSecretKnowledge : bool;
  prerequisites : Prerequisite.Collection.Profession.t;
  src : PublicationRef.list;
  errata : Erratum.list;
}

module Decode = Json_Decode_Static.Make (struct
  type nonrec t = t

  module Translation = struct
    type t = {
      name : string;
      description : string option;
      errata : Erratum.list option;
    }

    let t json =
      Json_Decode_Strict.
        {
          name = json |> field "name" string;
          description = json |> optionalField "description" string;
          errata = json |> optionalField "errata" Erratum.Decode.list;
        }

    let pred _ = true
  end

  type multilingual = {
    id : int;
    apValue : int;
    isSecretKnowledge : bool;
    prerequisites :
      Prerequisite.Collection.Profession.Decode.multilingual option;
    src : PublicationRef.Decode.multilingual list;
    translations : Translation.t Json_Decode_TranslationMap.partial;
  }

  let multilingual decodeTranslations json =
    Json_Decode_Strict.
      {
        id = json |> field "id" int;
        apValue = json |> field "apValue" int;
        isSecretKnowledge = json |> field "isSecretKnowledge" bool;
        prerequisites =
          json
          |> optionalField "prerequisites"
               Prerequisite.Collection.Profession.Decode.multilingual;
        src = json |> field "src" PublicationRef.Decode.multilingualList;
        translations = json |> field "translations" decodeTranslations;
      }

  let make langs (multilingual : multilingual) (translation : Translation.t) =
    Some
      {
        id = multilingual.id;
        name = translation.name;
        description = translation.description;
        apValue = multilingual.apValue;
        isSecretKnowledge = multilingual.isSecretKnowledge;
        prerequisites =
          multilingual.prerequisites
          |> Ley_Option.option []
               (Prerequisite.Collection.Profession.Decode.resolveTranslations
                  langs);
        src =
          PublicationRef.Decode.resolveTranslationsList langs multilingual.src;
        errata = translation.errata |> Ley_Option.fromOption [];
      }

  module Accessors = struct
    let id (x : t) = x.id

    let translations x = x.translations
  end
end)
