/* eslint-disable jsdoc/require-jsdoc */
import { createSlice } from "@reduxjs/toolkit"
import { CacheMap } from "optolith-database-schema/config/cache"
import { TypeId, TypeMap } from "optolith-database-schema/config/types"
import { init } from "../init.ts"
import { RootState } from "../store.ts"

export type DatabaseState = {
  [K in keyof TypeMap]: Record<TypeId<K>, TypeMap[K]>
} & {
  cache: CacheMap
}

const initialDatabaseState: DatabaseState = {
  advancedCombatSpecialAbilities: {},
  advancedKarmaSpecialAbilities: {},
  advancedMagicalSpecialAbilities: {},
  advancedSkillSpecialAbilities: {},
  advantages: {},
  ammunition: {},
  ancestorGlyphs: {},
  animalCare: {},
  animalDiseases: {},
  animals: {},
  animalShapePaths: {},
  animalShapes: {},
  animalShapeSizes: {},
  animalTypes: {},
  animistPowers: {},
  animistPowerTribes: {},
  arcaneBardTraditions: {},
  arcaneDancerTraditions: {},
  arcaneOrbEnchantments: {},
  armors: {},
  armorTypes: {},
  aspects: {},
  attireEnchantments: {},
  attributes: {},
  bandagesAndRemedies: {},
  blessedTraditions: {},
  blessings: {},
  books: {},
  bowlEnchantments: {},
  brawlingSpecialAbilities: {},
  brews: {},
  cantrips: {},
  cache: {
    newApplicationsAndUses: {
      newApplications: {},
      uses: {},
    },
  },
  cauldronEnchantments: {},
  ceremonialItems: {},
  ceremonialItemSpecialAbilities: {},
  ceremonies: {},
  chronicleEnchantments: {},
  closeCombatTechniques: {},
  clothes: {},
  combatSpecialAbilities: {},
  combatStyleSpecialAbilities: {},
  commandSpecialAbilities: {},
  conditions: {},
  containers: {},
  continents: {},
  coreRules: {},
  cultures: {},
  curses: {},
  daggerRituals: {},
  derivedCharacteristics: {},
  disadvantages: {},
  diseases: {},
  dominationRituals: {},
  elements: {},
  elixirs: {},
  elvenMagicalSongs: {},
  equipmentOfBlessedOnes: {},
  equipmentPackages: {},
  experienceLevels: {},
  eyeColors: {},
  familiarSpecialAbilities: {},
  familiarsTricks: {},
  fatePointSexSpecialAbilities: {},
  fatePointSpecialAbilities: {},
  focusRules: {},
  focusRuleSubjects: {},
  foolsHatEnchantments: {},
  gemsAndPreciousStones: {},
  generalSpecialAbilities: {},
  geodeRituals: {},
  hairColors: {},
  illuminationLightSources: {},
  illuminationRefillsAndSupplies: {},
  instrumentEnchantments: {},
  jesterTricks: {},
  jewelry: {},
  karmaSpecialAbilities: {},
  kirchenpraegungen: {},
  krallenkettenzauber: {},
  languages: {},
  lessonsCurricula: {},
  lessonsGuidelines: {},
  liebesspielzeug: {},
  liturgicalChants: {},
  liturgicalStyleSpecialAbilities: {},
  locales: {},
  luxuryGoods: {},
  lycantropicGifts: {},
  magicalArtifacts: {},
  magicalDances: {},
  magicalMelodies: {},
  magicalRunes: {},
  magicalSigns: {},
  magicalSpecialAbilities: {},
  magicalTraditions: {},
  magicStyleSpecialAbilities: {},
  metaConditions: {},
  musicalInstruments: {},
  optionalRules: {},
  orbEnchantments: {},
  orienteeringAids: {},
  pactCategories: {},
  pactGifts: {},
  patronCategories: {},
  patrons: {},
  personalityTraits: {},
  poisons: {},
  professions: {},
  properties: {},
  protectiveWardingCircleSpecialAbilities: {},
  publications: {},
  races: {},
  rangedCombatTechniques: {},
  reaches: {},
  regions: {},
  ringEnchantments: {},
  rituals: {},
  ropesAndChains: {},
  scripts: {},
  sermons: {},
  services: {},
  sexPractices: {},
  sexSpecialAbilities: {},
  sickleRituals: {},
  sikaryanDrainSpecialAbilities: {},
  skillGroups: {},
  skillModificationLevels: {},
  skills: {},
  skillStyleSpecialAbilities: {},
  socialStatuses: {},
  spells: {},
  spellSwordEnchantments: {},
  staffEnchantments: {},
  states: {},
  stationary: {},
  talismans: {},
  targetCategories: {},
  thievesTools: {},
  toolsOfTheTrade: {},
  toyEnchantments: {},
  tradeSecrets: {},
  travelGearAndTools: {},
  trinkhornzauber: {},
  ui: {},
  vampiricGifts: {},
  vehicles: {},
  visions: {},
  wandEnchantments: {},
  weaponAccessories: {},
  weaponEnchantments: {},
  weapons: {},
  zibiljaRituals: {},
}

