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
    ic : IC.t;
    src : PublicationRef.list;
    errata : Erratum.list;
  }

  module Decode = struct
    open Json.Decode
    open JsonStrict

    module MusicTradition = struct
      type translation = { name : string }

      let translation json = { name = json |> field "name" string }

      type multilingual = {
        id : Id.MagicalTradition.ArcaneBardTradition.t;
        translations : translation TranslationMap.t;
      }

      let multilingual json =
        {
          id =
            json |> field "id" Id.MagicalTradition.ArcaneBardTradition.Decode.t;
          translations =
            json |> field "translations" (TranslationMap.Decode.t translation);
        }

      let make_assoc locale_order json =
        let open Option.Infix in
        json |> multilingual |> fun multilingual ->
        multilingual.translations |> TranslationMap.preferred locale_order
        <&> fun translation -> (multilingual.id, translation.name)

      let make_map locale_order json =
        json
        |> list (make_assoc locale_order)
        |> ListX.foldl'
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

    let translation json =
      {
        name = json |> field "name" string;
        effect = json |> field "effect" string;
        duration =
          json
          |> field "duration"
               Rated.Static.Activatable.MainParameter.Decode.translation;
        cost =
          json
          |> field "cost"
               Rated.Static.Activatable.MainParameter.Decode.translation;
        errata = json |> optionalField "errata" Erratum.Decode.list;
      }

    type multilingual = {
      id : Id.MagicalMelody.t;
      check : Check.t;
      skill : Id.Skill.t NonEmptyList.t;
      musicTradition : string Id.MagicalTradition.ArcaneBardTradition.Map.t;
      property : int;
      ic : IC.t;
      src : PublicationRef.list;
      translations : translation TranslationMap.t;
    }

    let multilingual locale_order json =
      {
        id = json |> field "id" Id.MagicalMelody.Decode.t;
        check = json |> field "check" Check.Decode.t;
        skill =
          json
          |> field "skill" (NonEmptyList.Decode.one_or_many Id.Skill.Decode.t);
        musicTradition =
          json |> field "musicTradition" (MusicTradition.make_map locale_order);
        property = json |> field "property" int;
        ic = json |> field "ic" IC.Decode.t;
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
          errata = translation.errata |> Option.fromOption [];
        } )
  end
end

module Dynamic = Rated.Dynamic.Activatable.Make (struct
  open Static

  type id = Id.MagicalMelody.t

  type static = t

  let ic x = x.ic
end)