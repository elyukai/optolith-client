module Static = struct
  type t = {
    id : Id.LiturgicalChant.t;
    name : string;
    name_short : string option;
    check : Check.t;
    check_mod : Check.Modifier.t option;
    effect : string;
    casting_time : Rated.Static.Activatable.MainParameter.t;
    cost : Rated.Static.Activatable.MainParameter.t;
    range : Rated.Static.Activatable.MainParameter.t;
    duration : Rated.Static.Activatable.MainParameter.t;
    target : string;
    traditions : Id.BlessedTradition.Set.t;
    aspects : Id.Aspect.Set.t;
    ic : IC.t;
    prerequisites : Prerequisite.Collection.Liturgy.t;
    enhancements : Enhancement.t IntMap.t;
    src : PublicationRef.list;
    errata : Erratum.list;
  }

  module Decode = struct
    open Json.Decode
    open JsonStrict

    type translation = {
      name : string;
      nameShort : string option;
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
        nameShort = json |> optionalField "nameShort" string;
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
      id : Id.LiturgicalChant.t;
      check : Check.t;
      checkMod : Check.Modifier.t option;
      castingTimeNoMod : bool;
      costNoMod : bool;
      rangeNoMod : bool;
      durationNoMod : bool;
      traditions : int list;
      aspects : int list;
      ic : IC.t;
      prerequisites : Prerequisite.Collection.Liturgy.t option;
      enhancements : Enhancement.t IntMap.t option;
      src : PublicationRef.list;
      translations : translation TranslationMap.t;
    }

    let multilingual locale_order json =
      {
        id = json |> field "id" Id.LiturgicalChant.Decode.t;
        check = json |> field "check" Check.Decode.t;
        checkMod = json |> optionalField "checkMod" Check.Modifier.Decode.t;
        castingTimeNoMod = json |> field "castingTimeNoMod" bool;
        costNoMod = json |> field "costNoMod" bool;
        rangeNoMod = json |> field "rangeNoMod" bool;
        durationNoMod = json |> field "durationNoMod" bool;
        traditions = json |> field "traditions" (list int);
        aspects = json |> field "aspects" (list int);
        ic = json |> field "ic" IC.Decode.t;
        prerequisites =
          json
          |> optionalField "prerequisites"
               (Prerequisite.Collection.Liturgy.Decode.make locale_order);
        enhancements =
          json
          |> optionalField "enhancements"
               (Enhancement.Decode.make_map locale_order);
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
          name_short = translation.nameShort;
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
          traditions =
            multilingual.traditions |> Id.BlessedTradition.Set.from_int_list;
          aspects = multilingual.aspects |> Id.Aspect.Set.from_int_list;
          ic = multilingual.ic;
          prerequisites = multilingual.prerequisites |> Option.fromOption [];
          enhancements =
            multilingual.enhancements |> Option.fromOption IntMap.empty;
          src = multilingual.src;
          errata = translation.errata |> Option.fromOption [];
        } )
  end
end

module Dynamic = Rated.Dynamic.Activatable.WithEnhancements.Make (struct
  open Static

  type id = Id.LiturgicalChant.t

  type static = t

  let ic x = x.ic

  let enhancements x = x.enhancements
end)
