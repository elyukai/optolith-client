module Static = struct
  type t = {
    id : int;
    name : string;
    types : string Ley_IntMap.t;
    domains : string Ley_IntMap.t;
    src : PublicationRef.list;
    errata : Erratum.list;
  }

  module Decode = struct
    module Type = Json_Decode_Static.Nested.Make (struct
      type t = int * string

      module Translation = struct
        type t = { name : string }

        let t json = Json.Decode.{ name = json |> field "name" string }

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

    module Domain = Json_Decode_Static.Nested.Make (struct
      type t = int * string

      module Translation = struct
        type t = { name : string }

        let t json = Json.Decode.{ name = json |> field "name" string }

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

    include Json_Decode_Static.Make (struct
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
        types : Type.multilingual list;
        domains : Domain.multilingual list;
        src : PublicationRef.Decode.multilingual list;
        translations : Translation.t Json_Decode_TranslationMap.partial;
      }

      let multilingual decodeTranslations json =
        Json.Decode.
          {
            id = json |> field "id" int;
            types = json |> field "types" (list Type.multilingual);
            domains = json |> field "domains" (list Domain.multilingual);
            src = json |> field "src" PublicationRef.Decode.multilingualList;
            translations = json |> field "translations" decodeTranslations;
          }

      let make langs (multilingual : multilingual) (translation : Translation.t)
          =
        Some
          {
            id = multilingual.id;
            name = translation.name;
            types =
              multilingual.types
              |> Ley_Option.mapOption (Type.resolveTranslations langs)
              |> Ley_IntMap.fromList;
            domains =
              multilingual.domains
              |> Ley_Option.mapOption (Domain.resolveTranslations langs)
              |> Ley_IntMap.fromList;
            src =
              PublicationRef.Decode.resolveTranslationsList langs
                multilingual.src;
            errata = translation.errata |> Ley_Option.fromOption [];
          }

      module Accessors = struct
        let id (x : t) = x.id

        let translations x = x.translations
      end
    end)
  end
end

module Dynamic = struct
  type domain = Predefined of int | Custom of string

  type t = {
    category : int;
    level : int;
    type_ : int;
    domain : domain;
    name : string;
  }

  let is_domain_valid pact =
    match pact.domain with
    | Predefined domain -> domain > 0
    | Custom domain -> String.length domain > 0

  let is_name_valid pact = pact.category == 2 || String.length pact.name > 0

  let is_archdemonic_domain pact =
    match pact.domain with
    | Predefined domain -> domain < 13
    | Custom _ -> false

  let is_free_demon_domain pact =
    match pact.domain with
    | Predefined domain -> domain >= 13
    | Custom _ -> false

  let is_type_valid pact =
    pact.category == 1
    || pact.category == 2
       && ( (is_archdemonic_domain pact && pact.type_ == 1)
          || (is_free_demon_domain pact && pact.type_ == 2) )

  let is_valid pact =
    is_domain_valid pact && is_name_valid pact && is_type_valid pact
end
