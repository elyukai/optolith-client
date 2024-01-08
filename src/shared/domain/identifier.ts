import * as ID from "optolith-database-schema/types/_Identifier"

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
  Imitationszauberei = 51,
}

/**
 * Used identifiers of magical traditions.
 */
export enum MagicalTraditionIdentifier {
  GuildMages = 1,
  Witches = 2,
  Elves = 3,
  Unicorn = 4,
  Druids = 5,
  QabalyaMages = 6,
  IntuitiveMages = 7,
  Savants = 8,
  Illusionists = 9,
  ArcaneBards = 10,
  ArcaneDancers = 11,
  Schelme = 13,
  Zauberalchimisten = 14,
  TsatuariaAnhaengerinnen = 16,
  Necker = 17,
  Animisten = 18,
  Geoden = 19,
  Zibilijas = 20,
  BrobimGeoden = 21,
  Darna = 23,
  Runenschoepfer = 24,
}

/**
 * Used identifiers of aspects.
 */
export enum AspectIdentifier {
  General = 1,
  AllgemeinSchamanenritus = 44,
}

/**
 * Used identifiers of karma special abilities.
 */
export enum KarmaSpecialAbilityIdentifier {
  AspectKnowledge = 1,
  HigherOrdination = 14,
}

/**
 * Used identifiers of liturgical style special abilities.
 */
export enum LiturgicalStyleSpecialAbilityIdentifier {
  BirdsOfPassage = 38, // Zugvögel
  HuntressesOfTheWhiteMaiden = 40, // Jägerinnen der Weißen Maid
  FollowersOfTheGoldenOne = 47, // Anhänger des Güldenen
}

/**
 * Used identifiers of blessed traditions.
 */
export enum BlessedTraditionIdentifier {
  Praios = 1,
  Phex = 5,
  Firun = 9,
  Rahja = 12,
}

