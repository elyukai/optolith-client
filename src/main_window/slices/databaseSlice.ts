/* eslint-disable jsdoc/require-jsdoc */
import type { Cache } from "@optolith/database-schema/cache"
import type { EntityMap } from "@optolith/database-schema/gen"
import { createSlice } from "@reduxjs/toolkit"
import { init } from "../init.ts"
import { RootState } from "../store.ts"

export type DatabaseState = {
  [K in keyof EntityMap]: Record<string, EntityMap[K]>
} & {
  cache: Cache
}

const initialDatabaseState: DatabaseState = {
  cache: {
    activatableSelectOptions: {
      Advantage: {},
      Disadvantage: {},
      AdvancedCombatSpecialAbility: {},
      AdvancedKarmaSpecialAbility: {},
      AdvancedMagicalSpecialAbility: {},
      AdvancedSkillSpecialAbility: {},
      AncestorGlyph: {},
      BlessedTradition: {},
      BrawlingSpecialAbility: {},
      CeremonialItemSpecialAbility: {},
      CombatSpecialAbility: {},
      CombatStyleSpecialAbility: {},
      CommandSpecialAbility: {},
      FamiliarSpecialAbility: {},
      FatePointSexSpecialAbility: {},
      FatePointSpecialAbility: {},
      GeneralSpecialAbility: {},
      KarmaSpecialAbility: {},
      LiturgicalStyleSpecialAbility: {},
      LycantropicGift: {},
      MagicalSign: {},
      MagicalSpecialAbility: {},
      MagicalTradition: {},
      MagicStyleSpecialAbility: {},
      PactGift: {},
      ProtectiveWardingCircleSpecialAbility: {},
      Sermon: {},
      SexSpecialAbility: {},
      SikaryanDrainSpecialAbility: {},
      SkillStyleSpecialAbility: {},
      VampiricGift: {},
      Vision: {},
      Adoruzepterzauber: {},
      ArcaneOrbEnchantment: {},
      AttireEnchantment: {},
      Beutelzauber: {},
      BowlEnchantment: {},
      CauldronEnchantment: {},
      ChronicleEnchantment: {},
      DaggerRitual: {},
      FoolsHatEnchantment: {},
      Haubenzauber: {},
      Hauerkettenzauber: {},
      InstrumentEnchantment: {},
      Keulenzauber: {},
      Krallenkettenzauber: {},
      Kristallkugelzauber: {},
      OrbEnchantment: {},
      RingEnchantment: {},
      Schweinetrommelzauber: {},
      SickleRitual: {},
      SpellSwordEnchantment: {},
      StaffEnchantment: {},
      ToyEnchantment: {},
      Trinkhornzauber: {},
      WandEnchantment: {},
      WeaponEnchantment: {},
    },
    ancestorBloodAdvantages: [],
    magicalAndBlessedAdvantagesAndDisadvantages: {
      Advantage: {
        Blessed: [],
        Magical: [],
      },
      Disadvantage: {
        Blessed: [],
        Magical: [],
      },
    },
    newApplicationsAndUses: {
      newApplications: {},
      uses: {},
    },
    derivedTradeSecrets: {
      all: [],
      equipment: {
        Ammunition: {},
        AnimalCare: {},
        Armor: {},
        ArmorAccessory: {},
        BandageOrRemedy: {},
        Book: {},
        CeremonialItem: {},
        Clothes: {},
        Container: {},
        IlluminationLightSource: {},
        IlluminationRefillOrSupply: {},
        Jewelry: {},
        Laboratory: {},
        Liebesspielzeug: {},
        LuxuryGood: {},
        MagicalArtifact: {},
        MusicalInstrument: {},
        OrienteeringAid: {},
        RopeOrChain: {},
        SpecialAmmunition: {},
        Stationery: {},
        ThievesTool: {},
        ToolOfTheTrade: {},
        TravelGearOrTool: {},
        Vehicle: {},
        Weapon: {},
        WeaponAccessory: {},
      },
      herbary: {
        Disease: {},
        Elixir: {},
        HerbalAid: {},
        Poison: {},
      },
      talismans: {},
    },
  },
  Adoruzepterzauber: {},
  AdvancedCombatSpecialAbility: {},
  AdvancedKarmaSpecialAbility: {},
  AdvancedMagicalSpecialAbility: {},
  AdvancedSkillSpecialAbility: {},
  Advantage: {},
  AlternativeRule: {},
  Ammunition: {},
  AncestorGlyph: {},
  Animal: {},
  AnimalCare: {},
  AnimalDisease: {},
  AnimalShape: {},
  AnimalShapePath: {},
  AnimalShapeSize: {},
  AnimalType: {},
  AnimistPower: {},
  ArcaneBardTradition: {},
  ArcaneDancerTradition: {},
  ArcaneOrbEnchantment: {},
  Armor: {},
  ArmorAccessory: {},
  Aspect: {},
  AttireEnchantment: {},
  Attribute: {},
  BandageOrRemedy: {},
  Bannzeichen: {},
  BannzeichenOption: {},
  Beutelzauber: {},
  Biome: {},
  BlessedTradition: {},
  BlessedTraditionGroup: {},
  Blessing: {},
  Book: {},
  BotanicRegion: {},
  BowlEnchantment: {},
  BrawlingSpecialAbility: {},
  Brew: {},
  Cantrip: {},
  CauldronEnchantment: {},
  CeremonialItem: {},
  CeremonialItemSpecialAbility: {},
  CeremonialItemSpecialAbilityGroup: {},
  Ceremony: {},
  ChronicleEnchantment: {},
  CloseCombatTechnique: {},
  Clothes: {},
  ClothingPackage: {},
  CombatSpecialAbility: {},
  CombatStyleSpecialAbility: {},
  CommandSpecialAbility: {},
  Condition: {},
  Container: {},
  Continent: {},
  CoreRule: {},
  Culture: {},
  Curriculum: {},
  Curse: {},
  DaggerRitual: {},
  DerivedCharacteristic: {},
  Disadvantage: {},
  Disease: {},
  DominationRitual: {},
  Element: {},
  Elixir: {},
  ElvenMagicalSong: {},
  Enhancement: {},
  EquipmentCategory: {},
  EquipmentOfBlessedOnes: {},
  EquipmentPackage: {},
  ExperienceLevel: {},
  EyeColor: {},
  FamiliarSpecialAbility: {},
  FamiliarsTrick: {},
  FatePointSexSpecialAbility: {},
  FatePointSpecialAbility: {},
  FocusRule: {},
  FoolsHatEnchantment: {},
  GemOrPreciousStone: {},
  GeneralSelectOption: {},
  GeneralSpecialAbility: {},
  GeodeRitual: {},
  GoblinRitual: {},
  Guideline: {},
  HairColor: {},
  Haubenzauber: {},
  Hauerkettenzauber: {},
  HerbalAid: {},
  HerbalPreservation: {},
  HomunculusType: {},
  IlluminationLightSource: {},
  IlluminationRefillOrSupply: {},
  Influence: {},
  InstrumentEnchantment: {},
  Item: {},
  ItemComponent: {},
  ItemComponentOption: {},
  JesterTrick: {},
  Jewelry: {},
  KarmaSpecialAbility: {},
  Keulenzauber: {},
  Krallenkettenzauber: {},
  Kristallkugelzauber: {},
  Laboratory: {},
  Language: {},
  LanguageSpecialization: {},
  LessonPackage: {},
  Liebesspielzeug: {},
  LiturgicalChant: {},
  LiturgicalStyleSpecialAbility: {},
  Locale: {},
  LuxuryGood: {},
  LycantropicGift: {},
  MagicalArtifact: {},
  MagicalDance: {},
  MagicalMelody: {},
  MagicalRune: {},
  MagicalRuneOption: {},
  MagicalSign: {},
  MagicalSpecialAbility: {},
  MagicalTradition: {},
  MagicalTraditionSubgroup: {},
  MagicStyleSpecialAbility: {},
  MetaCondition: {},
  MusicalInstrument: {},
  NewSkillApplication: {},
  Newspaper: {},
  OptionalRule: {},
  OrbEnchantment: {},
  OrienteeringAid: {},
  PactCategory: {},
  PactDomain: {},
  PactGift: {},
  PactType: {},
  Patron: {},
  PatronCategory: {},
  PersonalityTrait: {},
  Plant: {},
  PlayerType: {},
  Poison: {},
  Profession: {},
  ProfessionPackage: {},
  ProfessionVariant: {},
  ProfessionVersion: {},
  Property: {},
  PropertySpecialization: {},
  ProtectiveWardingCircleSpecialAbility: {},
  Publication: {},
  Race: {},
  RaceVariant: {},
  RangedCombatTechnique: {},
  Reach: {},
  Region: {},
  RingEnchantment: {},
  Ritual: {},
  RopeOrChain: {},
  Schweinetrommelzauber: {},
  Script: {},
  Sermon: {},
  Service: {},
  SexPractice: {},
  SexSpecialAbility: {},
  SickleRitual: {},
  SikaryanDrainSpecialAbility: {},
  Skill: {},
  SkillApplication: {},
  SkillGroup: {},
  SkillModificationLevel: {},
  SkillStyleSpecialAbility: {},
  SkillUse: {},
  SocialStatus: {},
  SpecialAmmunition: {},
  Spell: {},
  SpellSwordEnchantment: {},
  StaffEnchantment: {},
  State: {},
  Stationery: {},
  SubBiome: {},
  Subject: {},
  Talisman: {},
  TargetCategory: {},
  ThievesTool: {},
  ToolOfTheTrade: {},
  ToyEnchantment: {},
  TradeSecret: {},
  TravelGearOrTool: {},
  Tribe: {},
  Trinkhornzauber: {},
  VampiricGift: {},
  Vehicle: {},
  Vision: {},
  WandEnchantment: {},
  Weapon: {},
  WeaponAccessory: {},
  WeaponEnchantment: {},
  WorkingSupernaturalCreature: {},
  ZibiljaRitual: {},
}

