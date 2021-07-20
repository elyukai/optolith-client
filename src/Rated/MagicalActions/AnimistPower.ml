module Static = struct
  type ic = DeriveFromPrimaryPatron | Fixed of ImprovementCost.t

  type level = { level : int; effect : string; src : PublicationRef.list }

  type t = {
    id : Id.AnimistPower.t;
    name : string;
    check : Check.t;
    effect : string;
    cost : Rated.Static.Activatable.MainParameter.t;
    cost_from_primary_patron : string option;
    duration : Rated.Static.Activatable.MainParameter.t;
    tribes : IntSet.t;
    property : int;
    ic : ic;
    prerequisites : Prerequisite.Collection.AnimistPower.t;
    prerequisites_text : string option;
    levels : level IntMap.t;
    src : PublicationRef.list;
    errata : Erratum.list;
  }

  module Decode = struct
    open Decoders_bs.Decode

    module CostFromPrimaryPatron = struct
      type translation = string

      let translation = string

      type multilingual = { translations : translation TranslationMap.t }

      let multilingual =
        field "translations" (TranslationMap.Decode.t translation)
        >>= fun translations -> succeed { translations }

      let make locale_order =
        multilingual
        >|= fun multilingual ->
        multilingual.translations |> TranslationMap.preferred locale_order
    end

    module Level = struct
      type translation = { effect : string }

      let translation =
        field "effect" string >>= fun effect -> succeed { effect }

      type multilingual = {
        level : int;
        src : PublicationRef.list;
        translations : translation TranslationMap.t;
      }

      let multilingual locale_order =
        field "level" int
        >>= fun level ->
        field "src" (PublicationRef.Decode.make_list locale_order)
        >>= fun src ->
        field "translations" (TranslationMap.Decode.t translation)
        >>= fun translations -> succeed { level; src; translations }

      let make_assoc locale_order =
        let open Option.Infix in
        multilingual locale_order
        >|= fun multilingual ->
        multilingual.translations
        |> TranslationMap.preferred locale_order
        <&> fun translation ->
        ( multilingual.level,
          {
            level = multilingual.level;
            effect = translation.effect;
            src = multilingual.src;
          } )

      let make_map locale_order =
        list (make_assoc locale_order) >|= Option.catOptions >|= IntMap.fromList
    end

    let ic =
      string
      >>= function
      | "DeriveFromPrimaryPatron" -> succeed DeriveFromPrimaryPatron
      | _ -> ImprovementCost.Decode.t >|= fun x -> Fixed x

    type translation = {
      name : string;
      effect : string;
      cost : Rated.Static.Activatable.MainParameter.Decode.translation;
      duration : Rated.Static.Activatable.MainParameter.Decode.translation;
      prerequisites : string option;
      errata : Erratum.list option;
    }

    let translation =
      field "name" string
      >>= fun name ->
      field "effect" string
      >>= fun effect ->
      field "cost" Rated.Static.Activatable.MainParameter.Decode.translation
      >>= fun cost ->
      field "duration" Rated.Static.Activatable.MainParameter.Decode.translation
      >>= fun duration ->
      field_opt "prerequisites" string
      >>= fun prerequisites ->
      field_opt "errata" Erratum.Decode.list
      >>= fun errata ->
      succeed { name; effect; cost; duration; prerequisites; errata }

    type multilingual = {
      id : Id.AnimistPower.t;
      check : Check.t;
      costFromPrimaryPatron : string option;
      tribes : int list;
      property : int;
      ic : ic;
      prerequisites : Prerequisite.Collection.AnimistPower.t option;
      levels : level IntMap.t option;
      src : PublicationRef.list;
      translations : translation TranslationMap.t;
    }

    let multilingual locale_order =
      field "id" Id.AnimistPower.Decode.t
      >>= fun id ->
      field "check" Check.Decode.t
      >>= fun check ->
      field "costFromPrimaryPatron" (CostFromPrimaryPatron.make locale_order)
      >>= fun costFromPrimaryPatron ->
      field "tribes" (list int)
      >>= fun tribes ->
      field "property" int
      >>= fun property ->
      field "ic" ic
      >>= fun ic ->
      field_opt "prerequisites"
        (Prerequisite.Collection.AnimistPower.Decode.make locale_order)
      >>= fun prerequisites ->
      field_opt "levels" (Level.make_map locale_order)
      >>= fun levels ->
      field "src" (PublicationRef.Decode.make_list locale_order)
      >>= fun src ->
      field "translations" (TranslationMap.Decode.t translation)
      >>= fun translations ->
      succeed
        {
          id;
          check;
          costFromPrimaryPatron;
          tribes;
          property;
          ic;
          prerequisites;
          levels;
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
          check = multilingual.check;
          effect = translation.effect;
          cost =
            Rated.Static.Activatable.MainParameter.Decode.make false
              translation.cost;
          cost_from_primary_patron = multilingual.costFromPrimaryPatron;
          duration =
            Rated.Static.Activatable.MainParameter.Decode.make false
              translation.duration;
          tribes = multilingual.tribes |> IntSet.fromList;
          property = multilingual.property;
          ic = multilingual.ic;
          prerequisites = multilingual.prerequisites |> Option.value ~default:[];
          prerequisites_text = translation.prerequisites;
          levels = multilingual.levels |> Option.value ~default:IntMap.empty;
          src = multilingual.src;
          errata = translation.errata |> Option.value ~default:[];
        } )
  end
end

module Dynamic = Rated.Dynamic.Activatable.DeriveSecondary.Make (struct
  open Static

  type id = Id.AnimistPower.t

  type static = t

  type static' = Patron.t

  let ic { Patron.ic = patron_ic; _ } x =
    match x.ic with Fixed ic -> Some ic | DeriveFromPrimaryPatron -> patron_ic
end)
