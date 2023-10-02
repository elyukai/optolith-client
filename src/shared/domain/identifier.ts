// TODO: Update for new identifier mappings

/**
 * Used identifiers of optional rules.
 */
export enum OptionalRuleIdentifier {
  MaximumAttributeScores = 8,
  HigherDefenseStats = 17,
}

/**
 * Used identifiers of races.
 */
export enum RaceIdentifier {
  Humans = 1,
}

/**
 * Used identifiers of professions.
 */
export enum ProfessionIdentifier {
  OwnProfession = 0,
}

/**
 * Used identifiers of eye colors.
 */
export enum EyeColorIdentifier {
  Red = 19,
  Purple = 20,
}

/**
 * Used identifiers of hair colors.
 */
export enum HairColorIdentifier {
  White = 24,
  Green = 25,
}

/**
 * Used identifiers of attributes.
 */
export enum AttributeIdentifier {
  Courage = 1,
  Sagacity = 2,
  Intuition = 3,
  Charisma = 4,
  Dexterity = 5,
  Agility = 6,
  Constitution = 7,
  Strength = 8,
}

/**
 * Used identifiers of derived characteristics.
 */
export enum DerivedCharacteristicIdentifier {
  LifePoints = 1,
  ArcaneEnergy = 2,
  KarmaPoints = 3,
  Spirit = 4,
  Toughness = 5,
  Dodge = 6,
  Initiative = 7,
  Movement = 8,
  FatePoints = 9,
  WoundThreshold = 10,
}

/**
 * Used identifiers of energies.
 */
export type EnergyIdentifier =
  | DerivedCharacteristicIdentifier.LifePoints
  | DerivedCharacteristicIdentifier.ArcaneEnergy
  | DerivedCharacteristicIdentifier.KarmaPoints

/**
 * Used identifiers of skill.
 */
export enum SkillIdentifier {
  Flying = 1,
  Gaukelei = 2,
  Climbing = 3,
  BodyControl = 4,
  FeatOfStrength = 5,
  Riding = 6,
  Swimming = 7,
  SelfControl = 8,
  Singing = 9,
  Perception = 10,
  Dancing = 11,
  Pickpocket = 12,
  Stealth = 13,
  Carousing = 14,
  Persuasion = 15,
  Seduction = 16,
  Intimidation = 17,
  Etiquette = 18,
  Streetwise = 19,
  Empathy = 20,
  FastTalk = 21,
  Disguise = 22,
  Willpower = 23,
  Tracking = 24,
  Ropes = 25,
  Fishing = 26,
  Orienting = 27,
  PlantLore = 28,
  AnimalLore = 29,
  Survival = 30,
  Gambling = 31,
  Geography = 32,
  History = 33,
  Religions = 34,
  Warfare = 35,
  MagicalLore = 36,
  Mechanics = 37,
  Math = 38,
  Law = 39,
  MythsAndLegends = 40,
  SphereLore = 41,
  Astronomy = 42,
  Alchemy = 43,
  Sailing = 44,
  Driving = 45,
  Commerce = 46,
  TreatPoison = 47,
  TreatDisease = 48,
  TreatSoul = 49,
  TreatWounds = 50,
  Woodworking = 51,
  PrepareFood = 52,
  Leatherworking = 53,
  ArtisticAbility = 54,
  Metalworking = 55,
  Music = 56,
  PickLocks = 57,
  Earthencraft = 58,
  Clothworking = 59,
}

/**
 * Used identifiers of advantages.
 */
export enum AdvantageIdentifier {
  CustomAdvantage = 0,
  Aptitude = 4, // Begabung
  Nimble = 9, // Flink
  Blessed = 12,
  Luck = 14,
  ExceptionalSkill = 16,
  ExceptionalCombatTechnique = 17,
  IncreasedAstralPower = 23,
  IncreasedKarmaPoints = 24,
  IncreasedLifePoints = 25,
  IncreasedSpirit = 26,
  IncreasedToughness = 27,
  ImmunityToPoison = 28,
  ImmunityToDisease = 29,
  MagicalAttunement = 32,
  Rich = 36,
  SociallyAdaptable = 40,
  InspireConfidence = 46,
  WeaponAptitude = 47,
  Spellcaster = 50,
  Unyielding = 54, // Eisern
  LargeSpellSelection = 58,
  HatredOf = 68,
  Prediger = 77,
  Visionaer = 78,
  ZahlreichePredigten = 79,
  ZahlreicheVisionen = 80,
  LeichterGang = 92,
  Einkommen = 99,
}

/**
 * Used identifiers of disadvantages.
 */
export enum DisadvantageIdentifier {
  CustomDisadvantage = 0,
  AfraidOf = 1,
  Poor = 2,
  Slow = 4,
  NoFlyingBalm = 17,
  NoFamiliar = 18,
  MagicalRestriction = 24,
  DecreasedArcanePower = 26,
  DecreasedKarmaPoints = 27,
  DecreasedLifePoints = 28,
  DecreasedSpirit = 29,
  DecreasedToughness = 30,
  BadLuck = 31,
  PersonalityFlaw = 33,
  Principles = 34,
  BadHabit = 36,
  NegativeTrait = 37, // Schlechte Eigenschaft
  Stigma = 45,
  Deaf = 47, // Taub
  Incompetent = 48,
  Obligations = 50, // Verpflichtungen
  Maimed = 51, // Verstümmelt
  BrittleBones = 56, // Gläsern
  SmallSpellSelection = 59,
  WenigePredigten = 72,
  WenigeVisionen = 73,
}

/**
 * Used identifiers of ranged combat techniques.
 */
export enum RangedCombatTechniqueIdentifier {
  SpittingFire = 4,
}

/**
 * Used identifiers of combat special abilities.
 */
export enum CombatSpecialAbilityIdentifier {
  CombatReflexes = 12,
}

/**
 * Used identifiers of general special abilities.
 */
export enum GeneralSpecialAbilityIdentifier {
  CraftInstruments = 17,
  Hunter = 18,
  FireEater = 53,
}

/**
 * Used identifiers of magical special abilities.
 */
export enum MagicalSpecialAbilityIdentifier {
  PropertyKnowledge = 3,
  GrosseMeditation = 12,
}

/**
 * Used identifiers of karma special abilities.
 */
export enum KarmaSpecialAbilityIdentifier {
  AspectKnowledge = 1,
  HigherOrdination = 14,
}
