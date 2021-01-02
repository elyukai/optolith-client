module F = Ley_Function
module O = Ley_Option
module L = Ley_List
module IM = Ley_IntMap

module Static = struct
  module Application = struct
    type t = {
      id : int;
      name : string;
      prerequisite : Prerequisite.Activatable.t option;
    }

    module Decode = struct
      include Json_Decode_Static.Nested.Make (struct
        type nonrec t = t

        module Translation = struct
          type t = { name : string }

          let t json = Json.Decode.{ name = json |> field "name" string }

          let pred _ = true
        end

        type multilingual = {
          id : int;
          prerequisite : Prerequisite.Activatable.t option;
          translations : Translation.t Json_Decode_TranslationMap.partial;
        }

        let multilingual decodeTranslations json =
          Json_Decode_Strict.
            {
              id = json |> field "id" int;
              prerequisite =
                json
                |> optionalField "prerequisite"
                     Prerequisite.Activatable.Decode.t;
              translations = json |> field "translations" decodeTranslations;
            }

        let make _ (multilingual : multilingual) (translation : Translation.t) =
          Some
            {
              id = multilingual.id;
              name = translation.name;
              prerequisite = multilingual.prerequisite;
            }

        module Accessors = struct
          let id (x : t) = x.id

          let translations x = x.translations
        end
      end)

      let makeMap langs applications =
        (* Insert a value into a map only if it is a Some *)
        let insertMaybe key x =
          O.option F.id (fun a -> IM.insert (key a) a) x
        in
        let makeAndInsert x =
          x |> resolveTranslations langs |> insertMaybe (fun a -> a.id)
        in
        let foldlIntoMap xs = L.foldl' makeAndInsert xs IM.empty in
        O.option IM.empty foldlIntoMap applications
    end
  end

  module Use = struct
    type t = {
      id : int;
      name : string;
      prerequisite : Prerequisite.Activatable.t;
    }

    module Decode = struct
      include Json_Decode_Static.Nested.Make (struct
        type nonrec t = t

        module Translation = struct
          type t = { name : string }

          let t json = Json.Decode.{ name = json |> field "name" string }

          let pred _ = true
        end

        type multilingual = {
          id : int;
          prerequisite : Prerequisite.Activatable.t;
          translations : Translation.t Json_Decode_TranslationMap.partial;
        }

        let multilingual decodeTranslations json =
          Json.Decode.
            {
              id = json |> field "id" int;
              prerequisite =
                json |> field "prerequisite" Prerequisite.Activatable.Decode.t;
              translations = json |> field "translations" decodeTranslations;
            }

        let make _ (multilingual : multilingual) (translation : Translation.t) =
          Some
            {
              id = multilingual.id;
              name = translation.name;
              prerequisite = multilingual.prerequisite;
            }

        module Accessors = struct
          let id (x : t) = x.id

          let translations x = x.translations
        end
      end)

      let makeMap langs uses =
        (* Insert a value into a map only if it is a Some *)
        let insertMaybe key x =
          O.option F.id (fun a -> IM.insert (key a) a) x
        in
        let makeAndInsert x =
          x |> resolveTranslations langs |> insertMaybe (fun a -> a.id)
        in
        let foldlIntoMap xs = L.foldl' makeAndInsert xs IM.empty in
        O.option IM.empty foldlIntoMap uses
    end
  end

  type encumbrance = True | False | Maybe of string option

  type t = {
    id : int;
    name : string;
    check : Check.t;
    encumbrance : encumbrance;
    gr : int;
    ic : IC.t;
    applications : Application.t Ley_IntMap.t;
    applicationsInput : string option;
    uses : Use.t Ley_IntMap.t;
    tools : string option;
    quality : string;
    failed : string;
    critical : string;
    botch : string;
    src : PublicationRef.list;
    errata : Erratum.list;
  }

  module Decode = Json_Decode_Static.Make (struct
    type nonrec t = t

    module Translation = struct
      type t = {
        name : string;
        applicationsInput : string option;
        encDescription : string option;
        tools : string option;
        quality : string;
        failed : string;
        critical : string;
        botch : string;
        errata : Erratum.list option;
      }

      let t json =
        Json_Decode_Strict.
          {
            name = json |> field "name" string;
            applicationsInput = json |> optionalField "applicationsInput" string;
            encDescription = json |> optionalField "encDescription" string;
            tools = json |> optionalField "tools" string;
            quality = json |> field "quality" string;
            failed = json |> field "failed" string;
            critical = json |> field "critical" string;
            botch = json |> field "botch" string;
            errata = json |> optionalField "errata" Erratum.Decode.list;
          }

      let pred _ = true
    end

    type encumbranceUniv = True | False | Maybe

    let encumbranceUniv =
      Json.Decode.(
        string
        |> map (function
             | "true" -> (True : encumbranceUniv)
             | "false" -> (False : encumbranceUniv)
             | "maybe" -> (Maybe : encumbranceUniv)
             | str -> raise (DecodeError ("Unknown encumbrance: " ^ str))))

    type multilingual = {
      id : int;
      check : Check.t;
      applications : Application.Decode.multilingual list option;
      uses : Use.Decode.multilingual list option;
      ic : IC.t;
      enc : encumbranceUniv;
      gr : int;
      src : PublicationRef.Decode.multilingual list;
      translations : Translation.t Json_Decode_TranslationMap.partial;
    }

    let multilingual decodeTranslations json =
      Json_Decode_Strict.
        {
          id = json |> field "id" int;
          applications =
            json
            |> optionalField "applications"
                 (list Application.Decode.multilingual);
          uses = json |> optionalField "uses" (list Use.Decode.multilingual);
          check = json |> field "check" Check.Decode.t;
          ic = json |> field "ic" IC.Decode.t;
          enc = json |> field "enc" encumbranceUniv;
          gr = json |> field "gr" int;
          src = json |> field "src" PublicationRef.Decode.multilingualList;
          translations = json |> field "translations" decodeTranslations;
        }

    let make langs (multilingual : multilingual) (translation : Translation.t) =
      Some
        {
          id = multilingual.id;
          name = translation.name;
          check = multilingual.check;
          encumbrance =
            ( match multilingual.enc with
            | True -> True
            | False -> False
            | Maybe -> Maybe translation.encDescription );
          applications =
            Application.Decode.makeMap langs multilingual.applications;
          applicationsInput = translation.applicationsInput;
          uses = Use.Decode.makeMap langs multilingual.uses;
          ic = multilingual.ic;
          gr = multilingual.gr;
          tools = translation.tools;
          quality = translation.quality;
          failed = translation.failed;
          critical = translation.critical;
          botch = translation.botch;
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

module Dynamic = Increasable.Dynamic.Make (struct
  type static = Static.t

  let minValue = 0
end)

module Group = struct
  type t = { id : int; check : Check.t; name : string; fullName : string }

  module Decode = Json_Decode_Static.Make (struct
    type nonrec t = t

    module Translation = struct
      type t = { name : string; fullName : string }

      let t json =
        Json.Decode.
          {
            name = json |> field "name" string;
            fullName = json |> field "fullName" string;
          }

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
          check = multilingual.check;
          name = translation.name;
          fullName = translation.fullName;
        }

    module Accessors = struct
      let id (x : t) = x.id

      let translations x = x.translations
    end
  end)
end
