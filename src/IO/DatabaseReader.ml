module Entities = struct
  open Promise.Infix

  type raw_collection = string list

  type t = {
    advanced_combat_special_abilities : raw_collection;
    advanced_karma_special_abilities : raw_collection;
    advanced_magical_special_abilities : raw_collection;
    advanced_skill_special_abilities : raw_collection;
    advantages : raw_collection;
    ancestor_glyphs : raw_collection;
    animal_diseases : raw_collection;
    animal_shape_paths : raw_collection;
    animal_shapes : raw_collection;
    animal_shape_sizes : raw_collection;
    animal_types : raw_collection;
    animist_powers : raw_collection;
    arcane_bard_traditions : raw_collection;
    arcane_dancer_traditions : raw_collection;
    arcane_orb_enchantments : raw_collection;
    armors : raw_collection;
    armor_types : raw_collection;
    aspects : raw_collection;
    attire_enchantments : raw_collection;
    attributes : raw_collection;
    blessed_traditions : raw_collection;
    blessings : raw_collection;
    bowl_enchantments : raw_collection;
    brawling_special_abilities : raw_collection;
    brews : raw_collection;
    cantrips : raw_collection;
    cauldron_enchantments : raw_collection;
    ceremonial_item_special_abilities : raw_collection;
    ceremonies : raw_collection;
    chronicle_enchantments : raw_collection;
    combat_special_abilities : raw_collection;
    combat_special_ability_groups : raw_collection;
    combat_style_special_abilities : raw_collection;
    combat_technique_groups : raw_collection;
    command_special_abilities : raw_collection;
    conditions : raw_collection;
    core_rules : raw_collection;
    cultures : raw_collection;
    curricula : raw_collection;
    curses : raw_collection;
    dagger_rituals : raw_collection;
    derived_characteristics : raw_collection;
    disadvantages : raw_collection;
    diseases : raw_collection;
    domination_rituals : raw_collection;
    elements : raw_collection;
    elven_magical_songs : raw_collection;
    equipment_packages : raw_collection;
    experience_levels : raw_collection;
    eye_colors : raw_collection;
    familiar_special_abilities : raw_collection;
    familiars_tricks : raw_collection;
    fate_point_sex_special_abilities : raw_collection;
    fate_point_special_abilities : raw_collection;
    focus_rules : raw_collection;
    fools_hat_enchantments : raw_collection;
    general_special_abilities : raw_collection;
    geode_rituals : raw_collection;
    guidelines : raw_collection;
    hair_colors : raw_collection;
    influences : raw_collection;
    instrument_enchantments : raw_collection;
    item_groups : raw_collection;
    items : raw_collection;
    jester_tricks : raw_collection;
    karma_special_abilities : raw_collection;
    kirchenpraegungen : raw_collection;
    krallenkettenzauber : raw_collection;
    languages : raw_collection;
    liturgical_chant_groups : raw_collection;
    liturgical_chants : raw_collection;
    liturgical_style_special_abilities : raw_collection;
    lycantropic_gifts : raw_collection;
    magical_dances : raw_collection;
    magical_melodies : raw_collection;
    magical_runes : raw_collection;
    magical_special_abilities : raw_collection;
    magical_tradition_placeholders : raw_collection;
    magical_traditions : raw_collection;
    magic_style_special_abilities : raw_collection;
    melee_combat_techniques : raw_collection;
    meta_conditions : raw_collection;
    optional_rules : raw_collection;
    orb_enchantments : raw_collection;
    pact_categories : raw_collection;
    pact_gifts : raw_collection;
    patron_categories : raw_collection;
    patrons : raw_collection;
    personality_traits : raw_collection;
    poisons : raw_collection;
    professions : raw_collection;
    properties : raw_collection;
    protective_warding_circle_special_abilities : raw_collection;
    publications : raw_collection;
    races : raw_collection;
    ranged_combat_techniques : raw_collection;
    reaches : raw_collection;
    regions : raw_collection;
    ring_enchantments : raw_collection;
    rituals : raw_collection;
    scripts : raw_collection;
    sermons : raw_collection;
    services : raw_collection;
    sex_practices : raw_collection;
    sex_special_abilities : raw_collection;
    sickle_rituals : raw_collection;
    sikaryan_drain_special_abilities : raw_collection;
    skill_groups : raw_collection;
    skill_modification_increments : raw_collection;
    skills : raw_collection;
    skill_style_special_abilities : raw_collection;
    social_statuses : raw_collection;
    special_ability_groups : raw_collection;
    spell_groups : raw_collection;
    spells : raw_collection;
    spell_sword_enchantments : raw_collection;
    staff_enchantments : raw_collection;
    states : raw_collection;
    subjects : raw_collection;
    talismans : raw_collection;
    target_categories : raw_collection;
    toy_enchantments : raw_collection;
    trade_secrets : raw_collection;
    tribes : raw_collection;
    trinkhornzauber : raw_collection;
    ui : raw_collection;
    vampiric_gifts : raw_collection;
    visions : raw_collection;
    wand_enchantments : raw_collection;
    weapon_enchantments : raw_collection;
    weapons : raw_collection;
    zibilja_rituals : raw_collection;
  }

  let data_root = Node.Path.join [| "."; "src"; "Database"; "Data" |]

  let dirs =
    [
      "AdvancedCombatSpecialAbilities"; "AdvancedKarmaSpecialAbilities";
      "AdvancedMagicalSpecialAbilities"; "AdvancedSkillSpecialAbilities";
      "Advantages"; "AncestorGlyphs"; "AnimalDiseases"; "AnimalShapePaths";
      "AnimalShapes"; "AnimalShapeSizes"; "AnimalTypes"; "AnimistPowers";
      "ArcaneBardTraditions"; "ArcaneDancerTraditions"; "ArcaneOrbEnchantments";
      "Armors"; "ArmorTypes"; "Aspects"; "AttireEnchantments"; "Attributes";
      "BlessedTraditions"; "Blessings"; "BowlEnchantments";
      "BrawlingSpecialAbilities"; "Brews"; "Cantrips"; "CauldronEnchantments";
      "CeremonialItemSpecialAbilities"; "Ceremonies"; "ChronicleEnchantments";
      "CombatSpecialAbilities"; "CombatSpecialAbilityGroups";
      "CombatStyleSpecialAbilities"; "CombatTechniqueGroups";
      "CommandSpecialAbilities"; "Conditions"; "CoreRules"; "Cultures";
      "Curricula"; "Curses"; "DaggerRituals"; "DerivedCharacteristics";
      "Disadvantages"; "Diseases"; "DominationRituals"; "Elements";
      "ElvenMagicalSongs"; "EquipmentPackages"; "ExperienceLevels"; "EyeColors";
      "FamiliarSpecialAbilities"; "FamiliarsTricks";
      "FatePointSexSpecialAbilities"; "FatePointSpecialAbilities"; "FocusRules";
      "FoolsHatEnchantments"; "GeneralSpecialAbilities"; "GeodeRituals";
      "Guidelines"; "HairColors"; "Influences"; "InstrumentEnchantments";
      "ItemGroups"; "Items"; "JesterTricks"; "KarmaSpecialAbilities";
      "Kirchenpraegungen"; "Krallenkettenzauber"; "Languages";
      "LiturgicalChantGroups"; "LiturgicalChants";
      "LiturgicalStyleSpecialAbilities"; "LycantropicGifts"; "MagicalDances";
      "MagicalMelodies"; "MagicalRunes"; "MagicalSpecialAbilities";
      "MagicalTraditionPlaceholders"; "MagicalTraditions";
      "MagicStyleSpecialAbilities"; "MeleeCombatTechniques"; "MetaConditions";
      "OptionalRules"; "OrbEnchantments"; "PactCategories"; "PactGifts";
      "PatronCategories"; "Patrons"; "PersonalityTraits"; "Poisons";
      "Professions"; "Properties"; "ProtectiveWardingCircleSpecialAbilities";
      "Publications"; "Races"; "RangedCombatTechniques"; "Reaches"; "Regions";
      "RingEnchantments"; "Rituals"; "Scripts"; "Sermons"; "Services";
      "SexPractices"; "SexSpecialAbilities"; "SickleRituals";
      "SikaryanDrainSpecialAbilities"; "SkillGroups";
      "SkillModificationIncrements"; "Skills"; "SkillStyleSpecialAbilities";
      "SocialStatuses"; "SpecialAbilityGroups"; "SpellGroups"; "Spells";
      "SpellSwordEnchantments"; "StaffEnchantments"; "States"; "Subjects";
      "Talismans"; "TargetCategories"; "ToyEnchantments"; "TradeSecrets";
      "Tribes"; "Trinkhornzauber"; "UI"; "VampiricGifts"; "Visions";
      "WandEnchantments"; "WeaponEnchantments"; "Weapons"; "ZibiljaRituals";
    ]

  let dirs_number = List.length dirs

  let create_file_path dir_name file_name =
    Node.Path.join [| data_root; dir_name; file_name |]

  let read_files_of_entry_type dir_name =
    let read_file file_name =
      Node.Fs.Promises.read_file (create_file_path dir_name file_name) `utf8
    in
    Node.Path.join2 data_root dir_name
    |> Node.Fs.Promises.readdir
    |> Js.Promise.then_ (fun file_names ->
           file_names |> Array.to_list |> Promise.traverse read_file)

  let read_directories ~set_progress dirs =
    let max = dirs |> List.length |> Js.Int.toFloat in
    let update_progress i res =
      let () = set_progress ((Js.Int.toFloat i +. 1.) /. max) in
      res
    in
    let read_directory i dir =
      dir |> read_files_of_entry_type <&> update_progress i
    in
    Promise.traversei read_directory dirs

  let read_files ~set_progress =
    dirs
    |> read_directories ~set_progress
    <&> function
    | [
        advanced_combat_special_abilities; advanced_karma_special_abilities;
        advanced_magical_special_abilities; advanced_skill_special_abilities;
        advantages; ancestor_glyphs; animal_diseases; animal_shape_paths;
        animal_shapes; animal_shape_sizes; animal_types; animist_powers;
        arcane_bard_traditions; arcane_dancer_traditions;
        arcane_orb_enchantments; armors; armor_types; aspects;
        attire_enchantments; attributes; blessed_traditions; blessings;
        bowl_enchantments; brawling_special_abilities; brews; cantrips;
        cauldron_enchantments; ceremonial_item_special_abilities; ceremonies;
        chronicle_enchantments; combat_special_abilities;
        combat_special_ability_groups; combat_style_special_abilities;
        combat_technique_groups; command_special_abilities; conditions;
        core_rules; cultures; curricula; curses; dagger_rituals;
        derived_characteristics; disadvantages; diseases; domination_rituals;
        elements; elven_magical_songs; equipment_packages; experience_levels;
        eye_colors; familiar_special_abilities; familiars_tricks;
        fate_point_sex_special_abilities; fate_point_special_abilities;
        focus_rules; fools_hat_enchantments; general_special_abilities;
        geode_rituals; guidelines; hair_colors; influences;
        instrument_enchantments; item_groups; items; jester_tricks;
        karma_special_abilities; kirchenpraegungen; krallenkettenzauber;
        languages; liturgical_chant_groups; liturgical_chants;
        liturgical_style_special_abilities; lycantropic_gifts; magical_dances;
        magical_melodies; magical_runes; magical_special_abilities;
        magical_tradition_placeholders; magical_traditions;
        magic_style_special_abilities; melee_combat_techniques; meta_conditions;
        optional_rules; orb_enchantments; pact_categories; pact_gifts;
        patron_categories; patrons; personality_traits; poisons; professions;
        properties; protective_warding_circle_special_abilities; publications;
        races; ranged_combat_techniques; reaches; regions; ring_enchantments;
        rituals; scripts; sermons; services; sex_practices;
        sex_special_abilities; sickle_rituals; sikaryan_drain_special_abilities;
        skill_groups; skill_modification_increments; skills;
        skill_style_special_abilities; social_statuses; special_ability_groups;
        spell_groups; spells; spell_sword_enchantments; staff_enchantments;
        states; subjects; talismans; target_categories; toy_enchantments;
        trade_secrets; tribes; trinkhornzauber; ui; vampiric_gifts; visions;
        wand_enchantments; weapon_enchantments; weapons; zibilja_rituals;
      ] ->
        {
          advanced_combat_special_abilities;
          advanced_karma_special_abilities;
          advanced_magical_special_abilities;
          advanced_skill_special_abilities;
          advantages;
          ancestor_glyphs;
          animal_diseases;
          animal_shape_paths;
          animal_shapes;
          animal_shape_sizes;
          animal_types;
          animist_powers;
          arcane_bard_traditions;
          arcane_dancer_traditions;
          arcane_orb_enchantments;
          armors;
          armor_types;
          aspects;
          attire_enchantments;
          attributes;
          blessed_traditions;
          blessings;
          bowl_enchantments;
          brawling_special_abilities;
          brews;
          cantrips;
          cauldron_enchantments;
          ceremonial_item_special_abilities;
          ceremonies;
          chronicle_enchantments;
          combat_special_abilities;
          combat_special_ability_groups;
          combat_style_special_abilities;
          combat_technique_groups;
          command_special_abilities;
          conditions;
          core_rules;
          cultures;
          curricula;
          curses;
          dagger_rituals;
          derived_characteristics;
          disadvantages;
          diseases;
          domination_rituals;
          elements;
          elven_magical_songs;
          equipment_packages;
          experience_levels;
          eye_colors;
          familiar_special_abilities;
          familiars_tricks;
          fate_point_sex_special_abilities;
          fate_point_special_abilities;
          focus_rules;
          fools_hat_enchantments;
          general_special_abilities;
          geode_rituals;
          guidelines;
          hair_colors;
          influences;
          instrument_enchantments;
          item_groups;
          items;
          jester_tricks;
          karma_special_abilities;
          kirchenpraegungen;
          krallenkettenzauber;
          languages;
          liturgical_chant_groups;
          liturgical_chants;
          liturgical_style_special_abilities;
          lycantropic_gifts;
          magical_dances;
          magical_melodies;
          magical_runes;
          magical_special_abilities;
          magical_tradition_placeholders;
          magical_traditions;
          magic_style_special_abilities;
          melee_combat_techniques;
          meta_conditions;
          optional_rules;
          orb_enchantments;
          pact_categories;
          pact_gifts;
          patron_categories;
          patrons;
          personality_traits;
          poisons;
          professions;
          properties;
          protective_warding_circle_special_abilities;
          publications;
          races;
          ranged_combat_techniques;
          reaches;
          regions;
          ring_enchantments;
          rituals;
          scripts;
          sermons;
          services;
          sex_practices;
          sex_special_abilities;
          sickle_rituals;
          sikaryan_drain_special_abilities;
          skill_groups;
          skill_modification_increments;
          skills;
          skill_style_special_abilities;
          social_statuses;
          special_ability_groups;
          spell_groups;
          spells;
          spell_sword_enchantments;
          staff_enchantments;
          states;
          subjects;
          talismans;
          target_categories;
          toy_enchantments;
          trade_secrets;
          tribes;
          trinkhornzauber;
          ui;
          vampiric_gifts;
          visions;
          wand_enchantments;
          weapon_enchantments;
          weapons;
          zibilja_rituals;
        }
    | xs ->
        failwith
          ("Unexpected length of directories: "
          ^ Js.Int.toString (List.length xs))
end
