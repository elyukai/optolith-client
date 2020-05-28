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
  advantages: Ley_IntMap.t(Advantage.t),
  animistForces: Ley_IntMap.t(AnimistForce.t),
  arcaneBardTraditions: Ley_IntMap.t(string),
  arcaneDancerTraditions: Ley_IntMap.t(string),
  armorTypes: Ley_IntMap.t(string),
  aspects: Ley_IntMap.t(string),
  attributes: Ley_IntMap.t(Attribute.t),
  blessedTraditions: Ley_IntMap.t(BlessedTradition.t),
  blessings: Ley_IntMap.t(Blessing.t),
  brews: Ley_IntMap.t(string),
  cantrips: Ley_IntMap.t(Cantrip.t),
  combatSpecialAbilityGroups: Ley_IntMap.t(string),
  combatTechniqueGroups: Ley_IntMap.t(string),
  combatTechniques: Ley_IntMap.t(CombatTechnique.t),
  conditions: Ley_IntMap.t(Condition.t),
  cultures: Ley_IntMap.t(Culture.t),
  curses: Ley_IntMap.t(Curse.t),
  derivedCharacteristics: Ley_StrMap.t(DerivedCharacteristic.t),
  disadvantages: Ley_IntMap.t(Disadvantage.t),
  dominationRituals: Ley_IntMap.t(DominationRitual.t),
  elvenMagicalSongs: Ley_IntMap.t(ElvenMagicalSong.t),
  items: Ley_IntMap.t(Item.t),
  equipmentGroups: Ley_IntMap.t(string),
  equipmentPackages: Ley_IntMap.t(EquipmentPackage.t),
  experienceLevels: Ley_IntMap.t(ExperienceLevel.t),
  eyeColors: Ley_IntMap.t(string),
  focusRules: Ley_IntMap.t(FocusRule.t),
  geodeRituals: Ley_IntMap.t(GeodeRitual.t),
  hairColors: Ley_IntMap.t(string),
  liturgicalChantEnhancements: Ley_IntMap.t(SelectOption.t),
  liturgicalChantGroups: Ley_IntMap.t(string),
  liturgicalChants: Ley_IntMap.t(LiturgicalChant.t),
  magicalDances: Ley_IntMap.t(MagicalDance.t),
  magicalMelodies: Ley_IntMap.t(MagicalMelody.t),
  magicalTraditions: Ley_IntMap.t(MagicalTradition.t),
  messages: Messages.t,
  optionalRules: Ley_IntMap.t(OptionalRule.t),
  pacts: Ley_IntMap.t(PactCategory.t),
  professions: Ley_IntMap.t(Profession.t),
  properties: Ley_IntMap.t(string),
  publications: Ley_StrMap.t(Publication.t),
  races: Ley_IntMap.t(Race.t),
  reaches: Ley_IntMap.t(string),
  rogueSpells: Ley_IntMap.t(RogueSpell.t),
  skillGroups: Ley_IntMap.t(Skill.group),
  skills: Ley_IntMap.t(Skill.t),
  socialStatuses: Ley_IntMap.t(string),
  specialAbilities: Ley_IntMap.t(SpecialAbility.t),
  specialAbilityGroups: Ley_IntMap.t(string),
  spellEnhancements: Ley_IntMap.t(SelectOption.t),
  spellGroups: Ley_IntMap.t(string),
  spells: Ley_IntMap.t(Spell.t),
  states: Ley_IntMap.t(State.t),
  subjects: Ley_IntMap.t(string),
  tribes: Ley_IntMap.t(string),
  zibiljaRituals: Ley_IntMap.t(ZibiljaRitual.t),
};

[@genType]
[@genType.as "Activatable"]
type activatable =
  | Advantage(Advantage.t)
  | Disadvantage(Disadvantage.t)
  | SpecialAbility(SpecialAbility.t);
