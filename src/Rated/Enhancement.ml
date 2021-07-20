module Static = struct
  type t = {
    id : int;
    name : string;
    level : int;
    effect : string;
    prerequisites : Prerequisite.Collection.Enhancement.t;
    src : PublicationRef.list;
    errata : Erratum.list;
  }

  let ap_value ic { level; _ } = ImprovementCost.ap_for_activation ic * level

  let minimum_rating { level; _ } = (level * 4) + 4

  module Decode = struct
    open Decoders_bs.Decode

    type translation = {
      name : string;
      effect : string;
      errata : Erratum.list option;
    }

    let translation =
      field "name" string
      >>= fun name ->
      field "effect" string
      >>= fun effect ->
      field_opt "errata" Erratum.Decode.list
      >>= fun errata -> succeed { name; effect; errata }

    type multilingual = {
      id : int;
      level : int;
      prerequisites : Prerequisite.Collection.Enhancement.t option;
      src : PublicationRef.list;
      translations : translation TranslationMap.t;
    }

    let multilingual locale_order =
      field "id" int
      >>= fun id ->
      field "level" int
      >>= fun level ->
      field_opt "prerequisites"
        (Prerequisite.Collection.Enhancement.Decode.make locale_order)
      >>= fun prerequisites ->
      field "src" (PublicationRef.Decode.make_list locale_order)
      >>= fun src ->
      field "translations" (TranslationMap.Decode.t translation)
      >>= fun translations ->
      succeed { id; level; prerequisites; src; translations }

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
          level = multilingual.level;
          effect = translation.effect;
          prerequisites = multilingual.prerequisites |> Option.value ~default:[];
          src = multilingual.src;
          errata = translation.errata |> Option.value ~default:[];
        } )

    let make_map locale_order =
      list (make_assoc locale_order) >|= Option.catOptions >|= IntMap.fromList
  end
end

module Dynamic = struct
  module Dependency = struct
    type t = Internal of int | External of IdGroup.Activatable.t
  end

  type t = {
    id : int;
    dependencies : Dependency.t list;
    static : Static.t option;
  }
end
