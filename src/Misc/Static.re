module IM = Ley_IntMap;

type t = {
  advantages: IM.t(Advantage.Static.t),
  animalShapes: IM.t(AnimalShape.t),
  animalShapePaths: IM.t(string),
  animalShapeSizes: IM.t(AnimalShape.Size.t),
  animistForces: IM.t(AnimistForce.Static.t),
  arcaneBardTraditions: IM.t(string),
  arcaneDancerTraditions: IM.t(string),
  armorTypes: IM.t(string),
  aspects: IM.t(string),
  attributes: IM.t(Attribute.Static.t),
  blessedTraditions: IM.t(BlessedTradition.t),
  blessings: IM.t(Blessing.Static.t),
  brews: IM.t(string),
  cantrips: IM.t(Cantrip.Static.t),
  combatSpecialAbilityGroups: IM.t(string),
  combatTechniqueGroups: IM.t(string),
  combatTechniques: IM.t(CombatTechnique.Static.t),
  conditions: IM.t(Condition.Static.t),
  coreRules: IM.t(CoreRule.t),
  cultures: IM.t(Culture.Static.t),
  curricula: IM.t(Curriculum.Static.t),
  curses: IM.t(Curse.Static.t),
  derivedCharacteristics: IM.t(DerivedCharacteristic.Static.t),
  disadvantages: IM.t(Disadvantage.Static.t),
  dominationRituals: IM.t(DominationRitual.Static.t),
  elvenMagicalSongs: IM.t(ElvenMagicalSong.Static.t),
  items: IM.t(Item.t),
  equipmentGroups: IM.t(string),
  equipmentPackages: IM.t(EquipmentPackage.t),
  experienceLevels: IM.t(ExperienceLevel.t),
  eyeColors: IM.t(string),
  focusRules: IM.t(FocusRule.Static.t),
  geodeRituals: IM.t(GeodeRitual.Static.t),
  hairColors: IM.t(string),
  languages: IM.t(Language.t),
  liturgicalChantEnhancements: SelectOption.map,
  liturgicalChantGroups: IM.t(string),
  liturgicalChants: IM.t(LiturgicalChant.Static.t),
  magicalDances: IM.t(MagicalDance.Static.t),
  magicalMelodies: IM.t(MagicalMelody.Static.t),
  magicalTraditions: IM.t(MagicalTradition.t),
  messages: Messages.t,
  optionalRules: IM.t(OptionalRule.Static.t),
  pacts: IM.t(Pact.Static.t),
  professions: IM.t(Profession.Static.t),
  properties: IM.t(string),
  publications: IM.t(Publication.t),
  races: IM.t(Race.Static.t),
  reaches: IM.t(string),
  rogueSpells: IM.t(RogueSpell.Static.t),
  scripts: IM.t(Script.t),
  skillGroups: IM.t(SkillGroup.t),
  skills: IM.t(Skill.Static.t),
  socialStatuses: IM.t(string),
  specialAbilities: IM.t(SpecialAbility.Static.t),
  specialAbilityGroups: IM.t(string),
  spellEnhancements: SelectOption.map,
  spellGroups: IM.t(string),
  spells: IM.t(Spell.Static.t),
  states: IM.t(State.Static.t),
  subjects: IM.t(string),
  tradeSecrets: IM.t(TradeSecret.t),
  tribes: IM.t(string),
  zibiljaRituals: IM.t(ZibiljaRitual.Static.t),
};

type activatable =
  | Advantage(Advantage.Static.t)
  | Disadvantage(Disadvantage.Static.t)
  | SpecialAbility(SpecialAbility.Static.t);
