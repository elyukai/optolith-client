// TODO: Update for new identifier mappings

export namespace OptionalRuleIdentifier {
  export const HigherDefenseStats = 17
}

export namespace AttributeIdentifier {
  export const Courage = 1
  export const Sagacity = 2
  export const Intuition = 3
  export const Charisma = 4
  export const Dexterity = 5
  export const Agility = 6
  export const Constitution = 7
  export const Strength = 8
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

export namespace AdvantageIdentifier {
  export const CustomAdvantage = 0
  export const Aptitude = 4 // Begabung
  export const Nimble = 9 // Flink
  export const Blessed = 12
  export const Luck = 14
  export const ExceptionalSkill = 16
  export const ExceptionalCombatTechnique = 17
  export const IncreasedAstralPower = 23
  export const IncreasedKarmaPoints = 24
  export const IncreasedLifePoints = 25
  export const IncreasedSpirit = 26
  export const IncreasedToughness = 27
  export const ImmunityToPoison = 28
  export const ImmunityToDisease = 29
  export const MagicalAttunement = 32
  export const Rich = 36
  export const SociallyAdaptable = 40
  export const InspireConfidence = 46
  export const WeaponAptitude = 47
  export const Spellcaster = 50
  export const Unyielding = 54 // Eisern
  export const LargeSpellSelection = 58
  export const HatredOf = 68
  export const Prediger = 77
  export const Visionaer = 78
  export const ZahlreichePredigten = 79
  export const ZahlreicheVisionen = 80
  export const LeichterGang = 92
  export const Einkommen = 99
}

export namespace DisadvantageIdentifier {
  export const CustomDisadvantage = 0
  export const AfraidOf = 1
  export const Poor = 2
  export const Slow = 4
  export const NoFlyingBalm = 17
  export const NoFamiliar = 18
  export const MagicalRestriction = 24
  export const DecreasedArcanePower = 26
  export const DecreasedKarmaPoints = 27
  export const DecreasedLifePoints = 28
  export const DecreasedSpirit = 29
  export const DecreasedToughness = 30
  export const BadLuck = 31
  export const PersonalityFlaw = 33
  export const Principles = 34
  export const BadHabit = 36
  export const NegativeTrait = 37 // Schlechte Eigenschaft
  export const Stigma = 45
  export const Deaf = 47 // Taub
  export const Incompetent = 48
  export const Obligations = 50 // Verpflichtungen
  export const Maimed = 51 // Verstümmelt
  export const BrittleBones = 56 // Gläsern
  export const SmallSpellSelection = 59
  export const WenigePredigten = 72
  export const WenigeVisionen = 73
}

export namespace CombatSpecialAbilityIdentifier {
  export const CombatReflexes = 12
}
