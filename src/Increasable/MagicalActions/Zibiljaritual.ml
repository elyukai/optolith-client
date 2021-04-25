module Static = struct
  type t = {
    id : int;
    name : string;
    check : Check.t;
    checkMod : Check.Modifier.t option;
    effect : string;
    castingTime : ActivatableSkill.MainParameter.t;
    cost : ActivatableSkill.MainParameter.t;
    range : ActivatableSkill.MainParameter.t;
    duration : ActivatableSkill.MainParameter.t;
    target : string;
    property : int;
    ic : IC.t;
    src : PublicationRef.list;
    errata : Erratum.list;
  }

  module Decode = Json_Decode_Static.Make (struct
    type nonrec t = t

    module Translation = struct
      type t = {
        name : string;
        effect : string;
        castingTime : ActivatableSkill.MainParameter.translation;
        cost : ActivatableSkill.MainParameter.translation;
        range : ActivatableSkill.MainParameter.translation;
        duration : ActivatableSkill.MainParameter.translation;
        target : string;
        errata : Erratum.t list option;
      }

      let t json =
        Json_Decode_Strict.
          {
            name = json |> field "name" string;
            effect = json |> field "effect" string;
            castingTime =
              json |> field "castingTime" ActivatableSkill.MainParameter.decode;
            cost = json |> field "cost" ActivatableSkill.MainParameter.decode;
            range = json |> field "range" ActivatableSkill.MainParameter.decode;
            duration =
              json |> field "duration" ActivatableSkill.MainParameter.decode;
            target = json |> field "target" string;
            errata = json |> optionalField "errata" Erratum.Decode.list;
          }

      let pred _ = true
    end

    type multilingual = {
      id : int;
      check : Check.t;
      checkMod : Check.Modifier.t option;
      castingTimeNoMod : bool;
      costNoMod : bool;
      rangeNoMod : bool;
      durationNoMod : bool;
      property : int;
      ic : IC.t;
      src : PublicationRef.Decode.multilingual list;
      translations : Translation.t Json_Decode_TranslationMap.partial;
    }

    let multilingual decodeTranslations json =
      Json_Decode_Strict.
        {
          id = json |> field "id" int;
          check = json |> field "check" Check.Decode.t;
          checkMod = json |> optionalField "checkMod" Check.Modifier.Decode.t;
          castingTimeNoMod = json |> field "castingTimeNoMod" bool;
          costNoMod = json |> field "costNoMod" bool;
          rangeNoMod = json |> field "rangeNoMod" bool;
          durationNoMod = json |> field "durationNoMod" bool;
          property = json |> field "property" int;
          ic = json |> field "ic" IC.Decode.t;
          src = json |> field "src" PublicationRef.Decode.multilingualList;
          translations = json |> field "translations" decodeTranslations;
        }

    let make langs (multilingual : multilingual) (translation : Translation.t) =
      Some
        {
          id = multilingual.id;
          name = translation.name;
          check = multilingual.check;
          checkMod = multilingual.checkMod;
          effect = translation.effect;
          castingTime =
            ActivatableSkill.MainParameter.make multilingual.castingTimeNoMod
              translation.castingTime;
          cost =
            ActivatableSkill.MainParameter.make multilingual.costNoMod
              translation.cost;
          range =
            ActivatableSkill.MainParameter.make multilingual.rangeNoMod
              translation.range;
          duration =
            ActivatableSkill.MainParameter.make multilingual.durationNoMod
              translation.duration;
          target = translation.target;
          property = multilingual.property;
          ic = multilingual.ic;
          src =
            PublicationRef.Decode.resolveTranslationsList langs multilingual.src;
          errata = translation.errata |> Ley_Option.fromOption [];
        }

    module Accessors = struct
      let id (x : t) = x.id

      let translations x = x.translations
    end
  end)
end

module Dynamic = ActivatableSkill.Dynamic.Make (struct
  type static = Static.t
end)