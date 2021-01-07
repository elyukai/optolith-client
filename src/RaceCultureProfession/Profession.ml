module F = Ley_Function
module IM = Ley_IntMap
module O = Ley_Option

module Static = struct
  module Options = struct
    type 'a variant_override = Remove | Override of 'a

    type skill_specialization =
      | Specific of int OneOrMany.t
      | FromGroup of int OneOrMany.t

    type language_script = int

    type second_combat_technique = { amount : int; value : int }

    type combat_technique = {
      amount : int;
      value : int;
      second : second_combat_technique option;
      sid : int list;
    }

    type cantrip = { amount : int; sid : int list }

    type curse = int

    type terrain_knowledge = int list

    type skill = {
      gr : int option;
          (** If specified, only choose from skills of the specified group. *)
      value : int;
          (** The AP value the user can spend. *)
    }

    type activatable_skill = { id : int list; value : int }

    type variant = {
      skill_specialization : skill_specialization variant_override option;
      language_script : language_script option;
      combat_technique : combat_technique variant_override option;
      cantrip : cantrip option;
      curse : curse option;
      terrain_knowledge : terrain_knowledge option;
      skill : skill option;
      spells : activatable_skill list option;
      liturgical_chants : activatable_skill list option;
      guild_mage_unfamiliar_spell : bool;
    }

    let default_variant : variant =
      {
        skill_specialization = None;
        language_script = None;
        combat_technique = None;
        cantrip = None;
        curse = None;
        terrain_knowledge = None;
        skill = None;
        spells = None;
        liturgical_chants = None;
        guild_mage_unfamiliar_spell = false;
      }

    type t = {
      skill_specialization : skill_specialization option;
      language_script : language_script option;
      combat_technique : combat_technique option;
      cantrip : cantrip option;
      curse : curse option;
      terrain_knowledge : terrain_knowledge option;
      skill : skill option;
      spells : activatable_skill list option;
      liturgical_chants : activatable_skill list option;
      guild_mage_unfamiliar_spell : bool;
    }

    let default : t =
      {
        skill_specialization = None;
        language_script = None;
        combat_technique = None;
        cantrip = None;
        curse = None;
        terrain_knowledge = None;
        skill = None;
        spells = None;
        liturgical_chants = None;
        guild_mage_unfamiliar_spell = false;
      }

    module Decode = struct
      let variant_override decoder =
        Json.Decode.(
          field "type" string
          |> andThen (function
               | "Remove" -> F.const Remove
               | "Override" -> decoder |> map (fun x -> Override x)
               | str -> raise(DecodeError ("Unknown variant override type: " ^ str))))

      let skill_specialization =
        Json.Decode.(
          field "type" string
          |> andThen (function
               | "Single" ->
                   field "value" (OneOrMany.Decode.t int)
                   |> map (fun x -> Specific x)
               | "Group" ->
                   field "value" (OneOrMany.Decode.t int)
                   |> map (fun x -> FromGroup x)
               | str ->
                   raise
                     (DecodeError ("Unknown skill specialization type: " ^ str))))

      let language_and_script = Json.Decode.int

      let second_combat_technique json =
        Json.Decode.
          {
            amount = json |> field "amount" int;
            value = json |> field "value" int;
          }

      let combat_technique json =
        Json_Decode_Strict.
          {
            amount = json |> field "amount" int;
            value = json |> field "value" int;
            second = json |> optionalField "second" second_combat_technique;
            sid = json |> field "sid" (list int);
          }

      let cantrip json =
        Json.Decode.
          {
            amount = json |> field "amount" int;
            sid = json |> field "sid" (list int);
          }

      let curse = Json.Decode.int

      let terrain_knowledge = Json.Decode.(list int)

      let skill json =
        Json_Decode_Strict.
          {
            gr = json |> optionalField "gr" int;
            value = json |> field "value" int;
          }

      let activatable_skill json =
        Json_Decode_Strict.
          {
            id = json |> field "id" (list int);
            value = json |> field "value" int;
          }

      let variant json: variant =
        Json_Decode_Strict.
          ({
            skill_specialization =
              json
              |> optionalField "skillSpecialization" (variant_override skill_specialization);
            language_script =
              json |> optionalField "languageScript" language_and_script;
            combat_technique =
              json |> optionalField "combatTechnique" (variant_override combat_technique);
            cantrip = json |> optionalField "cantrip" cantrip;
            curse = json |> optionalField "curse" curse;
            terrain_knowledge =
              json |> optionalField "terrainKnowledge" terrain_knowledge;
            skill = json |> optionalField "skill" skill;
            spells = json |> optionalField "spells" (list activatable_skill);
            liturgical_chants =
              json |> optionalField "liturgicalChants" (list activatable_skill);
            guild_mage_unfamiliar_spell = false;
          })

      let t json =
        Json_Decode_Strict.(
          ( {
              skill_specialization =
                json |> optionalField "skillSpecialization" skill_specialization;
              language_script =
                json |> optionalField "languageScript" language_and_script;
              combat_technique = json |> optionalField "combatTechnique" combat_technique;
              cantrip = json |> optionalField "cantrip" cantrip;
              curse = json |> optionalField "curse" curse;
              terrain_knowledge =
                json |> optionalField "terrainKnowledge" terrain_knowledge;
              skill = json |> optionalField "skill" skill;
              spells = json |> optionalField "spells" (list activatable_skill);
              liturgical_chants =
                json
                |> optionalField "liturgicalChants" (list activatable_skill);
              guild_mage_unfamiliar_spell = false;
            }
            : t ))
    end

    let guild_mage_unfamiliar_spell prerequisites =
      prerequisites
      |> Ley_List.any (fun (x : Prerequisite.Profession.t) ->
             match x.value with
             | Activatable { id; active = true; _ } -> (
                 (
                   id
                   == Id.Activatable.MagicalTradition
                        (Id.SpecialAbility.MagicalTradition.toInt TraditionGuildMages)) [@warning
                                                                         "-44"]
                 )
             | Activatable _ | Sex _ | Race _ | Culture _  | Increasable _ -> false)
  end

  type name = Const of string | BySex of { m : string; f : string }

  let name =
    Json_Decode_Strict.(
      either (fun json -> json |> string |> (fun x -> Const x))
            (fun json -> BySex { m = json |> field "m" string; f = json |> field "f" string })
        )


        let split_combat_techniques xs =
          xs |> O.option (IM.empty, IM.empty) (
          List.fold_left (fun (mp1, mp2) {IdValue.id; value} ->
              match id with
              | Id.CombatTechnique.MeleeCombatTechnique id ->
                  (IM.insert value id mp1 , mp2)
              | RangedCombatTechnique id ->
                  (mp1, IM.insert value id mp2)
            )
            (IM.empty, IM.empty) )

        let split_spells xs =
        xs |> O.option (IM.empty, IM.empty) (
          List.fold_left (fun (mp1, mp2) {IdValue.id; value} ->
              match id with
              | Id.Spellwork.Spell id ->
                  (IM.insert value id mp1 , mp2)
              | Ritual id ->
                  (mp1, IM.insert value id mp2)
            )
            (IM.empty, IM.empty) )

        let split_liturgical_chants xs =
        xs |> O.option (IM.empty, IM.empty) (
          List.fold_left (fun (mp1, mp2) {IdValue.id; value} ->
              match id with
              | Id.LiturgicalChant.LiturgicalChant id ->
                  (IM.insert value id mp1 , mp2)
              | Ceremony id ->
                  (mp1, IM.insert value id mp2)
            )
            (IM.empty, IM.empty) )

  module Variant = struct
    type t = {
      id : int;
      name : name;
      ap_value : int;
      prerequisites : Prerequisite.Collection.Profession.t;
      options : Options.variant;
      special_abilities : Prerequisite.Activatable.t list;
      melee_combat_techniques : int IM.t;
      ranged_combat_techniques : int IM.t;
      skills : int IM.t;
      spells : int IM.t;
      rituals : int IM.t;
      liturgical_chants : int IM.t;
      ceremonies : int IM.t;
      blessings : int list;
      preceding_text : string option;
      full_text : string option;
      concluding_text : string option;
    }

    module Decode = Json_Decode_Static.Nested.Make (struct
      type nonrec t = t

      module Translation = struct
        type t = {
          name : name;
          preceding_text : string option;
          full_text : string option;
          concluding_text : string option;
        }

        let t
          json
          = Json_Decode_Strict.
               {
                 name = json |> field "name" name;
                 preceding_text = json |> optionalField "precedingText" string;
                 full_text = json |> optionalField "fullText" string;
                 concluding_text = json |> optionalField "concludingText" string;
               }

        let pred _ = true
      end

      type multilingual = {
        id : int;
        ap_value : int;
        prerequisites :
          Prerequisite.Collection.Profession.Decode.multilingual option;
        options : Options.variant option;
        special_abilities : Prerequisite.Activatable.t list option;
        combat_techniques : Id.CombatTechnique.t IdValue.t list option;
        skills : int IdValue.t list option;
        spells : Id.Spellwork.t IdValue.t list option;
        liturgical_chants : Id.LiturgicalChant.t IdValue.t list option;
        blessings : int list option;
        translations : Translation.t Json_Decode_TranslationMap.partial;
      }

      let multilingual decode_translations json =
        Json_Decode_Strict.
          {
            id = json |> field "id" int;
            ap_value = json |> field "apValue" int;
            prerequisites =
              json
              |> optionalField "prerequisites"
                   Prerequisite.Collection.Profession.Decode.multilingual;
            options = json |> optionalField "options" Options.Decode.variant;
            special_abilities =
              json
              |> optionalField "specialAbilities"
                   (list Prerequisite.Activatable.Decode.t);
            combat_techniques =
              json
              |> optionalField "combatTechniques"
                   (list (IdValue.Decode.t Id.CombatTechnique.Decode.t));
            skills =
              json |> optionalField "skills" (list (IdValue.Decode.t int));
            spells =
              json
              |> optionalField "spells"
                   (list (IdValue.Decode.t Id.Spellwork.Decode.t));
            liturgical_chants =
              json
              |> optionalField "liturgicalChants"
                   (list (IdValue.Decode.t Id.LiturgicalChant.Decode.t));
            blessings = json |> optionalField "blessings" (list int);
            translations = json |> field "translations" decode_translations;
          }

      let make langs (multilingual : multilingual) (translation : Translation.t)
          =
        let prerequisites =
          multilingual.prerequisites
          |> O.option []
               (Prerequisite.Collection.Profession.Decode.resolveTranslations
                  langs) in
        let melee_combat_techniques, ranged_combat_techniques = split_combat_techniques
        multilingual.combat_techniques
        in
        let spells, rituals = split_spells
        multilingual.spells in
        let liturgical_chants, ceremonies = split_liturgical_chants
        multilingual.liturgical_chants
      in
        Some
          {
            id = multilingual.id;
            name = translation.name;
            ap_value = multilingual.ap_value;
            prerequisites;
            options =
              {
                (multilingual.options |> O.fromOption Options.default_variant) with
                guild_mage_unfamiliar_spell =
                  Options.guild_mage_unfamiliar_spell prerequisites;
              };
            special_abilities = multilingual.special_abilities |> O.fromOption [];
            melee_combat_techniques;
            ranged_combat_techniques;
            skills = multilingual.skills |> O.option IM.empty (IM.from_list_with IdValue.Decode.to_assoc);
            spells; rituals;
            liturgical_chants; ceremonies;
            blessings = multilingual.blessings |> O.fromOption [];
            preceding_text = translation.preceding_text;
            full_text = translation.full_text;
            concluding_text = translation.concluding_text;
          }

      module Accessors = struct
        let id (x : t) = x.id

        let translations x = x.translations
      end
    end)
  end

  type t = {
    id : int;
    name : name;
    subname : name option;
    ap_value : int option;
    prerequisites : Prerequisite.Collection.Profession.t;
    prerequisites_start : string option;
    options : Options.t;
    special_abilities : Prerequisite.Activatable.t list;
    melee_combat_techniques : int IM.t;
    ranged_combat_techniques : int IM.t;
    skills : int IM.t;
    spells : int IM.t;
    rituals : int IM.t;
    liturgical_chants : int IM.t;
    ceremonies : int IM.t;
    blessings : int list;
    suggested_advantages : int list;
    suggested_advantages_text : string option;
    suggested_disadvantages : int list;
    suggested_disadvantages_text : string option;
    unsuitable_advantages : int list;
    unsuitable_advantages_text : string option;
    unsuitable_disadvantages : int list;
    unsuitable_disadvantages_text : string option;
    variants : Variant.t IM.t;
    is_variant_required : bool;
    curriculum : int option;
    gr : int;
    sgr : int;
        (** Divides the groups into smaller subgroups, e.g. "Mage", "Blessed One of the Twelve Gods" or "Fighter". *)
    src : PublicationRef.list;
    errata : Erratum.list;
  }

  module Decode = Json_Decode_Static.Make (struct
    type nonrec t = t

    module Translation = struct
      type t = {
        name : name;
        subname : name option;
        prerequisites_start : string option;
        suggested_advantages : string option;
        suggested_disadvantages : string option;
        unsuitable_advantages : string option;
        unsuitable_disadvantages : string option;
        errata : Erratum.list option;
      }

      let t json =
        Json_Decode_Strict.
          {
            name = json |> field "name" name;
            subname = json |> optionalField "subname" name;
            prerequisites_start =
              json |> optionalField "prerequisitesStart" string;
            suggested_advantages =
              json |> optionalField "suggestedAdvantages" string;
            suggested_disadvantages =
              json |> optionalField "suggestedDisadvantages" string;
            unsuitable_advantages =
              json |> optionalField "unsuitableAdvantages" string;
            unsuitable_disadvantages =
              json |> optionalField "unsuitableDisadvantages" string;
            errata = json |> optionalField "errata" Erratum.Decode.list;
          }

      let pred _ = true
    end

    type multilingual = {
      id : int;
      ap_value : int option;
      prerequisites :
        Prerequisite.Collection.Profession.Decode.multilingual option;
      options : Options.t option;
      special_abilities : Prerequisite.Activatable.t list option;
      combat_techniques : Id.CombatTechnique.t IdValue.t list option;
      skills : int IdValue.t list option;
      spells : Id.Spellwork.t IdValue.t list option;
      liturgical_chants : Id.LiturgicalChant.t IdValue.t list option;
      blessings : int list option;
      suggested_advantages : int list option;
      suggested_disadvantages : int list option;
      unsuitable_advantages : int list option;
      unsuitable_disadvantages : int list option;
      variants : Variant.Decode.multilingual list option;
      is_variant_required : bool;
      curriculum : int option;
      gr : int;
      sgr : int;
      src : PublicationRef.Decode.multilingual list;
      translations : Translation.t Json_Decode_TranslationMap.partial;
    }

    let multilingual decode_translations json =
      Json_Decode_Strict.
        {
          id = json |> field "id" int;
          ap_value = json |> optionalField "apValue" int;
          prerequisites =
            json
            |> optionalField "prerequisites"
                 Prerequisite.Collection.Profession.Decode.multilingual;
          options = json |> optionalField "options" Options.Decode.t;
          special_abilities =
            json
            |> optionalField "specialAbilities"
                 (list Prerequisite.Activatable.Decode.t);
          combat_techniques =
            json
            |> optionalField "combatTechniques"
                 (list (IdValue.Decode.t Id.CombatTechnique.Decode.t));
          skills = json |> optionalField "skills" (list (IdValue.Decode.t int));
          spells =
            json
            |> optionalField "spells"
                 (list (IdValue.Decode.t Id.Spellwork.Decode.t));
          liturgical_chants =
            json
            |> optionalField "liturgicalChants"
                 (list (IdValue.Decode.t Id.LiturgicalChant.Decode.t));
          blessings = json |> optionalField "blessings" (list int);
          suggested_advantages =
            json |> optionalField "suggestedAdvantages" (list int);
          suggested_disadvantages =
            json |> optionalField "suggestedDisadvantages" (list int);
          unsuitable_advantages =
            json |> optionalField "unsuitableAdvantages" (list int);
          unsuitable_disadvantages =
            json |> optionalField "unsuitableDisadvantages" (list int);
          variants =
            json |> optionalField "variants" (list Variant.Decode.multilingual);
          is_variant_required = json |> field "isVariantRequired" bool;
          curriculum = json |> optionalField "curriculum" int;
          gr = json |> field "gr" int;
          sgr = json |> field "sgr" int;
          src = json |> field "src" PublicationRef.Decode.multilingualList;
          translations = json |> field "translations" decode_translations;
        }

    let make langs (multilingual : multilingual) (translation : Translation.t): t option =
      let prerequisites =
        multilingual.prerequisites
        |> O.option []
             (Prerequisite.Collection.Profession.Decode.resolveTranslations
                langs)
      in
      let melee_combat_techniques, ranged_combat_techniques = split_combat_techniques
      multilingual.combat_techniques
      in
      let spells, rituals = split_spells
      multilingual.spells in
      let liturgical_chants, ceremonies = split_liturgical_chants
      multilingual.liturgical_chants in
      Some
        {
          id = multilingual.id;
          name = translation.name;
          subname = translation.subname;
          ap_value = multilingual.ap_value;
          prerequisites;
          prerequisites_start = translation.prerequisites_start;
          options =
            {
              (multilingual.options |> O.fromOption Options.default) with
              guild_mage_unfamiliar_spell =
                Options.guild_mage_unfamiliar_spell prerequisites;
            };
          special_abilities = multilingual.special_abilities |> O.fromOption [];
          melee_combat_techniques;
          ranged_combat_techniques;
          skills = multilingual.skills |> O.option IM.empty (IM.from_list_with IdValue.Decode.to_assoc);
          spells; rituals;
          liturgical_chants; ceremonies;
          blessings = multilingual.blessings |> O.fromOption [];
          suggested_advantages = multilingual.suggested_advantages |> O.fromOption [];
          suggested_advantages_text = translation.suggested_advantages;
          suggested_disadvantages = multilingual.suggested_disadvantages |> O.fromOption [];
          suggested_disadvantages_text = translation.suggested_disadvantages;
          unsuitable_advantages = multilingual.unsuitable_advantages |> O.fromOption [];
          unsuitable_advantages_text = translation.unsuitable_advantages;
          unsuitable_disadvantages = multilingual.unsuitable_disadvantages |> O.fromOption [];
          unsuitable_disadvantages_text = translation.unsuitable_disadvantages;
          variants =
            multilingual.variants
            |> O.option [] (O.mapOption (Variant.Decode.resolveTranslations langs))
            |> IM.from_list_with (fun (v: Variant.t) -> (v.id, v));
          is_variant_required = multilingual.is_variant_required;
          curriculum = multilingual.curriculum;
          gr = multilingual.gr;
          sgr = multilingual.sgr;
          src =
            PublicationRef.Decode.resolveTranslationsList langs multilingual.src;
          errata = translation.errata |> O.fromOption [];
        }

    module Accessors = struct
      let id (x : t) = x.id

      let translations x = x.translations
    end
  end)
end

module Dynamic = struct
  type t = Base of int | WithVariant of (int * int)
end