const databaseSlice = createSlice({
  name: "database",
  initialState: initialDatabaseState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(init, (state, action) => {
      for (const [entityName, instances] of action.payload.database) {
        ;(state[entityName as keyof EntityMap] as Record<string, EntityMap[keyof EntityMap]>) =
          Object.fromEntries(
            instances.map(({ id, content }) => [id, content as EntityMap[keyof EntityMap]]),
          )
      }

      state.cache = action.payload.cache
    })
  },
})

// export const { } = databaseSlice.actions

export const selectDatabase = (state: RootState) => state.database

export const selectStaticAdvancedCombatSpecialAbilities = (state: RootState) =>
  state.database.AdvancedCombatSpecialAbility
export const selectStaticAdvancedKarmaSpecialAbilities = (state: RootState) =>
  state.database.AdvancedKarmaSpecialAbility
export const selectStaticAdvancedMagicalSpecialAbilities = (state: RootState) =>
  state.database.AdvancedMagicalSpecialAbility
export const selectStaticAdvancedSkillSpecialAbilities = (state: RootState) =>
  state.database.AdvancedSkillSpecialAbility
export const selectStaticAdvantages = (state: RootState) => state.database.Advantage
export const selectStaticAmmunition = (state: RootState) => state.database.Ammunition
export const selectStaticAncestorGlyphs = (state: RootState) => state.database.AncestorGlyph
export const selectStaticAnimalCare = (state: RootState) => state.database.AnimalCare
export const selectStaticAnimalDiseases = (state: RootState) => state.database.AnimalDisease
export const selectStaticAnimals = (state: RootState) => state.database.Animal
export const selectStaticAnimalShapePaths = (state: RootState) => state.database.AnimalShapePath
export const selectStaticAnimalShapes = (state: RootState) => state.database.AnimalShape
export const selectStaticAnimalShapeSizes = (state: RootState) => state.database.AnimalShapeSize
export const selectStaticAnimalTypes = (state: RootState) => state.database.AnimalType
export const selectStaticAnimistPowers = (state: RootState) => state.database.AnimistPower
export const selectStaticAnimistPowerTribes = (state: RootState) => state.database.Tribe
export const selectStaticArcaneBardTraditions = (state: RootState) =>
  state.database.ArcaneBardTradition
