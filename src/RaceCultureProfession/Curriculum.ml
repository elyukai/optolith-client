module Static = struct
  type restricted_spellwork =
    | Spell of int
    | Ritual of int
    | Property of int
    | OneFromProperty of int
    | DemonSummoning
    | Borbaradian
    | DamageIntelligent

  type lesson_package = {
    id : int;
    name : string;
    ap_value : int;
    melee_combat_techniques : int Ley_IntMap.t;
    ranged_combat_techniques : int Ley_IntMap.t;
    skills : int Ley_IntMap.t;
    spells : int Ley_IntMap.t;
    rituals : int Ley_IntMap.t;
  }

  type t = {
    id : int;
    name : string;
    guideline : int;
    elective_spellworks : int list;
    restricted_spellworks : restricted_spellwork list;
    lesson_packages : lesson_package Ley_IntMap.t;
    src : PublicationRef.list;
    errata : Erratum.list;
  }

  module Decode = struct
    module LessonPackage = struct
      include Json_Decode_Static.Nested.Make (struct
        type t = lesson_package

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
          ap_value : int;
          melee_combat_techniques : skill list option;
          ranged_combat_techniques : skill list option;
          skills : skill list option;
          spells : skill list;
          rituals : skill list option;
          translations : Translation.t Json_Decode_TranslationMap.partial;
        }

        let multilingual decodeTranslations json =
          Json_Decode_Strict.
            {
              id = json |> field "id" int;
              ap_value = json |> field "apValue" int;
              melee_combat_techniques =
                json |> optionalField "meleeCombatTechniques" (list skill);
              ranged_combat_techniques =
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
              ap_value = multilingual.ap_value;
              melee_combat_techniques =
                multilingual.melee_combat_techniques
                |> Ley_Option.option [] (Ley_List.map skill_to_pair)
                |> Ley_IntMap.fromList;
              ranged_combat_techniques =
                multilingual.ranged_combat_techniques
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

      let to_pair (x : lesson_package) = (x.id, x)
    end

    let restricted_spellwork =
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
        elective_spellworks : int list;
        restricted_spellworks : restricted_spellwork list;
        lesson_packages : LessonPackage.multilingual list;
        src : PublicationRef.Decode.multilingual list;
        translations : Translation.t Json_Decode_TranslationMap.partial;
      }

      let multilingual decodeTranslations json =
        Json.Decode.
          {
            id = json |> field "id" int;
            guideline = json |> field "guideline" int;
            elective_spellworks = json |> field "electiveSpellworks" (list int);
            restricted_spellworks =
              json |> field "restrictedSpellworks" (list restricted_spellwork);
            lesson_packages =
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
            elective_spellworks = multilingual.elective_spellworks;
            restricted_spellworks = multilingual.restricted_spellworks;
            lesson_packages =
              Ley_Option.Infix.(
                multilingual.lesson_packages
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

module Dynamic = struct
  type t = { id : int; lesson_package : int option; static : Static.t option }
end
