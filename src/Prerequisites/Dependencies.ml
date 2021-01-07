module B = Ley_Bool
module F = Ley_Function
module I = Ley_Int
module L = Ley_List
module O = Ley_Option
module IM = Ley_IntMap
module IS = Ley_IntSet

type mode = Add | Remove

module Activatable = struct
  module Dynamic = Activatable_Dynamic

  (** [match_level] checks if the entry matches the required level, if a level
      is required. *)
  let match_level (dependency : Dynamic.dependency) (active : Dynamic.single) =
    match (dependency.level, active.level) with
    (* If there is no level dependency, skip *)
    | None, _ -> true
    (* If there is a level dependency but no actual level, skip (this case
       should not happen at all) *)
    | Some _, None -> false
    (* The active level must be at least the required level, if required. If
       prohibited, the level must be lower than the level specified in the
       dependency. This basically inverts the comparision and is why the result
       can be compared with the [active] boolean. *)
    | Some dependencyLevel, Some activeLevel ->
        activeLevel >= dependencyLevel == dependency.active

  (** [match_options] checks if the entry matches the required option(s), if one
      or more selected options are required. *)
  let match_options (dependency : Dynamic.dependency) (active : Dynamic.single)
      =
    let lookup_active_at_index i =
      O.Infix.(
        L.Safe.atMay active.options i
        >>= Activatable_Convert.activatable_option_to_select_option_id)
    in
    dependency.options
    |> L.Index.iall (fun i req_option ->
           (* Get the active option at the same position as the required option *)
           match (req_option, lookup_active_at_index i) with
           (* If no active option is available, the required option is not
              matched automatically *)
           | _, None -> false
           (* If only one option is possible, required and active options must
              be equal *)
           | OneOrMany.One req_option, Some active_option ->
               Id.Activatable.SelectOption.(active_option == req_option)
               = dependency.active
           (* If multiple options are possible, one must be equal to the active
              option *)
           | OneOrMany.Many req_options, Some active_option ->
               L.elem active_option req_options = dependency.active)

  (** [match_dep] checks if an active entry fulfills the given dependency. *)
  let match_dep dependency active =
    (match_level dependency active && match_options dependency active)
    (* Prohibiting instead of requiring a specific entry configuration is a
       logical inversion, which means that we can compare with the value if it
       should be required (true) or prohibited (false) to implement this
       inversion. *)
    == dependency.active
end