export const selectStaticArcaneDancerTraditions = (state: RootState) =>
  state.database.ArcaneDancerTradition
export const selectStaticArcaneOrbEnchantments = (state: RootState) =>
  state.database.ArcaneOrbEnchantment
export const selectStaticArmors = (state: RootState) => state.database.Armor
export const selectStaticAspects = (state: RootState) => state.database.Aspect
export const selectStaticAttireEnchantments = (state: RootState) => state.database.AttireEnchantment
export const selectStaticAttributes = (state: RootState) => state.database.Attribute
export const selectStaticBandagesAndRemedies = (state: RootState) => state.database.BandageOrRemedy
export const selectStaticBlessedTraditions = (state: RootState) => state.database.BlessedTradition
export const selectStaticBlessings = (state: RootState) => state.database.Blessing
export const selectStaticBooks = (state: RootState) => state.database.Book
export const selectStaticBowlEnchantments = (state: RootState) => state.database.BowlEnchantment
export const selectStaticBrawlingSpecialAbilities = (state: RootState) =>
  state.database.BrawlingSpecialAbility
export const selectStaticBrews = (state: RootState) => state.database.Brew
export const selectStaticCantrips = (state: RootState) => state.database.Cantrip
export const selectStaticCauldronEnchantments = (state: RootState) =>
  state.database.CauldronEnchantment
