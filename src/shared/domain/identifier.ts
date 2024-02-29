import * as ID from "optolith-database-schema/types/_Identifier"
import { assertExhaustive } from "../utils/typeSafety.ts"

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
 * Used identifiers of skill groups.
 */
export enum SkillGroupIdentifier {
  Physical = 1,
  Social = 2,
  Nature = 3,
  Knowledge = 4,
  Craft = 5,
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
  IncreasedAstralPower = 20,
  IncreasedKarmaPoints = 21,
  IncreasedLifePoints = 22,
  IncreasedSpirit = 23,
  IncreasedToughness = 24,
  ImmunityToPoison = 25,
  ImmunityToDisease = 26,
  MagicalAttunement = 29,
  Rich = 33,
  SociallyAdaptable = 37,
  InspireConfidence = 43,
  WeaponAptitude = 44,
  Spellcaster = 47,
  Unyielding = 51, // Eisern
  HatredOf = 55,
  LargeSpellSelection = 66,
  LeichterGang = 85,
  Preacher = 91,
  Visionary = 92,
  ManySermons = 93,
  ManyVisions = 94,
  Einkommen = 129,
}

/**
 * Used identifiers of disadvantages.
 */
export enum DisadvantageIdentifier {
  CustomDisadvantage = 0,
  AfraidOf = 1,
  Poor = 2,
  Slow = 4,
  NoFlyingBalm = 14,
  NoFamiliar = 15,
  MagicalRestriction = 21,
  DecreasedArcanePower = 23,
  DecreasedKarmaPoints = 24,
  DecreasedLifePoints = 25,
  DecreasedSpirit = 26,
  DecreasedToughness = 27,
  BadLuck = 28,
  PersonalityFlaw = 30,
  Principles = 31,
  BadHabit = 33,
  NegativeTrait = 34, // Schlechte Eigenschaft
  Stigma = 42,
  Deaf = 44, // Taub
  Incompetent = 45,
  Obligations = 47, // Verpflichtungen
  Maimed = 48, // Verstümmelt
  BrittleBones = 56, // Gläsern
  SmallSpellSelection = 64,
  FewerSermons = 70,
  FewerVisions = 71,
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
  SkillSpecialization = 9,
  CraftInstruments = 17,
  Hunter = 18,
  Literacy = 27,
  Language = 29,
  LanguageSpecialization = 30,
  FireEater = 53,
}

/**
 * Used identifiers of magical special abilities.
 */
