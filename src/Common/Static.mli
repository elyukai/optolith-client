type t = {
  (* advanced_combat_special_abilities : AdvancedCombatSpecialAbility.Static.t IntMap.t; *)
  (* advanced_karma_special_abilities : AdvancedKarmaSpecialAbility.Static.t IntMap.t; *)
  (* advanced_magical_special_abilities : AdvancedMagicalSpecialAbility.Static.t IntMap.t; *)
  (* advantages : Advantage.Static.t IntMap.t; *)
  (* ancestor_glyphs : AncestorGlyph.Static.t IntMap.t; *)
  (* animal_shapes : AnimalShape.t IntMap.t; *)
  (* animal_shape_paths : string IntMap.t; *)
  (* animal_shape_sizes : AnimalShape.Size.t IntMap.t; *)
  animist_powers : AnimistPower.Static.t Id.AnimistPower.Map.t;
  (* arcane_bard_traditions : ArcaneTradition.t IntMap.t; *)
  (* arcane_dancer_traditions : ArcaneTradition.t IntMap.t; *)
  (* armors : abc IntMap.t; *)
  (* armor_types : string IntMap.t; *)
  (* aspects : Aspect.t IntMap.t; *)
  (* attire_enchantments : AttireEnchantment.Static.t IntMap.t; *)
  attributes : Attribute.Static.t Id.Attribute.Map.t;
  (* blessed_traditions : BlessedTradition.Static.t IntMap.t; *)
  (* blessings : Blessing.Static.t IntMap.t; *)
  (* brawling_special_abilities : BrawlingSpecialAbility.Static.t IntMap.t; *)
  (* brews : string IntMap.t; *)
  (* cantrips : Cantrip.Static.t IntMap.t; *)
  (* ceremonial_item_special_abilities : CeremonialItemSpecialAbility.Static.t IntMap.t; *)
  ceremonies : Ceremony.Static.t Id.Ceremony.Map.t;
  (* chronikzauber : Chronikzauber.Static.t IntMap.t; *)
  (* combat_special_abilities : CombatSpecialAbility.Static.t IntMap.t; *)
  (* combat_special_ability_groups : string IntMap.t; *)
  (* combat_style_special_abilities : CombatStyleSpecialAbility.Static.t IntMap.t; *)
  (* combat_technique_groups : string IntMap.t; *)
  (* command_special_abilities : CommandSpecialAbility.Static.t IntMap.t; *)
  (* conditions : Condition.Static.t IntMap.t; *)
  (* core_rules : CoreRule.t IntMap.t; *)
  (* cultures : Culture.Static.t IntMap.t; *)
  (* curricula : Curriculum.Static.t IntMap.t; *)
  curses : Curse.Static.t Id.Curse.Map.t;
  (* dagger_rituals : DaggerRitual.Static.t IntMap.t; *)
  (* derived_characteristics : DerivedCharacteristic.Static.t IntMap.t; *)
  (* disadvantages : Disadvantage.Static.t IntMap.t; *)
  diseases : Disease.t Id.Disease.Map.t;
  domination_rituals : DominationRitual.Static.t Id.DominationRitual.Map.t;
  (* elements : Element.t IntMap.t; *)
  elven_magical_songs : ElvenMagicalSong.Static.t Id.ElvenMagicalSong.Map.t;
  (* equipment_packages : EquipmentPackage.t IntMap.t; *)
  (* erweiterte_talentsonderfertigkeiten : ErweiterteTalentsonderfertigkeit.Static.t IntMap.t; *)
  experience_levels : ExperienceLevel.t Id.ExperienceLevel.Map.t;
  (* eye_colors : string IntMap.t; *)
  (* familiar_special_abilities : FamiliarSpecialAbility.Static.t IntMap.t; *)
  (* fate_point_special_abilities : FatePointSpecialAbility.Static.t IntMap.t; *)
  focus_rules : FocusRule.Static.t Id.FocusRule.Map.t;
  (* general_special_abilities : GeneralSpecialAbility.Static.t IntMap.t; *)
  geode_rituals : GeodeRitual.Static.t Id.GeodeRitual.Map.t;
  (* hair_colors : string IntMap.t; *)
  (* instrument_enchantments : InstrumentEnchantment.Static.t IntMap.t; *)
  (* items : Item.t IntMap.t; *)
  (* item_groups : string IntMap.t; *)
  (* kappenzauber : Kappenzauber.Static.t IntMap.t; *)
  (* karma_special_abilities : KarmaSpecialAbility.Static.t IntMap.t; *)
  (* kesselzauber : Kesselzauber.Static.t IntMap.t; *)
  (* kugelzauber : Kugelzauber.Static.t IntMap.t; *)
  (* languages : Language.t IntMap.t; *)
  liturgical_chants : LiturgicalChant.Static.t Id.LiturgicalChant.Map.t;
  (* liturgical_chant_groups : string IntMap.t; *)
  (* liturgical_style_special_abilities : LiturgicalStyleSpecialAbility.Static.t IntMap.t; *)
  (* lykanthropische_gaben : LykanthropischeGabe.Static.t IntMap.t; *)
  magical_dances : MagicalDance.Static.t Id.MagicalDance.Map.t;
  magical_melodies : MagicalMelody.Static.t Id.MagicalMelody.Map.t;
  (* magical_special_abilities : MagicalSpecialAbility.Static.t IntMap.t; *)
  (* magical_traditions : MagicalTradition.Static.t IntMap.t; *)
  (* magic_style_special_abilities : MagicStyleSpecialAbility.Static.t IntMap.t; *)
  melee_combat_techniques :
    CombatTechnique.Melee.Static.t Id.MeleeCombatTechnique.Map.t;
  optional_rules : OptionalRule.Static.t Id.OptionalRule.Map.t;
  (* orb_enchantments : OrbEnchantment.Static.t IntMap.t; *)
  (* pact : Pact.Static.t IntMap.t; *)
  (* paktgeschenke : Paktgeschenk.Static.t IntMap.t; *)
  patrons : Patron.t IntMap.t;
  patron_categories : Patron.Category.t IntMap.t;
  (* poisons : Poison.t IntMap.t; *)
  (* professions : Profession.Static.t IntMap.t; *)
  (* properties : Property.t IntMap.t; *)
  (* protective_warding_circle_special_abilities : ProtectiveWardingCircleSpecialAbility.Static.t IntMap.t; *)
  publications : Publication.t Id.Publication.Map.t;
  (* races : Race.Static.t IntMap.t; *)
  ranged_combat_techniques :
    CombatTechnique.Ranged.Static.t Id.RangedCombatTechnique.Map.t;
  (* reaches : string IntMap.t; *)
  regions : Region.t Id.Region.Map.t;
  (* ringzauber : Ringzauber.Static.t IntMap.t; *)
  rituals : Ritual.Static.t Id.Ritual.Map.t;
  (* schalenzauber : Schalenzauber.Static.t IntMap.t; *)
  jester_tricks : JesterTrick.Static.t Id.JesterTrick.Map.t;
  (* scripts : Script.t IntMap.t; *)
  (* sermons : Sermon.Static.t IntMap.t; *)
  (* sex_schicksalspunkte_sonderfertigkeiten : SexSchicksalspunkteSonderfertigkeit.Static.t IntMap.t; *)
  (* sex_sonderfertigkeiten : SexSonderfertigkeit.Static.t IntMap.t; *)
  (* sichelrituale : Sichelritual.Static.t IntMap.t; *)
  (* sikaryan_raub_sonderfertigkeiten : SikaryanRaubSonderfertigkeit.Static.t IntMap.t; *)
  skills : Skill.Static.t Id.Skill.Map.t;
  skill_groups : Skill.Group.t IntMap.t;
  (* social_statuses : string IntMap.t; *)
  (* special_ability_groups : string IntMap.t; *)
  spells : Spell.Static.t Id.Spell.Map.t;
  (* spell_groups : string IntMap.t; *)
  (* spell_sword_enchantments : SpellSwordEnchantment.Static.t IntMap.t; *)
  (* spielzeugzauber : Spielzeugzauber.Static.t IntMap.t; *)
  (* staff_enchantments : StaffEnchantment.Static.t IntMap.t; *)
  (* states : State.Static.t IntMap.t; *)
  (* subjects : string IntMap.t; *)
  (* talentstilsonderfertigkeiten : Talentstilsonderfertigkeit.Static.t IntMap.t; *)
  (* trade_secrets : TradeSecret.t IntMap.t; *)
  (* tribes : string IntMap.t; *)
  (* ui : Messages.t IntMap.t; *)
  (* vampirische_gaben : VampirischeGabe.Static.t IntMap.t; *)
  (* visions : Vision.Static.t IntMap.t; *)
  (* waffenzauber : Waffenzauber.Static.t IntMap.t; *)
  (* wand_enchantments : WandEnchantment.Static.t IntMap.t; *)
  (* weapons : abc IntMap.t; *)
  zibilja_rituals : ZibiljaRitual.Static.t Id.ZibiljaRitual.Map.t;
}
