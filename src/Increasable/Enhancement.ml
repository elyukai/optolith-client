type t = {
  id : int;
  name : string;
  level : int;
  effect : string;
  prerequisite : int option;
      (** The enhancement requires another enhancement. *)
  src : PublicationRef.list;
  errata : Erratum.list;
}

module Decode = Json_Decode_Static.Nested.Make (struct
  type nonrec t = t

  module Translation = struct
    type t = { name : string; effect : string; errata : Erratum.list option }

    let t json =
      Json_Decode_Strict.
        {
          name = json |> field "name" string;
          effect = json |> field "effect" string;
          errata = json |> optionalField "errata" Erratum.Decode.list;
        }

    let pred _ = true
  end

  type multilingual = {
    id : int;
    level : int;
    prerequisite : int option;
    src : PublicationRef.Decode.multilingual list;
    translations : Translation.t Json_Decode_TranslationMap.partial;
  }

  let multilingual decodeTranslations json =
    Json_Decode_Strict.
      {
        id = json |> field "id" int;
        level = json |> field "level" int;
        prerequisite = json |> optionalField "prerequisite" int;
        src = json |> field "src" PublicationRef.Decode.multilingualList;
        translations = json |> field "translations" decodeTranslations;
      }

  let make langs (multilingual : multilingual) (translation : Translation.t) =
    Some
      {
        id = multilingual.id;
        name = translation.name;
        level = multilingual.level;
        effect = translation.effect;
        prerequisite = multilingual.prerequisite;
        src =
          multilingual.src
          |> PublicationRef.Decode.resolveTranslationsList langs;
        errata = translation.errata |> Ley_Option.fromOption [];
      }

  module Accessors = struct
    let id (x : t) = x.id

    let translations x = x.translations
  end
end)