const databaseSlice = createSlice({
  name: "database",
  initialState: initialDatabaseState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(init, (state, action) => {
      state.advancedCombatSpecialAbilities = Object.fromEntries(
        action.payload.database.raw.advancedCombatSpecialAbilities,
      )
      state.advancedKarmaSpecialAbilities = Object.fromEntries(
        action.payload.database.raw.advancedKarmaSpecialAbilities,
      )
      state.advancedMagicalSpecialAbilities = Object.fromEntries(
        action.payload.database.raw.advancedMagicalSpecialAbilities,
      )
      state.advancedSkillSpecialAbilities = Object.fromEntries(
        action.payload.database.raw.advancedSkillSpecialAbilities,
      )
      state.advantages = Object.fromEntries(action.payload.database.raw.advantages)
      state.ammunition = Object.fromEntries(action.payload.database.raw.ammunition)
      state.ancestorGlyphs = Object.fromEntries(action.payload.database.raw.ancestorGlyphs)
      state.animalCare = Object.fromEntries(action.payload.database.raw.animalCare)
      state.animalDiseases = Object.fromEntries(action.payload.database.raw.animalDiseases)
      state.animals = Object.fromEntries(action.payload.database.raw.animals)
      state.animalShapePaths = Object.fromEntries(action.payload.database.raw.animalShapePaths)
      state.animalShapes = Object.fromEntries(action.payload.database.raw.animalShapes)
      state.animalShapeSizes = Object.fromEntries(action.payload.database.raw.animalShapeSizes)
      state.animalTypes = Object.fromEntries(action.payload.database.raw.animalTypes)
      state.animistPowers = Object.fromEntries(action.payload.database.raw.animistPowers)
      state.animistPowerTribes = Object.fromEntries(action.payload.database.raw.animistPowerTribes)
      state.arcaneBardTraditions = Object.fromEntries(
        action.payload.database.raw.arcaneBardTraditions,
      )
      state.arcaneDancerTraditions = Object.fromEntries(
        action.payload.database.raw.arcaneDancerTraditions,
      )
      state.arcaneOrbEnchantments = Object.fromEntries(
        action.payload.database.raw.arcaneOrbEnchantments,
      )
      state.armors = Object.fromEntries(action.payload.database.raw.armors)
      state.armorTypes = Object.fromEntries(action.payload.database.raw.armorTypes)
      state.aspects = Object.fromEntries(action.payload.database.raw.aspects)
      state.attireEnchantments = Object.fromEntries(action.payload.database.raw.attireEnchantments)
      state.attributes = Object.fromEntries(action.payload.database.raw.attributes)
      state.bandagesAndRemedies = Object.fromEntries(
        action.payload.database.raw.bandagesAndRemedies,
      )
      state.blessedTraditions = Object.fromEntries(action.payload.database.raw.blessedTraditions)
      state.blessings = Object.fromEntries(action.payload.database.raw.blessings)
      state.books = Object.fromEntries(action.payload.database.raw.books)
      state.bowlEnchantments = Object.fromEntries(action.payload.database.raw.bowlEnchantments)
      state.brawlingSpecialAbilities = Object.fromEntries(
        action.payload.database.raw.brawlingSpecialAbilities,
      )
      state.brews = Object.fromEntries(action.payload.database.raw.brews)
      state.cantrips = Object.fromEntries(action.payload.database.raw.cantrips)
      state.cache = action.payload.database.cache
      state.cauldronEnchantments = Object.fromEntries(
        action.payload.database.raw.cauldronEnchantments,
      )
      state.ceremonialItems = Object.fromEntries(action.payload.database.raw.ceremonialItems)
      state.ceremonialItemSpecialAbilities = Object.fromEntries(
        action.payload.database.raw.ceremonialItemSpecialAbilities,
      )
      state.ceremonies = Object.fromEntries(action.payload.database.raw.ceremonies)
      state.chronicleEnchantments = Object.fromEntries(
        action.payload.database.raw.chronicleEnchantments,
      )
      state.closeCombatTechniques = Object.fromEntries(
        action.payload.database.raw.closeCombatTechniques,
      )
      state.clothes = Object.fromEntries(action.payload.database.raw.clothes)
      state.combatSpecialAbilities = Object.fromEntries(
        action.payload.database.raw.combatSpecialAbilities,
      )
      state.combatStyleSpecialAbilities = Object.fromEntries(
        action.payload.database.raw.combatStyleSpecialAbilities,
      )
      state.commandSpecialAbilities = Object.fromEntries(
        action.payload.database.raw.commandSpecialAbilities,
      )
      state.conditions = Object.fromEntries(action.payload.database.raw.conditions)
      state.containers = Object.fromEntries(action.payload.database.raw.containers)
      state.continents = Object.fromEntries(action.payload.database.raw.continents)
      state.coreRules = Object.fromEntries(action.payload.database.raw.coreRules)
      state.cultures = Object.fromEntries(action.payload.database.raw.cultures)
      state.curses = Object.fromEntries(action.payload.database.raw.curses)
      state.daggerRituals = Object.fromEntries(action.payload.database.raw.daggerRituals)
      state.derivedCharacteristics = Object.fromEntries(
        action.payload.database.raw.derivedCharacteristics,
      )
      state.disadvantages = Object.fromEntries(action.payload.database.raw.disadvantages)
      state.diseases = Object.fromEntries(action.payload.database.raw.diseases)
      state.dominationRituals = Object.fromEntries(action.payload.database.raw.dominationRituals)
      state.elements = Object.fromEntries(action.payload.database.raw.elements)
      state.elixirs = Object.fromEntries(action.payload.database.raw.elixirs)
      state.elvenMagicalSongs = Object.fromEntries(action.payload.database.raw.elvenMagicalSongs)
      state.equipmentOfBlessedOnes = Object.fromEntries(
        action.payload.database.raw.equipmentOfBlessedOnes,
      )
      state.equipmentPackages = Object.fromEntries(action.payload.database.raw.equipmentPackages)
      state.experienceLevels = Object.fromEntries(action.payload.database.raw.experienceLevels)
      state.eyeColors = Object.fromEntries(action.payload.database.raw.eyeColors)
      state.familiarSpecialAbilities = Object.fromEntries(
        action.payload.database.raw.familiarSpecialAbilities,
      )
      state.familiarsTricks = Object.fromEntries(action.payload.database.raw.familiarsTricks)
      state.fatePointSexSpecialAbilities = Object.fromEntries(
        action.payload.database.raw.fatePointSexSpecialAbilities,
      )
      state.fatePointSpecialAbilities = Object.fromEntries(
        action.payload.database.raw.fatePointSpecialAbilities,
      )
      state.focusRules = Object.fromEntries(action.payload.database.raw.focusRules)
      state.focusRuleSubjects = Object.fromEntries(action.payload.database.raw.focusRuleSubjects)
      state.foolsHatEnchantments = Object.fromEntries(
        action.payload.database.raw.foolsHatEnchantments,
      )
      state.gemsAndPreciousStones = Object.fromEntries(
        action.payload.database.raw.gemsAndPreciousStones,
      )
      state.generalSpecialAbilities = Object.fromEntries(
        action.payload.database.raw.generalSpecialAbilities,
      )
      state.geodeRituals = Object.fromEntries(action.payload.database.raw.geodeRituals)
      state.hairColors = Object.fromEntries(action.payload.database.raw.hairColors)
      state.illuminationLightSources = Object.fromEntries(
        action.payload.database.raw.illuminationLightSources,
      )
      state.illuminationRefillsAndSupplies = Object.fromEntries(
        action.payload.database.raw.illuminationRefillsAndSupplies,
      )
      state.instrumentEnchantments = Object.fromEntries(
        action.payload.database.raw.instrumentEnchantments,
      )
      state.jesterTricks = Object.fromEntries(action.payload.database.raw.jesterTricks)
      state.jewelry = Object.fromEntries(action.payload.database.raw.jewelry)
      state.karmaSpecialAbilities = Object.fromEntries(
        action.payload.database.raw.karmaSpecialAbilities,
      )
      state.kirchenpraegungen = Object.fromEntries(action.payload.database.raw.kirchenpraegungen)
      state.krallenkettenzauber = Object.fromEntries(
        action.payload.database.raw.krallenkettenzauber,
      )
      state.languages = Object.fromEntries(action.payload.database.raw.languages)
      state.lessonsCurricula = Object.fromEntries(action.payload.database.raw.lessonsCurricula)
      state.lessonsGuidelines = Object.fromEntries(action.payload.database.raw.lessonsGuidelines)
      state.liebesspielzeug = Object.fromEntries(action.payload.database.raw.liebesspielzeug)
      state.liturgicalChants = Object.fromEntries(action.payload.database.raw.liturgicalChants)
      state.liturgicalStyleSpecialAbilities = Object.fromEntries(
        action.payload.database.raw.liturgicalStyleSpecialAbilities,
      )
      state.locales = Object.fromEntries(action.payload.database.raw.locales)
      state.luxuryGoods = Object.fromEntries(action.payload.database.raw.luxuryGoods)
      state.lycantropicGifts = Object.fromEntries(action.payload.database.raw.lycantropicGifts)
      state.magicalArtifacts = Object.fromEntries(action.payload.database.raw.magicalArtifacts)
      state.magicalDances = Object.fromEntries(action.payload.database.raw.magicalDances)
      state.magicalMelodies = Object.fromEntries(action.payload.database.raw.magicalMelodies)
      state.magicalRunes = Object.fromEntries(action.payload.database.raw.magicalRunes)
      state.magicalSigns = Object.fromEntries(action.payload.database.raw.magicalSigns)
      state.magicalSpecialAbilities = Object.fromEntries(
        action.payload.database.raw.magicalSpecialAbilities,
      )
      state.magicalTraditions = Object.fromEntries(action.payload.database.raw.magicalTraditions)
      state.magicStyleSpecialAbilities = Object.fromEntries(
        action.payload.database.raw.magicStyleSpecialAbilities,
      )
      state.metaConditions = Object.fromEntries(action.payload.database.raw.metaConditions)
      state.musicalInstruments = Object.fromEntries(action.payload.database.raw.musicalInstruments)
      state.optionalRules = Object.fromEntries(action.payload.database.raw.optionalRules)
      state.orbEnchantments = Object.fromEntries(action.payload.database.raw.orbEnchantments)
      state.orienteeringAids = Object.fromEntries(action.payload.database.raw.orienteeringAids)
      state.pactCategories = Object.fromEntries(action.payload.database.raw.pactCategories)
      state.pactGifts = Object.fromEntries(action.payload.database.raw.pactGifts)
      state.patronCategories = Object.fromEntries(action.payload.database.raw.patronCategories)
      state.patrons = Object.fromEntries(action.payload.database.raw.patrons)
      state.personalityTraits = Object.fromEntries(action.payload.database.raw.personalityTraits)
      state.poisons = Object.fromEntries(action.payload.database.raw.poisons)
      state.professions = Object.fromEntries(action.payload.database.raw.professions)
      state.properties = Object.fromEntries(action.payload.database.raw.properties)
      state.protectiveWardingCircleSpecialAbilities = Object.fromEntries(
        action.payload.database.raw.protectiveWardingCircleSpecialAbilities,
      )
      state.publications = Object.fromEntries(action.payload.database.raw.publications)
      state.races = Object.fromEntries(action.payload.database.raw.races)
      state.rangedCombatTechniques = Object.fromEntries(
        action.payload.database.raw.rangedCombatTechniques,
      )
      state.reaches = Object.fromEntries(action.payload.database.raw.reaches)
      state.regions = Object.fromEntries(action.payload.database.raw.regions)
      state.ringEnchantments = Object.fromEntries(action.payload.database.raw.ringEnchantments)
      state.rituals = Object.fromEntries(action.payload.database.raw.rituals)
      state.ropesAndChains = Object.fromEntries(action.payload.database.raw.ropesAndChains)
      state.scripts = Object.fromEntries(action.payload.database.raw.scripts)
      state.sermons = Object.fromEntries(action.payload.database.raw.sermons)
      state.services = Object.fromEntries(action.payload.database.raw.services)
      state.sexPractices = Object.fromEntries(action.payload.database.raw.sexPractices)
      state.sexSpecialAbilities = Object.fromEntries(
        action.payload.database.raw.sexSpecialAbilities,
      )
      state.sickleRituals = Object.fromEntries(action.payload.database.raw.sickleRituals)
      state.sikaryanDrainSpecialAbilities = Object.fromEntries(
        action.payload.database.raw.sikaryanDrainSpecialAbilities,
      )
      state.skillGroups = Object.fromEntries(action.payload.database.raw.skillGroups)
      state.skillModificationLevels = Object.fromEntries(
        action.payload.database.raw.skillModificationLevels,
      )
      state.skills = Object.fromEntries(action.payload.database.raw.skills)
      state.skillStyleSpecialAbilities = Object.fromEntries(
        action.payload.database.raw.skillStyleSpecialAbilities,
      )
      state.socialStatuses = Object.fromEntries(action.payload.database.raw.socialStatuses)
      state.spells = Object.fromEntries(action.payload.database.raw.spells)
      state.spellSwordEnchantments = Object.fromEntries(
        action.payload.database.raw.spellSwordEnchantments,
      )
      state.staffEnchantments = Object.fromEntries(action.payload.database.raw.staffEnchantments)
      state.states = Object.fromEntries(action.payload.database.raw.states)
      state.stationary = Object.fromEntries(action.payload.database.raw.stationary)
      state.talismans = Object.fromEntries(action.payload.database.raw.talismans)
      state.targetCategories = Object.fromEntries(action.payload.database.raw.targetCategories)
      state.thievesTools = Object.fromEntries(action.payload.database.raw.thievesTools)
      state.toolsOfTheTrade = Object.fromEntries(action.payload.database.raw.toolsOfTheTrade)
      state.toyEnchantments = Object.fromEntries(action.payload.database.raw.toyEnchantments)
      state.tradeSecrets = Object.fromEntries(action.payload.database.raw.tradeSecrets)
      state.travelGearAndTools = Object.fromEntries(action.payload.database.raw.travelGearAndTools)
      state.trinkhornzauber = Object.fromEntries(action.payload.database.raw.trinkhornzauber)
      state.ui = Object.fromEntries(action.payload.database.raw.ui)
      state.vampiricGifts = Object.fromEntries(action.payload.database.raw.vampiricGifts)
      state.vehicles = Object.fromEntries(action.payload.database.raw.vehicles)
      state.visions = Object.fromEntries(action.payload.database.raw.visions)
      state.wandEnchantments = Object.fromEntries(action.payload.database.raw.wandEnchantments)
      state.weaponAccessories = Object.fromEntries(action.payload.database.raw.weaponAccessories)
      state.weaponEnchantments = Object.fromEntries(action.payload.database.raw.weaponEnchantments)
      state.weapons = Object.fromEntries(action.payload.database.raw.weapons)
      state.zibiljaRituals = Object.fromEntries(action.payload.database.raw.zibiljaRituals)
    })
  },
})

