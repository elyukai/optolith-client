type t = {
  id : int;
  name : string;
  items : int Ley_IntMap.t;
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

  type item = { id : int; amount : int option }

  let item json =
    Json_Decode_Strict.
      {
        id = json |> field "id" int;
        amount = json |> optionalField "amount" int;
      }

  let item_to_pair { id; amount } = (id, amount)

  type multilingual = {
    id : int;
    items : item list;
    src : PublicationRef.Decode.multilingual list;
    translations : Translation.t Json_Decode_TranslationMap.partial;
  }

  let multilingual decodeTranslations json =
    Json.Decode.
      {
        id = json |> field "id" int;
        items = json |> field "items" (list item);
        src = json |> field "src" PublicationRef.Decode.multilingualList;
        translations = json |> field "translations" decodeTranslations;
      }

  let make langs (multilingual : multilingual) (translation : Translation.t) =
    Some
      {
        id = multilingual.id;
        name = translation.name;
        items =
          multilingual.items |> Ley_List.map item_to_pair |> Ley_IntMap.fromList
          |> Ley_IntMap.map (Ley_Option.fromOption 1);
        src =
          PublicationRef.Decode.resolveTranslationsList langs multilingual.src;
        errata = translation.errata |> Ley_Option.fromOption [];
      }

  module Accessors = struct
    let id (x : t) = x.id

    let translations x = x.translations
  end
end)
