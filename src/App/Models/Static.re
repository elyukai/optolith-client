module SourceRef = Static_SourceRef;
module Erratum = Static_Erratum;
module Prerequisites = Static_Prerequisites;
module Skill = Static_Skill;
module SelectOption = Static_SelectOption;
module Advantage = Static_Advantage;
module AnimistForce = Static_AnimistForce;
module Attribute = Static_Attribute;
module BlessedTradition = Static_BlessedTradition;
module Blessing = Static_Blessing;
module Cantrip = Static_Cantrip;
module CombatTechnique = Static_CombatTechnique;
module Condition = Static_Condition;
module Culture = Static_Culture;
module Curse = Static_Curse;
module DerivedCharacteristic = Static_DerivedCharacteristic;
module Disadvantage = Static_Disadvantage;
module DominationRitual = Static_DominationRitual;
module ElvenMagicalSong = Static_ElvenMagicalSong;
module EquipmentPackage = Static_EquipmentPackage;
module ExperienceLevel = Static_ExperienceLevel;
module FocusRule = Static_FocusRule;
module GeodeRitual = Static_GeodeRitual;
module Item = Static_Item;
module LiturgicalChant = Static_LiturgicalChant;
module MagicalDance = Static_MagicalDance;
module MagicalMelody = Static_MagicalMelody;
module MagicalTradition = Static_MagicalTradition;
module Messages = Static_Messages;
module OptionalRule = Static_OptionalRule;
module PactCategory = Static_Pact;
module Patron = Static_Patron;
module Profession = Static_Profession;
module Publication = Static_Publication;
module Race = Static_Race;
module RogueSpell = Static_RogueSpell;
module SpecialAbility = Static_SpecialAbility;
module Spell = Static_Spell;
module State = Static_State;
module ZibiljaRitual = Static_ZibiljaRitual;

type t = {
  advantages: IntMap.t(Advantage.t),
  animistForces: IntMap.t(AnimistForce.t),
  arcaneBardTraditions: IntMap.t(string),
  arcaneDancerTraditions: IntMap.t(string),
  armorTypes: IntMap.t(string),
  aspects: IntMap.t(string),
  attributes: IntMap.t(Attribute.t),
  blessedTraditions: IntMap.t(BlessedTradition.t),
  blessings: IntMap.t(Blessing.t),
  brews: IntMap.t(string),
  cantrips: IntMap.t(Cantrip.t),
  combatSpecialAbilityGroups: IntMap.t(string),
  combatTechniqueGroups: IntMap.t(string),
  combatTechniques: IntMap.t(CombatTechnique.t),
  conditions: IntMap.t(Condition.t),
  cultures: IntMap.t(Culture.t),
  curses: IntMap.t(Curse.t),
  derivedCharacteristics: StrMap.t(DerivedCharacteristic.t),
  disadvantages: IntMap.t(Disadvantage.t),
  dominationRituals: IntMap.t(DominationRitual.t),
  elvenMagicalSongs: IntMap.t(ElvenMagicalSong.t),
  items: IntMap.t(Item.t),
  equipmentGroups: IntMap.t(string),
  equipmentPackages: IntMap.t(EquipmentPackage.t),
  experienceLevels: IntMap.t(ExperienceLevel.t),
  eyeColors: IntMap.t(string),
  focusRules: IntMap.t(FocusRule.t),
  geodeRituals: IntMap.t(GeodeRitual.t),
  hairColors: IntMap.t(string),
  liturgicalChantEnhancements: IntMap.t(SelectOption.t),
  liturgicalChantGroups: IntMap.t(string),
  liturgicalChants: IntMap.t(LiturgicalChant.t),
  magicalDances: IntMap.t(MagicalDance.t),
  magicalMelodies: IntMap.t(MagicalMelody.t),
  magicalTraditions: IntMap.t(MagicalTradition.t),
  messages: Messages.t,
  optionalRules: IntMap.t(OptionalRule.t),
  pacts: IntMap.t(PactCategory.t),
  professions: IntMap.t(Profession.t),
  properties: IntMap.t(string),
  publications: StrMap.t(Publication.t),
  races: IntMap.t(Race.t),
  reaches: IntMap.t(string),
  rogueSpells: IntMap.t(RogueSpell.t),
  skillGroups: IntMap.t(Skill.group),
  skills: IntMap.t(Skill.t),
  socialStatuses: IntMap.t(string),
  specialAbilities: IntMap.t(SpecialAbility.t),
  specialAbilityGroups: IntMap.t(string),
  spellEnhancements: IntMap.t(SelectOption.t),
  spellGroups: IntMap.t(string),
  spells: IntMap.t(Spell.t),
  states: IntMap.t(State.t),
  subjects: IntMap.t(string),
  tribes: IntMap.t(string),
  zibiljaRituals: IntMap.t(ZibiljaRitual.t),
};

type activatable =
  | Advantage(Advantage.t)
  | Disadvantage(Disadvantage.t)
  | SpecialAbility(SpecialAbility.t);