export const selectStaticCeremonialItems = (state: RootState) => state.database.CeremonialItem
export const selectStaticCeremonialItemSpecialAbilities = (state: RootState) =>
  state.database.CeremonialItemSpecialAbility
export const selectStaticCeremonies = (state: RootState) => state.database.Ceremony
export const selectStaticChronicleEnchantments = (state: RootState) =>
  state.database.ChronicleEnchantment
export const selectStaticCloseCombatTechniques = (state: RootState) =>
  state.database.CloseCombatTechnique
export const selectStaticClothes = (state: RootState) => state.database.Clothes
export const selectStaticCombatSpecialAbilities = (state: RootState) =>
  state.database.CombatSpecialAbility
export const selectStaticCombatStyleSpecialAbilities = (state: RootState) =>
  state.database.CombatStyleSpecialAbility
export const selectStaticCommandSpecialAbilities = (state: RootState) =>
  state.database.CommandSpecialAbility
export const selectStaticConditions = (state: RootState) => state.database.Condition
export const selectStaticContainers = (state: RootState) => state.database.Container
export const selectStaticContinents = (state: RootState) => state.database.Continent
export const selectStaticCoreRules = (state: RootState) => state.database.CoreRule
export const selectStaticCultures = (state: RootState) => state.database.Culture
export const selectStaticCurses = (state: RootState) => state.database.Curse
export const selectStaticDaggerRituals = (state: RootState) => state.database.DaggerRitual
export const selectStaticDerivedCharacteristics = (state: RootState) =>
  state.database.DerivedCharacteristic
export const selectStaticDisadvantages = (state: RootState) => state.database.Disadvantage
export const selectStaticDiseases = (state: RootState) => state.database.Disease
export const selectStaticDominationRituals = (state: RootState) => state.database.DominationRitual
export const selectStaticElements = (state: RootState) => state.database.Element
export const selectStaticElixirs = (state: RootState) => state.database.Elixir
export const selectStaticElvenMagicalSongs = (state: RootState) => state.database.ElvenMagicalSong
export const selectStaticEquipmentOfBlessedOnes = (state: RootState) =>
  state.database.EquipmentOfBlessedOnes
export const selectStaticEquipmentPackages = (state: RootState) => state.database.EquipmentPackage
export const selectStaticExperienceLevels = (state: RootState) => state.database.ExperienceLevel
export const selectStaticEyeColors = (state: RootState) => state.database.EyeColor
export const selectStaticFamiliarSpecialAbilities = (state: RootState) =>
  state.database.FamiliarSpecialAbility
export const selectStaticFamiliarsTricks = (state: RootState) => state.database.FamiliarsTrick
export const selectStaticFatePointSexSpecialAbilities = (state: RootState) =>
  state.database.FatePointSexSpecialAbility
export const selectStaticFatePointSpecialAbilities = (state: RootState) =>
  state.database.FatePointSpecialAbility
