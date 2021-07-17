module Static = struct
  type t = {
    id : Id.Ritual.t;
    name : string;
    check : Check.t;
    check_mod : Check.Modifier.t option;
    effect : string;
    casting_time : Rated.Static.Activatable.MainParameter.t;
    cost : Rated.Static.Activatable.MainParameter.t;
    range : Rated.Static.Activatable.MainParameter.t;
    duration : Rated.Static.Activatable.MainParameter.t;
    target : string;
    property : int;
    traditions : Id.MagicalTradition.Set.t;
    ic : IC.t;
    prerequisites : Prerequisite.Collection.Spellwork.t;
    enhancements : Enhancement.Static.t IntMap.t;
    src : PublicationRef.list;
    errata : Erratum.list;
  }

  module Decode = struct
    open Json.Decode
    open JsonStrict

    type translation = {
      name : string;
      effect : string;
      castingTime : Rated.Static.Activatable.MainParameter.Decode.translation;
      cost : Rated.Static.Activatable.MainParameter.Decode.translation;
      range : Rated.Static.Activatable.MainParameter.Decode.translation;
      duration : Rated.Static.Activatable.MainParameter.Decode.translation;
      target : string;
      errata : Erratum.list option;
    }

    let translation json =
      {
        name = json |> field "name" string;
        effect = json |> field "effect" string;
        castingTime =
          json
          |> field "castingTime"
               Rated.Static.Activatable.MainParameter.Decode.translation;
        cost =
          json
          |> field "cost"
               Rated.Static.Activatable.MainParameter.Decode.translation;
        range =
          json
          |> field "range"
               Rated.Static.Activatable.MainParameter.Decode.translation;
        duration =
          json
          |> field "duration"
               Rated.Static.Activatable.MainParameter.Decode.translation;
        target = json |> field "target" string;
        errata = json |> optionalField "errata" Erratum.Decode.list;
      }

    type multilingual = {
      id : Id.Ritual.t;
      check : Check.t;
      checkMod : Check.Modifier.t option;
      castingTimeNoMod : bool;
      costNoMod : bool;
      rangeNoMod : bool;
      durationNoMod : bool;
      property : int;
      traditions : int list;
      ic : IC.t;
      prerequisites : Prerequisite.Collection.Spellwork.t option;
      enhancements : Enhancement.Static.t IntMap.t option;
      src : PublicationRef.list;
      translations : translation TranslationMap.t;
    }

    let multilingual locale_order json =
      {
        id = json |> field "id" Id.Ritual.Decode.t;
        check = json |> field "check" Check.Decode.t;
        checkMod = json |> optionalField "checkMod" Check.Modifier.Decode.t;
        castingTimeNoMod = json |> field "castingTimeNoMod" bool;
        costNoMod = json |> field "costNoMod" bool;
        rangeNoMod = json |> field "rangeNoMod" bool;
        durationNoMod = json |> field "durationNoMod" bool;
        property = json |> field "property" int;
        traditions = json |> field "traditions" (list int);
        ic = json |> field "ic" IC.Decode.t;
        prerequisites =
          json
          |> optionalField "prerequisites"
               (Prerequisite.Collection.Spellwork.Decode.make locale_order);
        enhancements =
          json
          |> optionalField "enhancements"
               (Enhancement.Static.Decode.make_map locale_order);
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
          check = multilingual.check;
          check_mod = multilingual.checkMod;
          effect = translation.effect;
          casting_time =
            Rated.Static.Activatable.MainParameter.Decode.make
              multilingual.castingTimeNoMod translation.castingTime;
          cost =
            Rated.Static.Activatable.MainParameter.Decode.make
              multilingual.costNoMod translation.cost;
          range =
            Rated.Static.Activatable.MainParameter.Decode.make
              multilingual.rangeNoMod translation.range;
          duration =
            Rated.Static.Activatable.MainParameter.Decode.make
              multilingual.durationNoMod translation.duration;
          target = translation.target;
          property = multilingual.property;
          traditions =
            multilingual.traditions |> Id.MagicalTradition.Set.from_int_list;
          ic = multilingual.ic;
          prerequisites = multilingual.prerequisites |> Option.value ~default:[];
          enhancements =
            multilingual.enhancements |> Option.value ~default:IntMap.empty;
          src = multilingual.src;
          errata = translation.errata |> Option.value ~default:[];
        } )
  end
end

module Dynamic = Rated.Dynamic.Activatable.ByMagicalTradition.Make (struct
  open Static

  type id = Id.Ritual.t

  type static = t

  let ic x = x.ic

  let enhancements x = x.enhancements
end)