// export const { } = databaseSlice.actions

export const selectDatabase = (state: RootState) => state.database

export const selectStaticAdvancedCombatSpecialAbilities = (state: RootState) =>
  state.database.advancedCombatSpecialAbilities
export const selectStaticAdvancedKarmaSpecialAbilities = (state: RootState) =>
  state.database.advancedKarmaSpecialAbilities
export const selectStaticAdvancedMagicalSpecialAbilities = (state: RootState) =>
  state.database.advancedMagicalSpecialAbilities
export const selectStaticAdvancedSkillSpecialAbilities = (state: RootState) =>
  state.database.advancedSkillSpecialAbilities
export const selectStaticAdvantages = (state: RootState) => state.database.advantages
export const selectStaticAmmunition = (state: RootState) => state.database.ammunition
export const selectStaticAncestorGlyphs = (state: RootState) => state.database.ancestorGlyphs
export const selectStaticAnimalCare = (state: RootState) => state.database.animalCare
export const selectStaticAnimalDiseases = (state: RootState) => state.database.animalDiseases
export const selectStaticAnimals = (state: RootState) => state.database.animals
export const selectStaticAnimalShapePaths = (state: RootState) => state.database.animalShapePaths
export const selectStaticAnimalShapes = (state: RootState) => state.database.animalShapes
export const selectStaticAnimalShapeSizes = (state: RootState) => state.database.animalShapeSizes
export const selectStaticAnimalTypes = (state: RootState) => state.database.animalTypes
export const selectStaticAnimistPowers = (state: RootState) => state.database.animistPowers
export const selectStaticAnimistPowerTribes = (state: RootState) =>
  state.database.animistPowerTribes
