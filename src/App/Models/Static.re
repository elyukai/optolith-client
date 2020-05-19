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

[@genType]
[@genType.as "Static"]
type t = {
  advantages: Ley.IntMap.t(Advantage.t),
  animistForces: Ley.IntMap.t(AnimistForce.t),
  arcaneBardTraditions: Ley.IntMap.t(string),
  arcaneDancerTraditions: Ley.IntMap.t(string),
  armorTypes: Ley.IntMap.t(string),
  aspects: Ley.IntMap.t(string),
  attributes: Ley.IntMap.t(Attribute.t),
  blessedTraditions: Ley.IntMap.t(BlessedTradition.t),
  blessings: Ley.IntMap.t(Blessing.t),
  brews: Ley.IntMap.t(string),
  cantrips: Ley.IntMap.t(Cantrip.t),
  combatSpecialAbilityGroups: Ley.IntMap.t(string),
  combatTechniqueGroups: Ley.IntMap.t(string),
  combatTechniques: Ley.IntMap.t(CombatTechnique.t),
  conditions: Ley.IntMap.t(Condition.t),
  cultures: Ley.IntMap.t(Culture.t),
  curses: Ley.IntMap.t(Curse.t),
  derivedCharacteristics: Ley.StrMap.t(DerivedCharacteristic.t),
  disadvantages: Ley.IntMap.t(Disadvantage.t),
  dominationRituals: Ley.IntMap.t(DominationRitual.t),
  elvenMagicalSongs: Ley.IntMap.t(ElvenMagicalSong.t),
  items: Ley.IntMap.t(Item.t),
  equipmentGroups: Ley.IntMap.t(string),
  equipmentPackages: Ley.IntMap.t(EquipmentPackage.t),
  experienceLevels: Ley.IntMap.t(ExperienceLevel.t),
  eyeColors: Ley.IntMap.t(string),
  focusRules: Ley.IntMap.t(FocusRule.t),
  geodeRituals: Ley.IntMap.t(GeodeRitual.t),
  hairColors: Ley.IntMap.t(string),
  liturgicalChantEnhancements: Ley.IntMap.t(SelectOption.t),
  liturgicalChantGroups: Ley.IntMap.t(string),
  liturgicalChants: Ley.IntMap.t(LiturgicalChant.t),
  magicalDances: Ley.IntMap.t(MagicalDance.t),
  magicalMelodies: Ley.IntMap.t(MagicalMelody.t),
  magicalTraditions: Ley.IntMap.t(MagicalTradition.t),
  messages: Messages.t,
  optionalRules: Ley.IntMap.t(OptionalRule.t),
  pacts: Ley.IntMap.t(PactCategory.t),
  professions: Ley.IntMap.t(Profession.t),
  properties: Ley.IntMap.t(string),
  publications: Ley.StrMap.t(Publication.t),
  races: Ley.IntMap.t(Race.t),
  reaches: Ley.IntMap.t(string),
  rogueSpells: Ley.IntMap.t(RogueSpell.t),
  skillGroups: Ley.IntMap.t(Skill.group),
  skills: Ley.IntMap.t(Skill.t),
  socialStatuses: Ley.IntMap.t(string),
  specialAbilities: Ley.IntMap.t(SpecialAbility.t),
  specialAbilityGroups: Ley.IntMap.t(string),
  spellEnhancements: Ley.IntMap.t(SelectOption.t),
  spellGroups: Ley.IntMap.t(string),
  spells: Ley.IntMap.t(Spell.t),
  states: Ley.IntMap.t(State.t),
  subjects: Ley.IntMap.t(string),
  tribes: Ley.IntMap.t(string),
  zibiljaRituals: Ley.IntMap.t(ZibiljaRitual.t),
};

[@genType]
[@genType.as "Activatable"]
type activatable =
  | Advantage(Advantage.t)
  | Disadvantage(Disadvantage.t)
  | SpecialAbility(SpecialAbility.t);
