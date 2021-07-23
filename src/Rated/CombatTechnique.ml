(** Common static functionality for both melee and ranged combat techniques. *)
module Static = struct
  module Decode = struct
    open Decoders_bs.Decode

    type translation = {
      name : string;
      special : string option;
      errata : Erratum.list option;
    }

    let translation =
      field "name" string
      >>= fun name ->
      field_opt "special" string
      >>= fun special ->
      field_opt "errata" Erratum.Decode.list
      >>= fun errata -> succeed { name; special; errata }
  end
end

module Melee = struct
  module Static = struct
    type t = {
      id : Id.MeleeCombatTechnique.t;
      name : string;
      special : string option;
      primary_attribute : Id.Attribute.t list;
      improvement_cost : ImprovementCost.t;
      breaking_point_rating : int;
      parry : bool;
      src : PublicationRef.list;
      errata : Erratum.list;
    }

    module Decode = struct
      open Decoders_bs.Decode

      type multilingual = {
        id : Id.MeleeCombatTechnique.t;
        improvement_cost : ImprovementCost.t;
        primary_attribute : Id.Attribute.t list;
        parry : bool;
        breaking_point_rating : int;
        src : PublicationRef.list;
        translations : Static.Decode.translation TranslationMap.t;
      }

      let multilingual locale_order =
        field "id" Id.MeleeCombatTechnique.Decode.t
        >>= fun id ->
        field "improvement_cost" ImprovementCost.Decode.t
        >>= fun improvement_cost ->
        field "primary_attribute" (list Id.Attribute.Decode.t)
        >>= fun primary_attribute ->
        field "parry" bool
        >>= fun parry ->
        field "breaking_point_rating" int
        >>= fun breaking_point_rating ->
        field "src" (PublicationRef.Decode.make_list locale_order)
        >>= fun src ->
        field "translations" (TranslationMap.Decode.t Static.Decode.translation)
        >>= fun translations ->
        succeed
          {
            id;
            improvement_cost;
            primary_attribute;
            parry;
            breaking_point_rating;
            src;
            translations;
          }

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
            improvement_cost = multilingual.improvement_cost;
            primary_attribute = multilingual.primary_attribute;
            special = translation.special;
            parry = multilingual.parry;
            breaking_point_rating = multilingual.breaking_point_rating;
            src = multilingual.src;
            errata = translation.errata |> Option.value ~default:[];
          } )
    end
  end

  module Dynamic = Rated.Dynamic.Make (struct
    open Static

    type id = Id.MeleeCombatTechnique.t

    type static = t

    let ic x = x.improvement_cost

    let min_value = 6
  end)
end

module Ranged = struct
  module Static = struct
    type t = {
      id : Id.RangedCombatTechnique.t;
      name : string;
      special : string option;
      primary_attribute : Id.Attribute.t list;
      improvement_cost : ImprovementCost.t;
      breaking_point_rating : int;
      src : PublicationRef.list;
      errata : Erratum.list;
    }

    module Decode = struct
      open Decoders_bs.Decode

      type multilingual = {
        id : Id.RangedCombatTechnique.t;
        improvement_cost : ImprovementCost.t;
        primary_attribute : Id.Attribute.t list;
        breaking_point_rating : int;
        src : PublicationRef.list;
        translations : Static.Decode.translation TranslationMap.t;
      }

      let multilingual locale_order =
        field "id" Id.RangedCombatTechnique.Decode.t
        >>= fun id ->
        field "improvement_cost" ImprovementCost.Decode.t
        >>= fun improvement_cost ->
        field "primary_attribute" (list Id.Attribute.Decode.t)
        >>= fun primary_attribute ->
        field "breaking_point_rating" int
        >>= fun breaking_point_rating ->
        field "src" (PublicationRef.Decode.make_list locale_order)
        >>= fun src ->
        field "translations" (TranslationMap.Decode.t Static.Decode.translation)
        >>= fun translations ->
        succeed
          {
            id;
            improvement_cost;
            primary_attribute;
            breaking_point_rating;
            src;
            translations;
          }

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
            improvement_cost = multilingual.improvement_cost;
            primary_attribute = multilingual.primary_attribute;
            special = translation.special;
            breaking_point_rating = multilingual.breaking_point_rating;
            src = multilingual.src;
            errata = translation.errata |> Option.value ~default:[];
          } )
    end
  end

  module Dynamic = Rated.Dynamic.Make (struct
    open Static

    type id = Id.RangedCombatTechnique.t

    type static = t

    let ic x = x.improvement_cost

    let min_value = 6
  end)
end
