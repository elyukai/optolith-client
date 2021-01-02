module Static = struct
  type t = {
    id : int;
    name : string;
    nameShort : string option;
    check : Check.t;
    checkMod : Check.Modifier.t option;
    effect : string;
    castingTime : ActivatableSkill.MainParameter.t;
    cost : ActivatableSkill.MainParameter.t;
    range : ActivatableSkill.MainParameter.t;
    duration : ActivatableSkill.MainParameter.t;
    target : string;
    traditions : Ley_IntSet.t;
    aspects : Ley_IntSet.t;
    ic : IC.t;
    enhancements : Enhancement.t list;
    src : PublicationRef.list;
    errata : Erratum.list;
  }

  module Decode = Json_Decode_Static.Make (struct
    type nonrec t = t

    module Translation = struct
      type t = {
        name : string;
        nameShort : string option;
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
            nameShort = json |> optionalField "nameShort" string;
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
      traditions : int list;
      aspects : int list;
      ic : IC.t;
      enhancements : Enhancement.Decode.multilingual list option;
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
          traditions = json |> field "traditions" (list int);
          aspects = json |> field "aspects" (list int);
          ic = json |> field "ic" IC.Decode.t;
          enhancements =
            json
            |> optionalField "enhancements"
                 (list Enhancement.Decode.multilingual);
          src = json |> field "src" PublicationRef.Decode.multilingualList;
          translations = json |> field "translations" decodeTranslations;
        }

    let make langs (multilingual : multilingual) (translation : Translation.t) =
      Some
        {
          id = multilingual.id;
          name = translation.name;
          nameShort = translation.nameShort;
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
          traditions = multilingual.traditions |> Ley_IntSet.fromList;
          aspects = multilingual.aspects |> Ley_IntSet.fromList;
          ic = multilingual.ic;
          enhancements =
            multilingual.enhancements
            |> Ley_Option.option []
                 (Ley_Option.mapOption
                    (Enhancement.Decode.resolveTranslations langs));
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
