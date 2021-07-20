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
      open Decoders_bs.Decode

      type translation = { name : string }

      let translation = field "name" string >>= fun name -> succeed { name }

      type multilingual = {
        id : int;
        translations : translation TranslationMap.t;
      }

      let multilingual =
        field "id" int
        >>= fun id ->
        field "translations" (TranslationMap.Decode.t translation)
        >>= fun translations -> succeed { id; translations }

      let make_assoc locale_order =
        let open Option.Infix in
        multilingual
        >|= fun multilingual ->
        multilingual.translations
        |> TranslationMap.preferred locale_order
        <&> fun translation ->
        ( multilingual.id,
          { id = multilingual.id; name = translation.name; prerequisite = None }
        )

      let make_map locale_order =
        list (make_assoc locale_order)
        >|= ListX.foldl'
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
    id : Id.Skill.t;
    name : string;
    check : Check.t;
    encumbrance : encumbrance;
    gr : int;
    ic : ImprovementCost.t;
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
    open Decoders_bs.Decode

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

    let translation =
      field "name" string
      >>= fun name ->
      field_opt "applicationsInput" string
      >>= fun applicationsInput ->
      field_opt "encDescription" string
      >>= fun encDescription ->
      field_opt "tools" string
      >>= fun tools ->
      field "quality" string
      >>= fun quality ->
      field "failed" string
      >>= fun failed ->
      field "critical" string
      >>= fun critical ->
      field "botch" string
      >>= fun botch ->
      field_opt "errata" Erratum.Decode.list
      >>= fun errata ->
      succeed
        {
          name;
          applicationsInput;
          encDescription;
          tools;
          quality;
          failed;
          critical;
          botch;
          errata;
        }

    type encumbrance_multilingual = True | False | Maybe

    let encumbrance_multilingual =
      string
      >>= function
      | "true" -> succeed (True : encumbrance_multilingual)
      | "false" -> succeed (False : encumbrance_multilingual)
      | "maybe" -> succeed (Maybe : encumbrance_multilingual)
      | _ -> fail "Expected encumbrance influence"

    type multilingual = {
      id : Id.Skill.t;
      check : Check.t;
      applications : Application.t IntMap.t option;
      ic : ImprovementCost.t;
      enc : encumbrance_multilingual;
      gr : int;
      src : PublicationRef.list;
      translations : translation TranslationMap.t;
    }

    let multilingual locale_order =
      field "id" Id.Skill.Decode.t
      >>= fun id ->
      field_opt "applications" (Application.Decode.make_map locale_order)
      >>= fun applications ->
      field "check" Check.Decode.t
      >>= fun check ->
      field "ic" ImprovementCost.Decode.t
      >>= fun ic ->
      field "enc" encumbrance_multilingual
      >>= fun enc ->
      field "gr" int
      >>= fun gr ->
      field "src" (PublicationRef.Decode.make_list locale_order)
      >>= fun src ->
      field "translations" (TranslationMap.Decode.t translation)
      >>= fun translations ->
      succeed { id; applications; check; ic; enc; gr; src; translations }

    let make_assoc locale_order =
      let open Option.Infix in
      multilingual locale_order
      >|= fun multilingual ->
      multilingual.translations
      |> TranslationMap.preferred locale_order
      <&> fun translation ->
      ( multilingual.id,
        {
          id = multilingual.id;
          name = translation.name;
          check = multilingual.check;
          encumbrance =
            (match multilingual.enc with
            | True -> True
            | False -> False
            | Maybe -> Maybe translation.encDescription);
          applications =
            multilingual.applications |> Option.value ~default:IntMap.empty;
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
          errata = translation.errata |> Option.value ~default:[];
        } )
  end
end

module Dynamic = Rated.Dynamic.Make (struct
  open Static

  type id = Id.Skill.t

  type static = t

  let ic x = x.ic

  let min_value = 0
end)

module Group = struct
  type t = { id : int; check : Check.t; name : string; fullName : string }

  module Decode = struct
    open Decoders_bs.Decode

    type translation = { name : string; fullName : string }

    let translation =
      field "name" string
      >>= fun name ->
      field "fullName" string >>= fun fullName -> succeed { name; fullName }

    type multilingual = {
      id : int;
      check : Check.t;
      translations : translation TranslationMap.t;
    }

    let multilingual =
      field "id" int
      >>= fun id ->
      field "check" Check.Decode.t
      >>= fun check ->
      field "translations" (TranslationMap.Decode.t translation)
      >>= fun translations -> succeed { id; check; translations }

    let make_assoc locale_order =
      let open Option.Infix in
      multilingual
      >|= fun multilingual ->
      multilingual.translations
      |> TranslationMap.preferred locale_order
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
