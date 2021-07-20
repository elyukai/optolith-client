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
    ic : ImprovementCost.t;
    prerequisites : Prerequisite.Collection.Spellwork.t;
    enhancements : Enhancement.Static.t IntMap.t;
    src : PublicationRef.list;
    errata : Erratum.list;
  }

  module Decode = struct
    open Decoders_bs.Decode

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

    let translation =
      field "name" string
      >>= fun name ->
      field "effect" string
      >>= fun effect ->
      field "castingTime"
        Rated.Static.Activatable.MainParameter.Decode.translation
      >>= fun castingTime ->
      field "cost" Rated.Static.Activatable.MainParameter.Decode.translation
      >>= fun cost ->
      field "range" Rated.Static.Activatable.MainParameter.Decode.translation
      >>= fun range ->
      field "duration" Rated.Static.Activatable.MainParameter.Decode.translation
      >>= fun duration ->
      field "target" string
      >>= fun target ->
      field_opt "errata" Erratum.Decode.list
      >>= fun errata ->
      succeed
        { name; effect; castingTime; cost; range; duration; target; errata }

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
      ic : ImprovementCost.t;
      prerequisites : Prerequisite.Collection.Spellwork.t option;
      enhancements : Enhancement.Static.t IntMap.t option;
      src : PublicationRef.list;
      translations : translation TranslationMap.t;
    }

    let multilingual locale_order =
      field "id" Id.Ritual.Decode.t
      >>= fun id ->
      field "check" Check.Decode.t
      >>= fun check ->
      field_opt "checkMod" Check.Modifier.Decode.t
      >>= fun checkMod ->
      field "castingTimeNoMod" bool
      >>= fun castingTimeNoMod ->
      field "costNoMod" bool
      >>= fun costNoMod ->
      field "rangeNoMod" bool
      >>= fun rangeNoMod ->
      field "durationNoMod" bool
      >>= fun durationNoMod ->
      field "property" int
      >>= fun property ->
      field "traditions" (list int)
      >>= fun traditions ->
      field "ic" ImprovementCost.Decode.t
      >>= fun ic ->
      field_opt "prerequisites"
        (Prerequisite.Collection.Spellwork.Decode.make locale_order)
      >>= fun prerequisites ->
      field_opt "enhancements" (Enhancement.Static.Decode.make_map locale_order)
      >>= fun enhancements ->
      field "src" (PublicationRef.Decode.make_list locale_order)
      >>= fun src ->
      field "translations" (TranslationMap.Decode.t translation)
      >>= fun translations ->
      succeed
        {
          id;
          check;
          checkMod;
          castingTimeNoMod;
          costNoMod;
          rangeNoMod;
          durationNoMod;
          property;
          traditions;
          ic;
          prerequisites;
          enhancements;
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
