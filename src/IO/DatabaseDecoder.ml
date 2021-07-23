module Entities = struct
  let categories_total = DatabaseReader.Entities.dirs_number |> Js.Int.toFloat

  let percent_per_category = 1.0 /. categories_total

  (** Prepare decoders for each type in the database. *)
  module DecodeType = struct
    open DatabaseReader.Entities

    let decode empty insert make_assoc data_acc ~log_err locale_order data =
      data |> data_acc
      |> ListX.foldl'
           (fun file_content ->
             file_content |> Yaml.parse
             |> Decoders_bs.Decode.decode_value (make_assoc locale_order)
             |> function
             | Ok (Some (parsed_key, parsed_value)) ->
                 insert parsed_key parsed_value
             | Ok None -> Function.id
             | Error err ->
                 let () = log_err err in
                 Function.id)
           empty

    (* let animal_shapes = decode_type (AnimalShape.Decode.assoc langs) parsed_data.animal_shapes in let () = progress 1.0 in *)
    (* let animal_shape_paths = decode_type (IdName.Decode.assoc langs) parsed_data.animal_shape_paths in let () = progress 2.0 in *)
    (* let animal_shape_sizes = decode_type (AnimalShape.Size.Decode.assoc langs) parsed_data.animal_shape_sizes in let () = progress 3.0 in *)

    let animist_powers =
      let open Id.AnimistPower.Map in
      let open AnimistPower.Static.Decode in
      let data_acc data = data.animist_powers in
      decode empty insert make_assoc data_acc

    (* let arcane_bard_traditions ~log_err langs data =
       let open Id.MagicalTradition.ArcaneBardTradition.Map in
       let open ArcaneBardTradition.Static.Decode in
       decode ~log_err empty insert (make_assoc langs) data.arcane_bard_traditions *)

    (* let arcane_dancer_traditions ~log_err langs data =
       let open Id.MagicalTradition.ArcaneDancerTradition.Map in
       let open ArcaneDancerTradition.Static.Decode in
       decode ~log_err empty insert (make_assoc langs) data.arcane_dancer_traditions *)

    (* let armor_types = decode_type (IdName.Decode.assoc langs) parsed_data.armor_types in let () = progress 7.0 in *)
    (* let aspects = decode_type (Aspect.Decode.assoc langs) parsed_data.aspects in let () = progress 8.0 in *)

    let attributes =
      let open Id.Attribute.Map in
      let open Attribute.Static.Decode in
      let data_acc data = data.attributes in
      decode empty insert make_assoc data_acc

    (* let blessings = decode_type (Blessing.Static.Decode.assoc langs) parsed_data.blessings in let () = progress 10.0 in *)
    (* let brews = decode_type (IdName.Decode.assoc langs) parsed_data.brews in let () = progress 11.0 in *)
    (* let cantrips = decode_type (Cantrip.Static.Decode.assoc langs) parsed_data.cantrips in let () = progress 12.0 in *)

    let ceremonies =
      let open Id.Ceremony.Map in
      let open Ceremony.Static.Decode in
      let data_acc data = data.ceremonies in
      decode empty insert make_assoc data_acc

    (* let combat_special_ability_groups = decode_type (IdName.Decode.assoc langs) parsed_data.combat_special_ability_groups in let () = progress 14.0 in *)
    (* let combat_technique_groups = decode_type (IdName.Decode.assoc langs) parsed_data.combat_technique_groups in let () = progress 15.0 in *)
    (* let conditions = decode_type (Condition.Static.Decode.assoc langs) parsed_data.conditions in let () = progress 16.0 in *)
    (* let core_rules = decode_type (CoreRule.Decode.assoc langs) parsed_data.core_rules in let () = progress 17.0 in *)
    (* let cultures = decode_type (Culture.Static.Decode.assoc langs) parsed_data.cultures in let () = progress 18.0 in *)
    (* let curricula = decode_type (Curriculum.Static.Decode.assoc langs) parsed_data.curricula in let () = progress 19.0 in *)

    let curses =
      let open Id.Curse.Map in
      let open Curse.Static.Decode in
      let data_acc data = data.curses in
      decode empty insert make_assoc data_acc

    (* let derived_characteristics = decode_type (DerivedCharacteristic.Static.Decode.assoc langs) parsed_data.derived_characteristics in let () = progress 21.0 in *)

    let diseases =
      let open Id.Disease.Map in
      let open Disease.Decode in
      let data_acc data = data.diseases in
      decode empty insert make_assoc data_acc

    let domination_rituals =
      let open Id.DominationRitual.Map in
      let open DominationRitual.Static.Decode in
      let data_acc data = data.domination_rituals in
      decode empty insert make_assoc data_acc

    (* let elements = decode_type (Element.Decode.assoc langs) parsed_data.elements in let () = progress 24.0 in *)

    let elven_magical_songs =
      let open Id.ElvenMagicalSong.Map in
      let open ElvenMagicalSong.Static.Decode in
      let data_acc data = data.elven_magical_songs in
      decode empty insert make_assoc data_acc

    (* let equipment_packages = decode_type (EquipmentPackage.Decode.assoc langs) parsed_data.equipment_packages in let () = progress 26.0 in *)

    let experience_levels =
      let open Id.ExperienceLevel.Map in
      let open ExperienceLevel.Decode in
      let data_acc data = data.experience_levels in
      decode empty insert make_assoc data_acc

    (* let eye_colors = decode_type (IdName.Decode.assoc langs) parsed_data.eye_colors in let () = progress 28.0 in *)

    let focus_rules =
      let open Id.FocusRule.Map in
      let open FocusRule.Static.Decode in
      let data_acc data = data.focus_rules in
      decode empty insert make_assoc data_acc

    let geode_rituals =
      let open Id.GeodeRitual.Map in
      let open GeodeRitual.Static.Decode in
      let data_acc data = data.geode_rituals in
      decode empty insert make_assoc data_acc

    (* let hair_colors = decode_type (strinDecode.assoc langs) parsed_data.hair_colors in let () = progress 31.0 in *)
    (* let items = decode_type (Item.Decode.assoc langs) parsed_data.items in let () = progress 32.0 in *)
    (* let item_groups = decode_type (IdName.Decode.assoc langs) parsed_data.item_groups in let () = progress 33.0 in *)

    let jester_tricks =
      let open Id.JesterTrick.Map in
      let open JesterTrick.Static.Decode in
      let data_acc data = data.jester_tricks in
      decode empty insert make_assoc data_acc

    (* let languages = decode_type (Language.Decode.assoc langs) parsed_data.languages in let () = progress 34.0 in *)

    let liturgical_chants =
      let open Id.LiturgicalChant.Map in
      let open LiturgicalChant.Static.Decode in
      let data_acc data = data.liturgical_chants in
      decode empty insert make_assoc data_acc

    (* let liturgical_chant_groups = decode_type (IdName.Decode.assoc langs) parsed_data.liturgical_chant_groups in let () = progress 36.0 in *)

    let magical_dances =
      let open Id.MagicalDance.Map in
      let open MagicalDance.Static.Decode in
      let data_acc data = data.magical_dances in
      decode empty insert make_assoc data_acc

    let magical_melodies =
      let open Id.MagicalMelody.Map in
      let open MagicalMelody.Static.Decode in
      let data_acc data = data.magical_melodies in
      decode empty insert make_assoc data_acc

    let melee_combat_techniques =
      let open Id.MeleeCombatTechnique.Map in
      let open CombatTechnique.Melee.Static.Decode in
      let data_acc data = data.melee_combat_techniques in
      decode empty insert make_assoc data_acc

    let optional_rules =
      let open Id.OptionalRule.Map in
      let open OptionalRule.Static.Decode in
      let data_acc data = data.optional_rules in
      decode empty insert make_assoc data_acc

    (* let pact = decode_type (Pact.Static.Decode.assoc langs) parsed_data.pact in let () = progress 41.0 in *)

    let patrons =
      let open IntMap in
      let open Patron.Decode in
      let data_acc data = data.patrons in
      decode empty insert make_assoc data_acc

    let patron_categories =
      let open IntMap in
      let open Patron.Category.Decode in
      let data_acc data = data.patron_categories in
      decode empty insert make_assoc data_acc

    (* let poisons = decode_type (Poison.Decode.assoc langs) parsed_data.poisons in let () = progress 44.0 in *)
    (* let professions = decode_type (Profession.Static.Decode.assoc langs) parsed_data.professions in let () = progress 45.0 in *)
    (* let properties = decode_type (Property.Decode.assoc langs) parsed_data.properties in let () = progress 46.0 in *)

    let publications =
      let open Id.Publication.Map in
      let open Publication.Decode in
      let data_acc data = data.publications in
      decode empty insert make_assoc data_acc

    (* let races = decode_type (Race.Static.Decode.assoc langs) parsed_data.races in let () = progress 48.0 in *)

    let ranged_combat_techniques =
      let open Id.RangedCombatTechnique.Map in
      let open CombatTechnique.Ranged.Static.Decode in
      let data_acc data = data.ranged_combat_techniques in
      decode empty insert make_assoc data_acc

    (* let reaches = decode_type (IdName.Decode.assoc langs) parsed_data.reaches in let () = progress 50.0 in *)

    let regions =
      let open Id.Region.Map in
      let open Region.Decode in
      let data_acc data = data.regions in
      decode empty insert make_assoc data_acc

    let rituals =
      let open Id.Ritual.Map in
      let open Ritual.Static.Decode in
      let data_acc data = data.rituals in
      decode empty insert make_assoc data_acc

    (* let scripts = decode_type (Script.Decode.assoc langs) parsed_data.scripts in let () = progress 53.0 in *)

    let skills ~regions ~diseases =
      let open Id.Skill.Map in
      let open Skill.Static.Decode in
      let data_acc data = data.skills in
      decode empty insert (make_assoc ~regions ~diseases) data_acc

    let skill_groups =
      let open IntMap in
      let open Skill.Group.Decode in
      let data_acc data = data.skill_groups in
      decode empty insert make_assoc data_acc

    (* let social_statuses = decode_type (IdName.Decode.assoc langs) parsed_data.social_statuses in let () = progress 56.0 in *)
    (* let special_ability_groups = decode_type (IdName.Decode.assoc langs) parsed_data.special_ability_groups in let () = progress 57.0 in *)

    let spells =
      let open Id.Spell.Map in
      let open Spell.Static.Decode in
      let data_acc data = data.spells in
      decode empty insert make_assoc data_acc

    (* let spell_groups = decode_type (IdName.Decode.assoc langs) parsed_data.spell_groups in let () = progress 59.0 in *)
    (* let states = decode_type (State.Static.Decode.assoc langs) parsed_data.states in let () = progress 60.0 in *)
    (* let subjects = decode_type (IdName.Decode.assoc langs) parsed_data.subjects in let () = progress 61.0 in *)
    (* let trade_secrets = decode_type (TradeSecret.Decode.assoc langs) parsed_data.trade_secrets in let () = progress 62.0 in *)
    (* let tribes = decode_type (IdName.Decode.assoc langs) parsed_data.tribes in let () = progress 63.0 in *)
    (* let ui = decode_type (Messages.Decode.assoc langs) parsed_data.ui in let () = progress 64.0 in *)

    let zibilja_rituals =
      let open Id.ZibiljaRitual.Map in
      let open ZibiljaRitual.Static.Decode in
      let data_acc data = data.zibilja_rituals in
      decode empty insert make_assoc data_acc
  end

  let decode_files
       ~set_progress ~log_err langs _messages (parsed: DatabaseReader.Entities.t): Static.t =
     let count = ref 0 in
     let progress () = let () = count := !count + 1 in set_progress(percent_per_category *. Js.Int.toFloat(!count)) in
  
     (* let animal_shapes = decode_type (AnimalShape.Decode.assoc langs) parsed_data.animal_shapes in let () = progress 1.0 in *)
     (* let animal_shape_paths = decode_type (IdName.Decode.assoc langs) parsed_data.animal_shape_paths in let () = progress 2.0 in *)
     (* let animal_shape_sizes = decode_type (AnimalShape.Size.Decode.assoc langs) parsed_data.animal_shape_sizes in let () = progress 3.0 in *)
     let animist_powers = DecodeType.animist_powers ~log_err langs parsed in let () = progress () in
     (* let arcane_bard_traditions = decode_type (ArcaneTradition.Decode.assoc langs) parsed_data.arcane_bard_traditions in let () = progress 5.0 in *)
     (* let arcane_dancer_traditions = decode_type (ArcaneTradition.Decode.assoc langs) parsed_data.arcane_dancer_traditions in let () = progress 6.0 in *)
     (* let armor_types = decode_type (IdName.Decode.assoc langs) parsed_data.armor_types in let () = progress 7.0 in *)
     (* let aspects = decode_type (Aspect.Decode.assoc langs) parsed_data.aspects in let () = progress 8.0 in *)
     let attributes = DecodeType.attributes ~log_err langs parsed in let () = progress () in
     (* let blessings = decode_type (Blessing.Static.Decode.assoc langs) parsed_data.blessings in let () = progress 10.0 in *)
     (* let brews = decode_type (IdName.Decode.assoc langs) parsed_data.brews in let () = progress 11.0 in *)
     (* let cantrips = decode_type (Cantrip.Static.Decode.assoc langs) parsed_data.cantrips in let () = progress 12.0 in *)
     let ceremonies = DecodeType.ceremonies ~log_err langs parsed in let () = progress () in
     (* let combat_special_ability_groups = decode_type (IdName.Decode.assoc langs) parsed_data.combat_special_ability_groups in let () = progress 14.0 in *)
     (* let combat_technique_groups = decode_type (IdName.Decode.assoc langs) parsed_data.combat_technique_groups in let () = progress 15.0 in *)
     (* let conditions = decode_type (Condition.Static.Decode.assoc langs) parsed_data.conditions in let () = progress 16.0 in *)
     (* let core_rules = decode_type (CoreRule.Decode.assoc langs) parsed_data.core_rules in let () = progress 17.0 in *)
     (* let cultures = decode_type (Culture.Static.Decode.assoc langs) parsed_data.cultures in let () = progress 18.0 in *)
     (* let curricula = decode_type (Curriculum.Static.Decode.assoc langs) parsed_data.curricula in let () = progress 19.0 in *)
     let curses = DecodeType.curses ~log_err langs parsed in let () = progress () in
     (* let derived_characteristics = decode_type (DerivedCharacteristic.Static.Decode.assoc langs) parsed_data.derived_characteristics in let () = progress 21.0 in *)
     let diseases = DecodeType.diseases ~log_err langs parsed in let () = progress () in
     let domination_rituals = DecodeType.domination_rituals ~log_err langs parsed in let () = progress () in
     (* let elements = decode_type (Element.Decode.assoc langs) parsed_data.elements in let () = progress 24.0 in *)
     let elven_magical_songs = DecodeType.elven_magical_songs ~log_err langs parsed in let () = progress () in
     (* let equipment_packages = decode_type (EquipmentPackage.Decode.assoc langs) parsed_data.equipment_packages in let () = progress 26.0 in *)
     let experience_levels = DecodeType.experience_levels ~log_err langs parsed in let () = progress () in
     (* let eye_colors = decode_type (IdName.Decode.assoc langs) parsed_data.eye_colors in let () = progress 28.0 in *)
     let focus_rules = DecodeType.focus_rules ~log_err langs parsed in let () = progress () in
     let geode_rituals = DecodeType.geode_rituals ~log_err langs parsed in let () = progress () in
     (* let hair_colors = decode_type (strinDecode.assoc langs) parsed_data.hair_colors in let () = progress 31.0 in *)
     (* let items = decode_type (Item.Decode.assoc langs) parsed_data.items in let () = progress 32.0 in *)
     (* let item_groups = decode_type (IdName.Decode.assoc langs) parsed_data.item_groups in let () = progress 33.0 in *)
     let jester_tricks = DecodeType.jester_tricks ~log_err langs parsed in let () = progress () in
     (* let languages = decode_type (Language.Decode.assoc langs) parsed_data.languages in let () = progress 34.0 in *)
     let liturgical_chants = DecodeType.liturgical_chants ~log_err langs parsed in let () = progress () in
     (* let liturgical_chant_groups = decode_type (IdName.Decode.assoc langs) parsed_data.liturgical_chant_groups in let () = progress 36.0 in *)
     let magical_dances = DecodeType.magical_dances ~log_err langs parsed in let () = progress () in
     let magical_melodies = DecodeType.magical_melodies ~log_err langs parsed in let () = progress () in
     let melee_combat_techniques = DecodeType.melee_combat_techniques ~log_err langs parsed in let () = progress () in
     let optional_rules = DecodeType.optional_rules ~log_err langs parsed in let () = progress () in
     (* let pact = decode_type (Pact.Static.Decode.assoc langs) parsed_data.pact in let () = progress 41.0 in *)
     let patrons = DecodeType.patrons ~log_err langs parsed in let () = progress () in
     let patron_categories = DecodeType.patron_categories ~log_err langs parsed in let () = progress () in
     (* let poisons = decode_type (Poison.Decode.assoc langs) parsed_data.poisons in let () = progress 44.0 in *)
     (* let professions = decode_type (Profession.Static.Decode.assoc langs) parsed_data.professions in let () = progress 45.0 in *)
     (* let properties = decode_type (Property.Decode.assoc langs) parsed_data.properties in let () = progress 46.0 in *)
     let publications = DecodeType.publications ~log_err langs parsed in let () = progress () in
     (* let races = decode_type (Race.Static.Decode.assoc langs) parsed_data.races in let () = progress 48.0 in *)
     let ranged_combat_techniques = DecodeType.ranged_combat_techniques ~log_err langs parsed in let () = progress () in
     (* let reaches = decode_type (IdName.Decode.assoc langs) parsed_data.reaches in let () = progress 50.0 in *)
     let regions = DecodeType.regions ~log_err langs parsed in let () = progress () in
     let rituals = DecodeType.rituals ~log_err langs parsed in let () = progress () in
     (* let scripts = decode_type (Script.Decode.assoc langs) parsed_data.scripts in let () = progress 53.0 in *)
     let skill_groups = DecodeType.skill_groups ~log_err langs parsed in let () = progress () in
     (* let social_statuses = decode_type (IdName.Decode.assoc langs) parsed_data.social_statuses in let () = progress 56.0 in *)
     (* let special_ability_groups = decode_type (IdName.Decode.assoc langs) parsed_data.special_ability_groups in let () = progress 57.0 in *)
     let spells = DecodeType.spells ~log_err langs parsed in let () = progress () in
     (* let spell_groups = decode_type (IdName.Decode.assoc langs) parsed_data.spell_groups in let () = progress 59.0 in *)
     (* let states = decode_type (State.Static.Decode.assoc langs) parsed_data.states in let () = progress 60.0 in *)
     (* let subjects = decode_type (IdName.Decode.assoc langs) parsed_data.subjects in let () = progress 61.0 in *)
     (* let trade_secrets = decode_type (TradeSecret.Decode.assoc langs) parsed_data.trade_secrets in let () = progress 62.0 in *)
     (* let tribes = decode_type (IdName.Decode.assoc langs) parsed_data.tribes in let () = progress 63.0 in *)
     (* let ui = decode_type (Messages.Decode.assoc langs) parsed_data.ui in let () = progress 64.0 in *)
     let zibilja_rituals = DecodeType.zibilja_rituals ~log_err langs parsed in let () = progress () in
  
     let skills = DecodeType.skills ~regions ~diseases ~log_err langs parsed in let () = progress () in
  
     (* let advanced_combat_special_abilities = decode_type (AdvancedCombatSpecialAbility.Static.Decode.assoc langs) parsed_data.advanced_combat_special_abilities in let () = progress 1.0 in *)
     (* let advanced_karma_special_abilities = decode_type (AdvancedKarmaSpecialAbility.Static.Decode.assoc langs) parsed_data.advanced_karma_special_abilities in let () = progress 2.0 in *)
     (* let advanced_magical_special_abilities = decode_type (AdvancedMagicalSpecialAbility.Static.Decode.assoc langs) parsed_data.advanced_magical_special_abilities in let () = progress 3.0 in *)
     (* let advantages = decode_type (Advantage.Static.Decode.assoc langs) parsed_data.advantages in let () = progress 4.0 in *)
     (* let ancestor_glyphs = decode_type (AncestorGlyph.Static.Decode.assoc langs) parsed_data.ancestor_glyphs in let () = progress 5.0 in *)
     (* let attire_enchantments = decode_type (AttireEnchantment.Static.Decode.assoc langs) parsed_data.attire_enchantments in let () = progress 14.0 in *)
     (* let blessed_traditions = decode_type (BlessedTradition.Static.Decode.assoc langs) parsed_data.blessed_traditions in let () = progress 16.0 in *)
     (* let brawling_special_abilities = decode_type (BrawlingSpecialAbility.Static.Decode.assoc langs) parsed_data.brawling_special_abilities in let () = progress 18.0 in *)
     (* let ceremonial_item_special_abilities = decode_type (CeremonialItemSpecialAbility.Static.Decode.assoc langs) parsed_data.ceremonial_item_special_abilities in let () = progress 21.0 in *)
     (* let chronikzauber = decode_type (Chronikzauber.Static.Decode.assoc langs) parsed_data.chronikzauber in let () = progress 23.0 in *)
     (* let combat_special_abilities = decode_type (CombatSpecialAbility.Static.Decode.assoc langs) parsed_data.combat_special_abilities in let () = progress 24.0 in *)
     (* let combat_style_special_abilities = decode_type (CombatStyleSpecialAbility.Static.Decode.assoc langs) parsed_data.combat_style_special_abilities in let () = progress 26.0 in *)
     (* let command_special_abilities = decode_type (CommandSpecialAbility.Static.Decode.assoc langs) parsed_data.command_special_abilities in let () = progress 28.0 in *)
     (* let dagger_rituals = decode_type (DaggerRitual.Static.Decode.assoc langs) parsed_data.dagger_rituals in let () = progress 34.0 in *)
     (* let disadvantages = decode_type (Disadvantage.Static.Decode.assoc langs) parsed_data.disadvantages in let () = progress 36.0 in *)
     (* let erweiterte_talentsonderfertigkeiten = decode_type (ErweiterteTalentsonderfertigkeit.Static.Decode.assoc langs) parsed_data.erweiterte_talentsonderfertigkeiten in let () = progress 42.0 in *)
     (* let familiar_special_abilities = decode_type (FamiliarSpecialAbility.Static.Decode.assoc langs) parsed_data.familiar_special_abilities in let () = progress 45.0 in *)
     (* let fate_point_special_abilities = decode_type (FatePointSpecialAbility.Static.Decode.assoc langs) parsed_data.fate_point_special_abilities in let () = progress 46.0 in *)
     (* let general_special_abilities = decode_type (GeneralSpecialAbility.Static.Decode.assoc langs) parsed_data.general_special_abilities in let () = progress 48.0 in *)
     (* let instrument_enchantments = decode_type (InstrumentEnchantment.Static.Decode.assoc langs) parsed_data.instrument_enchantments in let () = progress 51.0 in *)
     (* let kappenzauber = decode_type (Kappenzauber.Static.Decode.assoc langs) parsed_data.kappenzauber in let () = progress 54.0 in *)
     (* let karma_special_abilities = decode_type (KarmaSpecialAbility.Static.Decode.assoc langs) parsed_data.karma_special_abilities in let () = progress 55.0 in *)
     (* let kesselzauber = decode_type (Kesselzauber.Static.Decode.assoc langs) parsed_data.kesselzauber in let () = progress 56.0 in *)
     (* let kugelzauber = decode_type (Kugelzauber.Static.Decode.assoc langs) parsed_data.kugelzauber in let () = progress 57.0 in *)
     (* let liturgical_style_special_abilities = decode_type (LiturgicalStyleSpecialAbility.Static.Decode.assoc langs) parsed_data.liturgical_style_special_abilities in let () = progress 61.0 in *)
     (* let lykanthropische_gaben = decode_type (LykanthropischeGabe.Static.Decode.assoc langs) parsed_data.lykanthropische_gaben in let () = progress 62.0 in *)
     (* let magical_special_abilities = decode_type (MagicalSpecialAbility.Static.Decode.assoc langs) parsed_data.magical_special_abilities in let () = progress 65.0 in *)
     (* let magical_traditions = decode_type (MagicalTradition.Decode.assoc langs) parsed_data.magical_traditions in let () = progress 66.0 in *)
     (* let magic_style_special_abilities = decode_type (MagicStyleSpecialAbility.Static.Decode.assoc langs) parsed_data.magic_style_special_abilities in let () = progress 67.0 in *)
     (* let orb_enchantments = decode_type (OrbEnchantment.Static.Decode.assoc langs) parsed_data.orb_enchantments in let () = progress 70.0 in *)
     (* let paktgeschenke = decode_type (Paktgeschenk.Static.Decode.assoc langs) parsed_data.paktgeschenke in let () = progress 72.0 in *)
     (* let protective_warding_circle_special_abilities = decode_type (ProtectiveWardingCircleSpecialAbility.Static.Decode.assoc langs) parsed_data.protective_warding_circle_special_abilities in let () = progress 78.0 in *)
     (* let ringzauber = decode_type (Ringzauber.Static.Decode.assoc langs) parsed_data.ringzauber in let () = progress 83.0 in *)
     (* let schalenzauber = decode_type (Schalenzauber.Static.Decode.assoc langs) parsed_data.schalenzauber in let () = progress 85.0 in *)
     (* let sermons = decode_type (Sermon.Static.Decode.assoc langs) parsed_data.sermons in let () = progress 88.0 in *)
     (* let sex_schicksalspunkte_sonderfertigkeiten = decode_type (SexSchicksalspunkteSonderfertigkeit.Static.Decode.assoc langs) parsed_data.sex_schicksalspunkte_sonderfertigkeiten in let () = progress 89.0 in *)
     (* let sex_sonderfertigkeiten = decode_type (SexSonderfertigkeit.Static.Decode.assoc langs) parsed_data.sex_sonderfertigkeiten in let () = progress 90.0 in *)
     (* let sichelrituale = decode_type (Sichelritual.Static.Decode.assoc langs) parsed_data.sichelrituale in let () = progress 91.0 in *)
     (* let sikaryan_raub_sonderfertigkeiten = decode_type (SikaryanRaubSonderfertigkeit.Static.Decode.assoc langs) parsed_data.sikaryan_raub_sonderfertigkeiten in let () = progress 92.0 in *)
     (* let spell_sword_enchantments = decode_type (SpellSwordEnchantment.Static.Decode.assoc langs) parsed_data.spell_sword_enchantments in let () = progress 99.0 in *)
     (* let spielzeugzauber = decode_type (Spielzeugzauber.Static.Decode.assoc langs) parsed_data.spielzeugzauber in let () = progress 100.0 in *)
     (* let staff_enchantments = decode_type (StaffEnchantment.Static.Decode.assoc langs) parsed_data.staff_enchantments in let () = progress 101.0 in *)
     (* let talentstilsonderfertigkeiten = decode_type (Talentstilsonderfertigkeit.Static.Decode.assoc langs) parsed_data.talentstilsonderfertigkeiten in let () = progress 104.0 in *)
     (* let vampirische_gaben = decode_type (VampirischeGabe.Static.Decode.assoc langs) parsed_data.vampirische_gaben in let () = progress 108.0 in *)
     (* let visions = decode_type (Vision.Static.Decode.assoc langs) parsed_data.visions in let () = progress 109.0 in *)
     (* let waffenzauber = decode_type (Waffenzauber.Static.Decode.assoc langs) parsed_data.waffenzauber in let () = progress 110.0 in *)
     (* let wand_enchantments = decode_type (WandEnchantment.Static.Decode.assoc langs) parsed_data.wand_enchantments in let () = progress 111.0 in *)
  
     Static.{
       (* advanced_combat_special_abilities; *)
       (* advanced_karma_special_abilities; *)
       (* advanced_magical_special_abilities; *)
       (* advantages; *)
       (* ancestor_glyphs; *)
       (* animal_shape_paths; *)
       (* animal_shapes; *)
       (* animal_shape_sizes; *)
       animist_powers;
       (* arcane_bard_traditions; *)
       (* arcane_dancer_traditions; *)
       (* armors; *)
       (* armor_types; *)
       (* aspects; *)
       (* attire_enchantments; *)
       attributes;
       (* blessed_traditions; *)
       (* blessings; *)
       (* brawling_special_abilities; *)
       (* brews; *)
       (* cantrips; *)
       (* ceremonial_item_special_abilities; *)
       ceremonies;
       (* chronikzauber; *)
       (* combat_special_abilities; *)
       (* combat_special_ability_groups; *)
       (* combat_style_special_abilities; *)
       (* combat_technique_groups; *)
       (* command_special_abilities; *)
       (* conditions; *)
       (* core_rules; *)
       (* cultures; *)
       (* curricula; *)
       curses;
       (* dagger_rituals; *)
       (* derived_characteristics; *)
       (* disadvantages; *)
       diseases;
       domination_rituals;
       (* elements; *)
       elven_magical_songs;
       (* equipment_packages; *)
       (* erweiterte_talentsonderfertigkeiten; *)
       experience_levels;
       (* eye_colors; *)
       (* familiar_special_abilities; *)
       (* fate_point_special_abilities; *)
       focus_rules;
       (* general_special_abilities; *)
       geode_rituals;
       (* hair_colors; *)
       (* instrument_enchantments; *)
       (* item_groups; *)
       (* items; *)
       jester_tricks;
       (* kappenzauber; *)
       (* karma_special_abilities; *)
       (* kesselzauber; *)
       (* kugelzauber; *)
       (* languages; *)
       (* liturgical_chant_groups; *)
       liturgical_chants;
       (* liturgical_style_special_abilities; *)
       (* lykanthropische_gaben; *)
       magical_dances;
       magical_melodies;
       (* magical_special_abilities; *)
       (* magical_traditions; *)
       (* magic_style_special_abilities; *)
       melee_combat_techniques;
       optional_rules;
       (* orb_enchantments; *)
       (* pact_categories; *)
       (* paktgeschenke; *)
       patron_categories;
       patrons;
       (* poisons; *)
       (* professions; *)
       (* properties; *)
       (* protective_warding_circle_special_abilities; *)
       publications;
       (* races; *)
       ranged_combat_techniques;
       (* reaches; *)
       regions;
       (* ringzauber; *)
       rituals;
       (* schalenzauber; *)
       (* scripts; *)
       (* sermons; *)
       (* sex_schicksalspunkte_sonderfertigkeiten; *)
       (* sex_sonderfertigkeiten; *)
       (* sichelrituale; *)
       (* sikaryan_raub_sonderfertigkeiten; *)
       skill_groups;
       skills;
       (* social_statuses; *)
       (* special_ability_groups; *)
       (* spell_groups; *)
       spells;
       (* spell_sword_enchantments; *)
       (* spielzeugzauber; *)
       (* staff_enchantments; *)
       (* states; *)
       (* subjects; *)
       (* talentstilsonderfertigkeiten; *)
       (* trade_secrets; *)
       (* tribes; *)
       (* ui; *)
       (* vampirische_gaben; *)
       (* visions; *)
       (* waffenzauber; *)
       (* wand_enchantments; *)
       (* weapons; *)
       zibilja_rituals;
     }[@@ocamlformat "disable"]
end