export const selectStaticArcaneBardTraditions = (state: RootState) =>
  state.database.arcaneBardTraditions
export const selectStaticArcaneDancerTraditions = (state: RootState) =>
  state.database.arcaneDancerTraditions
export const selectStaticArcaneOrbEnchantments = (state: RootState) =>
  state.database.arcaneOrbEnchantments
export const selectStaticArmors = (state: RootState) => state.database.armors
export const selectStaticArmorTypes = (state: RootState) => state.database.armorTypes
export const selectStaticAspects = (state: RootState) => state.database.aspects
export const selectStaticAttireEnchantments = (state: RootState) =>
  state.database.attireEnchantments
export const selectStaticAttributes = (state: RootState) => state.database.attributes
export const selectStaticBandagesAndRemedies = (state: RootState) =>
  state.database.bandagesAndRemedies
export const selectStaticBlessedTraditions = (state: RootState) => state.database.blessedTraditions
export const selectStaticBlessings = (state: RootState) => state.database.blessings
export const selectStaticBooks = (state: RootState) => state.database.books
export const selectStaticBowlEnchantments = (state: RootState) => state.database.bowlEnchantments
export const selectStaticBrawlingSpecialAbilities = (state: RootState) =>
  state.database.brawlingSpecialAbilities
export const selectStaticBrews = (state: RootState) => state.database.brews
export const selectStaticCantrips = (state: RootState) => state.database.cantrips
export const selectStaticCauldronEnchantments = (state: RootState) =>
  state.database.cauldronEnchantments
