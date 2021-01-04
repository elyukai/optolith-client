type staticEntry =
  | Blessing of Blessing.Static.t
  | Cantrip of Cantrip.Static.t
  | TradeSecret of TradeSecret.t
  | Language of Language.t
  | Script of Script.t
  | AnimalShape of AnimalShape.t
  | SpellEnhancement of Enhancement.t
  | LiturgicalChantEnhancement of Enhancement.t
  | ArcaneBardTradition of ArcaneTradition.t
  | ArcaneDancerTradition of ArcaneTradition.t
  | Element of Element.t
  | Property of Property.t
  | Aspect of Aspect.t
  | Disease of Disease.t
  | Poison of Poison.t
  | MeleeCombatTechnique of CombatTechnique.Melee.Static.t
  | RangedCombatTechnique of CombatTechnique.Ranged.Static.t
  | LiturgicalChant of LiturgicalChant.Static.t
  | Ceremony of Ceremony.Static.t
  | Skill of Skill.Static.t
  | Spell of Spell.Static.t
  | Ritual of Ritual.Static.t

type t = {
  id : Id.Activatable.SelectOption.t;
  name : string;
  apValue : int option;
  prerequisites : Prerequisite.Collection.General.t;
  description : string option;
  isSecret : bool option;
  languages : int list option;
  continent : int option;
  isExtinct : bool option;
  specializations : string list option;
  specializationInput : string option;
  animalGr : int option;
  animalLevel : int option;
  enhancementTarget : int option;
  enhancementLevel : int option;
  staticEntry : staticEntry option;
  applications : Skill.Static.Application.t list option;
      (** needed to be able to filter valid applications without altering the static entry *)
  src : PublicationRef.t list;
  errata : Erratum.t list;
}

module Map = Ley_Map.Make (Id.Activatable.SelectOption)

type map = t Map.t

