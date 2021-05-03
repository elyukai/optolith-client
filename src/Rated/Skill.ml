module Static = struct
  type linked_activatable = {
    id : IdGroup.Activatable.t;
    options : IdGroup.SelectOption.t list;
    level : int option;
  }

  module Application = struct
    type t = {
      id : int;
      name : string;
      prerequisite : linked_activatable option;
    }

    module Decode = struct
      open Json.Decode

      type translation = { name : string }

      let translation json = { name = json |> field "name" string }

      type multilingual = {
        id : int;
        translations : translation TranslationMap.t;
      }

      let multilingual json =
        {
          id = json |> field "id" int;
          translations =
            json |> field "translations" (TranslationMap.Decode.t translation);
        }

      let make_assoc locale_order json =
        let open Option.Infix in
        json |> multilingual |> fun multilingual ->
        multilingual.translations |> TranslationMap.preferred locale_order
        <&> fun translation ->
        ( multilingual.id,
          { id = multilingual.id; name = translation.name; prerequisite = None }
        )

      let make_map locale_order json =
        json
        |> list (make_assoc locale_order)
        |> ListX.foldl'
             (function
               | None -> Function.id
               | Some (key, value) -> IntMap.insert key value)
             IntMap.empty
    end
  end

  module Use = struct
    type t = { id : int; name : string; prerequisite : linked_activatable }
  end

  type encumbrance = True | False | Maybe of string option

  type t = {
    id : int;
    name : string;
    check : Check.t;
    encumbrance : encumbrance;
    gr : int;
    ic : IC.t;
    applications : Application.t IntMap.t;
    applications_input : string option;
    uses : Use.t IntMap.t;
    tools : string option;
    quality : string;
    failed : string;
    critical : string;
    botch : string;
    src : PublicationRef.list;
    errata : Erratum.list;
  }

  module Decode = struct
    open Json.Decode
    open JsonStrict

    type translation = {
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

    let translation json =
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

    type encumbrance_multilingual = True | False | Maybe

    let encumbrance_multilingual =
      string
      |> map (function
           | "true" -> (True : encumbrance_multilingual)
           | "false" -> False
           | "maybe" -> Maybe
           | str ->
               JsonStatic.raise_unknown_variant ~variant_name:"Encumbrance"
                 ~invalid:str)

    type multilingual = {
      id : int;
      check : Check.t;
      applications : Application.t IntMap.t option;
      ic : IC.t;
      enc : encumbrance_multilingual;
      gr : int;
      src : PublicationRef.list;
      translations : translation TranslationMap.t;
    }

    let multilingual locale_order json =
      {
        id = json |> field "id" int;
        applications =
          json
          |> optionalField "applications"
               (Application.Decode.make_map locale_order);
        check = json |> field "check" Check.Decode.t;
        ic = json |> field "ic" IC.Decode.t;
        enc = json |> field "enc" encumbrance_multilingual;
        gr = json |> field "gr" int;
        src = json |> field "src" (PublicationRef.Decode.make_list locale_order);
        translations =
          json |> field "translations" (TranslationMap.Decode.t translation);
      }

    let make_assoc locale_order json =
      let open Option.Infix in
      json |> multilingual locale_order |> fun multilingual ->
      multilingual.translations |> TranslationMap.preferred locale_order
      <&> fun translation ->
      ( multilingual.id,
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
            multilingual.applications |> Option.fromOption IntMap.empty;
          applications_input = translation.applicationsInput;
          uses = IntMap.empty;
          ic = multilingual.ic;
          gr = multilingual.gr;
          tools = translation.tools;
          quality = translation.quality;
          failed = translation.failed;
          critical = translation.critical;
          botch = translation.botch;
          src = multilingual.src;
          errata = translation.errata |> Option.fromOption [];
        } )
  end
end

module Dynamic = Rated.Dynamic.Make (struct
  open Static

  type static = t

  let ic x = x.ic

  let min_value = 0
end)

module Group = struct
  type t = { id : int; check : Check.t; name : string; fullName : string }

  module Decode = struct
    open Json.Decode

    type translation = { name : string; fullName : string }

    let translation json =
      {
        name = json |> field "name" string;
        fullName = json |> field "fullName" string;
      }

    type multilingual = {
      id : int;
      check : Check.t;
      translations : translation TranslationMap.t;
    }

    let multilingual json =
      {
        id = json |> field "id" int;
        check = json |> field "check" Check.Decode.t;
        translations =
          json |> field "translations" (TranslationMap.Decode.t translation);
      }

    let make_assoc locale_order json =
      let open Option.Infix in
      json |> multilingual |> fun multilingual ->
      multilingual.translations |> TranslationMap.preferred locale_order
      <&> fun translation ->
      ( multilingual.id,
        {
          id = multilingual.id;
          check = multilingual.check;
          name = translation.name;
          fullName = translation.fullName;
        } )
  end
end
