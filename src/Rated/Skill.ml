module Static = struct
  type linked_activatable = {
    id : IdGroup.Activatable.t;
    options : IdGroup.SelectOption.t list;
    level : int option;
  }

  module Application = struct
    type t = {
      id : IdGroup.Application.t;
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
        ( IdGroup.Application.Generic multilingual.id,
          {
            id = Generic multilingual.id;
            name = translation.name;
            prerequisite = None;
          } )

      let make_map locale_order =
        list (make_assoc locale_order)
        >|= ListX.foldl'
              (function
                | None -> Function.id
                | Some (key, value) -> IdGroup.Application.Map.insert key value)
              IdGroup.Application.Map.empty
    end
  end

  module Use = struct
    type t = { id : int; name : string; prerequisite : linked_activatable }
  end

  type encumbrance = True | False | Maybe of string

  type t = {
    id : Id.Skill.t;
    name : string;
    check : Check.t;
    applications : Application.t IdGroup.Application.Map.t;
    applications_input : string option;
    uses : Use.t IntMap.t;
    encumbrance : encumbrance;
    tools : string option;
    quality : string;
    failed : string;
    critical : string;
    botch : string;
    improvement_cost : ImprovementCost.t;
    gr : int;
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

    type derived = Regions | Diseases

    let derived =
      string
      >>= function
      | "Regions" -> succeed Regions
      | "Diseases" -> succeed Diseases
      | _ -> fail "Expected a category to derive applications from"

    type applications =
      | Derived of derived
      | Explicit of Application.t IdGroup.Application.Map.t

    let applications locale_order =
      field "tag" string
      >>= function
      | "Derived" -> field "value" derived >|= fun mp -> Derived mp
      | "Explicit" ->
          field "list" (Application.Decode.make_map locale_order)
          >|= fun mp -> Explicit mp
      | _ -> fail "Expected either derived or explicit applications"

    let region_to_application (x : Region.t) : Application.t =
      { id = Region x.id; name = x.name; prerequisite = None }

    let disease_to_application (x : Disease.t) : Application.t =
      { id = Disease x.id; name = x.name; prerequisite = None }

    let resolve_applications ~regions ~diseases = function
      | Derived derived -> (
          match derived with
          | Regions ->
              regions |> Id.Region.Map.to_array
              |> IdGroup.Application.Map.(
                   Js.Array.reduce
                     (fun mp (key, x) ->
                       insert (Region key) (region_to_application x) mp)
                     empty)
          | Diseases ->
              diseases |> Id.Disease.Map.to_array
              |> IdGroup.Application.Map.(
                   Js.Array.reduce
                     (fun mp (key, x) ->
                       insert (Disease key) (disease_to_application x) mp)
                     empty))
      | Explicit mp -> mp

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
      applications : applications option;
      enc : encumbrance_multilingual;
      improvement_cost : ImprovementCost.t;
      gr : int;
      src : PublicationRef.list;
      translations : translation TranslationMap.t;
    }

    let multilingual locale_order =
      field "id" Id.Skill.Decode.t
      >>= fun id ->
      field_opt "applications" (applications locale_order)
      >>= fun applications ->
      field "check" Check.Decode.t
      >>= fun check ->
      field "improvement_cost" ImprovementCost.Decode.t
      >>= fun improvement_cost ->
      field "enc" encumbrance_multilingual
      >>= fun enc ->
      field "gr" int
      >>= fun gr ->
      field "src" (PublicationRef.Decode.make_list locale_order)
      >>= fun src ->
      field "translations" (TranslationMap.Decode.t translation)
      >>= fun translations ->
      succeed
        {
          id;
          applications;
          check;
          improvement_cost;
          enc;
          gr;
          src;
          translations;
        }

    let make_assoc ~regions ~diseases locale_order =
      multilingual locale_order
      >>= fun multilingual ->
      multilingual.translations
      |> TranslationMap.preferred locale_order
      |> function
      | Some translation ->
          (match (multilingual.enc, translation.encDescription) with
          | True, None -> succeed (True : encumbrance)
          | False, None -> succeed (False : encumbrance)
          | Maybe, Some text -> succeed (Maybe text : encumbrance)
          | (True | False), Some _ | Maybe, None -> fail "")
          >|= fun encumbrance ->
          Some
            ( multilingual.id,
              {
                id = multilingual.id;
                name = translation.name;
                check = multilingual.check;
                encumbrance;
                applications =
                  multilingual.applications
                  |> Option.fold ~none:IdGroup.Application.Map.empty
                       ~some:(resolve_applications ~regions ~diseases);
                applications_input = translation.applicationsInput;
                uses = IntMap.empty;
                improvement_cost = multilingual.improvement_cost;
                gr = multilingual.gr;
                tools = translation.tools;
                quality = translation.quality;
                failed = translation.failed;
                critical = translation.critical;
                botch = translation.botch;
                src = multilingual.src;
                errata = translation.errata |> Option.value ~default:[];
              } )
      | None -> succeed None
  end
end

module Dynamic = Rated.Dynamic.Make (struct
  open Static

  type id = Id.Skill.t

  type static = t

  let ic x = x.improvement_cost

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
