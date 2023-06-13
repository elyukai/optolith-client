// TODO: Update for new identifier mappings

export enum OptionalRuleIdentifier {
  MaximumAttributeScores = 8,
  HigherDefenseStats = 17,
}

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

export type EnergyIdentifier =
  | DerivedCharacteristicIdentifier.LifePoints
  | DerivedCharacteristicIdentifier.ArcaneEnergy
  | DerivedCharacteristicIdentifier.KarmaPoints

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

export enum CombatSpecialAbilityIdentifier {
  CombatReflexes = 12,
}

export enum MagicalSpecialAbilityIdentifier {
  GrosseMeditation = 12,
}

export enum KarmaSpecialAbilityIdentifier {
  HigherOrdination = 14,
}
