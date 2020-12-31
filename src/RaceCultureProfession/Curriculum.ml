module Dynamic = struct
  type t = { id : int; lessonPackage : int option }
end

module Static = struct
  type restrictedSpellwork =
    | Spell of int
    | Ritual of int
    | Property of int
    | OneFromProperty of int
    | DemonSummoning
    | Borbaradian
    | DamageIntelligent

  type lessonPackage = {
    id : int;
    name : string;
    apValue : int;
    meleeCombatTechniques : int Ley_IntMap.t;
    rangedCombatTechniques : int Ley_IntMap.t;
    skills : int Ley_IntMap.t;
    spells : int Ley_IntMap.t;
    rituals : int Ley_IntMap.t;
  }

  type t = {
    id : int;
    name : string;
    guideline : int;
    electiveSpellworks : int list;
    restrictedSpellworks : restrictedSpellwork list;
    lessonPackages : lessonPackage Ley_IntMap.t;
    src : PublicationRef.list;
    errata : Erratum.list;
  }

  module Decode = struct
    module LessonPackage = struct
      include Json_Decode_Static.Nested.Make (struct
        type t = lessonPackage

        module Translation = struct
          type t = { name : string }

          let t json = Json.Decode.{ name = json |> field "name" string }

          let pred _ = true
        end

        type skill = { id : int; value : int }

        let skill json =
          Json.Decode.
            { id = json |> field "id" int; value = json |> field "value" int }

        let skill_to_pair { id; value } = (id, value)

        type multilingual = {
          id : int;
          apValue : int;
          meleeCombatTechniques : skill list option;
          rangedCombatTechniques : skill list option;
          skills : skill list option;
          spells : skill list;
          rituals : skill list option;
          translations : Translation.t Json_Decode_TranslationMap.partial;
        }

        let multilingual decodeTranslations json =
          Json_Decode_Strict.
            {
              id = json |> field "id" int;
              apValue = json |> field "apValue" int;
              meleeCombatTechniques =
                json |> optionalField "meleeCombatTechniques" (list skill);
              rangedCombatTechniques =
                json |> optionalField "rangedCombatTechniques" (list skill);
              skills =
                json |> optionalField "rangedCombatTechniques" (list skill);
              spells = json |> field "spells" (list skill);
              rituals = json |> optionalField "rituals" (list skill);
              translations = json |> field "translations" decodeTranslations;
            }

        let make _ (multilingual : multilingual) (translation : Translation.t) =
          Some
            {
              id = multilingual.id;
              name = translation.name;
              apValue = multilingual.apValue;
              meleeCombatTechniques =
                multilingual.meleeCombatTechniques
                |> Ley_Option.option [] (Ley_List.map skill_to_pair)
                |> Ley_IntMap.fromList;
              rangedCombatTechniques =
                multilingual.rangedCombatTechniques
                |> Ley_Option.option [] (Ley_List.map skill_to_pair)
                |> Ley_IntMap.fromList;
              skills =
                multilingual.skills
                |> Ley_Option.option [] (Ley_List.map skill_to_pair)
                |> Ley_IntMap.fromList;
              spells =
                multilingual.spells |> Ley_List.map skill_to_pair
                |> Ley_IntMap.fromList;
              rituals =
                multilingual.rituals
                |> Ley_Option.option [] (Ley_List.map skill_to_pair)
                |> Ley_IntMap.fromList;
            }

        module Accessors = struct
          let id (x : t) = x.id

          let translations x = x.translations
        end
      end)

      let to_pair (x : lessonPackage) = (x.id, x)
    end

    let restrictedSpellwork =
      Json.Decode.(
        field "type" string
        |> andThen (function
             | "Spell" -> field "value" int |> map (fun id -> Spell id)
             | "Ritual" -> field "value" int |> map (fun id -> Ritual id)
             | "Property" -> field "value" int |> map (fun id -> Property id)
             | "OneFromProperty" ->
                 field "value" int |> map (fun id -> OneFromProperty id)
             | "DemonSummoning" -> fun _ -> DemonSummoning
             | "Borbaradian" -> fun _ -> Borbaradian
             | "DamageIntelligent" -> fun _ -> DamageIntelligent
             | str ->
                 raise
                   (DecodeError ("Unknown restricted spellwork type: " ^ str))))

    include Json_Decode_Static.Make (struct
      type nonrec t = t

      module Translation = struct
        type t = { name : string; errata : Erratum.list option }

        let t json =
          Json_Decode_Strict.
            {
              name = json |> field "name" string;
              errata = json |> optionalField "errata" Erratum.Decode.list;
            }

        let pred _ = true
      end

      type multilingual = {
        id : int;
        guideline : int;
        electiveSpellworks : int list;
        restrictedSpellworks : restrictedSpellwork list;
        lessonPackages : LessonPackage.multilingual list;
        src : PublicationRef.Decode.multilingual list;
        translations : Translation.t Json_Decode_TranslationMap.partial;
      }

      let multilingual decodeTranslations json =
        Json.Decode.
          {
            id = json |> field "id" int;
            guideline = json |> field "guideline" int;
            electiveSpellworks = json |> field "electiveSpellworks" (list int);
            restrictedSpellworks =
              json |> field "restrictedSpellworks" (list restrictedSpellwork);
            lessonPackages =
              json |> field "lessonPackages" (list LessonPackage.multilingual);
            src = json |> field "src" PublicationRef.Decode.multilingualList;
            translations = json |> field "translations" decodeTranslations;
          }

      let make langs (multilingual : multilingual) (translation : Translation.t)
          =
        Some
          {
            id = multilingual.id;
            name = translation.name;
            guideline = multilingual.guideline;
            electiveSpellworks = multilingual.electiveSpellworks;
            restrictedSpellworks = multilingual.restrictedSpellworks;
            lessonPackages =
              Ley_Option.Infix.(
                multilingual.lessonPackages
                |> Ley_Option.mapOption (fun pkg ->
                       pkg
                       |> LessonPackage.resolveTranslations langs
                       <&> LessonPackage.to_pair)
                |> Ley_IntMap.fromList);
            src =
              PublicationRef.Decode.resolveTranslationsList langs
                multilingual.src;
            errata = translation.errata |> Ley_Option.fromOption [];
          }

      module Accessors = struct
        let id (x : t) = x.id

        let translations x = x.translations
      end
    end)
  end
end