type TagPropertyOptions = {
  Advantage: ID.AdvantageIdentifier
  Disadvantage: ID.DisadvantageIdentifier
  GeneralSpecialAbility: ID.GeneralSpecialAbilityIdentifier
  FatePointSpecialAbility: ID.FatePointSpecialAbilityIdentifier
  CombatSpecialAbility: ID.CombatSpecialAbilityIdentifier
  MagicalSpecialAbility: ID.MagicalSpecialAbilityIdentifier
  StaffEnchantment: ID.StaffEnchantmentIdentifier
  FamiliarSpecialAbility: ID.FamiliarSpecialAbilityIdentifier
  KarmaSpecialAbility: ID.KarmaSpecialAbilityIdentifier
  ProtectiveWardingCircleSpecialAbility: ID.ProtectiveWardingCircleSpecialAbilityIdentifier
  CombatStyleSpecialAbility: ID.CombatStyleSpecialAbilityIdentifier
  AdvancedCombatSpecialAbility: ID.AdvancedCombatSpecialAbilityIdentifier
  CommandSpecialAbility: ID.CommandSpecialAbilityIdentifier
  MagicStyleSpecialAbility: ID.MagicStyleSpecialAbilityIdentifier
  AdvancedMagicalSpecialAbility: ID.AdvancedMagicalSpecialAbilityIdentifier
  SpellSwordEnchantment: ID.SpellSwordEnchantmentIdentifier
  DaggerRitual: ID.DaggerRitualIdentifier
  InstrumentEnchantment: ID.InstrumentEnchantmentIdentifier
  AttireEnchantment: ID.AttireEnchantmentIdentifier
  OrbEnchantment: ID.OrbEnchantmentIdentifier
  WandEnchantment: ID.WandEnchantmentIdentifier
  BrawlingSpecialAbility: ID.BrawlingSpecialAbilityIdentifier
  AncestorGlyph: ID.AncestorGlyphIdentifier
  CeremonialItemSpecialAbility: ID.CeremonialItemSpecialAbilityIdentifier
  Sermon: ID.SermonIdentifier
  LiturgicalStyleSpecialAbility: ID.LiturgicalStyleSpecialAbilityIdentifier
  AdvancedKarmaSpecialAbility: ID.AdvancedKarmaSpecialAbilityIdentifier
  Vision: ID.VisionIdentifier
  MagicalTradition: ID.MagicalTraditionIdentifier
  BlessedTradition: ID.BlessedTraditionIdentifier
  PactGift: ID.PactGiftIdentifier
  SikaryanDrainSpecialAbility: ID.SikaryanDrainSpecialAbilityIdentifier
  LycantropicGift: ID.LycantropicGiftIdentifier
  SkillStyleSpecialAbility: ID.SkillStyleSpecialAbilityIdentifier
  AdvancedSkillSpecialAbility: ID.AdvancedSkillSpecialAbilityIdentifier
  ArcaneOrbEnchantment: ID.ArcaneOrbEnchantmentIdentifier
  CauldronEnchantment: ID.CauldronEnchantmentIdentifier
  FoolsHatEnchantment: ID.FoolsHatEnchantmentIdentifier
  ToyEnchantment: ID.ToyEnchantmentIdentifier
  BowlEnchantment: ID.BowlEnchantmentIdentifier
  FatePointSexSpecialAbility: ID.FatePointSexSpecialAbilityIdentifier
  SexSpecialAbility: ID.SexSpecialAbilityIdentifier
  WeaponEnchantment: ID.WeaponEnchantmentIdentifier
  SickleRitual: ID.SickleRitualIdentifier
  RingEnchantment: ID.RingEnchantmentIdentifier
  ChronicleEnchantment: ID.ChronicleEnchantmentIdentifier
  Krallenkettenzauber: ID.KrallenkettenzauberIdentifier
  Trinkhornzauber: ID.TrinkhornzauberIdentifier
  Attribute: ID.AttributeIdentifier
  Skill: ID.SkillIdentifier
  CloseCombatTechnique: ID.CloseCombatTechniqueIdentifier
  RangedCombatTechnique: ID.RangedCombatTechniqueIdentifier
  Cantrip: ID.CantripIdentifier
  Spell: ID.SpellIdentifier
  Ritual: ID.RitualIdentifier
  Curse: ID.CurseIdentifier
  ElvenMagicalSong: ID.ElvenMagicalSongIdentifier
  DominationRitual: ID.DominationRitualIdentifier
  MagicalMelody: ID.MagicalMelodyIdentifier
  MagicalDance: ID.MagicalDanceIdentifier
  JesterTrick: ID.JesterTrickIdentifier
  AnimistPower: ID.AnimistPowerIdentifier
  GeodeRitual: ID.GeodeRitualIdentifier
  ZibiljaRitual: ID.ZibiljaRitualIdentifier
  Blessing: ID.BlessingIdentifier
  LiturgicalChant: ID.LiturgicalChantIdentifier
  Ceremony: ID.CeremonyIdentifier
  Ammunition: ID.AmmunitionIdentifier
  Animal: ID.AnimalIdentifier
  AnimalCare: ID.AnimalCareIdentifier
  Armor: ID.ArmorIdentifier
  BandageOrRemedy: ID.BandageOrRemedyIdentifier
  Book: ID.BookIdentifier
  CeremonialItem: ID.CeremonialItemIdentifier
  Clothes: ID.ClothesIdentifier
  Container: ID.ContainerIdentifier
  Elixir: ID.ElixirIdentifier
  EquipmentOfBlessedOnes: ID.EquipmentOfBlessedOnesIdentifier
  GemOrPreciousStone: ID.GemOrPreciousStoneIdentifier
  IlluminationLightSource: ID.IlluminationLightSourceIdentifier
  IlluminationRefillsOrSupplies: ID.IlluminationRefillsOrSuppliesIdentifier
  Jewelry: ID.JewelryIdentifier
  Liebesspielzeug: ID.LiebesspielzeugIdentifier
  LuxuryGood: ID.LuxuryGoodIdentifier
  MagicalArtifact: ID.MagicalArtifactIdentifier
  MusicalInstrument: ID.MusicalInstrumentIdentifier
  OrienteeringAid: ID.OrienteeringAidIdentifier
  Poison: ID.PoisonIdentifier
  RopeOrChain: ID.RopeOrChainIdentifier
  Stationary: ID.StationaryIdentifier
  ThievesTool: ID.ThievesToolIdentifier
  ToolOfTheTrade: ID.ToolOfTheTradeIdentifier
  TravelGearOrTool: ID.TravelGearOrToolIdentifier
  Vehicle: ID.VehicleIdentifier
  Weapon: ID.WeaponIdentifier
  WeaponAccessory: ID.WeaponAccessoryIdentifier
}