export const selectStaticCeremonialItems = (state: RootState) => state.database.ceremonialItems
export const selectStaticCeremonialItemSpecialAbilities = (state: RootState) =>
  state.database.ceremonialItemSpecialAbilities
export const selectStaticCeremonies = (state: RootState) => state.database.ceremonies
export const selectStaticChronicleEnchantments = (state: RootState) =>
  state.database.chronicleEnchantments
export const selectStaticCloseCombatTechniques = (state: RootState) =>
  state.database.closeCombatTechniques
export const selectStaticClothes = (state: RootState) => state.database.clothes
export const selectStaticCombatSpecialAbilities = (state: RootState) =>
  state.database.combatSpecialAbilities
export const selectStaticCombatStyleSpecialAbilities = (state: RootState) =>
  state.database.combatStyleSpecialAbilities
export const selectStaticCommandSpecialAbilities = (state: RootState) =>
  state.database.commandSpecialAbilities
export const selectStaticConditions = (state: RootState) => state.database.conditions
export const selectStaticContainers = (state: RootState) => state.database.containers
export const selectStaticContinents = (state: RootState) => state.database.continents
export const selectStaticCoreRules = (state: RootState) => state.database.coreRules
export const selectStaticCultures = (state: RootState) => state.database.cultures
export const selectStaticCurses = (state: RootState) => state.database.curses
export const selectStaticDaggerRituals = (state: RootState) => state.database.daggerRituals
export const selectStaticDerivedCharacteristics = (state: RootState) =>
  state.database.derivedCharacteristics
