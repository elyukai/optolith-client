type level = QL | Fixed of int

type use = Weapon | Ingestion | Inhalation | Contact

type category = AnimalVenom | PlantPoison | AlchemicalPoison | MineralPoison

type t = {
  id : int;
  name : string;
  level : level;
  category : category;
  uses : use list;
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

  let level =
    Json.Decode.(
      field "type" string
      |> andThen (function
           | "QL" -> fun _ -> QL
           | "Fixed" -> field "value" int |> map (fun x -> Fixed x)
           | str -> raise (DecodeError ("Unknown level type: " ^ str))))

  let category =
    Json.Decode.(
      string
      |> map (function
           | "AnimalVenom" -> AnimalVenom
           | "PlantPoison" -> PlantPoison
           | "AlchemicalPoison" -> AlchemicalPoison
           | "MineralPoison" -> MineralPoison
           | str -> raise (DecodeError ("Unknown category: " ^ str))))

  let use =
    Json.Decode.(
      string
      |> map (function
           | "Weapon" -> Weapon
           | "Ingestion" -> Ingestion
           | "Inhalation" -> Inhalation
           | "Contact" -> Contact
           | str -> raise (DecodeError ("Unknown use: " ^ str))))

  type multilingual = {
    id : int;
    level : level;
    category : category;
    uses : use list;
    src : PublicationRef.Decode.multilingual list;
    translations : Translation.t Json_Decode_TranslationMap.partial;
  }

  let multilingual decodeTranslations json =
    Json.Decode.
      {
        id = json |> field "id" int;
        level = json |> field "level" level;
        category = json |> field "type" category;
        uses = json |> field "useType" (list use);
        src = json |> field "src" PublicationRef.Decode.multilingualList;
        translations = json |> field "translations" decodeTranslations;
      }

  let make langs (multilingual : multilingual) (translation : Translation.t) =
    Some
      {
        id = multilingual.id;
        name = translation.name;
        level = multilingual.level;
        category = multilingual.category;
        uses = multilingual.uses;
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