const TagPropertyMap: {
  [K in keyof TagPropertyOptions]: (id: number) => TagPropertyOptions[K]
} = {
  Advantage: id => ({ tag: "Advantage", advantage: id }),
  Disadvantage: id => ({ tag: "Disadvantage", disadvantage: id }),
  GeneralSpecialAbility: id => ({ tag: "GeneralSpecialAbility", general_special_ability: id }),
  FatePointSpecialAbility: id => ({
    tag: "FatePointSpecialAbility",
    fate_point_special_ability: id,
  }),
  CombatSpecialAbility: id => ({ tag: "CombatSpecialAbility", combat_special_ability: id }),
  MagicalSpecialAbility: id => ({ tag: "MagicalSpecialAbility", magical_special_ability: id }),
  StaffEnchantment: id => ({ tag: "StaffEnchantment", staff_enchantment: id }),
  FamiliarSpecialAbility: id => ({ tag: "FamiliarSpecialAbility", familiar_special_ability: id }),
  KarmaSpecialAbility: id => ({ tag: "KarmaSpecialAbility", karma_special_ability: id }),
  ProtectiveWardingCircleSpecialAbility: id => ({
    tag: "ProtectiveWardingCircleSpecialAbility",
    protective_warding_circle_special_ability: id,
  }),
  CombatStyleSpecialAbility: id => ({
    tag: "CombatStyleSpecialAbility",
    combat_style_special_ability: id,
  }),
  AdvancedCombatSpecialAbility: id => ({
    tag: "AdvancedCombatSpecialAbility",
    advanced_combat_special_ability: id,
  }),
  CommandSpecialAbility: id => ({ tag: "CommandSpecialAbility", command_special_ability: id }),
  MagicStyleSpecialAbility: id => ({
    tag: "MagicStyleSpecialAbility",
    magic_style_special_ability: id,
  }),
  AdvancedMagicalSpecialAbility: id => ({
    tag: "AdvancedMagicalSpecialAbility",
    advanced_magical_special_ability: id,
  }),
  SpellSwordEnchantment: id => ({ tag: "SpellSwordEnchantment", spell_sword_enchantment: id }),
  DaggerRitual: id => ({ tag: "DaggerRitual", dagger_ritual: id }),
  InstrumentEnchantment: id => ({ tag: "InstrumentEnchantment", instrument_enchantment: id }),
  AttireEnchantment: id => ({ tag: "AttireEnchantment", attire_enchantment: id }),
  OrbEnchantment: id => ({ tag: "OrbEnchantment", orb_enchantment: id }),
  WandEnchantment: id => ({ tag: "WandEnchantment", wand_enchantment: id }),
  BrawlingSpecialAbility: id => ({ tag: "BrawlingSpecialAbility", brawling_special_ability: id }),
  AncestorGlyph: id => ({ tag: "AncestorGlyph", ancestor_glyph: id }),
  CeremonialItemSpecialAbility: id => ({
    tag: "CeremonialItemSpecialAbility",
    ceremonial_item_special_ability: id,
  }),
  Sermon: id => ({ tag: "Sermon", sermon: id }),
  LiturgicalStyleSpecialAbility: id => ({
    tag: "LiturgicalStyleSpecialAbility",
    liturgical_style_special_ability: id,
  }),
  AdvancedKarmaSpecialAbility: id => ({
    tag: "AdvancedKarmaSpecialAbility",
    advanced_karma_special_ability: id,
  }),
  Vision: id => ({ tag: "Vision", vision: id }),
  MagicalTradition: id => ({ tag: "MagicalTradition", magical_tradition: id }),
  BlessedTradition: id => ({ tag: "BlessedTradition", blessed_tradition: id }),
  PactGift: id => ({ tag: "PactGift", pact_gift: id }),
  SikaryanDrainSpecialAbility: id => ({
    tag: "SikaryanDrainSpecialAbility",
    sikaryan_drain_special_ability: id,
  }),
  LycantropicGift: id => ({ tag: "LycantropicGift", lycantropic_gift: id }),
  SkillStyleSpecialAbility: id => ({
    tag: "SkillStyleSpecialAbility",
    skill_style_special_ability: id,
  }),
  AdvancedSkillSpecialAbility: id => ({
    tag: "AdvancedSkillSpecialAbility",
    advanced_skill_special_ability: id,
  }),
  ArcaneOrbEnchantment: id => ({ tag: "ArcaneOrbEnchantment", arcane_orb_enchantment: id }),
  CauldronEnchantment: id => ({ tag: "CauldronEnchantment", cauldron_enchantment: id }),
  FoolsHatEnchantment: id => ({ tag: "FoolsHatEnchantment", fools_hat_enchantment: id }),
  ToyEnchantment: id => ({ tag: "ToyEnchantment", toy_enchantment: id }),
  BowlEnchantment: id => ({ tag: "BowlEnchantment", bowl_enchantment: id }),
  FatePointSexSpecialAbility: id => ({
    tag: "FatePointSexSpecialAbility",
    fate_point_sex_special_ability: id,
  }),
  SexSpecialAbility: id => ({ tag: "SexSpecialAbility", sex_special_ability: id }),
  WeaponEnchantment: id => ({ tag: "WeaponEnchantment", weapon_enchantment: id }),
  SickleRitual: id => ({ tag: "SickleRitual", sickle_ritual: id }),
  RingEnchantment: id => ({ tag: "RingEnchantment", ring_enchantment: id }),
  ChronicleEnchantment: id => ({ tag: "ChronicleEnchantment", chronicle_enchantment: id }),
  Krallenkettenzauber: id => ({ tag: "Krallenkettenzauber", krallenkettenzauber: id }),
  Trinkhornzauber: id => ({ tag: "Trinkhornzauber", trinkhornzauber: id }),
  Attribute: id => ({ tag: "Attribute", attribute: id }),
  Skill: id => ({ tag: "Skill", skill: id }),
  CloseCombatTechnique: id => ({ tag: "CloseCombatTechnique", close_combat_technique: id }),
  RangedCombatTechnique: id => ({ tag: "RangedCombatTechnique", ranged_combat_technique: id }),
  Cantrip: id => ({ tag: "Cantrip", cantrip: id }),
  Spell: id => ({ tag: "Spell", spell: id }),
  Ritual: id => ({ tag: "Ritual", ritual: id }),
  Curse: id => ({ tag: "Curse", curse: id }),
  ElvenMagicalSong: id => ({ tag: "ElvenMagicalSong", elven_magical_song: id }),
  DominationRitual: id => ({ tag: "DominationRitual", domination_ritual: id }),
  MagicalMelody: id => ({ tag: "MagicalMelody", magical_melody: id }),
  MagicalDance: id => ({ tag: "MagicalDance", magical_dance: id }),
  JesterTrick: id => ({ tag: "JesterTrick", jester_trick: id }),
  AnimistPower: id => ({ tag: "AnimistPower", animist_power: id }),
  GeodeRitual: id => ({ tag: "GeodeRitual", geode_ritual: id }),
  ZibiljaRitual: id => ({ tag: "ZibiljaRitual", zibilja_ritual: id }),
  Blessing: id => ({ tag: "Blessing", blessing: id }),
  LiturgicalChant: id => ({ tag: "LiturgicalChant", liturgical_chant: id }),
  Ceremony: id => ({ tag: "Ceremony", ceremony: id }),
  Ammunition: id => ({ tag: "Ammunition", ammunition: id }),
  Animal: id => ({ tag: "Animal", animal: id }),
  AnimalCare: id => ({ tag: "AnimalCare", animal_care: id }),
  Armor: id => ({ tag: "Armor", armor: id }),
  BandageOrRemedy: id => ({ tag: "BandageOrRemedy", bandage_or_remedy: id }),
  Book: id => ({ tag: "Book", book: id }),
  CeremonialItem: id => ({ tag: "CeremonialItem", ceremonial_item: id }),
  Clothes: id => ({ tag: "Clothes", clothes: id }),
  Container: id => ({ tag: "Container", container: id }),
  Elixir: id => ({ tag: "Elixir", elixir: id }),
  EquipmentOfBlessedOnes: id => ({ tag: "EquipmentOfBlessedOnes", equipment_of_blessed_ones: id }),
  GemOrPreciousStone: id => ({ tag: "GemOrPreciousStone", gem_or_precious_stone: id }),
  IlluminationLightSource: id => ({
    tag: "IlluminationLightSource",
    illumination_light_source: id,
  }),
  IlluminationRefillsOrSupplies: id => ({
    tag: "IlluminationRefillsOrSupplies",
    illumination_refills_or_supplies: id,
  }),
  Jewelry: id => ({ tag: "Jewelry", jewelry: id }),
  Liebesspielzeug: id => ({ tag: "Liebesspielzeug", liebesspielzeug: id }),
  LuxuryGood: id => ({ tag: "LuxuryGood", luxury_good: id }),
  MagicalArtifact: id => ({ tag: "MagicalArtifact", magical_artifact: id }),
  MusicalInstrument: id => ({ tag: "MusicalInstrument", musical_instrument: id }),
  OrienteeringAid: id => ({ tag: "OrienteeringAid", orienteering_aid: id }),
  Poison: id => ({ tag: "Poison", poison: id }),
  RopeOrChain: id => ({ tag: "RopeOrChain", rope_or_chain: id }),
  Stationary: id => ({ tag: "Stationary", stationary: id }),
  ThievesTool: id => ({ tag: "ThievesTool", thieves_tool: id }),
  ToolOfTheTrade: id => ({ tag: "ToolOfTheTrade", tool_of_the_trade: id }),
  TravelGearOrTool: id => ({ tag: "TravelGearOrTool", travel_gear_or_tool: id }),
  Vehicle: id => ({ tag: "Vehicle", vehicle: id }),
  Weapon: id => ({ tag: "Weapon", weapon: id }),
  WeaponAccessory: id => ({ tag: "WeaponAccessory", weapon_accessory: id }),
}

/**
 * Creates an identifier object from a type name and a plain identifier.
 */
export const createIdentifierObject = <T extends keyof TagPropertyOptions>(
  tag: T,
  id: number,
): TagPropertyOptions[T] => TagPropertyMap[tag](id)