export enum MagicalSpecialAbilityIdentifier {
  PropertyKnowledge = 3,
  GrosseMeditation = 12,
  Adaptation = 18,
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
 * Used identifiers of magical special abilities.
 */
export enum MagicStyleSpecialAbilityIdentifier {
  ScholarDesMagierkollegsZuHoningen = 24,
  MadaschwesternStil = 55,
}

/**
 * Used identifiers of pact gifts.
 */
export enum PactGiftIdentifier {
  DunklesAbbildDerBuendnisgabe = 3,
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
  Publication: ID.PublicationIdentifier
  ExperienceLevel: ID.ExperienceLevelIdentifier
  CoreRule: ID.CoreRuleIdentifier
  FocusRule: ID.FocusRuleIdentifier
  Subject: ID.SubjectIdentifier
  OptionalRule: ID.OptionalRuleIdentifier
  Race: ID.RaceIdentifier
  Culture: ID.CultureIdentifier
  Profession: ID.ProfessionIdentifier
  ProfessionVariant: ID.ProfessionVariantIdentifier
  Curriculum: ID.CurriculumIdentifier
  Guideline: ID.GuidelineIdentifier
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
  VampiricGift: ID.VampiricGiftIdentifier
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
  MagicalRune: ID.MagicalRuneIdentifier
  MagicalSign: ID.MagicalSignIdentifier
  Language: ID.LanguageIdentifier
  Script: ID.ScriptIdentifier
  Continent: ID.ContinentIdentifier
  SocialStatus: ID.SocialStatusIdentifier
  Attribute: ID.AttributeIdentifier
  Skill: ID.SkillIdentifier
  SkillGroup: ID.SkillGroupIdentifier
  CloseCombatTechnique: ID.CloseCombatTechniqueIdentifier
  RangedCombatTechnique: ID.RangedCombatTechniqueIdentifier
  Spell: ID.SpellIdentifier
  Ritual: ID.RitualIdentifier
  Cantrip: ID.CantripIdentifier
  Property: ID.PropertyIdentifier
  LiturgicalChant: ID.LiturgicalChantIdentifier
  Ceremony: ID.CeremonyIdentifier
  Blessing: ID.BlessingIdentifier
  Aspect: ID.AspectIdentifier
  Curse: ID.CurseIdentifier
  ElvenMagicalSong: ID.ElvenMagicalSongIdentifier
  DominationRitual: ID.DominationRitualIdentifier
  MagicalMelody: ID.MagicalMelodyIdentifier
  MagicalDance: ID.MagicalDanceIdentifier
  JesterTrick: ID.JesterTrickIdentifier
  AnimistPower: ID.AnimistPowerIdentifier
  GeodeRitual: ID.GeodeRitualIdentifier
  ZibiljaRitual: ID.ZibiljaRitualIdentifier
  AnimalType: ID.AnimalTypeIdentifier
  TargetCategory: ID.TargetCategoryIdentifier
  General: ID.GeneralIdentifier
  Element: ID.ElementIdentifier
  AnimalShapeSize: ID.AnimalShapeSizeIdentifier
  Patron: ID.PatronIdentifier
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
  Reach: ID.ReachIdentifier
  PatronCategory: ID.PatronCategoryIdentifier
  PersonalityTrait: ID.PersonalityTraitIdentifier
  HairColor: ID.HairColorIdentifier
  EyeColor: ID.EyeColorIdentifier
  PactCategory: ID.PactCategoryIdentifier
  PactDomain: ID.PactDomainIdentifier
  AnimistTribe: ID.AnimistTribeIdentifier
  Influence: ID.InfluenceIdentifier
  Condition: ID.ConditionIdentifier
  State: ID.StateIdentifier
  Disease: ID.DiseaseIdentifier
  SexPractice: ID.SexPracticeIdentifier
  TradeSecret: ID.TradeSecretIdentifier
  AnimalShape: ID.AnimalShapeIdentifier
  ArcaneBardTradition: ID.ArcaneBardTraditionIdentifier
  ArcaneDancerTradition: ID.ArcaneDancerTraditionIdentifier
}

// prettier-ignore
const TagPropertyMap: {
  [K in keyof TagPropertyOptions]: (id: number) => TagPropertyOptions[K]
} = {
  Publication: id => ({ tag: "Publication", publication: id }),
  ExperienceLevel: id => ({ tag: "ExperienceLevel", experience_level: id }),
  CoreRule: id => ({ tag: "CoreRule", core_rule: id }),
  FocusRule: id => ({ tag: "FocusRule", focus_rule: id }),
  Subject: id => ({ tag: "Subject", subject: id }),
  OptionalRule: id => ({ tag: "OptionalRule", optional_rule: id }),
  Race: id => ({ tag: "Race", race: id }),
  Culture: id => ({ tag: "Culture", culture: id }),
  Profession: id => ({ tag: "Profession", profession: id }),
  ProfessionVariant: id => ({ tag: "ProfessionVariant", profession_variant: id }),
  Curriculum: id => ({ tag: "Curriculum", curriculum: id }),
  Guideline: id => ({ tag: "Guideline", guideline: id }),
  Advantage: id => ({ tag: "Advantage", advantage: id }),
  Disadvantage: id => ({ tag: "Disadvantage", disadvantage: id }),
  GeneralSpecialAbility: id => ({ tag: "GeneralSpecialAbility", general_special_ability: id }),
  FatePointSpecialAbility: id => ({ tag: "FatePointSpecialAbility", fate_point_special_ability: id }),
  CombatSpecialAbility: id => ({ tag: "CombatSpecialAbility", combat_special_ability: id }),
  MagicalSpecialAbility: id => ({ tag: "MagicalSpecialAbility", magical_special_ability: id }),
  StaffEnchantment: id => ({ tag: "StaffEnchantment", staff_enchantment: id }),
  FamiliarSpecialAbility: id => ({ tag: "FamiliarSpecialAbility", familiar_special_ability: id }),
  KarmaSpecialAbility: id => ({ tag: "KarmaSpecialAbility", karma_special_ability: id }),
  ProtectiveWardingCircleSpecialAbility: id => ({ tag: "ProtectiveWardingCircleSpecialAbility", protective_warding_circle_special_ability: id }),
  CombatStyleSpecialAbility: id => ({ tag: "CombatStyleSpecialAbility", combat_style_special_ability: id }),
  AdvancedCombatSpecialAbility: id => ({ tag: "AdvancedCombatSpecialAbility", advanced_combat_special_ability: id }),
  CommandSpecialAbility: id => ({ tag: "CommandSpecialAbility", command_special_ability: id }),
  MagicStyleSpecialAbility: id => ({ tag: "MagicStyleSpecialAbility", magic_style_special_ability: id }),
  AdvancedMagicalSpecialAbility: id => ({ tag: "AdvancedMagicalSpecialAbility", advanced_magical_special_ability: id }),
  SpellSwordEnchantment: id => ({ tag: "SpellSwordEnchantment", spell_sword_enchantment: id }),
  DaggerRitual: id => ({ tag: "DaggerRitual", dagger_ritual: id }),
  InstrumentEnchantment: id => ({ tag: "InstrumentEnchantment", instrument_enchantment: id }),
  AttireEnchantment: id => ({ tag: "AttireEnchantment", attire_enchantment: id }),
  OrbEnchantment: id => ({ tag: "OrbEnchantment", orb_enchantment: id }),
  WandEnchantment: id => ({ tag: "WandEnchantment", wand_enchantment: id }),
  BrawlingSpecialAbility: id => ({ tag: "BrawlingSpecialAbility", brawling_special_ability: id }),
  AncestorGlyph: id => ({ tag: "AncestorGlyph", ancestor_glyph: id }),
  CeremonialItemSpecialAbility: id => ({ tag: "CeremonialItemSpecialAbility", ceremonial_item_special_ability: id }),
  Sermon: id => ({ tag: "Sermon", sermon: id }),
  LiturgicalStyleSpecialAbility: id => ({ tag: "LiturgicalStyleSpecialAbility", liturgical_style_special_ability: id }),
  AdvancedKarmaSpecialAbility: id => ({ tag: "AdvancedKarmaSpecialAbility", advanced_karma_special_ability: id }),
  Vision: id => ({ tag: "Vision", vision: id }),
  MagicalTradition: id => ({ tag: "MagicalTradition", magical_tradition: id }),
  BlessedTradition: id => ({ tag: "BlessedTradition", blessed_tradition: id }),
  PactGift: id => ({ tag: "PactGift", pact_gift: id }),
  VampiricGift: id => ({ tag: "VampiricGift", vampiric_gift: id }),
  SikaryanDrainSpecialAbility: id => ({ tag: "SikaryanDrainSpecialAbility", sikaryan_drain_special_ability: id }),
  LycantropicGift: id => ({ tag: "LycantropicGift", lycantropic_gift: id }),
  SkillStyleSpecialAbility: id => ({ tag: "SkillStyleSpecialAbility", skill_style_special_ability: id }),
  AdvancedSkillSpecialAbility: id => ({ tag: "AdvancedSkillSpecialAbility", advanced_skill_special_ability: id }),
  ArcaneOrbEnchantment: id => ({ tag: "ArcaneOrbEnchantment", arcane_orb_enchantment: id }),
  CauldronEnchantment: id => ({ tag: "CauldronEnchantment", cauldron_enchantment: id }),
  FoolsHatEnchantment: id => ({ tag: "FoolsHatEnchantment", fools_hat_enchantment: id }),
  ToyEnchantment: id => ({ tag: "ToyEnchantment", toy_enchantment: id }),
  BowlEnchantment: id => ({ tag: "BowlEnchantment", bowl_enchantment: id }),
  FatePointSexSpecialAbility: id => ({ tag: "FatePointSexSpecialAbility", fate_point_sex_special_ability: id }),
  SexSpecialAbility: id => ({ tag: "SexSpecialAbility", sex_special_ability: id }),
  WeaponEnchantment: id => ({ tag: "WeaponEnchantment", weapon_enchantment: id }),
  SickleRitual: id => ({ tag: "SickleRitual", sickle_ritual: id }),
  RingEnchantment: id => ({ tag: "RingEnchantment", ring_enchantment: id }),
  ChronicleEnchantment: id => ({ tag: "ChronicleEnchantment", chronicle_enchantment: id }),
  Krallenkettenzauber: id => ({ tag: "Krallenkettenzauber", krallenkettenzauber: id }),
  Trinkhornzauber: id => ({ tag: "Trinkhornzauber", trinkhornzauber: id }),
  MagicalRune: id => ({ tag: "MagicalRune", magical_rune: id }),
  MagicalSign: id => ({ tag: "MagicalSign", magical_sign: id }),
  Language: id => ({ tag: "Language", language: id }),
  Script: id => ({ tag: "Script", script: id }),
  Continent: id => ({ tag: "Continent", continent: id }),
  SocialStatus: id => ({ tag: "SocialStatus", social_status: id }),
  Attribute: id => ({ tag: "Attribute", attribute: id }),
  Skill: id => ({ tag: "Skill", skill: id }),
  SkillGroup: id => ({ tag: "SkillGroup", skill_group: id }),
  CloseCombatTechnique: id => ({ tag: "CloseCombatTechnique", close_combat_technique: id }),
  RangedCombatTechnique: id => ({ tag: "RangedCombatTechnique", ranged_combat_technique: id }),
  Spell: id => ({ tag: "Spell", spell: id }),
  Ritual: id => ({ tag: "Ritual", ritual: id }),
  Cantrip: id => ({ tag: "Cantrip", cantrip: id }),
  Property: id => ({ tag: "Property", property: id }),
  LiturgicalChant: id => ({ tag: "LiturgicalChant", liturgical_chant: id }),
  Ceremony: id => ({ tag: "Ceremony", ceremony: id }),
  Blessing: id => ({ tag: "Blessing", blessing: id }),
  Aspect: id => ({ tag: "Aspect", aspect: id }),
  Curse: id => ({ tag: "Curse", curse: id }),
  ElvenMagicalSong: id => ({ tag: "ElvenMagicalSong", elven_magical_song: id }),
  DominationRitual: id => ({ tag: "DominationRitual", domination_ritual: id }),
  MagicalMelody: id => ({ tag: "MagicalMelody", magical_melody: id }),
  MagicalDance: id => ({ tag: "MagicalDance", magical_dance: id }),
  JesterTrick: id => ({ tag: "JesterTrick", jester_trick: id }),
  AnimistPower: id => ({ tag: "AnimistPower", animist_power: id }),
  GeodeRitual: id => ({ tag: "GeodeRitual", geode_ritual: id }),
  ZibiljaRitual: id => ({ tag: "ZibiljaRitual", zibilja_ritual: id }),
  AnimalType: id => ({ tag: "AnimalType", animal_type: id }),
  TargetCategory: id => ({ tag: "TargetCategory", target_category: id }),
  General: id => ({ tag: "General", general: id }),
  Element: id => ({ tag: "Element", element: id }),
  AnimalShapeSize: id => ({ tag: "AnimalShapeSize", animal_shape_size: id }),
  Patron: id => ({ tag: "Patron", patron: id }),
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
  IlluminationLightSource: id => ({ tag: "IlluminationLightSource", illumination_light_source: id }),
  IlluminationRefillsOrSupplies: id => ({ tag: "IlluminationRefillsOrSupplies", illumination_refills_or_supplies: id }),
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
  Reach: id => ({ tag: "Reach", reach: id }),
  PatronCategory: id => ({ tag: "PatronCategory", patron_category: id }),
  PersonalityTrait: id => ({ tag: "PersonalityTrait", personality_trait: id }),
  HairColor: id => ({ tag: "HairColor", hair_color: id }),
  EyeColor: id => ({ tag: "EyeColor", eye_color: id }),
  PactCategory: id => ({ tag: "PactCategory", pact_category: id }),
  PactDomain: id => ({ tag: "PactDomain", pact_domain: id }),
  AnimistTribe: id => ({ tag: "AnimistTribe", animist_tribe: id }),
  Influence: id => ({ tag: "Influence", influence: id }),
  Condition: id => ({ tag: "Condition", condition: id }),
  State: id => ({ tag: "State", state: id }),
  Disease: id => ({ tag: "Disease", disease: id }),
  SexPractice: id => ({ tag: "SexPractice", sex_practice: id }),
  TradeSecret: id => ({ tag: "TradeSecret", trade_secret: id }),
  AnimalShape: id => ({ tag: "AnimalShape", animal_shape: id }),
  ArcaneBardTradition: id => ({ tag: "ArcaneBardTradition", arcane_bard_tradition: id }),
  ArcaneDancerTradition: id => ({ tag: "ArcaneDancerTradition", arcane_dancer_tradition: id }),
}

/**
 * Creates an identifier object from a type name and a plain identifier.
 */
export const createIdentifierObject = <T extends keyof TagPropertyOptions>(
  tag: T,
  id: number,
): TagPropertyOptions[T] => TagPropertyMap[tag](id)

/**
 * Returns a function by a type name that creates an identifier object from a
 * plain identifier.
 */
export const getCreateIdentifierObject = <T extends keyof TagPropertyOptions>(
  tag: T,
): ((id: number) => TagPropertyOptions[T]) => TagPropertyMap[tag]

/**
 * Splits an identifier object into its type name and plain identifier.
 */
export const splitIdentifierObject = <T extends keyof TagPropertyOptions>(
  obj: TagPropertyOptions[T],
): [tag: T, id: number] => {
  // prettier-ignore
  switch (obj.tag) {
    case "Publication": return [obj.tag as T, obj.publication]
    case "ExperienceLevel": return [obj.tag as T, obj.experience_level]
    case "CoreRule": return [obj.tag as T, obj.core_rule]
    case "FocusRule": return [obj.tag as T, obj.focus_rule]
    case "Subject": return [obj.tag as T, obj.subject]
    case "OptionalRule": return [obj.tag as T, obj.optional_rule]
    case "Race": return [obj.tag as T, obj.race]
    case "Culture": return [obj.tag as T, obj.culture]
    case "Profession": return [obj.tag as T, obj.profession]
    case "ProfessionVariant": return [obj.tag as T, obj.profession_variant]
    case "Curriculum": return [obj.tag as T, obj.curriculum]
    case "Guideline": return [obj.tag as T, obj.guideline]
    case "Advantage": return [obj.tag as T, obj.advantage]
    case "Disadvantage": return [obj.tag as T, obj.disadvantage]
    case "GeneralSpecialAbility": return [obj.tag as T, obj.general_special_ability]
    case "FatePointSpecialAbility": return [obj.tag as T, obj.fate_point_special_ability]
    case "CombatSpecialAbility": return [obj.tag as T, obj.combat_special_ability]
    case "MagicalSpecialAbility": return [obj.tag as T, obj.magical_special_ability]
    case "StaffEnchantment": return [obj.tag as T, obj.staff_enchantment]
    case "FamiliarSpecialAbility": return [obj.tag as T, obj.familiar_special_ability]
    case "KarmaSpecialAbility": return [obj.tag as T, obj.karma_special_ability]
    case "ProtectiveWardingCircleSpecialAbility": return [obj.tag as T, obj.protective_warding_circle_special_ability]
    case "CombatStyleSpecialAbility": return [obj.tag as T, obj.combat_style_special_ability]
    case "AdvancedCombatSpecialAbility": return [obj.tag as T, obj.advanced_combat_special_ability]
    case "CommandSpecialAbility": return [obj.tag as T, obj.command_special_ability]
    case "MagicStyleSpecialAbility": return [obj.tag as T, obj.magic_style_special_ability]
    case "AdvancedMagicalSpecialAbility": return [obj.tag as T, obj.advanced_magical_special_ability]
    case "SpellSwordEnchantment": return [obj.tag as T, obj.spell_sword_enchantment]
    case "DaggerRitual": return [obj.tag as T, obj.dagger_ritual]
    case "InstrumentEnchantment": return [obj.tag as T, obj.instrument_enchantment]
    case "AttireEnchantment": return [obj.tag as T, obj.attire_enchantment]
    case "OrbEnchantment": return [obj.tag as T, obj.orb_enchantment]
    case "WandEnchantment": return [obj.tag as T, obj.wand_enchantment]
    case "BrawlingSpecialAbility": return [obj.tag as T, obj.brawling_special_ability]
    case "AncestorGlyph": return [obj.tag as T, obj.ancestor_glyph]
    case "CeremonialItemSpecialAbility": return [obj.tag as T, obj.ceremonial_item_special_ability]
    case "Sermon": return [obj.tag as T, obj.sermon]
    case "LiturgicalStyleSpecialAbility": return [obj.tag as T, obj.liturgical_style_special_ability]
    case "AdvancedKarmaSpecialAbility": return [obj.tag as T, obj.advanced_karma_special_ability]
    case "Vision": return [obj.tag as T, obj.vision]
    case "MagicalTradition": return [obj.tag as T, obj.magical_tradition]
    case "BlessedTradition": return [obj.tag as T, obj.blessed_tradition]
    case "PactGift": return [obj.tag as T, obj.pact_gift]
    case "VampiricGift": return [obj.tag as T, obj.vampiric_gift]
    case "SikaryanDrainSpecialAbility": return [obj.tag as T, obj.sikaryan_drain_special_ability]
    case "LycantropicGift": return [obj.tag as T, obj.lycantropic_gift]
    case "SkillStyleSpecialAbility": return [obj.tag as T, obj.skill_style_special_ability]
    case "AdvancedSkillSpecialAbility": return [obj.tag as T, obj.advanced_skill_special_ability]
    case "ArcaneOrbEnchantment": return [obj.tag as T, obj.arcane_orb_enchantment]
    case "CauldronEnchantment": return [obj.tag as T, obj.cauldron_enchantment]
    case "FoolsHatEnchantment": return [obj.tag as T, obj.fools_hat_enchantment]
    case "ToyEnchantment": return [obj.tag as T, obj.toy_enchantment]
    case "BowlEnchantment": return [obj.tag as T, obj.bowl_enchantment]
    case "FatePointSexSpecialAbility": return [obj.tag as T, obj.fate_point_sex_special_ability]
    case "SexSpecialAbility": return [obj.tag as T, obj.sex_special_ability]
    case "WeaponEnchantment": return [obj.tag as T, obj.weapon_enchantment]
    case "SickleRitual": return [obj.tag as T, obj.sickle_ritual]
    case "RingEnchantment": return [obj.tag as T, obj.ring_enchantment]
    case "ChronicleEnchantment": return [obj.tag as T, obj.chronicle_enchantment]
    case "Krallenkettenzauber": return [obj.tag as T, obj.krallenkettenzauber]
    case "Trinkhornzauber": return [obj.tag as T, obj.trinkhornzauber]
    case "MagicalRune": return [obj.tag as T, obj.magical_rune]
    case "MagicalSign": return [obj.tag as T, obj.magical_sign]
    case "Language": return [obj.tag as T, obj.language]
    case "Script": return [obj.tag as T, obj.script]
    case "Continent": return [obj.tag as T, obj.continent]
    case "SocialStatus": return [obj.tag as T, obj.social_status]
    case "Attribute": return [obj.tag as T, obj.attribute]
    case "Skill": return [obj.tag as T, obj.skill]
    case "SkillGroup": return [obj.tag as T, obj.skill_group]
    case "CloseCombatTechnique": return [obj.tag as T, obj.close_combat_technique]
    case "RangedCombatTechnique": return [obj.tag as T, obj.ranged_combat_technique]
    case "Spell": return [obj.tag as T, obj.spell]
    case "Ritual": return [obj.tag as T, obj.ritual]
    case "Cantrip": return [obj.tag as T, obj.cantrip]
    case "Property": return [obj.tag as T, obj.property]
    case "LiturgicalChant": return [obj.tag as T, obj.liturgical_chant]
    case "Ceremony": return [obj.tag as T, obj.ceremony]
    case "Blessing": return [obj.tag as T, obj.blessing]
    case "Aspect": return [obj.tag as T, obj.aspect]
    case "Curse": return [obj.tag as T, obj.curse]
    case "ElvenMagicalSong": return [obj.tag as T, obj.elven_magical_song]
    case "DominationRitual": return [obj.tag as T, obj.domination_ritual]
    case "MagicalMelody": return [obj.tag as T, obj.magical_melody]
    case "MagicalDance": return [obj.tag as T, obj.magical_dance]
    case "JesterTrick": return [obj.tag as T, obj.jester_trick]
    case "AnimistPower": return [obj.tag as T, obj.animist_power]
    case "GeodeRitual": return [obj.tag as T, obj.geode_ritual]
    case "ZibiljaRitual": return [obj.tag as T, obj.zibilja_ritual]
    case "AnimalType": return [obj.tag as T, obj.animal_type]
    case "TargetCategory": return [obj.tag as T, obj.target_category]
    case "General": return [obj.tag as T, obj.general]
    case "Element": return [obj.tag as T, obj.element]
    case "AnimalShapeSize": return [obj.tag as T, obj.animal_shape_size]
    case "Patron": return [obj.tag as T, obj.patron]
    case "Ammunition": return [obj.tag as T, obj.ammunition]
    case "Animal": return [obj.tag as T, obj.animal]
    case "AnimalCare": return [obj.tag as T, obj.animal_care]
    case "Armor": return [obj.tag as T, obj.armor]
    case "BandageOrRemedy": return [obj.tag as T, obj.bandage_or_remedy]
    case "Book": return [obj.tag as T, obj.book]
    case "CeremonialItem": return [obj.tag as T, obj.ceremonial_item]
    case "Clothes": return [obj.tag as T, obj.clothes]
    case "Container": return [obj.tag as T, obj.container]
    case "Elixir": return [obj.tag as T, obj.elixir]
    case "EquipmentOfBlessedOnes": return [obj.tag as T, obj.equipment_of_blessed_ones]
    case "GemOrPreciousStone": return [obj.tag as T, obj.gem_or_precious_stone]
    case "IlluminationLightSource": return [obj.tag as T, obj.illumination_light_source]
    case "IlluminationRefillsOrSupplies": return [obj.tag as T, obj.illumination_refills_or_supplies]
    case "Jewelry": return [obj.tag as T, obj.jewelry]
    case "Liebesspielzeug": return [obj.tag as T, obj.liebesspielzeug]
    case "LuxuryGood": return [obj.tag as T, obj.luxury_good]
    case "MagicalArtifact": return [obj.tag as T, obj.magical_artifact]
    case "MusicalInstrument": return [obj.tag as T, obj.musical_instrument]
    case "OrienteeringAid": return [obj.tag as T, obj.orienteering_aid]
    case "Poison": return [obj.tag as T, obj.poison]
    case "RopeOrChain": return [obj.tag as T, obj.rope_or_chain]
    case "Stationary": return [obj.tag as T, obj.stationary]
    case "ThievesTool": return [obj.tag as T, obj.thieves_tool]
    case "ToolOfTheTrade": return [obj.tag as T, obj.tool_of_the_trade]
    case "TravelGearOrTool": return [obj.tag as T, obj.travel_gear_or_tool]
    case "Vehicle": return [obj.tag as T, obj.vehicle]
    case "Weapon": return [obj.tag as T, obj.weapon]
    case "WeaponAccessory": return [obj.tag as T, obj.weapon_accessory]
    case "Reach": return [obj.tag as T, obj.reach]
    case "PatronCategory": return [obj.tag as T, obj.patron_category]
    case "PersonalityTrait": return [obj.tag as T, obj.personality_trait]
    case "HairColor": return [obj.tag as T, obj.hair_color]
    case "EyeColor": return [obj.tag as T, obj.eye_color]
    case "PactCategory": return [obj.tag as T, obj.pact_category]
    case "PactDomain": return [obj.tag as T, obj.pact_domain]
    case "AnimistTribe": return [obj.tag as T, obj.animist_tribe]
    case "Influence": return [obj.tag as T, obj.influence]
    case "Condition": return [obj.tag as T, obj.condition]
    case "State": return [obj.tag as T, obj.state]
    case "Disease": return [obj.tag as T, obj.disease]
    case "SexPractice": return [obj.tag as T, obj.sex_practice]
    case "TradeSecret": return [obj.tag as T, obj.trade_secret]
    case "AnimalShape": return [obj.tag as T, obj.animal_shape]
    case "ArcaneBardTradition": return [obj.tag as T, obj.arcane_bard_tradition]
    case "ArcaneDancerTradition": return [obj.tag as T, obj.arcane_dancer_tradition]
    default: return assertExhaustive(obj)
  }
}

/**
 * Checks if two identifiers are equal.
 */
export const equalsIdentifier = <T extends TagPropertyOptions[keyof TagPropertyOptions]>(
  a: T,
  b: T,
): boolean => {
  // prettier-ignore
  switch (a.tag) {
    case "Publication": return b.tag === "Publication" && a.publication === b.publication
    case "ExperienceLevel": return b.tag === "ExperienceLevel" && a.experience_level === b.experience_level
    case "CoreRule": return b.tag === "CoreRule" && a.core_rule === b.core_rule
    case "FocusRule": return b.tag === "FocusRule" && a.focus_rule === b.focus_rule
    case "Subject": return b.tag === "Subject" && a.subject === b.subject
    case "OptionalRule": return b.tag === "OptionalRule" && a.optional_rule === b.optional_rule
    case "Race": return b.tag === "Race" && a.race === b.race
    case "Culture": return b.tag === "Culture" && a.culture === b.culture
    case "Profession": return b.tag === "Profession" && a.profession === b.profession
    case "ProfessionVariant": return b.tag === "ProfessionVariant" && a.profession_variant === b.profession_variant
    case "Curriculum": return b.tag === "Curriculum" && a.curriculum === b.curriculum
    case "Guideline": return b.tag === "Guideline" && a.guideline === b.guideline
    case "Advantage": return b.tag === "Advantage" && a.advantage === b.advantage
    case "Disadvantage": return b.tag === "Disadvantage" && a.disadvantage === b.disadvantage
    case "GeneralSpecialAbility": return b.tag === "GeneralSpecialAbility" && a.general_special_ability === b.general_special_ability
    case "FatePointSpecialAbility": return b.tag === "FatePointSpecialAbility" && a.fate_point_special_ability === b.fate_point_special_ability
    case "CombatSpecialAbility": return b.tag === "CombatSpecialAbility" && a.combat_special_ability === b.combat_special_ability
    case "MagicalSpecialAbility": return b.tag === "MagicalSpecialAbility" && a.magical_special_ability === b.magical_special_ability
    case "StaffEnchantment": return b.tag === "StaffEnchantment" && a.staff_enchantment === b.staff_enchantment
    case "FamiliarSpecialAbility": return b.tag === "FamiliarSpecialAbility" && a.familiar_special_ability === b.familiar_special_ability
    case "KarmaSpecialAbility": return b.tag === "KarmaSpecialAbility" && a.karma_special_ability === b.karma_special_ability
    case "ProtectiveWardingCircleSpecialAbility": return b.tag === "ProtectiveWardingCircleSpecialAbility" && a.protective_warding_circle_special_ability === b.protective_warding_circle_special_ability
    case "CombatStyleSpecialAbility": return b.tag === "CombatStyleSpecialAbility" && a.combat_style_special_ability === b.combat_style_special_ability
    case "AdvancedCombatSpecialAbility": return b.tag === "AdvancedCombatSpecialAbility" && a.advanced_combat_special_ability === b.advanced_combat_special_ability
    case "CommandSpecialAbility": return b.tag === "CommandSpecialAbility" && a.command_special_ability === b.command_special_ability
    case "MagicStyleSpecialAbility": return b.tag === "MagicStyleSpecialAbility" && a.magic_style_special_ability === b.magic_style_special_ability
    case "AdvancedMagicalSpecialAbility": return b.tag === "AdvancedMagicalSpecialAbility" && a.advanced_magical_special_ability === b.advanced_magical_special_ability
    case "SpellSwordEnchantment": return b.tag === "SpellSwordEnchantment" && a.spell_sword_enchantment === b.spell_sword_enchantment
    case "DaggerRitual": return b.tag === "DaggerRitual" && a.dagger_ritual === b.dagger_ritual
    case "InstrumentEnchantment": return b.tag === "InstrumentEnchantment" && a.instrument_enchantment === b.instrument_enchantment
    case "AttireEnchantment": return b.tag === "AttireEnchantment" && a.attire_enchantment === b.attire_enchantment
    case "OrbEnchantment": return b.tag === "OrbEnchantment" && a.orb_enchantment === b.orb_enchantment
    case "WandEnchantment": return b.tag === "WandEnchantment" && a.wand_enchantment === b.wand_enchantment
    case "BrawlingSpecialAbility": return b.tag === "BrawlingSpecialAbility" && a.brawling_special_ability === b.brawling_special_ability
    case "AncestorGlyph": return b.tag === "AncestorGlyph" && a.ancestor_glyph === b.ancestor_glyph
    case "CeremonialItemSpecialAbility": return b.tag === "CeremonialItemSpecialAbility" && a.ceremonial_item_special_ability === b.ceremonial_item_special_ability
    case "Sermon": return b.tag === "Sermon" && a.sermon === b.sermon
    case "LiturgicalStyleSpecialAbility": return b.tag === "LiturgicalStyleSpecialAbility" && a.liturgical_style_special_ability === b.liturgical_style_special_ability
    case "AdvancedKarmaSpecialAbility": return b.tag === "AdvancedKarmaSpecialAbility" && a.advanced_karma_special_ability === b.advanced_karma_special_ability
    case "Vision": return b.tag === "Vision" && a.vision === b.vision
    case "MagicalTradition": return b.tag === "MagicalTradition" && a.magical_tradition === b.magical_tradition
    case "BlessedTradition": return b.tag === "BlessedTradition" && a.blessed_tradition === b.blessed_tradition
    case "PactGift": return b.tag === "PactGift" && a.pact_gift === b.pact_gift
    case "VampiricGift": return b.tag === "VampiricGift" && a.vampiric_gift === b.vampiric_gift
    case "SikaryanDrainSpecialAbility": return b.tag === "SikaryanDrainSpecialAbility" && a.sikaryan_drain_special_ability === b.sikaryan_drain_special_ability
    case "LycantropicGift": return b.tag === "LycantropicGift" && a.lycantropic_gift === b.lycantropic_gift
    case "SkillStyleSpecialAbility": return b.tag === "SkillStyleSpecialAbility" && a.skill_style_special_ability === b.skill_style_special_ability
    case "AdvancedSkillSpecialAbility": return b.tag === "AdvancedSkillSpecialAbility" && a.advanced_skill_special_ability === b.advanced_skill_special_ability
    case "ArcaneOrbEnchantment": return b.tag === "ArcaneOrbEnchantment" && a.arcane_orb_enchantment === b.arcane_orb_enchantment
    case "CauldronEnchantment": return b.tag === "CauldronEnchantment" && a.cauldron_enchantment === b.cauldron_enchantment
    case "FoolsHatEnchantment": return b.tag === "FoolsHatEnchantment" && a.fools_hat_enchantment === b.fools_hat_enchantment
    case "ToyEnchantment": return b.tag === "ToyEnchantment" && a.toy_enchantment === b.toy_enchantment
    case "BowlEnchantment": return b.tag === "BowlEnchantment" && a.bowl_enchantment === b.bowl_enchantment
    case "FatePointSexSpecialAbility": return b.tag === "FatePointSexSpecialAbility" && a.fate_point_sex_special_ability === b.fate_point_sex_special_ability
    case "SexSpecialAbility": return b.tag === "SexSpecialAbility" && a.sex_special_ability === b.sex_special_ability
    case "WeaponEnchantment": return b.tag === "WeaponEnchantment" && a.weapon_enchantment === b.weapon_enchantment
    case "SickleRitual": return b.tag === "SickleRitual" && a.sickle_ritual === b.sickle_ritual
    case "RingEnchantment": return b.tag === "RingEnchantment" && a.ring_enchantment === b.ring_enchantment
    case "ChronicleEnchantment": return b.tag === "ChronicleEnchantment" && a.chronicle_enchantment === b.chronicle_enchantment
    case "Krallenkettenzauber": return b.tag === "Krallenkettenzauber" && a.krallenkettenzauber === b.krallenkettenzauber
    case "Trinkhornzauber": return b.tag === "Trinkhornzauber" && a.trinkhornzauber === b.trinkhornzauber
    case "MagicalRune": return b.tag === "MagicalRune" && a.magical_rune === b.magical_rune
    case "MagicalSign": return b.tag === "MagicalSign" && a.magical_sign === b.magical_sign
    case "Language": return b.tag === "Language" && a.language === b.language
    case "Script": return b.tag === "Script" && a.script === b.script
    case "Continent": return b.tag === "Continent" && a.continent === b.continent
    case "SocialStatus": return b.tag === "SocialStatus" && a.social_status === b.social_status
    case "Attribute": return b.tag === "Attribute" && a.attribute === b.attribute
    case "Skill": return b.tag === "Skill" && a.skill === b.skill
    case "SkillGroup": return b.tag === "SkillGroup" && a.skill_group === b.skill_group
    case "CloseCombatTechnique": return b.tag === "CloseCombatTechnique" && a.close_combat_technique === b.close_combat_technique
    case "RangedCombatTechnique": return b.tag === "RangedCombatTechnique" && a.ranged_combat_technique === b.ranged_combat_technique
    case "Spell": return b.tag === "Spell" && a.spell === b.spell
    case "Ritual": return b.tag === "Ritual" && a.ritual === b.ritual
    case "Cantrip": return b.tag === "Cantrip" && a.cantrip === b.cantrip
    case "Property": return b.tag === "Property" && a.property === b.property
    case "LiturgicalChant": return b.tag === "LiturgicalChant" && a.liturgical_chant === b.liturgical_chant
    case "Ceremony": return b.tag === "Ceremony" && a.ceremony === b.ceremony
    case "Blessing": return b.tag === "Blessing" && a.blessing === b.blessing
    case "Aspect": return b.tag === "Aspect" && a.aspect === b.aspect
    case "Curse": return b.tag === "Curse" && a.curse === b.curse
    case "ElvenMagicalSong": return b.tag === "ElvenMagicalSong" && a.elven_magical_song === b.elven_magical_song
    case "DominationRitual": return b.tag === "DominationRitual" && a.domination_ritual === b.domination_ritual
    case "MagicalMelody": return b.tag === "MagicalMelody" && a.magical_melody === b.magical_melody
    case "MagicalDance": return b.tag === "MagicalDance" && a.magical_dance === b.magical_dance
    case "JesterTrick": return b.tag === "JesterTrick" && a.jester_trick === b.jester_trick
    case "AnimistPower": return b.tag === "AnimistPower" && a.animist_power === b.animist_power
    case "GeodeRitual": return b.tag === "GeodeRitual" && a.geode_ritual === b.geode_ritual
    case "ZibiljaRitual": return b.tag === "ZibiljaRitual" && a.zibilja_ritual === b.zibilja_ritual
    case "AnimalType": return b.tag === "AnimalType" && a.animal_type === b.animal_type
    case "TargetCategory": return b.tag === "TargetCategory" && a.target_category === b.target_category
    case "General": return b.tag === "General" && a.general === b.general
    case "Element": return b.tag === "Element" && a.element === b.element
    case "AnimalShapeSize": return b.tag === "AnimalShapeSize" && a.animal_shape_size === b.animal_shape_size
    case "Patron": return b.tag === "Patron" && a.patron === b.patron
    case "Ammunition": return b.tag === "Ammunition" && a.ammunition === b.ammunition
    case "Animal": return b.tag === "Animal" && a.animal === b.animal
    case "AnimalCare": return b.tag === "AnimalCare" && a.animal_care === b.animal_care
    case "Armor": return b.tag === "Armor" && a.armor === b.armor
    case "BandageOrRemedy": return b.tag === "BandageOrRemedy" && a.bandage_or_remedy === b.bandage_or_remedy
    case "Book": return b.tag === "Book" && a.book === b.book
    case "CeremonialItem": return b.tag === "CeremonialItem" && a.ceremonial_item === b.ceremonial_item
    case "Clothes": return b.tag === "Clothes" && a.clothes === b.clothes
    case "Container": return b.tag === "Container" && a.container === b.container
    case "Elixir": return b.tag === "Elixir" && a.elixir === b.elixir
    case "EquipmentOfBlessedOnes": return b.tag === "EquipmentOfBlessedOnes" && a.equipment_of_blessed_ones === b.equipment_of_blessed_ones
    case "GemOrPreciousStone": return b.tag === "GemOrPreciousStone" && a.gem_or_precious_stone === b.gem_or_precious_stone
    case "IlluminationLightSource": return b.tag === "IlluminationLightSource" && a.illumination_light_source === b.illumination_light_source
    case "IlluminationRefillsOrSupplies": return b.tag === "IlluminationRefillsOrSupplies" && a.illumination_refills_or_supplies === b.illumination_refills_or_supplies
    case "Jewelry": return b.tag === "Jewelry" && a.jewelry === b.jewelry
    case "Liebesspielzeug": return b.tag === "Liebesspielzeug" && a.liebesspielzeug === b.liebesspielzeug
    case "LuxuryGood": return b.tag === "LuxuryGood" && a.luxury_good === b.luxury_good
    case "MagicalArtifact": return b.tag === "MagicalArtifact" && a.magical_artifact === b.magical_artifact
    case "MusicalInstrument": return b.tag === "MusicalInstrument" && a.musical_instrument === b.musical_instrument
    case "OrienteeringAid": return b.tag === "OrienteeringAid" && a.orienteering_aid === b.orienteering_aid
    case "Poison": return b.tag === "Poison" && a.poison === b.poison
    case "RopeOrChain": return b.tag === "RopeOrChain" && a.rope_or_chain === b.rope_or_chain
    case "Stationary": return b.tag === "Stationary" && a.stationary === b.stationary
    case "ThievesTool": return b.tag === "ThievesTool" && a.thieves_tool === b.thieves_tool
    case "ToolOfTheTrade": return b.tag === "ToolOfTheTrade" && a.tool_of_the_trade === b.tool_of_the_trade
    case "TravelGearOrTool": return b.tag === "TravelGearOrTool" && a.travel_gear_or_tool === b.travel_gear_or_tool
    case "Vehicle": return b.tag === "Vehicle" && a.vehicle === b.vehicle
    case "Weapon": return b.tag === "Weapon" && a.weapon === b.weapon
    case "WeaponAccessory": return b.tag === "WeaponAccessory" && a.weapon_accessory === b.weapon_accessory
    case "Reach": return b.tag === "Reach" && a.reach === b.reach
    case "PatronCategory": return b.tag === "PatronCategory" && a.patron_category === b.patron_category
    case "PersonalityTrait": return b.tag === "PersonalityTrait" && a.personality_trait === b.personality_trait
    case "HairColor": return b.tag === "HairColor" && a.hair_color === b.hair_color
    case "EyeColor": return b.tag === "EyeColor" && a.eye_color === b.eye_color
    case "PactCategory": return b.tag === "PactCategory" && a.pact_category === b.pact_category
    case "PactDomain": return b.tag === "PactDomain" && a.pact_domain === b.pact_domain
    case "AnimistTribe": return b.tag === "AnimistTribe" && a.animist_tribe === b.animist_tribe
    case "Influence": return b.tag === "Influence" && a.influence === b.influence
    case "Condition": return b.tag === "Condition" && a.condition === b.condition
    case "State": return b.tag === "State" && a.state === b.state
    case "Disease": return b.tag === "Disease" && a.disease === b.disease
    case "SexPractice": return b.tag === "SexPractice" && a.sex_practice === b.sex_practice
    case "TradeSecret": return b.tag === "TradeSecret" && a.trade_secret === b.trade_secret
    case "AnimalShape": return b.tag === "AnimalShape" && a.animal_shape === b.animal_shape
    case "ArcaneBardTradition": return b.tag === "ArcaneBardTradition" && a.arcane_bard_tradition === b.arcane_bard_tradition
    case "ArcaneDancerTradition": return b.tag === "ArcaneDancerTradition" && a.arcane_dancer_tradition === b.arcane_dancer_tradition
    default: return assertExhaustive(a)
  }
}

/**
 * Converts an identifier object to a string.
 */
export const identifierObjectToString = (
  obj: TagPropertyOptions[keyof TagPropertyOptions],
): string => {
  // prettier-ignore
  switch (obj.tag) {
    case "Publication": return `${obj.tag}_${obj.publication}`
    case "ExperienceLevel": return `${obj.tag}_${obj.experience_level}`
    case "CoreRule": return `${obj.tag}_${obj.core_rule}`
    case "FocusRule": return `${obj.tag}_${obj.focus_rule}`
    case "Subject": return `${obj.tag}_${obj.subject}`
    case "OptionalRule": return `${obj.tag}_${obj.optional_rule}`
    case "Race": return `${obj.tag}_${obj.race}`
    case "Culture": return `${obj.tag}_${obj.culture}`
    case "Profession": return `${obj.tag}_${obj.profession}`
    case "ProfessionVariant": return `${obj.tag}_${obj.profession_variant}`
    case "Curriculum": return `${obj.tag}_${obj.curriculum}`
    case "Guideline": return `${obj.tag}_${obj.guideline}`
    case "Advantage": return `${obj.tag}_${obj.advantage}`
    case "Disadvantage": return `${obj.tag}_${obj.disadvantage}`
    case "GeneralSpecialAbility": return `${obj.tag}_${obj.general_special_ability}`
    case "FatePointSpecialAbility": return `${obj.tag}_${obj.fate_point_special_ability}`
    case "CombatSpecialAbility": return `${obj.tag}_${obj.combat_special_ability}`
    case "MagicalSpecialAbility": return `${obj.tag}_${obj.magical_special_ability}`
    case "StaffEnchantment": return `${obj.tag}_${obj.staff_enchantment}`
    case "FamiliarSpecialAbility": return `${obj.tag}_${obj.familiar_special_ability}`
    case "KarmaSpecialAbility": return `${obj.tag}_${obj.karma_special_ability}`
    case "ProtectiveWardingCircleSpecialAbility": return `${obj.tag}_${obj.protective_warding_circle_special_ability}`
    case "CombatStyleSpecialAbility": return `${obj.tag}_${obj.combat_style_special_ability}`
    case "AdvancedCombatSpecialAbility": return `${obj.tag}_${obj.advanced_combat_special_ability}`
    case "CommandSpecialAbility": return `${obj.tag}_${obj.command_special_ability}`
    case "MagicStyleSpecialAbility": return `${obj.tag}_${obj.magic_style_special_ability}`
    case "AdvancedMagicalSpecialAbility": return `${obj.tag}_${obj.advanced_magical_special_ability}`
    case "SpellSwordEnchantment": return `${obj.tag}_${obj.spell_sword_enchantment}`
    case "DaggerRitual": return `${obj.tag}_${obj.dagger_ritual}`
    case "InstrumentEnchantment": return `${obj.tag}_${obj.instrument_enchantment}`
    case "AttireEnchantment": return `${obj.tag}_${obj.attire_enchantment}`
    case "OrbEnchantment": return `${obj.tag}_${obj.orb_enchantment}`
    case "WandEnchantment": return `${obj.tag}_${obj.wand_enchantment}`
    case "BrawlingSpecialAbility": return `${obj.tag}_${obj.brawling_special_ability}`
    case "AncestorGlyph": return `${obj.tag}_${obj.ancestor_glyph}`
    case "CeremonialItemSpecialAbility": return `${obj.tag}_${obj.ceremonial_item_special_ability}`
    case "Sermon": return `${obj.tag}_${obj.sermon}`
    case "LiturgicalStyleSpecialAbility": return `${obj.tag}_${obj.liturgical_style_special_ability}`
    case "AdvancedKarmaSpecialAbility": return `${obj.tag}_${obj.advanced_karma_special_ability}`
    case "Vision": return `${obj.tag}_${obj.vision}`
    case "MagicalTradition": return `${obj.tag}_${obj.magical_tradition}`
    case "BlessedTradition": return `${obj.tag}_${obj.blessed_tradition}`
    case "PactGift": return `${obj.tag}_${obj.pact_gift}`
    case "VampiricGift": return `${obj.tag}_${obj.vampiric_gift}`
    case "SikaryanDrainSpecialAbility": return `${obj.tag}_${obj.sikaryan_drain_special_ability}`
    case "LycantropicGift": return `${obj.tag}_${obj.lycantropic_gift}`
    case "SkillStyleSpecialAbility": return `${obj.tag}_${obj.skill_style_special_ability}`
    case "AdvancedSkillSpecialAbility": return `${obj.tag}_${obj.advanced_skill_special_ability}`
    case "ArcaneOrbEnchantment": return `${obj.tag}_${obj.arcane_orb_enchantment}`
    case "CauldronEnchantment": return `${obj.tag}_${obj.cauldron_enchantment}`
    case "FoolsHatEnchantment": return `${obj.tag}_${obj.fools_hat_enchantment}`
    case "ToyEnchantment": return `${obj.tag}_${obj.toy_enchantment}`
    case "BowlEnchantment": return `${obj.tag}_${obj.bowl_enchantment}`
    case "FatePointSexSpecialAbility": return `${obj.tag}_${obj.fate_point_sex_special_ability}`
    case "SexSpecialAbility": return `${obj.tag}_${obj.sex_special_ability}`
    case "WeaponEnchantment": return `${obj.tag}_${obj.weapon_enchantment}`
    case "SickleRitual": return `${obj.tag}_${obj.sickle_ritual}`
    case "RingEnchantment": return `${obj.tag}_${obj.ring_enchantment}`
    case "ChronicleEnchantment": return `${obj.tag}_${obj.chronicle_enchantment}`
    case "Krallenkettenzauber": return `${obj.tag}_${obj.krallenkettenzauber}`
    case "Trinkhornzauber": return `${obj.tag}_${obj.trinkhornzauber}`
    case "MagicalRune": return `${obj.tag}_${obj.magical_rune}`
    case "MagicalSign": return `${obj.tag}_${obj.magical_sign}`
    case "Language": return `${obj.tag}_${obj.language}`
    case "Script": return `${obj.tag}_${obj.script}`
    case "Continent": return `${obj.tag}_${obj.continent}`
    case "SocialStatus": return `${obj.tag}_${obj.social_status}`
    case "Attribute": return `${obj.tag}_${obj.attribute}`
    case "Skill": return `${obj.tag}_${obj.skill}`
    case "SkillGroup": return `${obj.tag}_${obj.skill_group}`
    case "CloseCombatTechnique": return `${obj.tag}_${obj.close_combat_technique}`
    case "RangedCombatTechnique": return `${obj.tag}_${obj.ranged_combat_technique}`
    case "Spell": return `${obj.tag}_${obj.spell}`
    case "Ritual": return `${obj.tag}_${obj.ritual}`
    case "Cantrip": return `${obj.tag}_${obj.cantrip}`
    case "Property": return `${obj.tag}_${obj.property}`
    case "LiturgicalChant": return `${obj.tag}_${obj.liturgical_chant}`
    case "Ceremony": return `${obj.tag}_${obj.ceremony}`
    case "Blessing": return `${obj.tag}_${obj.blessing}`
    case "Aspect": return `${obj.tag}_${obj.aspect}`
    case "Curse": return `${obj.tag}_${obj.curse}`
    case "ElvenMagicalSong": return `${obj.tag}_${obj.elven_magical_song}`
    case "DominationRitual": return `${obj.tag}_${obj.domination_ritual}`
    case "MagicalMelody": return `${obj.tag}_${obj.magical_melody}`
    case "MagicalDance": return `${obj.tag}_${obj.magical_dance}`
    case "JesterTrick": return `${obj.tag}_${obj.jester_trick}`
    case "AnimistPower": return `${obj.tag}_${obj.animist_power}`
    case "GeodeRitual": return `${obj.tag}_${obj.geode_ritual}`
    case "ZibiljaRitual": return `${obj.tag}_${obj.zibilja_ritual}`
    case "AnimalType": return `${obj.tag}_${obj.animal_type}`
    case "TargetCategory": return `${obj.tag}_${obj.target_category}`
    case "General": return `${obj.tag}_${obj.general}`
    case "Element": return `${obj.tag}_${obj.element}`
    case "AnimalShapeSize": return `${obj.tag}_${obj.animal_shape_size}`
    case "Patron": return `${obj.tag}_${obj.patron}`
    case "Ammunition": return `${obj.tag}_${obj.ammunition}`
    case "Animal": return `${obj.tag}_${obj.animal}`
    case "AnimalCare": return `${obj.tag}_${obj.animal_care}`
    case "Armor": return `${obj.tag}_${obj.armor}`
    case "BandageOrRemedy": return `${obj.tag}_${obj.bandage_or_remedy}`
    case "Book": return `${obj.tag}_${obj.book}`
    case "CeremonialItem": return `${obj.tag}_${obj.ceremonial_item}`
    case "Clothes": return `${obj.tag}_${obj.clothes}`
    case "Container": return `${obj.tag}_${obj.container}`
    case "Elixir": return `${obj.tag}_${obj.elixir}`
    case "EquipmentOfBlessedOnes": return `${obj.tag}_${obj.equipment_of_blessed_ones}`
    case "GemOrPreciousStone": return `${obj.tag}_${obj.gem_or_precious_stone}`
    case "IlluminationLightSource": return `${obj.tag}_${obj.illumination_light_source}`
    case "IlluminationRefillsOrSupplies": return `${obj.tag}_${obj.illumination_refills_or_supplies}`
    case "Jewelry": return `${obj.tag}_${obj.jewelry}`
    case "Liebesspielzeug": return `${obj.tag}_${obj.liebesspielzeug}`
    case "LuxuryGood": return `${obj.tag}_${obj.luxury_good}`
    case "MagicalArtifact": return `${obj.tag}_${obj.magical_artifact}`
    case "MusicalInstrument": return `${obj.tag}_${obj.musical_instrument}`
    case "OrienteeringAid": return `${obj.tag}_${obj.orienteering_aid}`
    case "Poison": return `${obj.tag}_${obj.poison}`
    case "RopeOrChain": return `${obj.tag}_${obj.rope_or_chain}`
    case "Stationary": return `${obj.tag}_${obj.stationary}`
    case "ThievesTool": return `${obj.tag}_${obj.thieves_tool}`
    case "ToolOfTheTrade": return `${obj.tag}_${obj.tool_of_the_trade}`
    case "TravelGearOrTool": return `${obj.tag}_${obj.travel_gear_or_tool}`
    case "Vehicle": return `${obj.tag}_${obj.vehicle}`
    case "Weapon": return `${obj.tag}_${obj.weapon}`
    case "WeaponAccessory": return `${obj.tag}_${obj.weapon_accessory}`
    case "Reach": return `${obj.tag}_${obj.reach}`
    case "PatronCategory": return `${obj.tag}_${obj.patron_category}`
    case "PersonalityTrait": return `${obj.tag}_${obj.personality_trait}`
    case "HairColor": return `${obj.tag}_${obj.hair_color}`
    case "EyeColor": return `${obj.tag}_${obj.eye_color}`
    case "PactCategory": return `${obj.tag}_${obj.pact_category}`
    case "PactDomain": return `${obj.tag}_${obj.pact_domain}`
    case "AnimistTribe": return `${obj.tag}_${obj.animist_tribe}`
    case "Influence": return `${obj.tag}_${obj.influence}`
    case "Condition": return `${obj.tag}_${obj.condition}`
    case "State": return `${obj.tag}_${obj.state}`
    case "Disease": return `${obj.tag}_${obj.disease}`
    case "SexPractice": return `${obj.tag}_${obj.sex_practice}`
    case "TradeSecret": return `${obj.tag}_${obj.trade_secret}`
    case "AnimalShape": return `${obj.tag}_${obj.animal_shape}`
    case "ArcaneBardTradition": return `${obj.tag}_${obj.arcane_bard_tradition}`
    case "ArcaneDancerTradition": return `${obj.tag}_${obj.arcane_dancer_tradition}`
    default: return assertExhaustive(obj)
  }
}
