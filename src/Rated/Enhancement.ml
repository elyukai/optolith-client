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

  let ap_value ic { level; _ } = IC.ap_for_activation ic * level

  let minimum_rating { level; _ } = (level * 4) + 4

  module Decode = struct
    open Json.Decode
    open JsonStrict

    type translation = {
      name : string;
      effect : string;
      errata : Erratum.list option;
    }

    let translation json =
      {
        name = json |> field "name" string;
        effect = json |> field "effect" string;
        errata = json |> optionalField "errata" Erratum.Decode.list;
      }

    type multilingual = {
      id : int;
      level : int;
      prerequisites : Prerequisite.Collection.Enhancement.t option;
      src : PublicationRef.list;
      translations : translation TranslationMap.t;
    }

    let multilingual locale_order json =
      {
        id = json |> field "id" int;
        level = json |> field "level" int;
        prerequisites =
          json
          |> optionalField "prerequisites"
               (Prerequisite.Collection.Enhancement.Decode.make locale_order);
        src = json |> field "src" (PublicationRef.Decode.make_list locale_order);
        translations =
          json |> field "translations" (TranslationMap.Decode.t translation);
      }

    let make_assoc locale_order json =
      let open Option.Infix in
      json |> multilingual locale_order
      |> fun multilingual ->
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

    let make_map locale_order json =
      json
      |> list (make_assoc locale_order)
      |> Option.catOptions |> IntMap.fromList
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