export const selectStaticDisadvantages = (state: RootState) => state.database.disadvantages
export const selectStaticDiseases = (state: RootState) => state.database.diseases
export const selectStaticDominationRituals = (state: RootState) => state.database.dominationRituals
export const selectStaticElements = (state: RootState) => state.database.elements
export const selectStaticElixirs = (state: RootState) => state.database.elixirs
export const selectStaticElvenMagicalSongs = (state: RootState) => state.database.elvenMagicalSongs
export const selectStaticEquipmentOfBlessedOnes = (state: RootState) =>
  state.database.equipmentOfBlessedOnes
export const selectStaticEquipmentPackages = (state: RootState) => state.database.equipmentPackages
export const selectStaticExperienceLevels = (state: RootState) => state.database.experienceLevels
export const selectStaticEyeColors = (state: RootState) => state.database.eyeColors
export const selectStaticFamiliarSpecialAbilities = (state: RootState) =>
  state.database.familiarSpecialAbilities
export const selectStaticFamiliarsTricks = (state: RootState) => state.database.familiarsTricks
export const selectStaticFatePointSexSpecialAbilities = (state: RootState) =>
  state.database.fatePointSexSpecialAbilities
export const selectStaticFatePointSpecialAbilities = (state: RootState) =>
  state.database.fatePointSpecialAbilities
