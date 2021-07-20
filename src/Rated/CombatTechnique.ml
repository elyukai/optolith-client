module Melee = struct
  module Static = struct
    type t = {
      id : Id.MeleeCombatTechnique.t;
      name : string;
      ic : ImprovementCost.t;
      primary : int list;
      special : string option;
      hasNoParry : bool;
      breakingPointRating : int;
      src : PublicationRef.list;
      errata : Erratum.list;
    }

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

      type multilingual = {
        id : Id.MeleeCombatTechnique.t;
        ic : ImprovementCost.t;
        primary : int list;
        hasNoParry : bool;
        breakingPointRating : int;
        src : PublicationRef.list;
        translations : translation TranslationMap.t;
      }

      let multilingual locale_order =
        field "id" Id.MeleeCombatTechnique.Decode.t
        >>= fun id ->
        field "ic" ImprovementCost.Decode.t
        >>= fun ic ->
        field "primary" (list int)
        >>= fun primary ->
        field "hasNoParry" bool
        >>= fun hasNoParry ->
        field "breakingPointRating" int
        >>= fun breakingPointRating ->
        field "src" (PublicationRef.Decode.make_list locale_order)
        >>= fun src ->
        field "translations" (TranslationMap.Decode.t translation)
        >>= fun translations ->
        succeed
          {
            id;
            ic;
            primary;
            hasNoParry;
            breakingPointRating;
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
            ic = multilingual.ic;
            primary = multilingual.primary;
            special = translation.special;
            hasNoParry = multilingual.hasNoParry;
            breakingPointRating = multilingual.breakingPointRating;
            src = multilingual.src;
            errata = translation.errata |> Option.value ~default:[];
          } )
    end
  end

  module Dynamic = Rated.Dynamic.Make (struct
    open Static

    type id = Id.MeleeCombatTechnique.t

    type static = t

    let ic x = x.ic

    let min_value = 6
  end)
end

module Ranged = struct
  module Static = struct
    type t = {
      id : Id.RangedCombatTechnique.t;
      name : string;
      ic : ImprovementCost.t;
      primary : int list;
      special : string option;
      breakingPointRating : int;
      src : PublicationRef.list;
      errata : Erratum.list;
    }

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

      type multilingual = {
        id : Id.RangedCombatTechnique.t;
        ic : ImprovementCost.t;
        primary : int list;
        breakingPointRating : int;
        src : PublicationRef.list;
        translations : translation TranslationMap.t;
      }

      let multilingual locale_order =
        field "id" Id.RangedCombatTechnique.Decode.t
        >>= fun id ->
        field "ic" ImprovementCost.Decode.t
        >>= fun ic ->
        field "primary" (list int)
        >>= fun primary ->
        field "breakingPointRating" int
        >>= fun breakingPointRating ->
        field "src" (PublicationRef.Decode.make_list locale_order)
        >>= fun src ->
        field "translations" (TranslationMap.Decode.t translation)
        >>= fun translations ->
        succeed { id; ic; primary; breakingPointRating; src; translations }

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
            ic = multilingual.ic;
            primary = multilingual.primary;
            special = translation.special;
            breakingPointRating = multilingual.breakingPointRating;
            src = multilingual.src;
            errata = translation.errata |> Option.value ~default:[];
          } )
    end
  end

  module Dynamic = Rated.Dynamic.Make (struct
    open Static

    type id = Id.RangedCombatTechnique.t

    type static = t

    let ic x = x.ic

    let min_value = 6
  end)
end
