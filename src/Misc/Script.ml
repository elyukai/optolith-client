type t = {
  id : int;
  name : string;
  apValue : int;
  languages : int list;
  continent : int;
  isExtinct : bool;
  src : PublicationRef.list;
  errata : Erratum.list;
}

module Decode = Json_Decode_Static.Make (struct
  type nonrec t = t

  module Translation = struct
    type t = { name : string; errata : Erratum.list option }

    let t json =
      Json_Decode_Strict.
        {
          name = json |> field "name" string;
          errata = json |> optionalField "errata" Erratum.Decode.list;
        }

    let pred _ = true
  end

  type multilingual = {
    id : int;
    apValue : int;
    languages : int list;
    continent : int;
    isExtinct : bool;
    src : PublicationRef.Decode.multilingual list;
    translations : Translation.t Json_Decode_TranslationMap.partial;
  }

  let multilingual decodeTranslations json =
    Json.Decode.
      {
        id = json |> field "id" int;
        apValue = json |> field "apValue" int;
        languages = json |> field "languages" (list int);
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
        apValue = multilingual.apValue;
        languages = multilingual.languages;
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
