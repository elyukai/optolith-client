module Static = struct
  type ic = DeriveFromPrimaryPatron | Fixed of IC.t

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
    open Json.Decode
    open JsonStrict

    module CostFromPrimaryPatron = struct
      type translation = string

      let translation = string

      type multilingual = { translations : translation TranslationMap.t }

      let multilingual json =
        {
          translations =
            json |> field "translations" (TranslationMap.Decode.t translation);
        }

      let make locale_order json =
        json |> multilingual |> fun multilingual ->
        multilingual.translations |> TranslationMap.preferred locale_order
    end

    module Level = struct
      type translation = { effect : string }

      let translation json = { effect = json |> field "effect" string }

      type multilingual = {
        level : int;
        src : PublicationRef.list;
        translations : translation TranslationMap.t;
      }

      let multilingual locale_order json =
        {
          level = json |> field "level" int;
          src =
            json |> field "src" (PublicationRef.Decode.make_list locale_order);
          translations =
            json |> field "translations" (TranslationMap.Decode.t translation);
        }

      let make_assoc locale_order json =
        let open Option.Infix in
        json |> multilingual locale_order |> fun multilingual ->
        multilingual.translations |> TranslationMap.preferred locale_order
        <&> fun translation ->
        ( multilingual.level,
          {
            level = multilingual.level;
            effect = translation.effect;
            src = multilingual.src;
          } )

      let make_map locale_order json =
        json
        |> list (make_assoc locale_order)
        |> Option.catOptions |> IntMap.fromList
    end

    let ic json =
      json |> string |> function
      | "DeriveFromPrimaryPatron" -> DeriveFromPrimaryPatron
      | _ -> json |> IC.Decode.t |> fun x -> Fixed x

    type translation = {
      name : string;
      effect : string;
      cost : Rated.Static.Activatable.MainParameter.Decode.translation;
      duration : Rated.Static.Activatable.MainParameter.Decode.translation;
      prerequisites : string option;
      errata : Erratum.list option;
    }

    let translation json =
      {
        name = json |> field "name" string;
        effect = json |> field "effect" string;
        cost =
          json
          |> field "cost"
               Rated.Static.Activatable.MainParameter.Decode.translation;
        duration =
          json
          |> field "duration"
               Rated.Static.Activatable.MainParameter.Decode.translation;
        prerequisites = json |> optionalField "prerequisites" string;
        errata = json |> optionalField "errata" Erratum.Decode.list;
      }

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

    let multilingual locale_order json =
      {
        id = json |> field "id" Id.AnimistPower.Decode.t;
        check = json |> field "check" Check.Decode.t;
        costFromPrimaryPatron =
          json
          |> field "costFromPrimaryPatron"
               (CostFromPrimaryPatron.make locale_order);
        tribes = json |> field "tribes" (list int);
        property = json |> field "property" int;
        ic = json |> field "ic" ic;
        prerequisites =
          json
          |> optionalField "prerequisites"
               (Prerequisite.Collection.AnimistPower.Decode.make locale_order);
        levels = json |> optionalField "levels" (Level.make_map locale_order);
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
          prerequisites = multilingual.prerequisites |> Option.fromOption [];
          prerequisites_text = translation.prerequisites;
          levels = multilingual.levels |> Option.fromOption IntMap.empty;
          src = multilingual.src;
          errata = translation.errata |> Option.fromOption [];
        } )
  end
end

module Dynamic = Rated.Dynamic.Activatable.DeriveSecondary.Make (struct
  open Static

  type id = Id.AnimistPower.t

  type static = t

  type static' = IC.t

  let ic patron x =
    match x.ic with Fixed ic -> ic | DeriveFromPrimaryPatron -> patron
end)