export const selectStaticFocusRules = (state: RootState) => state.database.focusRules
export const selectStaticFocusRuleSubjects = (state: RootState) => state.database.focusRuleSubjects
export const selectStaticFoolsHatEnchantments = (state: RootState) =>
  state.database.foolsHatEnchantments
export const selectStaticGemsAndPreciousStones = (state: RootState) =>
  state.database.gemsAndPreciousStones
export const selectStaticGeneralSpecialAbilities = (state: RootState) =>
  state.database.generalSpecialAbilities
export const selectStaticGeodeRituals = (state: RootState) => state.database.geodeRituals
export const selectStaticHairColors = (state: RootState) => state.database.hairColors
export const selectStaticIlluminationLightSources = (state: RootState) =>
  state.database.illuminationLightSources
export const selectStaticIlluminationRefillsAndSupplies = (state: RootState) =>
  state.database.illuminationRefillsAndSupplies
export const selectStaticInstrumentEnchantments = (state: RootState) =>
  state.database.instrumentEnchantments
export const selectStaticJesterTricks = (state: RootState) => state.database.jesterTricks
export const selectStaticJewelry = (state: RootState) => state.database.jewelry
export const selectStaticKarmaSpecialAbilities = (state: RootState) =>
  state.database.karmaSpecialAbilities
export const selectStaticKirchenpraegungen = (state: RootState) => state.database.kirchenpraegungen
export const selectStaticKrallenkettenzauber = (state: RootState) =>
  state.database.krallenkettenzauber
export const selectStaticLanguages = (state: RootState) => state.database.languages
export const selectStaticLessonsCurricula = (state: RootState) => state.database.lessonsCurricula
export const selectStaticLessonsGuidelines = (state: RootState) => state.database.lessonsGuidelines
export const selectStaticLiebesspielzeug = (state: RootState) => state.database.liebesspielzeug
export const selectStaticLiturgicalChants = (state: RootState) => state.database.liturgicalChants
export const selectStaticLiturgicalStyleSpecialAbilities = (state: RootState) =>
  state.database.liturgicalStyleSpecialAbilities
export const selectStaticLocales = (state: RootState) => state.database.locales
export const selectStaticLuxuryGoods = (state: RootState) => state.database.luxuryGoods
export const selectStaticLycantropicGifts = (state: RootState) => state.database.lycantropicGifts
export const selectStaticMagicalArtifacts = (state: RootState) => state.database.magicalArtifacts
export const selectStaticMagicalDances = (state: RootState) => state.database.magicalDances
export const selectStaticMagicalMelodies = (state: RootState) => state.database.magicalMelodies
export const selectStaticMagicalRunes = (state: RootState) => state.database.magicalRunes
export const selectStaticMagicalSigns = (state: RootState) => state.database.magicalSigns
export const selectStaticMagicalSpecialAbilities = (state: RootState) =>
  state.database.magicalSpecialAbilities
export const selectStaticMagicalTraditions = (state: RootState) => state.database.magicalTraditions
export const selectStaticMagicStyleSpecialAbilities = (state: RootState) =>
  state.database.magicStyleSpecialAbilities
export const selectStaticMetaConditions = (state: RootState) => state.database.metaConditions
export const selectStaticMusicalInstruments = (state: RootState) =>
  state.database.musicalInstruments
