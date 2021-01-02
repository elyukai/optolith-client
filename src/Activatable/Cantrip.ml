module Static = struct
  type t = {
    id : int;
    name : string;
    effect : string;
    range : string;
    duration : string;
    target : string;
    property : int;
    traditions : Ley_IntSet.t;
    prerequisites : Prerequisite.Collection.Activatable.t;
    src : PublicationRef.list;
    errata : Erratum.list;
  }

  module Decode = Json_Decode_Static.Make (struct
    type nonrec t = t

    module Translation = struct
      type t = {
        name : string;
        effect : string;
        range : string;
        duration : string;
        target : string;
        errata : Erratum.list option;
      }

      let t json =
        Json_Decode_Strict.
          {
            name = json |> field "name" string;
            effect = json |> field "effect" string;
            range = json |> field "range" string;
            duration = json |> field "duration" string;
            target = json |> field "target" string;
            errata = json |> optionalField "errata" Erratum.Decode.list;
          }

      let pred _ = true
    end

    type multilingual = {
      id : int;
      property : int;
      traditions : int list;
      prerequisites :
        Prerequisite.Collection.Activatable.Decode.multilingual option;
      src : PublicationRef.Decode.multilingual list;
      translations : Translation.t Json_Decode_TranslationMap.partial;
    }

    let multilingual decodeTranslations json =
      Json_Decode_Strict.
        {
          id = json |> field "id" int;
          property = json |> field "property" int;
          traditions = json |> field "traditions" (list int);
          prerequisites =
            json
            |> optionalField "prerequisites"
                 Prerequisite.Collection.Activatable.Decode.multilingual;
          src = json |> field "src" PublicationRef.Decode.multilingualList;
          translations = json |> field "translations" decodeTranslations;
        }

    let make langs (multilingual : multilingual) (translation : Translation.t) =
      Some
        {
          id = multilingual.id;
          name = translation.name;
          effect = translation.effect;
          range = translation.range;
          duration = translation.duration;
          target = translation.target;
          property = multilingual.property;
          traditions = multilingual.traditions |> Ley_IntSet.fromList;
          prerequisites =
            multilingual.prerequisites
            |> Ley_Option.option []
                 (Prerequisite.Collection.Activatable.Decode.resolveTranslations
                    langs);
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
