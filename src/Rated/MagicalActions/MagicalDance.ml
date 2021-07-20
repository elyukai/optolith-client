module Static = struct
  type t = {
    id : Id.MagicalDance.t;
    name : string;
    check : Check.t;
    effect : string;
    duration : Rated.Static.Activatable.MainParameter.t;
    cost : Rated.Static.Activatable.MainParameter.t;
    music_tradition : string Id.MagicalTradition.ArcaneDancerTradition.Map.t;
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
        id : Id.MagicalTradition.ArcaneDancerTradition.t;
        translations : translation TranslationMap.t;
      }

      let multilingual =
        field "id" Id.MagicalTradition.ArcaneDancerTradition.Decode.t
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
                    Id.MagicalTradition.ArcaneDancerTradition.Map.insert key
                      value)
              Id.MagicalTradition.ArcaneDancerTradition.Map.empty
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
      id : Id.MagicalDance.t;
      check : Check.t;
      musicTradition : string Id.MagicalTradition.ArcaneDancerTradition.Map.t;
      property : int;
      ic : ImprovementCost.t;
      src : PublicationRef.list;
      translations : translation TranslationMap.t;
    }

    let multilingual locale_order =
      field "id" Id.MagicalDance.Decode.t
      >>= fun id ->
      field "check" Check.Decode.t
      >>= fun check ->
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
      succeed { id; check; musicTradition; property; ic; src; translations }

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

  type id = Id.MagicalDance.t

  type static = t

  let ic x = x.ic
end)
