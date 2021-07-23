module Static = struct
  type t = {
    id : Id.Ritual.t;
    name : string;
    check : Check.t;
    check_mod : Check.Modifier.t option;
    effect : string;
    effect_quality_levels :
      Rated.Static.Activatable.EffectByQualityLevel.t option;
    effect_after_quality_levels : string option;
    casting_time : Rated.Static.Activatable.MainParameter.t;
    cost : Rated.Static.Activatable.MainParameter.t;
    range : Rated.Static.Activatable.MainParameter.t;
    duration : Rated.Static.Activatable.MainParameter.t;
    target : string;
    property : Id.Property.t;
    traditions : Id.MagicalTradition.Set.t;
    tradition_placeholders : int list;
    improvement_cost : ImprovementCost.t;
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
      effect_quality_levels :
        Rated.Static.Activatable.EffectByQualityLevel.t option;
      effect_after_quality_levels : string option;
      casting_time : Rated.Static.Activatable.MainParameter.Decode.translation;
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
      field_opt "effect_quality_levels"
        Rated.Static.Activatable.EffectByQualityLevel.Decode.t
      >>= fun effect_quality_levels ->
      field_opt "effect_after_quality_levels" string
      >>= fun effect_after_quality_levels ->
      field "casting_time"
        Rated.Static.Activatable.MainParameter.Decode.translation
      >>= fun casting_time ->
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
        {
          name;
          effect;
          effect_quality_levels;
          effect_after_quality_levels;
          casting_time;
          cost;
          range;
          duration;
          target;
          errata;
        }

    type multilingual = {
      id : Id.Ritual.t;
      check : Check.t;
      check_mod : Check.Modifier.t option;
      is_casting_time_modifiable : bool;
      is_cost_modifiable : bool;
      is_range_modifiable : bool;
      is_duration_modifiable : bool;
      property : Id.Property.t;
      traditions : Id.MagicalTradition.Set.t;
      tradition_placeholders : int list;
      improvement_cost : ImprovementCost.t;
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
      field_opt "check_mod" Check.Modifier.Decode.t
      >>= fun check_mod ->
      field "is_casting_time_modifiable" bool
      >>= fun is_casting_time_modifiable ->
      field "is_cost_modifiable" bool
      >>= fun is_cost_modifiable ->
      field "is_range_modifiable" bool
      >>= fun is_range_modifiable ->
      field "is_duration_modifiable" bool
      >>= fun is_duration_modifiable ->
      field "property" Id.Property.Decode.t
      >>= fun property ->
      field "traditions" Id.MagicalTradition.Decode.set
      >>= fun traditions ->
      field "tradition_placeholders" (list int)
      >>= fun tradition_placeholders ->
      field "improvement_cost" ImprovementCost.Decode.t
      >>= fun improvement_cost ->
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
          check_mod;
          is_casting_time_modifiable;
          is_cost_modifiable;
          is_range_modifiable;
          is_duration_modifiable;
          property;
          traditions;
          tradition_placeholders;
          improvement_cost;
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
          check_mod = multilingual.check_mod;
          effect = translation.effect;
          effect_quality_levels = translation.effect_quality_levels;
          effect_after_quality_levels = translation.effect_after_quality_levels;
          casting_time =
            Rated.Static.Activatable.MainParameter.Decode.make
              multilingual.is_casting_time_modifiable translation.casting_time;
          cost =
            Rated.Static.Activatable.MainParameter.Decode.make
              multilingual.is_cost_modifiable translation.cost;
          range =
            Rated.Static.Activatable.MainParameter.Decode.make
              multilingual.is_range_modifiable translation.range;
          duration =
            Rated.Static.Activatable.MainParameter.Decode.make
              multilingual.is_duration_modifiable translation.duration;
          target = translation.target;
          property = multilingual.property;
          traditions = multilingual.traditions;
          tradition_placeholders = multilingual.tradition_placeholders;
          improvement_cost = multilingual.improvement_cost;
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

  let ic x = x.improvement_cost

  let enhancements x = x.enhancements
end)
