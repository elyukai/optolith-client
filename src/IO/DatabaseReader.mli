(** Read Optolith Database contents.

    This module explicitly does not include any parsing functionality, so all
    contents are returned as YAML strings. This way you can separate reading and
    parsing into separate threads more intuitively. *)

(** Read entity files. *)
module Entities : sig
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

  val read_files : set_progress:(float -> unit) -> t Js.Promise.t
  (** [read_files ~set_progress] reads all entity files and returns them grouped
      by entity type. *)

  val dirs_number : int
  (** Number of read directories. *)
end