export const selectStaticFocusRules = (state: RootState) => state.database.FocusRule
export const selectStaticFocusRuleSubjects = (state: RootState) => state.database.Subject
export const selectStaticFoolsHatEnchantments = (state: RootState) =>
  state.database.FoolsHatEnchantment
export const selectStaticGemsAndPreciousStones = (state: RootState) =>
  state.database.GemOrPreciousStone
export const selectStaticGeneralSpecialAbilities = (state: RootState) =>
  state.database.GeneralSpecialAbility
export const selectStaticGeodeRituals = (state: RootState) => state.database.GeodeRitual
export const selectStaticHairColors = (state: RootState) => state.database.HairColor
export const selectStaticIlluminationLightSources = (state: RootState) =>
  state.database.IlluminationLightSource
export const selectStaticIlluminationRefillsAndSupplies = (state: RootState) =>
  state.database.IlluminationRefillOrSupply
export const selectStaticInfluences = (state: RootState) => state.database.Influence
export const selectStaticInstrumentEnchantments = (state: RootState) =>
  state.database.InstrumentEnchantment
export const selectStaticJesterTricks = (state: RootState) => state.database.JesterTrick
export const selectStaticJewelry = (state: RootState) => state.database.Jewelry
export const selectStaticKarmaSpecialAbilities = (state: RootState) =>
  state.database.KarmaSpecialAbility
export const selectStaticKrallenkettenzauber = (state: RootState) =>
  state.database.Krallenkettenzauber
export const selectStaticLanguages = (state: RootState) => state.database.Language
export const selectStaticLessonsCurricula = (state: RootState) => state.database.Curriculum
export const selectStaticLessonsGuidelines = (state: RootState) => state.database.Guideline
export const selectStaticLiebesspielzeug = (state: RootState) => state.database.Liebesspielzeug
export const selectStaticLiturgicalChants = (state: RootState) => state.database.LiturgicalChant
export const selectStaticLiturgicalStyleSpecialAbilities = (state: RootState) =>
  state.database.LiturgicalStyleSpecialAbility
export const selectStaticLocales = (state: RootState) => state.database.Locale
export const selectStaticLuxuryGoods = (state: RootState) => state.database.LuxuryGood
export const selectStaticLycantropicGifts = (state: RootState) => state.database.LycantropicGift
export const selectStaticMagicalArtifacts = (state: RootState) => state.database.MagicalArtifact
export const selectStaticMagicalDances = (state: RootState) => state.database.MagicalDance
export const selectStaticMagicalMelodies = (state: RootState) => state.database.MagicalMelody
export const selectStaticMagicalRunes = (state: RootState) => state.database.MagicalRune
export const selectStaticMagicalSigns = (state: RootState) => state.database.MagicalSign
export const selectStaticMagicalSpecialAbilities = (state: RootState) =>
  state.database.MagicStyleSpecialAbility
export const selectStaticMagicalTraditions = (state: RootState) => state.database.MagicalTradition
export const selectStaticMagicStyleSpecialAbilities = (state: RootState) =>
  state.database.MagicStyleSpecialAbility
export const selectStaticMetaConditions = (state: RootState) => state.database.MetaCondition
export const selectStaticMusicalInstruments = (state: RootState) => state.database.MusicalInstrument
export const selectStaticOptionalRules = (state: RootState) => state.database.OptionalRule
export const selectStaticOrbEnchantments = (state: RootState) => state.database.OrbEnchantment
export const selectStaticOrienteeringAids = (state: RootState) => state.database.OrienteeringAid
export const selectStaticPactCategories = (state: RootState) => state.database.PactCategory
export const selectStaticPactGifts = (state: RootState) => state.database.PactGift
export const selectStaticPatronCategories = (state: RootState) => state.database.PatronCategory
export const selectStaticPatrons = (state: RootState) => state.database.Patron
export const selectStaticPersonalityTraits = (state: RootState) => state.database.PersonalityTrait
export const selectStaticPoisons = (state: RootState) => state.database.Poison
export const selectStaticProfessions = (state: RootState) => state.database.Profession
export const selectStaticProperties = (state: RootState) => state.database.Property
export const selectStaticProtectiveWardingCircleSpecialAbilities = (state: RootState) =>
  state.database.ProtectiveWardingCircleSpecialAbility