module Resolve = struct
  (** [increasable_deps] flattens the dependency list for a specific increasable
      entry. It filters out dependencies that do not need to be fulfilled and
      returns a plain list of required minimum values. *)
  let increasable_deps compare_values value_by_id id dependencies =
    let resolve_single { Increasable.Dynamic.target; value; _ } =
      match target with
      | One _ -> Some value
      | Many targets -> (
          targets
          (* Check if the dependency is met by another entry so that it can be
             ignored currently *)
          |> L.any (fun other_id ->
                 other_id != id
                 && compare_values ~current:(value_by_id other_id)
                      ~required:value)
          |> function
          | true -> None
          | false -> Some value )
    in
    O.mapOption resolve_single dependencies

  (** [skill_deps] flattens the dependency list for a specific skill. It filters
      out dependencies that do not need to be fulfilled and returns a plain list
      of required minimum values. *)
  let skill_deps =
    let compare_values ~current ~required = current >= required in
    increasable_deps compare_values

  (** [activatable_skill_deps] flattens the dependency list for a specific
      activatable skill. It filters out dependencies that do not need to be
      fulfilled and returns a plain list of required minimum values. *)
  let activatable_skill_deps =
    let compare_values ~current ~required =
      match current with
      (* If dependency requires an active entry, the other entry must
         have at least the required value *)
      | ActivatableSkill.Dynamic.Active value -> value >= required
      (* Otherwise the dependency is not met by the other entry *)
      | Inactive -> false
    in
    increasable_deps compare_values

  (** [activatable_deps] flattens the dependency list for a specific
      activatable. It filters out dependencies that do not need to be fulfilled
      and returns a plain list of dependencies. *)
  let activatable_deps actives_by_id id dependencies =
    let resolve_single (dep : Activatable_Dynamic.dependency) =
      match dep.target with
      | One _ -> Some dep
      | Many targets -> (
          targets
          (* Check if the dependency is met by another entry so that it can be
             ignored currently *)
          |> L.any (fun other_id ->
                 other_id != id
                 && id |> actives_by_id |> L.any (Activatable.match_dep dep))
          |> function
          | true -> None
          | false -> Some dep )
    in
    O.mapOption resolve_single dependencies

  (** [required_select_options_1] flattens the dependency list for a specific
      activatable. It filters out dependencies that do not need to be fulfilled
      and returns a plain list of required options at the first position in the
      options list. *)
  let required_select_options_1 other_activatables
      (x : 'a Activatable_Dynamic.t) =
    activatable_deps
      (fun id ->
        IM.lookup id other_activatables
        |> O.option [] (fun (x : 'a Activatable_Dynamic.t) -> x.active))
      x.id x.dependencies
    |> O.mapOption (fun (dep : Activatable_Dynamic.dependency) ->
           dep.options |> O.listToOption)
end

module Modify = struct
  module Make = struct
    (** Helper to create adding function for different types. *)
    module Base (Entry : sig
      type static

      type t

      type dependency

      val empty : static option -> int -> t

      val is_empty : t -> bool

      val modify_dependencies : (dependency list -> dependency list) -> t -> t

      val get_dep_target : dependency -> int OneOrMany.t

      val modify_hero : (t IM.t -> t IM.t) -> Hero.t -> Hero.t
    end) =
    struct
      let modify alter dep hero =
        let single id hero_acc =
          Entry.modify_hero (IM.alter (alter dep id) id) hero_acc
        in
        match Entry.get_dep_target dep with
        | One id -> single id hero
        | Many ids -> L.foldl' single ids hero

      let add mp =
        let alter dep id hero_entry =
          hero_entry
          |> O.fromOption (Entry.empty (IM.lookup id mp) id)
          |> Entry.modify_dependencies (List.cons dep)
          |> O.return
        in
        modify alter

      let remove =
        let alter dep _ hero_entry =
          O.Infix.(
            hero_entry
            <&> Entry.modify_dependencies (L.delete dep)
            >>= O.ensure (B.notP Entry.is_empty))
        in
        modify alter
    end
    [@@private]

    (** Helper to create adding function for different increasable types. *)
    module Increasable (Entry : sig
      type static

      type t = static Increasable.Dynamic.t

      val empty : static option -> int -> t

      val is_empty : t -> bool

      val modify_hero : (t IM.t -> t IM.t) -> Hero.t -> Hero.t
    end) =
    Base (struct
      include Entry

      type dependency = Increasable.Dynamic.dependency

      let modify_dependencies f (entry : t) =
        { entry with dependencies = f entry.dependencies }

      let get_dep_target (dep : dependency) = dep.target
    end)

    (** Helper to create adding function for different activatable skill types. *)
    module ActivatableSkill (Entry : sig
      type static

      type t = static ActivatableSkill.Dynamic.t

      val empty : static option -> int -> t

      val is_empty : t -> bool

      val modify_hero : (t IM.t -> t IM.t) -> Hero.t -> Hero.t
    end) =
    Base (struct
      include Entry

      type dependency = OptolithClient.Increasable.Dynamic.dependency

      let modify_dependencies f (entry : t) =
        { entry with dependencies = f entry.dependencies }

      let get_dep_target (dep : dependency) = dep.target
    end)

    (** Helper to create adding function for different activatable skill types. *)
    module Activatable (Entry : sig
      type static

      type t = static Activatable_Dynamic.t

      val empty : static option -> int -> t

      val is_empty : t -> bool

      val modify_hero : (t IM.t -> t IM.t) -> Hero.t -> Hero.t
    end) =
    Base (struct
      include Entry

      type dependency = Activatable_Dynamic.dependency

      let modify_dependencies f (entry : t) =
        { entry with dependencies = f entry.dependencies }

      let get_dep_target (dep : dependency) = dep.target
    end)
  end

  module Attribute = Make.Increasable (struct
    include Attribute.Dynamic

    let modify_hero f (hero : Hero.t) =
      { hero with attributes = f hero.attributes }
  end)

  module Skill = Make.Increasable (struct
    include Skill.Dynamic

    let modify_hero f (hero : Hero.t) = { hero with skills = f hero.skills }
  end)

  module MeleeCombatTechnique = Make.Increasable (struct
    include CombatTechnique.Melee.Dynamic

    let modify_hero f (hero : Hero.t) =
      { hero with melee_combat_techniques = f hero.melee_combat_techniques }
  end)

  module RangedCombatTechnique = Make.Increasable (struct
    include CombatTechnique.Ranged.Dynamic

    let modify_hero f (hero : Hero.t) =
      { hero with ranged_combat_techniques = f hero.ranged_combat_techniques }
  end)

  module Spell = Make.ActivatableSkill (struct
    include Spell.Dynamic

    let modify_hero f (hero : Hero.t) = { hero with spells = f hero.spells }
  end)

  module Ritual = Make.ActivatableSkill (struct
    include Ritual.Dynamic

    let modify_hero f (hero : Hero.t) = { hero with rituals = f hero.rituals }
  end)

  module LiturgicalChant = Make.ActivatableSkill (struct
    include LiturgicalChant.Dynamic

    let modify_hero f (hero : Hero.t) =
      { hero with liturgical_chants = f hero.liturgical_chants }
  end)

  module Ceremony = Make.ActivatableSkill (struct
    include Ceremony.Dynamic

    let modify_hero f (hero : Hero.t) =
      { hero with ceremonies = f hero.ceremonies }
  end)

  module Advantage = Make.Activatable (struct
    include Advantage.Dynamic

    let modify_hero f (hero : Hero.t) =
      { hero with advantages = f hero.advantages }
  end)

  module Disadvantage = Make.Activatable (struct
    include Disadvantage.Dynamic

    let modify_hero f (hero : Hero.t) =
      { hero with disadvantages = f hero.disadvantages }
  end)

  module GeneralSpecialAbility = Make.Activatable (struct
    include GeneralSpecialAbility.Dynamic

    let modify_hero f (hero : Hero.t) =
      {
        hero with
        special_abilities =
          {
            hero.special_abilities with
            general_special_abilities =
              f hero.special_abilities.general_special_abilities;
          };
      }
  end)

  module FatePointSpecialAbility = Make.Activatable (struct
    include FatePointSpecialAbility.Dynamic

    let modify_hero f (hero : Hero.t) =
      {
        hero with
        special_abilities =
          {
            hero.special_abilities with
            fate_point_special_abilities =
              f hero.special_abilities.fate_point_special_abilities;
          };
      }
  end)

  module CombatSpecialAbility = Make.Activatable (struct
    include CombatSpecialAbility.Dynamic

    let modify_hero f (hero : Hero.t) =
      {
        hero with
        special_abilities =
          {
            hero.special_abilities with
            combat_special_abilities =
              f hero.special_abilities.combat_special_abilities;
          };
      }
  end)

  module MagicalSpecialAbility = Make.Activatable (struct
    include MagicalSpecialAbility.Dynamic

    let modify_hero f (hero : Hero.t) =
      {
        hero with
        special_abilities =
          {
            hero.special_abilities with
            magical_special_abilities =
              f hero.special_abilities.magical_special_abilities;
          };
      }
  end)

  module StaffEnchantment = Make.Activatable (struct
    include StaffEnchantment.Dynamic

    let modify_hero f (hero : Hero.t) =
      {
        hero with
        special_abilities =
          {
            hero.special_abilities with
            staff_enchantments = f hero.special_abilities.staff_enchantments;
          };
      }
  end)

  module FamiliarSpecialAbility = Make.Activatable (struct
    include FamiliarSpecialAbility.Dynamic

    let modify_hero f (hero : Hero.t) =
      {
        hero with
        special_abilities =
          {
            hero.special_abilities with
            familiar_special_abilities =
              f hero.special_abilities.familiar_special_abilities;
          };
      }
  end)

  module KarmaSpecialAbility = Make.Activatable (struct
    include KarmaSpecialAbility.Dynamic

    let modify_hero f (hero : Hero.t) =
      {
        hero with
        special_abilities =
          {
            hero.special_abilities with
            karma_special_abilities =
              f hero.special_abilities.karma_special_abilities;
          };
      }
  end)

  module ProtectiveWardingCircleSpecialAbility = Make.Activatable (struct
    include ProtectiveWardingCircleSpecialAbility.Dynamic

    let modify_hero f (hero : Hero.t) =
      {
        hero with
        special_abilities =
          {
            hero.special_abilities with
            protective_warding_circle_special_abilities =
              f
                hero.special_abilities
                  .protective_warding_circle_special_abilities;
          };
      }
  end)

  module CombatStyleSpecialAbility = Make.Activatable (struct
    include CombatStyleSpecialAbility.Dynamic

    let modify_hero f (hero : Hero.t) =
      {
        hero with
        special_abilities =
          {
            hero.special_abilities with
            combat_style_special_abilities =
              f hero.special_abilities.combat_style_special_abilities;
          };
      }
  end)

  module AdvancedCombatSpecialAbility = Make.Activatable (struct
    include AdvancedCombatSpecialAbility.Dynamic

    let modify_hero f (hero : Hero.t) =
      {
        hero with
        special_abilities =
          {
            hero.special_abilities with
            advanced_combat_special_abilities =
              f hero.special_abilities.advanced_combat_special_abilities;
          };
      }
  end)

  module CommandSpecialAbility = Make.Activatable (struct
    include CommandSpecialAbility.Dynamic

    let modify_hero f (hero : Hero.t) =
      {
        hero with
        special_abilities =
          {
            hero.special_abilities with
            command_special_abilities =
              f hero.special_abilities.command_special_abilities;
          };
      }
  end)

  module MagicStyleSpecialAbility = Make.Activatable (struct
    include MagicStyleSpecialAbility.Dynamic

    let modify_hero f (hero : Hero.t) =
      {
        hero with
        special_abilities =
          {
            hero.special_abilities with
            magic_style_special_abilities =
              f hero.special_abilities.magic_style_special_abilities;
          };
      }
  end)

  module AdvancedMagicalSpecialAbility = Make.Activatable (struct
    include AdvancedMagicalSpecialAbility.Dynamic

    let modify_hero f (hero : Hero.t) =
      {
        hero with
        special_abilities =
          {
            hero.special_abilities with
            advanced_magical_special_abilities =
              f hero.special_abilities.advanced_magical_special_abilities;
          };
      }
  end)

  module SpellSwordEnchantment = Make.Activatable (struct
    include SpellSwordEnchantment.Dynamic

    let modify_hero f (hero : Hero.t) =
      {
        hero with
        special_abilities =
          {
            hero.special_abilities with
            spell_sword_enchantments =
              f hero.special_abilities.spell_sword_enchantments;
          };
      }
  end)

  module DaggerRitual = Make.Activatable (struct
    include DaggerRitual.Dynamic

    let modify_hero f (hero : Hero.t) =
      {
        hero with
        special_abilities =
          {
            hero.special_abilities with
            dagger_rituals = f hero.special_abilities.dagger_rituals;
          };
      }
  end)

  module InstrumentEnchantment = Make.Activatable (struct
    include InstrumentEnchantment.Dynamic

    let modify_hero f (hero : Hero.t) =
      {
        hero with
        special_abilities =
          {
            hero.special_abilities with
            instrument_enchantments =
              f hero.special_abilities.instrument_enchantments;
          };
      }
  end)

  module AttireEnchantment = Make.Activatable (struct
    include AttireEnchantment.Dynamic

    let modify_hero f (hero : Hero.t) =
      {
        hero with
        special_abilities =
          {
            hero.special_abilities with
            attire_enchantments = f hero.special_abilities.attire_enchantments;
          };
      }
  end)

  module OrbEnchantment = Make.Activatable (struct
    include OrbEnchantment.Dynamic

    let modify_hero f (hero : Hero.t) =
      {
        hero with
        special_abilities =
          {
            hero.special_abilities with
            orb_enchantments = f hero.special_abilities.orb_enchantments;
          };
      }
  end)

  module WandEnchantment = Make.Activatable (struct
    include WandEnchantment.Dynamic

    let modify_hero f (hero : Hero.t) =
      {
        hero with
        special_abilities =
          {
            hero.special_abilities with
            wand_enchantments = f hero.special_abilities.wand_enchantments;
          };
      }
  end)

  module BrawlingSpecialAbility = Make.Activatable (struct
    include BrawlingSpecialAbility.Dynamic

    let modify_hero f (hero : Hero.t) =
      {
        hero with
        special_abilities =
          {
            hero.special_abilities with
            brawling_special_abilities =
              f hero.special_abilities.brawling_special_abilities;
          };
      }
  end)

  module AncestorGlyph = Make.Activatable (struct
    include AncestorGlyph.Dynamic

    let modify_hero f (hero : Hero.t) =
      {
        hero with
        special_abilities =
          {
            hero.special_abilities with
            ancestor_glyphs = f hero.special_abilities.ancestor_glyphs;
          };
      }
  end)

  module CeremonialItemSpecialAbility = Make.Activatable (struct
    include CeremonialItemSpecialAbility.Dynamic

    let modify_hero f (hero : Hero.t) =
      {
        hero with
        special_abilities =
          {
            hero.special_abilities with
            ceremonial_item_special_abilities =
              f hero.special_abilities.ceremonial_item_special_abilities;
          };
      }
  end)

  module Sermon = Make.Activatable (struct
    include Sermon.Dynamic

    let modify_hero f (hero : Hero.t) =
      {
        hero with
        special_abilities =
          {
            hero.special_abilities with
            sermons = f hero.special_abilities.sermons;
          };
      }
  end)

  module LiturgicalStyleSpecialAbility = Make.Activatable (struct
    include LiturgicalStyleSpecialAbility.Dynamic

    let modify_hero f (hero : Hero.t) =
      {
        hero with
        special_abilities =
          {
            hero.special_abilities with
            liturgical_style_special_abilities =
              f hero.special_abilities.liturgical_style_special_abilities;
          };
      }
  end)

  module AdvancedKarmaSpecialAbility = Make.Activatable (struct
    include AdvancedKarmaSpecialAbility.Dynamic

    let modify_hero f (hero : Hero.t) =
      {
        hero with
        special_abilities =
          {
            hero.special_abilities with
            advanced_karma_special_abilities =
              f hero.special_abilities.advanced_karma_special_abilities;
          };
      }
  end)

  module Vision = Make.Activatable (struct
    include Vision.Dynamic

    let modify_hero f (hero : Hero.t) =
      {
        hero with
        special_abilities =
          {
            hero.special_abilities with
            visions = f hero.special_abilities.visions;
          };
      }
  end)

  module MagicalTradition = Make.Activatable (struct
    include MagicalTradition.Dynamic

    let modify_hero f (hero : Hero.t) =
      {
        hero with
        special_abilities =
          {
            hero.special_abilities with
            magical_traditions = f hero.special_abilities.magical_traditions;
          };
      }
  end)

  module BlessedTradition = Make.Activatable (struct
    include BlessedTradition.Dynamic

    let modify_hero f (hero : Hero.t) =
      {
        hero with
        special_abilities =
          {
            hero.special_abilities with
            blessed_traditions = f hero.special_abilities.blessed_traditions;
          };
      }
  end)

  module Paktgeschenk = Make.Activatable (struct
    include Paktgeschenk.Dynamic

    let modify_hero f (hero : Hero.t) =
      {
        hero with
        special_abilities =
          {
            hero.special_abilities with
            paktgeschenke = f hero.special_abilities.paktgeschenke;
          };
      }
  end)

  module SikaryanRaubSonderfertigkeit = Make.Activatable (struct
    include SikaryanRaubSonderfertigkeit.Dynamic

    let modify_hero f (hero : Hero.t) =
      {
        hero with
        special_abilities =
          {
            hero.special_abilities with
            sikaryan_raub_sonderfertigkeiten =
              f hero.special_abilities.sikaryan_raub_sonderfertigkeiten;
          };
      }
  end)

  module LykanthropischeGabe = Make.Activatable (struct
    include LykanthropischeGabe.Dynamic

    let modify_hero f (hero : Hero.t) =
      {
        hero with
        special_abilities =
          {
            hero.special_abilities with
            lykanthropische_gaben =
              f hero.special_abilities.lykanthropische_gaben;
          };
      }
  end)

  module Talentstilsonderfertigkeit = Make.Activatable (struct
    include Talentstilsonderfertigkeit.Dynamic

    let modify_hero f (hero : Hero.t) =
      {
        hero with
        special_abilities =
          {
            hero.special_abilities with
            talentstilsonderfertigkeiten =
              f hero.special_abilities.talentstilsonderfertigkeiten;
          };
      }
  end)

  module ErweiterteTalentsonderfertigkeit = Make.Activatable (struct
    include ErweiterteTalentsonderfertigkeit.Dynamic

    let modify_hero f (hero : Hero.t) =
      {
        hero with
        special_abilities =
          {
            hero.special_abilities with
            erweiterte_talentsonderfertigkeiten =
              f hero.special_abilities.erweiterte_talentsonderfertigkeiten;
          };
      }
  end)

  module Kugelzauber = Make.Activatable (struct
    include Kugelzauber.Dynamic

    let modify_hero f (hero : Hero.t) =
      {
        hero with
        special_abilities =
          {
            hero.special_abilities with
            kugelzauber = f hero.special_abilities.kugelzauber;
          };
      }
  end)

  module Kesselzauber = Make.Activatable (struct
    include Kesselzauber.Dynamic

    let modify_hero f (hero : Hero.t) =
      {
        hero with
        special_abilities =
          {
            hero.special_abilities with
            kesselzauber = f hero.special_abilities.kesselzauber;
          };
      }
  end)

  module Kappenzauber = Make.Activatable (struct
    include Kappenzauber.Dynamic

    let modify_hero f (hero : Hero.t) =
      {
        hero with
        special_abilities =
          {
            hero.special_abilities with
            kappenzauber = f hero.special_abilities.kappenzauber;
          };
      }
  end)

  module Spielzeugzauber = Make.Activatable (struct
    include Spielzeugzauber.Dynamic

    let modify_hero f (hero : Hero.t) =
      {
        hero with
        special_abilities =
          {
            hero.special_abilities with
            spielzeugzauber = f hero.special_abilities.spielzeugzauber;
          };
      }
  end)

  module Schalenzauber = Make.Activatable (struct
    include Schalenzauber.Dynamic

    let modify_hero f (hero : Hero.t) =
      {
        hero with
        special_abilities =
          {
            hero.special_abilities with
            schalenzauber = f hero.special_abilities.schalenzauber;
          };
      }
  end)

  module SexSchicksalspunkteSonderfertigkeit = Make.Activatable (struct
    include SexSchicksalspunkteSonderfertigkeit.Dynamic

    let modify_hero f (hero : Hero.t) =
      {
        hero with
        special_abilities =
          {
            hero.special_abilities with
            sex_schicksalspunkte_sonderfertigkeiten =
              f hero.special_abilities.sex_schicksalspunkte_sonderfertigkeiten;
          };
      }
  end)

  module SexSonderfertigkeit = Make.Activatable (struct
    include SexSonderfertigkeit.Dynamic

    let modify_hero f (hero : Hero.t) =
      {
        hero with
        special_abilities =
          {
            hero.special_abilities with
            sex_sonderfertigkeiten =
              f hero.special_abilities.sex_sonderfertigkeiten;
          };
      }
  end)

  module Waffenzauber = Make.Activatable (struct
    include Waffenzauber.Dynamic

    let modify_hero f (hero : Hero.t) =
      {
        hero with
        special_abilities =
          {
            hero.special_abilities with
            waffenzauber = f hero.special_abilities.waffenzauber;
          };
      }
  end)

  module Sichelritual = Make.Activatable (struct
    include Sichelritual.Dynamic

    let modify_hero f (hero : Hero.t) =
      {
        hero with
        special_abilities =
          {
            hero.special_abilities with
            sichelrituale = f hero.special_abilities.sichelrituale;
          };
      }
  end)

  module Ringzauber = Make.Activatable (struct
    include Ringzauber.Dynamic

    let modify_hero f (hero : Hero.t) =
      {
        hero with
        special_abilities =
          {
            hero.special_abilities with
            ringzauber = f hero.special_abilities.ringzauber;
          };
      }
  end)

  module Chronikzauber = Make.Activatable (struct
    include Chronikzauber.Dynamic

    let modify_hero f (hero : Hero.t) =
      {
        hero with
        special_abilities =
          {
            hero.special_abilities with
            chronikzauber = f hero.special_abilities.chronikzauber;
          };
      }
  end)

  module Increasable = struct
    (** Takes the prerequisite's target id to choose the correct add
        function. *)
    let add (static : Static.t) = function
      | Id.Increasable.Attribute _ -> Attribute.add
      | Skill _ -> Skill.add
      | MeleeCombatTechnique _ -> MeleeCombatTechnique.add
      | RangedCombatTechnique _ -> RangedCombatTechnique.add
      | Spell _ -> Spell.add
      | Ritual _ -> Ritual.add
      | LiturgicalChant _ -> LiturgicalChant.add
      | Ceremony _ -> Ceremony.add

    (** Takes the prerequisite's target id to choose the correct remove
        function. *)
    let remove = function
      | Attribute _ -> Attribute.remove
      | Skill _ -> Skill.remove
      | MeleeCombatTechnique _ -> MeleeCombatTechnique.remove
      | RangedCombatTechnique _ -> RangedCombatTechnique.remove
      | Spell _ -> Spell.remove
      | Ritual _ -> Ritual.remove
      | LiturgicalChant _ -> LiturgicalChant.remove
      | Ceremony _ -> Ceremony.remove

    let modify = function Add -> add | Remove -> remove
  end

  module Activatable = struct
    (** Takes the prerequisite's target id to choose the correct add
        function. *)
    let add = function
      | Advantage _ -> Advantage.add
      | Disadvantage _ -> Disadvantage.add
      | GeneralSpecialAbility _ -> GeneralSpecialAbility.add
      | FatePointSpecialAbility _ -> FatePointSpecialAbility.add
      | CombatSpecialAbility _ -> CombatSpecialAbility.add
      | MagicalSpecialAbility _ -> MagicalSpecialAbility.add
      | StaffEnchantment _ -> StaffEnchantment.add
      | FamiliarSpecialAbility _ -> FamiliarSpecialAbility.add
      | KarmaSpecialAbility _ -> KarmaSpecialAbility.add
      | ProtectiveWardingCircleSpecialAbility _ ->
          ProtectiveWardingCircleSpecialAbility.add
      | CombatStyleSpecialAbility _ -> CombatStyleSpecialAbility.add
      | AdvancedCombatSpecialAbility _ -> AdvancedCombatSpecialAbility.add
      | CommandSpecialAbility _ -> CommandSpecialAbility.add
      | MagicStyleSpecialAbility _ -> MagicStyleSpecialAbility.add
      | AdvancedMagicalSpecialAbility _ -> AdvancedMagicalSpecialAbility.add
      | SpellSwordEnchantment _ -> SpellSwordEnchantment.add
      | DaggerRitual _ -> DaggerRitual.add
      | InstrumentEnchantment _ -> InstrumentEnchantment.add
      | AttireEnchantment _ -> AttireEnchantment.add
      | OrbEnchantment _ -> OrbEnchantment.add
      | WandEnchantment _ -> WandEnchantment.add
      | BrawlingSpecialAbility _ -> BrawlingSpecialAbility.add
      | AncestorGlyph _ -> AncestorGlyph.add
      | CeremonialItemSpecialAbility _ -> CeremonialItemSpecialAbility.add
      | Sermon _ -> Sermon.add
      | LiturgicalStyleSpecialAbility _ -> LiturgicalStyleSpecialAbility.add
      | AdvancedKarmaSpecialAbility _ -> AdvancedKarmaSpecialAbility.add
      | Vision _ -> Vision.add
      | MagicalTradition _ -> MagicalTradition.add
      | BlessedTradition _ -> BlessedTradition.add
      | Paktgeschenk _ -> Paktgeschenk.add
      | SikaryanRaubSonderfertigkeit _ -> SikaryanRaubSonderfertigkeit.add
      | LykanthropischeGabe _ -> LykanthropischeGabe.add
      | Talentstilsonderfertigkeit _ -> Talentstilsonderfertigkeit.add
      | ErweiterteTalentsonderfertigkeit _ ->
          ErweiterteTalentsonderfertigkeit.add
      | Kugelzauber _ -> Kugelzauber.add
      | Kesselzauber _ -> Kesselzauber.add
      | Kappenzauber _ -> Kappenzauber.add
      | Spielzeugzauber _ -> Spielzeugzauber.add
      | Schalenzauber _ -> Schalenzauber.add
      | SexSchicksalspunkteSonderfertigkeit _ ->
          SexSchicksalspunkteSonderfertigkeit.add
      | SexSonderfertigkeit _ -> SexSonderfertigkeit.add
      | Waffenzauber _ -> Waffenzauber.add
      | Sichelritual _ -> Sichelritual.add
      | Ringzauber _ -> Ringzauber.add
      | Chronikzauber _ -> Chronikzauber.add

    (** Takes the prerequisite's target id to choose the correct remove
        function. *)
    let remove = function
      | Advantage _ -> Advantage.remove
      | Disadvantage _ -> Disadvantage.remove
      | GeneralSpecialAbility _ -> GeneralSpecialAbility.remove
      | FatePointSpecialAbility _ -> FatePointSpecialAbility.remove
      | CombatSpecialAbility _ -> CombatSpecialAbility.remove
      | MagicalSpecialAbility _ -> MagicalSpecialAbility.remove
      | StaffEnchantment _ -> StaffEnchantment.remove
      | FamiliarSpecialAbility _ -> FamiliarSpecialAbility.remove
      | KarmaSpecialAbility _ -> KarmaSpecialAbility.remove
      | ProtectiveWardingCircleSpecialAbility _ ->
          ProtectiveWardingCircleSpecialAbility.remove
      | CombatStyleSpecialAbility _ -> CombatStyleSpecialAbility.remove
      | AdvancedCombatSpecialAbility _ -> AdvancedCombatSpecialAbility.remove
      | CommandSpecialAbility _ -> CommandSpecialAbility.remove
      | MagicStyleSpecialAbility _ -> MagicStyleSpecialAbility.remove
      | AdvancedMagicalSpecialAbility _ -> AdvancedMagicalSpecialAbility.remove
      | SpellSwordEnchantment _ -> SpellSwordEnchantment.remove
      | DaggerRitual _ -> DaggerRitual.remove
      | InstrumentEnchantment _ -> InstrumentEnchantment.remove
      | AttireEnchantment _ -> AttireEnchantment.remove
      | OrbEnchantment _ -> OrbEnchantment.remove
      | WandEnchantment _ -> WandEnchantment.remove
      | BrawlingSpecialAbility _ -> BrawlingSpecialAbility.remove
      | AncestorGlyph _ -> AncestorGlyph.remove
      | CeremonialItemSpecialAbility _ -> CeremonialItemSpecialAbility.remove
      | Sermon _ -> Sermon.remove
      | LiturgicalStyleSpecialAbility _ -> LiturgicalStyleSpecialAbility.remove
      | AdvancedKarmaSpecialAbility _ -> AdvancedKarmaSpecialAbility.remove
      | Vision _ -> Vision.remove
      | MagicalTradition _ -> MagicalTradition.remove
      | BlessedTradition _ -> BlessedTradition.remove
      | Paktgeschenk _ -> Paktgeschenk.remove
      | SikaryanRaubSonderfertigkeit _ -> SikaryanRaubSonderfertigkeit.remove
      | LykanthropischeGabe _ -> LykanthropischeGabe.remove
      | Talentstilsonderfertigkeit _ -> Talentstilsonderfertigkeit.remove
      | ErweiterteTalentsonderfertigkeit _ ->
          ErweiterteTalentsonderfertigkeit.remove
      | Kugelzauber _ -> Kugelzauber.remove
      | Kesselzauber _ -> Kesselzauber.remove
      | Kappenzauber _ -> Kappenzauber.remove
      | Spielzeugzauber _ -> Spielzeugzauber.remove
      | Schalenzauber _ -> Schalenzauber.remove
      | SexSchicksalspunkteSonderfertigkeit _ ->
          SexSchicksalspunkteSonderfertigkeit.remove
      | SexSonderfertigkeit _ -> SexSonderfertigkeit.remove
      | Waffenzauber _ -> Waffenzauber.remove
      | Sichelritual _ -> Sichelritual.remove
      | Ringzauber _ -> Ringzauber.remove
      | Chronikzauber _ -> Chronikzauber.remove

    let modify = function Add -> add | Remove -> remove
  end
end

module ApplyPrerequisite = struct
  let activatable mode source_id (prerequisite : Prerequisite.Activatable.t)
      hero =
    Modify.Activatable.modify prerequisite.id
      {
        source = source_id;
        target = Activatable_Accessors.id' prerequisite.id;
        active = prerequisite.active;
        options = prerequisite.options |> L.map (fun x -> OneOrMany.One x);
        level = prerequisite.level;
      }
      hero

  let activatable_multi_entry mode source_id
      (prerequisite : Prerequisite.ActivatableMultiEntry.t) hero =
    Modify.Activatable.modify mode prerequisite.id
      {
        source = source_id;
        target = Activatable_Accessors.id' prerequisite.id;
        active = prerequisite.active;
        options = prerequisite.options |> L.map (fun x -> OneOrMany.One x);
        level = prerequisite.level;
      }
      hero

  let activatable_multi_select mode source_id
      (prerequisite : Prerequisite.ActivatableMultiSelect.t) hero =
    Modify.Activatable.modify prerequisite.id
      {
        source = source_id;
        target = Activatable_Accessors.id' prerequisite.id;
        active = prerequisite.active;
        options =
          OneOrMany.Many prerequisite.firstOption
          :: (prerequisite.options |> L.map (fun x -> OneOrMany.One x));
        level = prerequisite.level;
      }
      hero

  let increasable mode source_id (prerequisite : Prerequisite.Increasable.t)
      hero =
    Modify.Increasable.modify mode prerequisite.id
      {
        source = source_id;
        target = Activatable_Accessors.id' prerequisite.id;
        value = prerequisite.value;
      }
      hero

  let increasable_multi_entry mode source_id
      (prerequisite : Prerequisite.IncreasableMultiEntry.t) hero =
    Modify.Increasable.modify mode prerequisite.id
      {
        source = source_id;
        target = Activatable_Accessors.id' prerequisite.id;
        value = prerequisite.value;
      }
      hero

  let primary_attribute mode source_id
      (prerequisite : Prerequisite.PrimaryAttribute.t) (hero : Hero.t) =
    ( match prerequisite.scope with
    | Magical ->
        MagicalTradition.primary_attribute
          hero.special_abilities.magical_traditions
    | Blessed ->
        BlessedTradition.primary_attribute
          hero.special_abilities.magical_traditions )
    |> O.option hero (fun attrId ->
           let dependency : Increasable.Dynamic.dependency =
             {
               source = sourceId;
               target = One attrId;
               value = prerequisite.value;
             }
           in
           match mode with
           | Add -> Add.addAttributeDependency dependency hero
           | Remove -> Remove.removeAttributeDependency dependency hero)

  let applySocialPrerequisite mode (prerequisite : Prerequisite.SocialStatus.t)
      (hero : Hero.t) =
    {
      hero with
      socialStatusDependencies =
        ( match mode with
        | Add -> L.cons prerequisite hero.socialStatusDependencies
        | Remove -> L.delete prerequisite hero.socialStatusDependencies );
    }
end

let modifyDependencies =
  mode prerequisites (source_id : Id.PrerequisiteSource.t) hero
  = L.foldl'
      (fun (prerequisite : Prerequisite.Unified.t) ->
        match prerequisite.value with
        | PrimaryAttribute options ->
            ApplyPrerequisite.primary_attribute mode
              ( match source_id with
              | Advantage id -> Advantage id
              | Disadvantage id -> Disadvantage id
              | SpecialAbility id -> SpecialAbility id
              | Spell id -> Spell id
              | LiturgicalChant id -> LiturgicalChant id )
              options
        | Activatable options ->
            ApplyPrerequisite.activatable mode
              ( match source_id with
              | Advantage id -> Advantage id
              | Disadvantage id -> Disadvantage id
              | SpecialAbility id -> SpecialAbility id )
              options
        | ActivatableMultiEntry options ->
            ApplyPrerequisite.activatable_multi_entry mode
              ( match source_id with
              | Advantage id -> Advantage id
              | Disadvantage id -> Disadvantage id
              | SpecialAbility id -> SpecialAbility id )
              options
        | ActivatableMultiSelect options ->
            ApplyPrerequisite.activatable_multi_select mode
              ( match source_id with
              | Advantage id -> Advantage id
              | Disadvantage id -> Disadvantage id
              | SpecialAbility id -> SpecialAbility id )
              options
        | Increasable options ->
            ApplyPrerequisite.increasable mode
              ( match source_id with
              | Advantage id -> Advantage id
              | Disadvantage id -> Disadvantage id
              | SpecialAbility id -> SpecialAbility id
              | Spell id -> Spell id
              | LiturgicalChant id -> LiturgicalChant id )
              options
        | IncreasableMultiEntry options ->
            ApplyPrerequisite.increasable_multi_entry mode
              ( match source_id with
              | Advantage id -> Advantage id
              | Disadvantage id -> Disadvantage id
              | SpecialAbility id -> SpecialAbility id
              | Spell id -> Spell id
              | LiturgicalChant id -> LiturgicalChant id )
              options
        | _ -> Ley_Function.id)
      hero prerequisites

(** Adds dependencies to all required entries to ensure rule validity. *)
let addDependencies = modifyDependencies Add

(** Removes dependencies from all required entries to ensure rule validity. *)
let removeDependencies = modifyDependencies Remove

(** Return the max level based on prerequisites and dependencies. *)
let getMaxLevel staticData hero sourceId dependencies prerequisites =
  Prerequisites.Validation.getMaxLevel staticData hero sourceId prerequisites
  |> F.flip
       (L.foldl (fun (prevMax, { Activatable_Dynamic.active; level; _ }) ->
            match (active, prevMax, level) with
            (* active must be always false because it needs to *prohibit* a certain
               level

               also, if there is both a previous max and an prohibited level in the
               dependency, take the minimum value

               the prohibited level is reduced by 1 since this level should not be
               reached, thus the maximum level must be lower *)
            | false, Some prev, Some notAllowed ->
                Some (I.min (prev, notAllowed - 1))
            | false, Some prev, None -> Some prev
            | false, None, Some notAllowed -> Some (notAllowed - 1)
            | false, None, None -> None
            | true, _, _ -> prevMax))
       dependencies

module TransferredUnfamiliar = struct
  (** Checks if a spellwork is unfamiliar. *)
  let check_unfamiliar_spell transferred_unfamiliar
      (traditions : MagicalTradition.Dynamic.t IM.t) =
    traditions
    |> IM.any (fun trad ->
           trad.id
           == Id.SpecialAbility.MagicalSpecialAbility.toInt
                TraditionIntuitiveMage)
    |> function
    | true -> F.const false
    | false ->
        let active_tradition_ids =
          traditions
          |> IM.foldl'
               (fun trad ->
                 trad.useArcaneSpellworksFromTradition |> O.fromOption trad.id
                 |> IS.insert)
               traditions IS.empty
        in

        let is_from_active_tradition = function
          (* If the list of traditions is empty, it is a General spellwork. *)
          | [] -> true
          | spellwork_traditions ->
              L.any (IS.member active_tradition_ids) spellwork_traditions
        in

        let is_transferred_spellwork (id : Id.Spellwork.t) =
          let check_id transferred_id =
            match (transferred_id, id) with
            | Spell id', Spell id'' | Ritual id', Ritual id'' -> id' == id''
            | Spells, Spell _ | Rituals, Ritual _ -> true
            | Spell _, Ritual _
            | Ritual _, Spell _
            | LiturgicalChant _, _
            | LiturgicalChants, _
            | Ceremony _, _
            | Ceremonies, _ ->
                false
          in
          transferred_unfamiliar |> L.any check_id
        in

        fun id traditions ->
          !is_from_active_tradition traditions && !is_transferred_spellwork id

  (* let getTransferredUnfamiliarById = (single: Activatable_Convert.singleWithId) =
       switch[@warning "-4"] (Id.SpecialAbility.fromInt(single.id)) {
       | TraditionGuildMages
       | MadaschwesternStil
       | ScholarDesMagierkollegsZuHoningen ->
         switch (single.options) {
         | [Preset(Spell(id)), ..._] -> [{id: Spell(id), srcId: single.id}]
         | [_, ..._]
         | [] -> []
         }
       | Zaubervariabilitaet -> [{id: Spells, srcId: single.id}]
       | ScholarDerHalleDesLebensZuNorburg
       | ScholarDesKreisesDerEinfuehlung ->
         single.options
         |> L.take(3)
         |> O.mapOption(
              fun
              | Id.Activatable.Option.Preset(Spell(id)) ->
                Some({id: Spell(id), srcId: single.id})
              | _ -> None,
            )
       | _ -> []
       }
     ); *)

  (* /**
   * Adds new transferred unfamiliar spells if the entry to activate allows
   * transferring unfamiliar spells.
   */
  let addTransferUnfamiliarDependencies
      (single: Activatable_Convert.singleWithId, hero: Hero.t) =
    single
    |> getTransferredUnfamiliarById
    |> (
      fun
      | [] -> hero
      | xs -> {
          ...hero,
          transferredUnfamiliarSpells: xs @ hero.transferredUnfamiliarSpells,
        }
    ); *)

  (* export const activationOptionsToActiveObjectWithId
    (active: Record<ActivatableActivationOptions>) =
      toActiveObjectWithId (-1) (AAOA.id (active)) (convertUIStateToActiveObject (active))

  /**
   * Adds new transferred unfamiliar spells if the entry to activate allows
   * transferring unfamiliar spells.
   */
  export const addTransferUnfamiliarDependenciesByActivationOptions =
    pipe (
      activationOptionsToActiveObjectWithId,
      addTransferUnfamiliarDependencies
    )

  /**
   * Removes transferred unfamiliar spells if the entry to deactivate allows
   * transferring unfamiliar spells.
   */
  export const removeTransferUnfamiliarDependencies:
    (active: Record<ActivatableDeactivationOptions>) -> ident<Record<Hero>> =
    active hero {
      const src_id = ADOA.id (active)
      const src_index = ADOA.index (active)

      const mnew_spells = pipe_ (
        lookup (src_id) (HA.specialAbilities (hero)),
        bindF (pipe (ADA.active, subscriptF (src_index))),
        bindF (pipe (toActiveObjectWithId (src_index) (src_id), getTransferredUnfamiliarById))
      )

      return maybe (hero)
                  (fun (new_spells: List<Record<TransferUnfamiliar>>) ->
                    over (HL.transferredUnfamiliarSpells)
                          (fun current -> foldr (sdelete) (current) (new_spells))
                          (hero))
                  (mnew_spells)
    } *)

  (* let removeTradById (id, xs) =
    L.filter(fun ((x, _, _): fullTradition) -> x.id === id, xs);

  /**
   * Remove all unfamiliar deps by the specified entry.
   */
  let removeUnfamiliarDepsById (id, xs) =
    L.filter(fun (x: Hero.TransferUnfamiliar.t) -> x.srcId === id, xs);

  let getUnfamiliarCount
      (
        staticData: Static.t,
        transferredUnfamiliar,
        heroTraditions,
        heroSpells,
      ) =
    L.countBy(
      fun (heroSpell: ActivatableSkill.Dynamic.t) ->
        IM.lookup(heroSpell.id, staticData.spells)
        |> O.option(
             false,
             isUnfamiliarSpell(transferredUnfamiliar, heroTraditions),
           ),
      heroSpells,
    );

  let getUnfamiliarCountAfter
      (
        staticData: Static.t,
        transferredUnfamiliar,
        heroTraditions,
        srcId,
        heroSpells,
      ) =
    getUnfamiliarCount(
      staticData,
      removeUnfamiliarDepsById(srcId, transferredUnfamiliar),
      removeTradById(srcId, heroTraditions),
      heroSpells,
    );

  /**
   * Check if an entry that allows transferring unfamiliar entries into a familiar
   * tradition can be removed, because it might happen, that this is not allowed,
   * because otherwise you'd have more unfamiliar spells than allowed by the
   * selected experience level during creation phase.
   */
  let isEntryAllowingTransferUnfamiliarRemovable
      (staticData: Static.t, hero: Hero.t) =
    switch (hero.phase) {
    | Advancement -> const(true)
    | Outline
    | Definition ->
      open ExperienceLevel;

      let heroTraditions =
        Tradition.Magical.getEntries(staticData, hero.specialAbilities);
      let transferredUnfamiliar = hero.transferredUnfamiliarSpells;
      let spells = IM.elems(hero.spells);

      O.option(
        const(false),
        fun (el, srcId) ->
          el.maxUnfamiliarSpells
          >= getUnfamiliarCountAfter(
               staticData,
               transferredUnfamiliar,
               heroTraditions,
               srcId,
               spells,
             ),
        IM.lookup(hero.experienceLevel, staticData.experienceLevels),
      );
    }; *)
end
