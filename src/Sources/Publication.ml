type t = {
  id : int;
  name : string;
  nameAbbr : string;
  isCore : bool;
  isAdultContent : bool;
}

module Decode = Json_Decode_Static.Make (struct
  type nonrec t = t

  module Translation = struct
    type t = {
      name : string;
      nameAbbr : string;
      isMissingImplementation : bool option;
    }

    let t json =
      Json_Decode_Strict.
        {
          name = json |> field "name" string;
          nameAbbr = json |> field "nameAbbr" string;
          isMissingImplementation =
            json |> optionalField "isMissingImplementation" bool;
        }

    let pred { isMissingImplementation; _ } =
      Ley_Option.dis isMissingImplementation
  end

  type multilingual = {
    id : int;
    isCore : bool;
    isAdultContent : bool;
    isMissingImplementation : bool option;
    translations : Translation.t Json_Decode_TranslationMap.partial;
  }

  let multilingual decodeTranslations json =
    Json_Decode_Strict.
      {
        id = json |> field "id" int;
        isCore = json |> field "isCore" bool;
        isAdultContent = json |> field "isAdultContent" bool;
        isMissingImplementation =
          json |> optionalField "isMissingImplementation" bool;
        translations = json |> field "translations" decodeTranslations;
      }

  let make _ multilingual (translation : Translation.t) =
    match multilingual with
    | { isMissingImplementation = Some true; _ } -> None
    | _ ->
        Some
          {
            id = multilingual.id;
            isCore = multilingual.isCore;
            isAdultContent = multilingual.isAdultContent;
            name = translation.name;
            nameAbbr = translation.nameAbbr;
          }

  module Accessors = struct
    let id (x : t) = x.id

    let translations x = x.translations
  end
end)
