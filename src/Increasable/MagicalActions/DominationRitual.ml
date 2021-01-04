module Static = struct
  type t = {
    id : int;
    name : string;
    check : Check.t;
    checkMod : Check.Modifier.t option;
    effect : string;
    cost : ActivatableSkill.MainParameter.t;
    duration : ActivatableSkill.MainParameter.t;
    property : int;
    src : PublicationRef.list;
    errata : Erratum.list;
  }

  module Decode = Json_Decode_Static.Make (struct
    type nonrec t = t

    module Translation = struct
      type t = {
        name : string;
        effect : string;
        cost : ActivatableSkill.MainParameter.translation;
        duration : ActivatableSkill.MainParameter.translation;
        errata : Erratum.t list option;
      }

      let t json =
        Json_Decode_Strict.
          {
            name = json |> field "name" string;
            effect = json |> field "effect" string;
            cost = json |> field "cost" ActivatableSkill.MainParameter.decode;
            duration =
              json |> field "duration" ActivatableSkill.MainParameter.decode;
            errata = json |> optionalField "errata" Erratum.Decode.list;
          }

      let pred _ = true
    end

    type multilingual = {
      id : int;
      check : Check.t;
      checkMod : Check.Modifier.t option;
      property : int;
      src : PublicationRef.Decode.multilingual list;
      translations : Translation.t Json_Decode_TranslationMap.partial;
    }

    let multilingual decodeTranslations json =
      Json_Decode_Strict.
        {
          id = json |> field "id" int;
          check = json |> field "check" Check.Decode.t;
          checkMod = json |> optionalField "checkMod" Check.Modifier.Decode.t;
          property = json |> field "property" int;
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
          cost = ActivatableSkill.MainParameter.make false translation.cost;
          duration =
            ActivatableSkill.MainParameter.make false translation.duration;
          property = multilingual.property;
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