module Decode = struct
  module F = Ley_Function
  module L = Ley_List
  module O = Ley_Option
  module IM = Ley_IntMap

  module Conversion = struct
    let make ~id ~name ?apValue ~staticEntry ~src ~errata () =
      {
        id;
        name;
        apValue;
        prerequisites = Plain [];
        description = None;
        isSecret = None;
        languages = None;
        continent = None;
        isExtinct = None;
        specializations = None;
        specializationInput = None;
        animalGr = None;
        animalLevel = None;
        enhancementTarget = None;
        enhancementLevel = None;
        staticEntry = Some staticEntry;
        applications = None;
        src;
        errata;
      }

    let from_blessing (x : Blessing.Static.t) =
      make ~id:(Blessing x.id) ~name:x.name ~staticEntry:(Blessing x) ~src:x.src
        ~errata:x.errata ()

    let from_cantrip (x : Cantrip.Static.t) =
      make ~id:(Cantrip x.id) ~name:x.name ~staticEntry:(Cantrip x) ~src:x.src
        ~errata:x.errata ()

    let from_melee_combat_technique (x : CombatTechnique.Melee.Static.t) =
      make ~id:(MeleeCombatTechnique x.id) ~name:x.name
        ~apValue:(IC.getApForActivatation x.ic)
        ~staticEntry:(MeleeCombatTechnique x) ~src:x.src ~errata:x.errata ()

    let from_ranged_combat_technique (x : CombatTechnique.Ranged.Static.t) =
      make ~id:(RangedCombatTechnique x.id) ~name:x.name
        ~apValue:(IC.getApForActivatation x.ic)
        ~staticEntry:(RangedCombatTechnique x) ~src:x.src ~errata:x.errata ()

    let from_liturgical_chant (x : LiturgicalChant.Static.t) =
      make ~id:(LiturgicalChant x.id) ~name:x.name
        ~apValue:(IC.getApForActivatation x.ic)
        ~staticEntry:(LiturgicalChant x) ~src:x.src ~errata:x.errata ()

    let from_ceremony (x : Ceremony.Static.t) =
      make ~id:(Ceremony x.id) ~name:x.name
        ~apValue:(IC.getApForActivatation x.ic)
        ~staticEntry:(Ceremony x) ~src:x.src ~errata:x.errata ()

    let from_skill (x : Skill.Static.t) =
      make ~id:(Skill x.id) ~name:x.name
        ~apValue:(IC.getApForActivatation x.ic)
        ~staticEntry:(Skill x) ~src:x.src ~errata:x.errata ()

    let from_spell (x : Spell.Static.t) =
      make ~id:(Spell x.id) ~name:x.name
        ~apValue:(IC.getApForActivatation x.ic)
        ~staticEntry:(Spell x) ~src:x.src ~errata:x.errata ()

    let from_ritual (x : Ritual.Static.t) =
      make ~id:(Ritual x.id) ~name:x.name
        ~apValue:(IC.getApForActivatation x.ic)
        ~staticEntry:(Ritual x) ~src:x.src ~errata:x.errata ()

    let from_trade_secret (x : TradeSecret.t) =
      make ~id:(TradeSecret x.id) ~name:x.name ~staticEntry:(TradeSecret x)
        ~src:x.src ~errata:x.errata ()

    let from_language (x : Language.t) =
      make ~id:(Language x.id) ~name:x.name ~staticEntry:(Language x) ~src:x.src
        ~errata:x.errata ()

    let from_script (x : Script.t) =
      make ~id:(Script x.id) ~name:x.name ~apValue:x.apValue
        ~staticEntry:(Script x) ~src:x.src ~errata:x.errata ()

    let from_animal_shape animal_shape_sizes src errata (x : AnimalShape.t) =
      make ~id:(AnimalShape x.id) ~name:x.name
        ?apValue:
          O.Infix.(
            animal_shape_sizes |> Ley_IntMap.lookup x.size
            <&> fun { AnimalShape.Size.apValue; _ } -> apValue)
        ~staticEntry:(AnimalShape x) ~src ~errata ()

    let from_arcane_bard_tradition src errata (x : ArcaneTradition.t) =
      make ~id:(ArcaneBardTradition x.id) ~name:x.name
        ~staticEntry:(ArcaneBardTradition x) ~src ~errata ()

    let from_arcane_dancer_tradition src errata (x : ArcaneTradition.t) =
      make ~id:(ArcaneDancerTradition x.id) ~name:x.name
        ~staticEntry:(ArcaneDancerTradition x) ~src ~errata ()

    let from_disease (x : Disease.t) =
      make ~id:(Disease x.id) ~name:x.name ~apValue:x.level
        ~staticEntry:(Disease x) ~src:x.src ~errata:x.errata ()

    let from_poison (x : Poison.t) =
      make ~id:(Poison x.id) ~name:x.name
        ~apValue:(match x.level with QL -> 6 | Fixed level -> level)
        ~staticEntry:(Poison x) ~src:x.src ~errata:x.errata ()

    let from_aspect src errata (x : Aspect.t) =
      make ~id:(Aspect x.id) ~name:x.name ~staticEntry:(Aspect x) ~src ~errata
        ()

    let from_element src errata (x : Element.t) =
      make ~id:(Element x.id) ~name:x.name ~staticEntry:(Element x) ~src ~errata
        ()

    let from_property src errata (x : Property.t) =
      make ~id:(Property x.id) ~name:x.name ~staticEntry:(Property x) ~src
        ~errata ()
  end

  module Derived = struct
    type select_option = t

    type selectOptionPrerequisite = {
      target : Id.Activatable.t;
      active : bool;
      level : int option;
    }

    let selectOptionPrerequisite json =
      Json_Decode_Strict.
        {
          target = json |> field "target" Id.Activatable.Decode.t;
          active = json |> field "active" bool;
          level = json |> optionalField "level" int;
        }

    type increasablePrerequisite =
      | Self of int
      | SelectOption of selectOptionPrerequisite

    let increasablePrerequisite =
      Json.Decode.(
        field "type" string
        |> andThen (function
             | "Self" -> field "value" int |> map (fun x -> Self x)
             | "SelectOption" ->
                 field "value" selectOptionPrerequisite
                 |> map (fun x -> SelectOption x)
             | str -> raise (DecodeError ("Unknown prerequisite type: " ^ str))))

    type increasableApValue =
      | DerivedFromIC of int
      | Fixed of { list : int Ley_IntMap.t; default : int }

    let increasableApValue =
      Json.Decode.(
        field "type" string
        |> andThen (function
             | "DerivedFromIC" ->
                 field "value" int |> map (fun x -> DerivedFromIC x)
             | "Fixed" ->
                 let element json =
                   (json |> field "id" int, json |> field "apValue" int)
                 in
                 let fixed json =
                   Fixed
                     {
                       list =
                         json
                         |> field "list" (list element)
                         |> Ley_IntMap.fromList;
                       default = json |> field "default" int;
                     }
                 in
                 field "value" fixed
             | str -> raise (DecodeError ("Unknown AP value type: " ^ str))))

    type specific = Include of int list | Exclude of int list

    let specific json =
      Ley_Option.Infix.(
        Json_Decode_Strict.(
          let include_list =
            json |> optionalField "specific" (list int) <&> fun xs -> Include xs
          in
          let exclude_list =
            json |> optionalField "exclude" (list int) <&> fun xs -> Exclude xs
          in
          include_list <|> exclude_list))

    type skillWithoutGroups = {
      specific : specific option;
      prerequisites : increasablePrerequisite list option;
      apValue : increasableApValue option;
    }

    let skillWithoutGroups json =
      Json_Decode_Strict.
        {
          specific = json |> specific;
          prerequisites =
            json |> optionalField "prerequisites" (list increasablePrerequisite);
          apValue = json |> optionalField "apValue" increasableApValue;
        }

    type t =
      | Blessings
      | Cantrips
      | TradeSecrets
      | Scripts
      | AnimalShapes
      | ArcaneBardTraditions
      | ArcaneDancerTraditions
      | Elements of { specific : specific option }
      | Properties of { requireKnowledge : bool option }
      | Aspects of {
          requireKnowledge : bool option;
          useMasterOfSuffixAsName : bool option;
        }
      | Diseases of { useHalfLevelAsApValue : bool option }
      | Poisons of { useHalfLevelAsApValue : bool option }
      | Languages of { prerequisites : selectOptionPrerequisite list option }
      | MeleeCombatTechniques of skillWithoutGroups
      | RangedCombatTechniques of skillWithoutGroups
      | LiturgicalChants of skillWithoutGroups
      | Ceremonies of skillWithoutGroups
      | Skills of {
          groups : int list option;
          specific : specific option;
          prerequisites : increasablePrerequisite list option;
          apValue : increasableApValue option;
        }
      | Spells of skillWithoutGroups
      | Rituals of skillWithoutGroups

    let t =
      Json_Decode_Strict.(
        field "category" string
        |> andThen (function
             | "Blessings" -> fun _ -> Blessings
             | "Cantrips" -> fun _ -> Cantrips
             | "TradeSecrets" -> fun _ -> TradeSecrets
             | "Scripts" -> fun _ -> Scripts
             | "AnimalShapes" -> fun _ -> AnimalShapes
             | "ArcaneBardTraditions" -> fun _ -> ArcaneBardTraditions
             | "ArcaneDancerTraditions" -> fun _ -> ArcaneDancerTraditions
             | "Elements" ->
                 fun json -> Elements { specific = json |> specific }
             | "Properties" ->
                 fun json ->
                   Properties
                     {
                       requireKnowledge =
                         json |> optionalField "requireKnowledge" bool;
                     }
             | "Aspects" ->
                 fun json ->
                   Aspects
                     {
                       requireKnowledge =
                         json |> optionalField "requireKnowledge" bool;
                       useMasterOfSuffixAsName =
                         json |> optionalField "useMasterOfSuffixAsName" bool;
                     }
             | "Diseases" ->
                 fun json ->
                   Diseases
                     {
                       useHalfLevelAsApValue =
                         json |> optionalField "useHalfLevelAsApValue" bool;
                     }
             | "Poisons" ->
                 fun json ->
                   Poisons
                     {
                       useHalfLevelAsApValue =
                         json |> optionalField "useHalfLevelAsApValue" bool;
                     }
             | "Languages" ->
                 fun json ->
                   Languages
                     {
                       prerequisites =
                         json
                         |> optionalField "prerequisites"
                              (list selectOptionPrerequisite);
                     }
             | "MeleeCombatTechniques" ->
                 skillWithoutGroups |> map (fun x -> MeleeCombatTechniques x)
             | "RangedCombatTechniques" ->
                 skillWithoutGroups |> map (fun x -> RangedCombatTechniques x)
             | "LiturgicalChants" ->
                 skillWithoutGroups |> map (fun x -> LiturgicalChants x)
             | "Ceremonies" -> skillWithoutGroups |> map (fun x -> Ceremonies x)
             | "Skills" ->
                 fun json ->
                   Skills
                     {
                       groups = json |> optionalField "groups" (list int);
                       specific = json |> specific;
                       prerequisites =
                         json
                         |> optionalField "prerequisites"
                              (list increasablePrerequisite);
                       apValue =
                         json |> optionalField "apValue" increasableApValue;
                     }
             | "Spells" -> skillWithoutGroups |> map (fun x -> Spells x)
             | "Rituals" -> skillWithoutGroups |> map (fun x -> Rituals x)
             | str -> raise (DecodeError ("Unknown derived category: " ^ str))))

    module Resolve = struct
      let insertIntoMap mp s = Map.insert s.id s mp

      let mapInsert f staticmp mp =
        Ley_IntMap.foldr
          (fun static mp -> static |> f |> insertIntoMap mp)
          mp staticmp

      let mapFilterMapInsert f filterMaps staticmp mp =
        Ley_IntMap.foldr
          (fun static mp ->
            let filterMap select_option =
              L.foldl'
                (fun g -> function Some acc -> g static acc | None -> None)
                filterMaps (Some select_option)
            in
            static |> f |> filterMap |> O.option mp (insertIntoMap mp))
          mp staticmp

      let resolve_specific_ids specific id =
        match specific with
        | Some specific ->
            let filter id =
              match specific with
              | Include xs -> L.elem id xs
              | Exclude xs -> L.notElem id xs
            in
            fun static x -> if filter (id static) then Some x else None
        | None -> F.const O.return

      let resolve_require_knowledge require_knowledge special_ability_id id =
        let create_prerequisite entry_id =
          Prerequisite.make
            (Prerequisite.General.Activatable
               {
                 id = special_ability_id;
                 active = true;
                 level = None;
                 options = [ entry_id ];
               })
        in
        match require_knowledge with
        | Some true ->
            fun static (x : select_option) ->
              Some
                {
                  x with
                  prerequisites = Plain [ create_prerequisite (id static) ];
                }
        | Some false | None -> F.const O.return

      let resolve_half_ap_value use_half_ap_value =
        match use_half_ap_value with
        | Some true ->
            fun _ (x : select_option) ->
              Some
                {
                  x with
                  apValue =
                    (* AP value has been set to full level by conversion script *)
                    O.Infix.(
                      x.apValue >>= fun apValue ->
                      Js.Int.toFloat apValue /. 2.0
                      |> Js.Math.ceil_int |> O.return);
                }
        | Some false | None -> F.const O.return

      let resolve_select_option_prerequisite { target; active; level } id =
        Prerequisite.make
          (Prerequisite.General.Activatable
             { id = target; active; level; options = [ id ] })

      let resolve_select_option_prerequisites prerequisites id =
        match prerequisites with
        | Some ps ->
            fun static (x : select_option) ->
              Some
                {
                  x with
                  prerequisites =
                    Plain
                      ( ps
                      |> L.map
                           (F.flip resolve_select_option_prerequisite
                              (id static)) );
                }
        | None -> F.const O.return

      let resolve_increasable_prerequisites prerequisites increasable_id
          select_option_id =
        let resolve_increasable_prerequisite static = function
          | Self sr ->
              Prerequisite.make
                (Prerequisite.General.Increasable
                   { id = increasable_id static; value = sr })
          | SelectOption options ->
              resolve_select_option_prerequisite options
                (select_option_id static)
        in
        match prerequisites with
        | Some ps ->
            fun static (x : select_option) ->
              Some
                {
                  x with
                  prerequisites =
                    Plain (ps |> L.map (resolve_increasable_prerequisite static));
                }
        | None -> F.const O.return

      let resolve_ap_value id ic ap_value =
        match ap_value with
        | Some (DerivedFromIC modifier) ->
            fun static (x : select_option) ->
              Some
                {
                  x with
                  apValue =
                    Some (ic static |> IC.getApForActivatation |> ( * ) modifier);
                }
        | Some (Fixed { list; default }) ->
            fun static (x : select_option) ->
              Some
                {
                  x with
                  apValue =
                    Some
                      ( id static |> F.flip IM.lookup list
                      |> O.fromOption default );
                }
        | None -> F.const O.return

      let resolve ~blessings ~cantrips ~trade_secrets ~languages ~scripts
          ~animal_shapes ~animal_shape_sizes ~arcane_bard_traditions
          ~arcane_dancer_traditions ~elements ~properties ~aspects ~diseases
          ~poisons ~melee_combat_techniques ~ranged_combat_techniques
          ~liturgical_chants ~ceremonies ~skills ~spells ~rituals ~src ~errata
          xs =
        Ley_List.foldl'
          (function
            | Blessings -> mapInsert Conversion.from_blessing blessings
            | Cantrips -> mapInsert Conversion.from_cantrip cantrips
            | TradeSecrets ->
                mapInsert Conversion.from_trade_secret trade_secrets
            | Scripts -> mapInsert Conversion.from_script scripts
            | AnimalShapes ->
                mapInsert
                  (Conversion.from_animal_shape animal_shape_sizes src errata)
                  animal_shapes
            | ArcaneBardTraditions ->
                mapInsert
                  (Conversion.from_arcane_bard_tradition src errata)
                  arcane_bard_traditions
            | ArcaneDancerTraditions ->
                mapInsert
                  (Conversion.from_arcane_dancer_tradition src errata)
                  arcane_dancer_traditions
            | Elements { specific } ->
                mapFilterMapInsert
                  (Conversion.from_element src errata)
                  [
                    resolve_specific_ids specific (fun (x : Element.t) -> x.id);
                  ]
                  elements
            | Properties { requireKnowledge } ->
                let property_knowledge_id =
                  Id.Activatable.MagicalSpecialAbility
                    (Id.SpecialAbility.MagicalSpecialAbility.toInt
                       PropertyKnowledge)
                in
                mapFilterMapInsert
                  (Conversion.from_property src errata)
                  [
                    resolve_require_knowledge requireKnowledge
                      property_knowledge_id (fun (x : Property.t) ->
                        Property x.id);
                  ]
                  properties
            | Aspects { requireKnowledge; useMasterOfSuffixAsName } ->
                let aspect_knowledge_id =
                  Id.Activatable.KarmaSpecialAbility
                    (Id.SpecialAbility.KarmaSpecialAbility.toInt
                       AspectKnowledge)
                in
                mapFilterMapInsert
                  (Conversion.from_aspect src errata)
                  [
                    resolve_require_knowledge requireKnowledge
                      aspect_knowledge_id (fun (x : Aspect.t) -> Aspect x.id);
                    ( match useMasterOfSuffixAsName with
                    | Some true ->
                        fun { masterOfAspectSuffix; _ } x ->
                          Some
                            {
                              x with
                              name = masterOfAspectSuffix |> O.fromOption x.name;
                            }
                    | Some false | None -> F.const O.return );
                  ]
                  aspects
            | Diseases { useHalfLevelAsApValue } ->
                mapFilterMapInsert Conversion.from_disease
                  [ resolve_half_ap_value useHalfLevelAsApValue ]
                  diseases
            | Poisons { useHalfLevelAsApValue } ->
                mapFilterMapInsert Conversion.from_poison
                  [ resolve_half_ap_value useHalfLevelAsApValue ]
                  poisons
            | Languages { prerequisites } ->
                mapFilterMapInsert Conversion.from_language
                  [
                    resolve_select_option_prerequisites prerequisites
                      (fun (x : Language.t) -> Language x.id);
                  ]
                  languages
            | MeleeCombatTechniques { specific; prerequisites; apValue } ->
                mapFilterMapInsert Conversion.from_melee_combat_technique
                  [
                    resolve_specific_ids specific
                      (fun (x : CombatTechnique.Melee.Static.t) -> x.id);
                    resolve_increasable_prerequisites prerequisites
                      (fun (x : CombatTechnique.Melee.Static.t) ->
                        MeleeCombatTechnique x.id)
                      (fun (x : CombatTechnique.Melee.Static.t) ->
                        MeleeCombatTechnique x.id);
                    resolve_ap_value
                      (fun (x : CombatTechnique.Melee.Static.t) -> x.id)
                      (fun (x : CombatTechnique.Melee.Static.t) -> x.ic)
                      apValue;
                  ]
                  melee_combat_techniques
            | RangedCombatTechniques { specific; prerequisites; apValue } ->
                mapFilterMapInsert Conversion.from_ranged_combat_technique
                  [
                    resolve_specific_ids specific
                      (fun (x : CombatTechnique.Ranged.Static.t) -> x.id);
                    resolve_increasable_prerequisites prerequisites
                      (fun (x : CombatTechnique.Ranged.Static.t) ->
                        RangedCombatTechnique x.id)
                      (fun (x : CombatTechnique.Ranged.Static.t) ->
                        RangedCombatTechnique x.id);
                    resolve_ap_value
                      (fun (x : CombatTechnique.Ranged.Static.t) -> x.id)
                      (fun (x : CombatTechnique.Ranged.Static.t) -> x.ic)
                      apValue;
                  ]
                  ranged_combat_techniques
            | LiturgicalChants { specific; prerequisites; apValue } ->
                mapFilterMapInsert Conversion.from_liturgical_chant
                  [
                    resolve_specific_ids specific
                      (fun (x : LiturgicalChant.Static.t) -> x.id);
                    resolve_increasable_prerequisites prerequisites
                      (fun (x : LiturgicalChant.Static.t) ->
                        LiturgicalChant x.id)
                      (fun (x : LiturgicalChant.Static.t) ->
                        LiturgicalChant x.id);
                    resolve_ap_value
                      (fun (x : LiturgicalChant.Static.t) -> x.id)
                      (fun (x : LiturgicalChant.Static.t) -> x.ic)
                      apValue;
                  ]
                  liturgical_chants
            | Ceremonies { specific; prerequisites; apValue } ->
                mapFilterMapInsert Conversion.from_ceremony
                  [
                    resolve_specific_ids specific
                      (fun (x : Ceremony.Static.t) -> x.id);
                    resolve_increasable_prerequisites prerequisites
                      (fun (x : Ceremony.Static.t) -> Ceremony x.id)
                      (fun (x : Ceremony.Static.t) -> Ceremony x.id);
                    resolve_ap_value
                      (fun (x : Ceremony.Static.t) -> x.id)
                      (fun (x : Ceremony.Static.t) -> x.ic)
                      apValue;
                  ]
                  ceremonies
            | Skills { groups; specific; prerequisites; apValue } ->
                mapFilterMapInsert Conversion.from_skill
                  [
                    ( match groups with
                    | Some included_groups ->
                        fun static x ->
                          if L.elem static.gr included_groups then Some x
                          else None
                    | None -> F.const O.return );
                    resolve_specific_ids specific (fun (x : Skill.Static.t) ->
                        x.id);
                    resolve_increasable_prerequisites prerequisites
                      (fun (x : Skill.Static.t) -> Skill x.id)
                      (fun (x : Skill.Static.t) -> Skill x.id);
                    resolve_ap_value
                      (fun (x : Skill.Static.t) -> x.id)
                      (fun (x : Skill.Static.t) -> x.ic)
                      apValue;
                  ]
                  skills
            | Spells { specific; prerequisites; apValue } ->
                mapFilterMapInsert Conversion.from_spell
                  [
                    resolve_specific_ids specific (fun (x : Spell.Static.t) ->
                        x.id);
                    resolve_increasable_prerequisites prerequisites
                      (fun (x : Spell.Static.t) -> Spell x.id)
                      (fun (x : Spell.Static.t) -> Spell x.id);
                    resolve_ap_value
                      (fun (x : Spell.Static.t) -> x.id)
                      (fun (x : Spell.Static.t) -> x.ic)
                      apValue;
                  ]
                  spells
            | Rituals { specific; prerequisites; apValue } ->
                mapFilterMapInsert Conversion.from_ritual
                  [
                    resolve_specific_ids specific (fun (x : Ritual.Static.t) ->
                        x.id);
                    resolve_increasable_prerequisites prerequisites
                      (fun (x : Ritual.Static.t) -> Ritual x.id)
                      (fun (x : Ritual.Static.t) -> Ritual x.id);
                    resolve_ap_value
                      (fun (x : Ritual.Static.t) -> x.id)
                      (fun (x : Ritual.Static.t) -> x.ic)
                      apValue;
                  ]
                  rituals)
          xs Map.empty
    end
  end

  module Explicit = struct
    module Preset = struct
      module Translation = struct
        type t = { errata : Erratum.list option }

        let t json =
          Json_Decode_Strict.
            { errata = json |> optionalField "errata" Erratum.Decode.list }

        let pred _ = true
      end

      module TranslationMap = Json_Decode_TranslationMap.Make (Translation)

      type multilingual = {
        id : Id.Activatable.SelectOption.t;
        prerequisites :
          Prerequisite.Collection.General.Decode.multilingual option;
        apValue : int option;
        src : PublicationRef.Decode.multilingual list option;
        translations : Translation.t Json_Decode_TranslationMap.partial option;
      }

      let multilingual json =
        Json_Decode_Strict.
          {
            id = json |> field "id" Id.Activatable.SelectOption.Decode.t;
            prerequisites =
              json
              |> optionalField "prerequisites"
                   Prerequisite.Collection.General.Decode.multilingual;
            apValue = json |> optionalField "apValue" int;
            src =
              json |> optionalField "src" PublicationRef.Decode.multilingualList;
            translations = json |> optionalField "translations" TranslationMap.t;
          }

      let make get_preset langs (multilingual : multilingual)
          (maybe_translation : Translation.t option) =
        O.Infix.(
          get_preset multilingual.id <&> fun (preset : t) ->
          {
            preset with
            prerequisites =
              multilingual.prerequisites
              <&> Prerequisite.Collection.General.Decode.resolveTranslations
                    langs
              |> O.fromOption (Prerequisite.Collection.ByLevel.Plain []);
            apValue = multilingual.apValue <|> preset.apValue;
            src =
              multilingual.src
              |> O.option preset.src
                   (PublicationRef.Decode.resolveTranslationsList langs);
            errata =
              maybe_translation
              >>= (fun translation -> translation.errata)
              |> O.fromOption preset.errata;
          })

      let resolveTranslations get_preset langs (x : multilingual) =
        Ley_Option.Infix.(
          x.translations
          >>= TranslationMap.getFromLanguageOrder langs
          |> make get_preset langs x)

      let resolveId ~blessings ~cantrips ~trade_secrets ~languages ~scripts
          ~animal_shapes ~animal_shape_sizes ~arcane_bard_traditions
          ~arcane_dancer_traditions ~elements ~properties ~aspects ~diseases
          ~poisons ~melee_combat_techniques ~ranged_combat_techniques
          ~liturgical_chants ~ceremonies ~skills ~spells ~rituals ~src ~errata =
        O.Infix.(
          function
          | Id.Activatable.SelectOption.Generic _ -> None
          | Blessing id ->
              blessings |> Ley_IntMap.lookup id <&> Conversion.from_blessing
          | Cantrip id ->
              cantrips |> Ley_IntMap.lookup id <&> Conversion.from_cantrip
          | TradeSecret id ->
              trade_secrets |> Ley_IntMap.lookup id
              <&> Conversion.from_trade_secret
          | Language id ->
              languages |> Ley_IntMap.lookup id <&> Conversion.from_language
          | Script id ->
              scripts |> Ley_IntMap.lookup id <&> Conversion.from_script
          | AnimalShape id ->
              animal_shapes |> Ley_IntMap.lookup id
              <&> Conversion.from_animal_shape animal_shape_sizes src errata
          | ArcaneBardTradition id ->
              arcane_bard_traditions |> Ley_IntMap.lookup id
              <&> Conversion.from_arcane_bard_tradition src errata
          | ArcaneDancerTradition id ->
              arcane_dancer_traditions |> Ley_IntMap.lookup id
              <&> Conversion.from_arcane_dancer_tradition src errata
          | Element id ->
              elements |> Ley_IntMap.lookup id
              <&> Conversion.from_element src errata
          | Property id ->
              properties |> Ley_IntMap.lookup id
              <&> Conversion.from_property src errata
          | Aspect id ->
              aspects |> Ley_IntMap.lookup id
              <&> Conversion.from_aspect src errata
          | Disease id ->
              diseases |> Ley_IntMap.lookup id <&> Conversion.from_disease
          | Poison id ->
              poisons |> Ley_IntMap.lookup id <&> Conversion.from_poison
          | MeleeCombatTechnique id ->
              melee_combat_techniques |> Ley_IntMap.lookup id
              <&> Conversion.from_melee_combat_technique
          | RangedCombatTechnique id ->
              ranged_combat_techniques |> Ley_IntMap.lookup id
              <&> Conversion.from_ranged_combat_technique
          | LiturgicalChant id ->
              liturgical_chants |> Ley_IntMap.lookup id
              <&> Conversion.from_liturgical_chant
          | Ceremony id ->
              ceremonies |> Ley_IntMap.lookup id <&> Conversion.from_ceremony
          | Skill id -> skills |> Ley_IntMap.lookup id <&> Conversion.from_skill
          | Spell id -> spells |> Ley_IntMap.lookup id <&> Conversion.from_spell
          | Ritual id ->
              rituals |> Ley_IntMap.lookup id <&> Conversion.from_ritual)
    end

    module Custom = struct
      module Translation = struct
        type t = {
          name : string;
          description : string option;
          errata : Erratum.list option;
        }

        let t json =
          Json_Decode_Strict.
            {
              name = json |> field "name" string;
              description = json |> optionalField "description" string;
              errata = json |> optionalField "errata" Erratum.Decode.list;
            }

        let pred _ = true
      end

      module TranslationMap = Json_Decode_TranslationMap.Make (Translation)

      type multilingual = {
        id : int;
        prerequisites :
          Prerequisite.Collection.General.Decode.multilingual option;
        apValue : int option;
        src : PublicationRef.Decode.multilingual list option;
        translations : Translation.t Json_Decode_TranslationMap.partial;
      }

      let multilingual json =
        Json_Decode_Strict.
          {
            id = json |> field "id" int;
            prerequisites =
              json
              |> optionalField "prerequisites"
                   Prerequisite.Collection.General.Decode.multilingual;
            apValue = json |> optionalField "apValue" int;
            src =
              json |> optionalField "src" PublicationRef.Decode.multilingualList;
            translations = json |> field "translations" TranslationMap.t;
          }

      let make main_src langs (multilingual : multilingual)
          (translation : Translation.t) =
        O.Infix.
          {
            id = Generic multilingual.id;
            name = translation.name;
            description = translation.description;
            prerequisites =
              multilingual.prerequisites
              <&> Prerequisite.Collection.General.Decode.resolveTranslations
                    langs
              |> O.fromOption (Prerequisite.Collection.ByLevel.Plain []);
            apValue = multilingual.apValue;
            isSecret = None;
            languages = None;
            continent = None;
            isExtinct = None;
            specializations = None;
            specializationInput = None;
            animalGr = None;
            animalLevel = None;
            enhancementTarget = None;
            enhancementLevel = None;
            applications = None;
            staticEntry = None;
            src =
              multilingual.src
              |> O.option main_src
                   (PublicationRef.Decode.resolveTranslationsList langs);
            errata = translation.errata |> O.fromOption [];
          }

      let resolveTranslations main_src langs x =
        Ley_Option.Infix.(
          x.translations
          |> TranslationMap.getFromLanguageOrder langs
          <&> make main_src langs x)
    end

    type multilingual =
      | Preset of Preset.multilingual
      | Custom of Custom.multilingual

    let multilingual =
      Json.Decode.(
        field "type" string
        |> andThen (function
             | "Preset" ->
                 field "value" Preset.multilingual |> map (fun x -> Preset x)
             | "Custom" ->
                 field "value" Custom.multilingual |> map (fun x -> Custom x)
             | str ->
                 raise
                   (DecodeError ("Unknown explicit select option type: " ^ str))))

    let resolveTranslations get_preset langs main_src = function
      | Preset multilingual ->
          multilingual |> Preset.resolveTranslations get_preset langs
      | Custom multilingual ->
          multilingual |> Custom.resolveTranslations main_src langs

    let resolve get_preset langs main_src xs =
      let fold x =
        x
        |> resolveTranslations get_preset langs main_src
        |> O.option F.id (fun value -> Map.insert value.id value)
      in
      Ley_List.foldl' fold xs Map.empty
  end

  type multilingual =
    | Derived of Derived.t list
    | Explicit of Explicit.multilingual list

  let multilingual =
    Json.Decode.(
      field "type" string
      |> andThen (function
           | "Derived" ->
               field "value" (list Derived.t) |> map (fun x -> Derived x)
           | "Explicit" ->
               field "value" (list Explicit.multilingual)
               |> map (fun x -> Explicit x)
           | str -> raise (DecodeError ("Unknown select option type: " ^ str))))

  let resolve ~blessings ~cantrips ~trade_secrets ~languages ~scripts
      ~animal_shapes ~animal_shape_sizes ~arcane_bard_traditions
      ~arcane_dancer_traditions ~elements ~properties ~aspects ~diseases
      ~poisons ~melee_combat_techniques ~ranged_combat_techniques
      ~liturgical_chants ~ceremonies ~skills ~spells ~rituals ~src ~errata langs
      = function
    | Derived derived ->
        Derived.Resolve.resolve ~blessings ~cantrips ~trade_secrets ~languages
          ~scripts ~animal_shapes ~animal_shape_sizes ~arcane_bard_traditions
          ~arcane_dancer_traditions ~elements ~properties ~aspects ~diseases
          ~poisons ~melee_combat_techniques ~ranged_combat_techniques
          ~liturgical_chants ~ceremonies ~skills ~spells ~rituals ~src ~errata
          derived
    | Explicit explicit ->
        Explicit.resolve
          (Explicit.Preset.resolveId ~blessings ~cantrips ~trade_secrets
             ~languages ~scripts ~animal_shapes ~animal_shape_sizes
             ~arcane_bard_traditions ~arcane_dancer_traditions ~elements
             ~properties ~aspects ~diseases ~poisons ~melee_combat_techniques
             ~ranged_combat_techniques ~liturgical_chants ~ceremonies ~skills
             ~spells ~rituals ~src ~errata)
          langs src explicit
end
