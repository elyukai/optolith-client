module Static = struct
  type t = {
    id : int;
    name : string;
    check : Check.t;
    effect : string;
    duration : ActivatableSkill.MainParameter.t;
    cost : ActivatableSkill.MainParameter.t;
    musicTradition : string Ley_IntMap.t;
    property : int;
    ic : IC.t;
    src : PublicationRef.list;
    errata : Erratum.list;
  }

  module Decode = Json_Decode_Static.Make (struct
    type nonrec t = t

    module MusicTradition = Json_Decode_Static.Nested.Make (struct
      type t = int * string

      module Translation = struct
        type t = { name : string }

        let t json = Json_Decode_Strict.{ name = json |> field "name" string }

        let pred _ = true
      end

      type multilingual = {
        id : int;
        translations : Translation.t Json_Decode_TranslationMap.partial;
      }

      let multilingual decodeTranslations json =
        Json_Decode_Strict.
          {
            id = json |> field "id" int;
            translations = json |> field "translations" decodeTranslations;
          }

      let make _ (multilingual : multilingual) (translation : Translation.t) =
        Some (multilingual.id, translation.name)

      module Accessors = struct
        let id ((id, _) : t) = id

        let translations x = x.translations
      end
    end)

    module Translation = struct
      type t = {
        name : string;
        effect : string;
        duration : ActivatableSkill.MainParameter.translation;
        cost : ActivatableSkill.MainParameter.translation;
        errata : Erratum.t list option;
      }

      let t json =
        Json_Decode_Strict.
          {
            name = json |> field "name" string;
            effect = json |> field "effect" string;
            duration =
              json |> field "duration" ActivatableSkill.MainParameter.decode;
            cost = json |> field "cost" ActivatableSkill.MainParameter.decode;
            errata = json |> optionalField "errata" Erratum.Decode.list;
          }

      let pred _ = true
    end

    type multilingual = {
      id : int;
      check : Check.t;
      musicTradition : MusicTradition.multilingual list;
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
          musicTradition =
            json |> field "musicTradition" (list MusicTradition.multilingual);
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
          effect = translation.effect;
          duration =
            ActivatableSkill.MainParameter.make false translation.duration;
          cost = ActivatableSkill.MainParameter.make false translation.cost;
          musicTradition =
            multilingual.musicTradition
            |> Ley_Option.mapOption (MusicTradition.resolveTranslations langs)
            |> Ley_IntMap.fromList;
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