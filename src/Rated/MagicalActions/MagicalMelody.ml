module Static = struct
  type t = {
    id : Id.MagicalMelody.t;
    name : string;
    check : Check.t;
    effect : string;
    duration : Rated.Static.Activatable.MainParameter.t;
    cost : Rated.Static.Activatable.MainParameter.t;
    skill : Id.Skill.t NonEmptyList.t;
    music_tradition : string Id.MagicalTradition.ArcaneBardTradition.Map.t;
    property : int;
    ic : ImprovementCost.t;
    src : PublicationRef.list;
    errata : Erratum.list;
  }

  module Decode = struct
    open Decoders_bs.Decode

    module MusicTradition = struct
      type translation = { name : string }

      let translation = field "name" string >>= fun name -> succeed { name }

      type multilingual = {
        id : Id.MagicalTradition.ArcaneBardTradition.t;
        translations : translation TranslationMap.t;
      }

      let multilingual =
        field "id" Id.MagicalTradition.ArcaneBardTradition.Decode.t
        >>= fun id ->
        field "translations" (TranslationMap.Decode.t translation)
        >>= fun translations -> succeed { id; translations }

      let make_assoc locale_order =
        let open Option.Infix in
        multilingual
        >|= fun multilingual ->
        multilingual.translations
        |> TranslationMap.preferred locale_order
        <&> fun translation -> (multilingual.id, translation.name)

      let make_map locale_order =
        list (make_assoc locale_order)
        >|= ListX.foldl'
              (function
                | None -> Function.id
                | Some (key, value) ->
                    Id.MagicalTradition.ArcaneBardTradition.Map.insert key value)
              Id.MagicalTradition.ArcaneBardTradition.Map.empty
    end

    type translation = {
      name : string;
      effect : string;
      duration : Rated.Static.Activatable.MainParameter.Decode.translation;
      cost : Rated.Static.Activatable.MainParameter.Decode.translation;
      errata : Erratum.list option;
    }

    let translation =
      field "name" string
      >>= fun name ->
      field "effect" string
      >>= fun effect ->
      field "duration" Rated.Static.Activatable.MainParameter.Decode.translation
      >>= fun duration ->
      field "cost" Rated.Static.Activatable.MainParameter.Decode.translation
      >>= fun cost ->
      field_opt "errata" Erratum.Decode.list
      >>= fun errata -> succeed { name; effect; duration; cost; errata }

    type multilingual = {
      id : Id.MagicalMelody.t;
      check : Check.t;
      skill : Id.Skill.t NonEmptyList.t;
      musicTradition : string Id.MagicalTradition.ArcaneBardTradition.Map.t;
      property : int;
      ic : ImprovementCost.t;
      src : PublicationRef.list;
      translations : translation TranslationMap.t;
    }

    let multilingual locale_order =
      field "id" Id.MagicalMelody.Decode.t
      >>= fun id ->
      field "check" Check.Decode.t
      >>= fun check ->
      field "skill" (NonEmptyList.Decode.one_or_many Id.Skill.Decode.t)
      >>= fun skill ->
      field "musicTradition" (MusicTradition.make_map locale_order)
      >>= fun musicTradition ->
      field "property" int
      >>= fun property ->
      field "ic" ImprovementCost.Decode.t
      >>= fun ic ->
      field "src" (PublicationRef.Decode.make_list locale_order)
      >>= fun src ->
      field "translations" (TranslationMap.Decode.t translation)
      >>= fun translations ->
      succeed
        { id; check; skill; musicTradition; property; ic; src; translations }

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
          duration =
            Rated.Static.Activatable.MainParameter.Decode.make false
              translation.duration;
          cost =
            Rated.Static.Activatable.MainParameter.Decode.make false
              translation.cost;
          skill = multilingual.skill;
          property = multilingual.property;
          music_tradition = multilingual.musicTradition;
          ic = multilingual.ic;
          src = multilingual.src;
          errata = translation.errata |> Option.value ~default:[];
        } )
  end
end

module Dynamic = Rated.Dynamic.Activatable.Make (struct
  open Static

  type id = Id.MagicalMelody.t

  type static = t

  let ic x = x.ic
end)