export const selectStaticOptionalRules = (state: RootState) => state.database.optionalRules
export const selectStaticOrbEnchantments = (state: RootState) => state.database.orbEnchantments
export const selectStaticOrienteeringAids = (state: RootState) => state.database.orienteeringAids
export const selectStaticPactCategories = (state: RootState) => state.database.pactCategories
export const selectStaticPactGifts = (state: RootState) => state.database.pactGifts
export const selectStaticPatronCategories = (state: RootState) => state.database.patronCategories
export const selectStaticPatrons = (state: RootState) => state.database.patrons
export const selectStaticPersonalityTraits = (state: RootState) => state.database.personalityTraits
export const selectStaticPoisons = (state: RootState) => state.database.poisons
export const selectStaticProfessions = (state: RootState) => state.database.professions
export const selectStaticProperties = (state: RootState) => state.database.properties
export const selectStaticProtectiveWardingCircleSpecialAbilities = (state: RootState) =>
  state.database.protectiveWardingCircleSpecialAbilities
export const selectStaticPublications = (state: RootState) => state.database.publications
export const selectStaticRaces = (state: RootState) => state.database.races
export const selectStaticRangedCombatTechniques = (state: RootState) =>
  state.database.rangedCombatTechniques
export const selectStaticReaches = (state: RootState) => state.database.reaches
export const selectStaticRegions = (state: RootState) => state.database.regions
export const selectStaticRingEnchantments = (state: RootState) => state.database.ringEnchantments
export const selectStaticRituals = (state: RootState) => state.database.rituals
export const selectStaticRopesAndChains = (state: RootState) => state.database.ropesAndChains
export const selectStaticScripts = (state: RootState) => state.database.scripts
export const selectStaticSermons = (state: RootState) => state.database.sermons
export const selectStaticServices = (state: RootState) => state.database.services
export const selectStaticSexPractices = (state: RootState) => state.database.sexPractices
export const selectStaticSexSpecialAbilities = (state: RootState) =>
  state.database.sexSpecialAbilities
export const selectStaticSickleRituals = (state: RootState) => state.database.sickleRituals
export const selectStaticSikaryanDrainSpecialAbilities = (state: RootState) =>
  state.database.sikaryanDrainSpecialAbilities
export const selectStaticSkillGroups = (state: RootState) => state.database.skillGroups
export const selectStaticSkillModificationLevels = (state: RootState) =>
  state.database.skillModificationLevels
export const selectStaticSkills = (state: RootState) => state.database.skills
export const selectStaticSkillStyleSpecialAbilities = (state: RootState) =>
  state.database.skillStyleSpecialAbilities
export const selectStaticSocialStatuses = (state: RootState) => state.database.socialStatuses
export const selectStaticSpells = (state: RootState) => state.database.spells
export const selectStaticSpellSwordEnchantments = (state: RootState) =>
  state.database.spellSwordEnchantments
export const selectStaticStaffEnchantments = (state: RootState) => state.database.staffEnchantments
export const selectStaticStates = (state: RootState) => state.database.states
export const selectStaticStationary = (state: RootState) => state.database.stationary
export const selectStaticTalismans = (state: RootState) => state.database.talismans
export const selectStaticTargetCategories = (state: RootState) => state.database.targetCategories
export const selectStaticThievesTools = (state: RootState) => state.database.thievesTools
export const selectStaticToolsOfTheTrade = (state: RootState) => state.database.toolsOfTheTrade
export const selectStaticToyEnchantments = (state: RootState) => state.database.toyEnchantments
export const selectStaticTradeSecrets = (state: RootState) => state.database.tradeSecrets
export const selectStaticTravelGearAndTools = (state: RootState) =>
  state.database.travelGearAndTools
export const selectStaticTrinkhornzauber = (state: RootState) => state.database.trinkhornzauber
export const selectStaticUi = (state: RootState) => state.database.ui
export const selectStaticVampiricGifts = (state: RootState) => state.database.vampiricGifts
export const selectStaticVehicles = (state: RootState) => state.database.vehicles
export const selectStaticVisions = (state: RootState) => state.database.visions
export const selectStaticWandEnchantments = (state: RootState) => state.database.wandEnchantments
export const selectStaticWeaponAccessories = (state: RootState) => state.database.weaponAccessories
export const selectStaticWeaponEnchantments = (state: RootState) =>
  state.database.weaponEnchantments
export const selectStaticWeapons = (state: RootState) => state.database.weapons
export const selectStaticZibiljaRituals = (state: RootState) => state.database.zibiljaRituals

export const databaseReducer = databaseSlice.reducer
