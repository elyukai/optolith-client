module IM = Ley_IntMap

type t = {
  advanced_combat_special_abilities :
    AdvancedCombatSpecialAbility.Static.t IM.t;
  advanced_karma_special_abilities : AdvancedKarmaSpecialAbility.Static.t IM.t;
  advanced_magical_special_abilities :
    AdvancedMagicalSpecialAbility.Static.t IM.t;
  advantages : Advantage.Static.t IM.t;
  ancestor_glyphs : AncestorGlyph.Static.t IM.t;
  animal_shapes : AnimalShape.t IM.t;
  animal_shape_paths : string IM.t;
  animal_shape_sizes : AnimalShape.Size.t IM.t;
  animist_forces : AnimistForce.Static.t IM.t;
  arcane_bard_traditions : ArcaneTradition.t IM.t;
  arcane_dancer_traditions : ArcaneTradition.t IM.t;
  (* armors : abc IM.t; *)
  armor_types : string IM.t;
  aspects : Aspect.t IM.t;
  attire_enchantments : AttireEnchantment.Static.t IM.t;
  attributes : Attribute.Static.t IM.t;
  blessed_traditions : BlessedTradition.Static.t IM.t;
  blessings : Blessing.Static.t IM.t;
  brawling_special_abilities : BrawlingSpecialAbility.Static.t IM.t;
  brews : string IM.t;
  cantrips : Cantrip.Static.t IM.t;
  ceremonial_item_special_abilities :
    CeremonialItemSpecialAbility.Static.t IM.t;
  ceremonies : Ceremony.Static.t IM.t;
  chronikzauber : Chronikzauber.Static.t IM.t;
  combat_special_abilities : CombatSpecialAbility.Static.t IM.t;
  combat_special_ability_groups : string IM.t;
  combat_style_special_abilities : CombatStyleSpecialAbility.Static.t IM.t;
  combat_technique_groups : string IM.t;
  command_special_abilities : CommandSpecialAbility.Static.t IM.t;
  conditions : Condition.Static.t IM.t;
  core_rules : CoreRule.t IM.t;
  cultures : Culture.Static.t IM.t;
  curricula : Curriculum.Static.t IM.t;
  curses : Curse.Static.t IM.t;
  dagger_rituals : DaggerRitual.Static.t IM.t;
  derived_characteristics : DerivedCharacteristic.Static.t IM.t;
  disadvantages : Disadvantage.Static.t IM.t;
  diseases : Disease.t IM.t;
  domination_rituals : DominationRitual.Static.t IM.t;
  elements : Element.t IM.t;
  elven_magical_songs : ElvenMagicalSong.Static.t IM.t;
  equipment_packages : EquipmentPackage.t IM.t;
  erweiterte_talentsonderfertigkeiten :
    ErweiterteTalentsonderfertigkeit.Static.t IM.t;
  experience_levels : ExperienceLevel.t IM.t;
  eye_colors : string IM.t;
  familiar_special_abilities : FamiliarSpecialAbility.Static.t IM.t;
  fate_point_special_abilities : FatePointSpecialAbility.Static.t IM.t;
  focus_rules : FocusRule.Static.t IM.t;
  general_special_abilities : GeneralSpecialAbility.Static.t IM.t;
  geodenrituale : Geodenritual.Static.t IM.t;
  hair_colors : string IM.t;
  instrument_enchantments : InstrumentEnchantment.Static.t IM.t;
  items : Item.t IM.t;
  item_groups : string IM.t;
  kappenzauber : Kappenzauber.Static.t IM.t;
  karma_special_abilities : KarmaSpecialAbility.Static.t IM.t;
  kesselzauber : Kesselzauber.Static.t IM.t;
  kugelzauber : Kugelzauber.Static.t IM.t;
  languages : Language.t IM.t;
  liturgical_chants : LiturgicalChant.Static.t IM.t;
  liturgical_chant_groups : string IM.t;
  liturgical_style_special_abilities :
    LiturgicalStyleSpecialAbility.Static.t IM.t;
  lykanthropische_gaben : LykanthropischeGabe.Static.t IM.t;
  magical_dances : MagicalDance.Static.t IM.t;
  magical_melodies : MagicalMelody.Static.t IM.t;
  magical_special_abilities : MagicalSpecialAbility.Static.t IM.t;
  magical_traditions : MagicalTradition.t IM.t;
  magic_style_special_abilities : MagicStyleSpecialAbility.Static.t IM.t;
  melee_combat_techniques : CombatTechnique.Melee.Static.t IM.t;
  optional_rules : OptionalRule.Static.t IM.t;
  orb_enchantments : OrbEnchantment.Static.t IM.t;
  pact : Pact.Static.t IM.t;
  paktgeschenke : Paktgeschenk.Static.t IM.t;
  patrons : Patron.t IM.t;
  patron_categories : Patron.Category.t IM.t;
  poisons : Poison.t IM.t;
  professions : Profession.Static.t IM.t;
  properties : Property.t IM.t;
  protective_warding_circle_special_abilities :
    ProtectiveWardingCircleSpecialAbility.Static.t IM.t;
  publications : Publication.t IM.t;
  races : Race.Static.t IM.t;
  ranged_combat_techniques : CombatTechnique.Ranged.Static.t IM.t;
  reaches : string IM.t;
  ringzauber : Ringzauber.Static.t IM.t;
  rituals : Ritual.Static.t IM.t;
  schalenzauber : Schalenzauber.Static.t IM.t;
  schelmenzauber : Schelmenzauber.Static.t IM.t;
  scripts : Script.t IM.t;
  sermons : Sermon.Static.t IM.t;
  sex_schicksalspunkte_sonderfertigkeiten :
    SexSchicksalspunkteSonderfertigkeit.Static.t IM.t;
  sex_sonderfertigkeiten : SexSonderfertigkeit.Static.t IM.t;
  sichelrituale : Sichelritual.Static.t IM.t;
  sikaryan_raub_sonderfertigkeiten : SikaryanRaubSonderfertigkeit.Static.t IM.t;
  skills : Skill.Static.t IM.t;
  skill_groups : Skill.Group.t IM.t;
  social_statuses : string IM.t;
  special_ability_groups : string IM.t;
  spells : Spell.Static.t IM.t;
  spell_groups : string IM.t;
  spell_sword_enchantments : SpellSwordEnchantment.Static.t IM.t;
  spielzeugzauber : Spielzeugzauber.Static.t IM.t;
  staff_enchantments : StaffEnchantment.Static.t IM.t;
  states : State.Static.t IM.t;
  subjects : string IM.t;
  talentstilsonderfertigkeiten : Talentstilsonderfertigkeit.Static.t IM.t;
  trade_secrets : TradeSecret.t IM.t;
  tribes : string IM.t;
  ui : Messages.t IM.t;
  vampirische_gaben : VampirischeGabe.Static.t IM.t;
  visions : Vision.Static.t IM.t;
  waffenzauber : Waffenzauber.Static.t IM.t;
  wand_enchantments : WandEnchantment.Static.t IM.t;
  (* weapons : abc IM.t; *)
  zibiljarituale : ZibiljaRitual.Static.t IM.t;
}