export const selectStaticPublications = (state: RootState) => state.database.Publication
export const selectStaticRaces = (state: RootState) => state.database.Race
export const selectStaticRangedCombatTechniques = (state: RootState) =>
  state.database.RangedCombatTechnique
export const selectStaticReaches = (state: RootState) => state.database.Reach
export const selectStaticRegions = (state: RootState) => state.database.Region
export const selectStaticRingEnchantments = (state: RootState) => state.database.RingEnchantment
export const selectStaticRituals = (state: RootState) => state.database.Ritual
export const selectStaticRopesAndChains = (state: RootState) => state.database.RopeOrChain
export const selectStaticScripts = (state: RootState) => state.database.Script
export const selectStaticSermons = (state: RootState) => state.database.Sermon
export const selectStaticServices = (state: RootState) => state.database.Service
export const selectStaticSexPractices = (state: RootState) => state.database.SexPractice
export const selectStaticSexSpecialAbilities = (state: RootState) =>
  state.database.SexSpecialAbility
export const selectStaticSickleRituals = (state: RootState) => state.database.SickleRitual
export const selectStaticSikaryanDrainSpecialAbilities = (state: RootState) =>
  state.database.SikaryanDrainSpecialAbility
export const selectStaticSkillGroups = (state: RootState) => state.database.SkillGroup
export const selectStaticSkillModificationLevels = (state: RootState) =>
  state.database.SkillModificationLevel
export const selectStaticSkills = (state: RootState) => state.database.Skill
export const selectStaticSkillStyleSpecialAbilities = (state: RootState) =>
  state.database.SkillStyleSpecialAbility
export const selectStaticSocialStatuses = (state: RootState) => state.database.SocialStatus
export const selectStaticSpells = (state: RootState) => state.database.Spell
export const selectStaticSpellSwordEnchantments = (state: RootState) =>
  state.database.SpellSwordEnchantment
export const selectStaticStaffEnchantments = (state: RootState) => state.database.StaffEnchantment
export const selectStaticStates = (state: RootState) => state.database.State
export const selectStaticStationary = (state: RootState) => state.database.Stationery
export const selectStaticTalismans = (state: RootState) => state.database.Talisman
export const selectStaticTargetCategories = (state: RootState) => state.database.TargetCategory
export const selectStaticThievesTools = (state: RootState) => state.database.ThievesTool
export const selectStaticToolsOfTheTrade = (state: RootState) => state.database.ToolOfTheTrade
export const selectStaticToyEnchantments = (state: RootState) => state.database.ToyEnchantment
export const selectStaticTradeSecrets = (state: RootState) => state.database.TradeSecret
export const selectStaticTravelGearAndTools = (state: RootState) => state.database.TravelGearOrTool
export const selectStaticTrinkhornzauber = (state: RootState) => state.database.Trinkhornzauber
export const selectStaticVampiricGifts = (state: RootState) => state.database.VampiricGift
export const selectStaticVehicles = (state: RootState) => state.database.Vehicle
export const selectStaticVisions = (state: RootState) => state.database.Vision
export const selectStaticWandEnchantments = (state: RootState) => state.database.WandEnchantment
export const selectStaticWeaponAccessories = (state: RootState) => state.database.WeaponAccessory
export const selectStaticWeaponEnchantments = (state: RootState) => state.database.WeaponEnchantment
export const selectStaticWeapons = (state: RootState) => state.database.Weapon
export const selectStaticZibiljaRituals = (state: RootState) => state.database.ZibiljaRitual

export const selectCache = (state: RootState) => state.database.cache
export const selectActivatableSelectOptionsCache = (state: RootState) =>
  state.database.cache.activatableSelectOptions
export const selectAncestorBloodAdvantagesCache = (state: RootState) =>
  state.database.cache.ancestorBloodAdvantages
export const selectMagicalAndBlessedAdvantagesAndDisadvantagesCache = (state: RootState) =>
  state.database.cache.magicalAndBlessedAdvantagesAndDisadvantages
export const selectNewApplicationsAndUsesCache = (state: RootState) =>
  state.database.cache.newApplicationsAndUses

export const databaseReducer = databaseSlice.reducer
