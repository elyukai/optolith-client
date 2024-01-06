/* eslint-disable jsdoc/require-jsdoc */
import { createSelector, createSlice } from "@reduxjs/toolkit"
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

export const selectAllAdvancedCombatSpecialAbilities = createSelector(
  selectStaticAdvancedCombatSpecialAbilities,
  xs => Object.values(xs),
)
export const selectAllAdvancedKarmaSpecialAbilities = createSelector(
  selectStaticAdvancedKarmaSpecialAbilities,
  xs => Object.values(xs),
)
export const selectAllAdvancedMagicalSpecialAbilities = createSelector(
  selectStaticAdvancedMagicalSpecialAbilities,
  xs => Object.values(xs),
)
export const selectAllAdvancedSkillSpecialAbilities = createSelector(
  selectStaticAdvancedSkillSpecialAbilities,
  xs => Object.values(xs),
)
export const selectAllAdvantages = createSelector(selectStaticAdvantages, xs => Object.values(xs))
export const selectAllAmmunition = createSelector(selectStaticAmmunition, xs => Object.values(xs))
export const selectAllAncestorGlyphs = createSelector(selectStaticAncestorGlyphs, xs =>
  Object.values(xs),
)
export const selectAllAnimalCare = createSelector(selectStaticAnimalCare, xs => Object.values(xs))
export const selectAllAnimalDiseases = createSelector(selectStaticAnimalDiseases, xs =>
  Object.values(xs),
)
export const selectAllAnimals = createSelector(selectStaticAnimals, xs => Object.values(xs))
export const selectAllAnimalShapePaths = createSelector(selectStaticAnimalShapePaths, xs =>
  Object.values(xs),
)
export const selectAllAnimalShapes = createSelector(selectStaticAnimalShapes, xs =>
  Object.values(xs),
)
export const selectAllAnimalShapeSizes = createSelector(selectStaticAnimalShapeSizes, xs =>
  Object.values(xs),
)
export const selectAllAnimalTypes = createSelector(selectStaticAnimalTypes, xs => Object.values(xs))
export const selectAllAnimistPowers = createSelector(selectStaticAnimistPowers, xs =>
  Object.values(xs),
)
export const selectAllAnimistPowerTribes = createSelector(selectStaticAnimistPowerTribes, xs =>
  Object.values(xs),
)
export const selectAllArcaneBardTraditions = createSelector(selectStaticArcaneBardTraditions, xs =>
  Object.values(xs),
)
export const selectAllArcaneDancerTraditions = createSelector(
  selectStaticArcaneDancerTraditions,
  xs => Object.values(xs),
)
export const selectAllArcaneOrbEnchantments = createSelector(
  selectStaticArcaneOrbEnchantments,
  xs => Object.values(xs),
)
export const selectAllArmors = createSelector(selectStaticArmors, xs => Object.values(xs))
export const selectAllArmorTypes = createSelector(selectStaticArmorTypes, xs => Object.values(xs))
export const selectAllAspects = createSelector(selectStaticAspects, xs => Object.values(xs))
export const selectAllAttireEnchantments = createSelector(selectStaticAttireEnchantments, xs =>
  Object.values(xs),
)
export const selectAllAttributes = createSelector(selectStaticAttributes, xs => Object.values(xs))
export const selectAllBandagesAndRemedies = createSelector(selectStaticBandagesAndRemedies, xs =>
  Object.values(xs),
)
export const selectAllBlessedTraditions = createSelector(selectStaticBlessedTraditions, xs =>
  Object.values(xs),
)
export const selectAllBlessings = createSelector(selectStaticBlessings, xs => Object.values(xs))
export const selectAllBooks = createSelector(selectStaticBooks, xs => Object.values(xs))
export const selectAllBowlEnchantments = createSelector(selectStaticBowlEnchantments, xs =>
  Object.values(xs),
)
export const selectAllBrawlingSpecialAbilities = createSelector(
  selectStaticBrawlingSpecialAbilities,
  xs => Object.values(xs),
)
export const selectAllBrews = createSelector(selectStaticBrews, xs => Object.values(xs))
export const selectAllCantrips = createSelector(selectStaticCantrips, xs => Object.values(xs))
export const selectAllCauldronEnchantments = createSelector(selectStaticCauldronEnchantments, xs =>
  Object.values(xs),
)
export const selectAllCeremonialItems = createSelector(selectStaticCeremonialItems, xs =>
  Object.values(xs),
)
export const selectAllCeremonialItemSpecialAbilities = createSelector(
  selectStaticCeremonialItemSpecialAbilities,
  xs => Object.values(xs),
)
export const selectAllCeremonies = createSelector(selectStaticCeremonies, xs => Object.values(xs))
export const selectAllChronicleEnchantments = createSelector(
  selectStaticChronicleEnchantments,
  xs => Object.values(xs),
)
export const selectAllCloseCombatTechniques = createSelector(
  selectStaticCloseCombatTechniques,
  xs => Object.values(xs),
)
export const selectAllClothes = createSelector(selectStaticClothes, xs => Object.values(xs))
export const selectAllCombatSpecialAbilities = createSelector(
  selectStaticCombatSpecialAbilities,
  xs => Object.values(xs),
)
export const selectAllCombatStyleSpecialAbilities = createSelector(
  selectStaticCombatStyleSpecialAbilities,
  xs => Object.values(xs),
)
export const selectAllCommandSpecialAbilities = createSelector(
  selectStaticCommandSpecialAbilities,
  xs => Object.values(xs),
)
export const selectAllConditions = createSelector(selectStaticConditions, xs => Object.values(xs))
export const selectAllContainers = createSelector(selectStaticContainers, xs => Object.values(xs))
export const selectAllContinents = createSelector(selectStaticContinents, xs => Object.values(xs))
export const selectAllCoreRules = createSelector(selectStaticCoreRules, xs => Object.values(xs))
export const selectAllCultures = createSelector(selectStaticCultures, xs => Object.values(xs))
export const selectAllCurses = createSelector(selectStaticCurses, xs => Object.values(xs))
export const selectAllDaggerRituals = createSelector(selectStaticDaggerRituals, xs =>
  Object.values(xs),
)
export const selectAllDerivedCharacteristics = createSelector(
  selectStaticDerivedCharacteristics,
  xs => Object.values(xs),
)
export const selectAllDisadvantages = createSelector(selectStaticDisadvantages, xs =>
  Object.values(xs),
)
export const selectAllDiseases = createSelector(selectStaticDiseases, xs => Object.values(xs))
export const selectAllDominationRituals = createSelector(selectStaticDominationRituals, xs =>
  Object.values(xs),
)
export const selectAllElements = createSelector(selectStaticElements, xs => Object.values(xs))
export const selectAllElixirs = createSelector(selectStaticElixirs, xs => Object.values(xs))
export const selectAllElvenMagicalSongs = createSelector(selectStaticElvenMagicalSongs, xs =>
  Object.values(xs),
)
export const selectAllEquipmentOfBlessedOnes = createSelector(
  selectStaticEquipmentOfBlessedOnes,
  xs => Object.values(xs),
)
export const selectAllEquipmentPackages = createSelector(selectStaticEquipmentPackages, xs =>
  Object.values(xs),
)
export const selectAllExperienceLevels = createSelector(selectStaticExperienceLevels, xs =>
  Object.values(xs),
)
export const selectAllEyeColors = createSelector(selectStaticEyeColors, xs => Object.values(xs))
export const selectAllFamiliarSpecialAbilities = createSelector(
  selectStaticFamiliarSpecialAbilities,
  xs => Object.values(xs),
)
export const selectAllFamiliarsTricks = createSelector(selectStaticFamiliarsTricks, xs =>
  Object.values(xs),
)
export const selectAllFatePointSexSpecialAbilities = createSelector(
  selectStaticFatePointSexSpecialAbilities,
  xs => Object.values(xs),
)
export const selectAllFatePointSpecialAbilities = createSelector(
  selectStaticFatePointSpecialAbilities,
  xs => Object.values(xs),
)
export const selectAllFocusRules = createSelector(selectStaticFocusRules, xs => Object.values(xs))
export const selectAllFocusRuleSubjects = createSelector(selectStaticFocusRuleSubjects, xs =>
  Object.values(xs),
)
export const selectAllFoolsHatEnchantments = createSelector(selectStaticFoolsHatEnchantments, xs =>
  Object.values(xs),
)
export const selectAllGemsAndPreciousStones = createSelector(
  selectStaticGemsAndPreciousStones,
  xs => Object.values(xs),
)
export const selectAllGeneralSpecialAbilities = createSelector(
  selectStaticGeneralSpecialAbilities,
  xs => Object.values(xs),
)
export const selectAllGeodeRituals = createSelector(selectStaticGeodeRituals, xs =>
  Object.values(xs),
)
export const selectAllHairColors = createSelector(selectStaticHairColors, xs => Object.values(xs))
export const selectAllIlluminationLightSources = createSelector(
  selectStaticIlluminationLightSources,
  xs => Object.values(xs),
)
export const selectAllIlluminationRefillsAndSupplies = createSelector(
  selectStaticIlluminationRefillsAndSupplies,
  xs => Object.values(xs),
)
export const selectAllInstrumentEnchantments = createSelector(
  selectStaticInstrumentEnchantments,
  xs => Object.values(xs),
)
export const selectAllJesterTricks = createSelector(selectStaticJesterTricks, xs =>
  Object.values(xs),
)
export const selectAllJewelry = createSelector(selectStaticJewelry, xs => Object.values(xs))
export const selectAllKarmaSpecialAbilities = createSelector(
  selectStaticKarmaSpecialAbilities,
  xs => Object.values(xs),
)
export const selectAllKirchenpraegungen = createSelector(selectStaticKirchenpraegungen, xs =>
  Object.values(xs),
)
export const selectAllKrallenkettenzauber = createSelector(selectStaticKrallenkettenzauber, xs =>
  Object.values(xs),
)
export const selectAllLanguages = createSelector(selectStaticLanguages, xs => Object.values(xs))
export const selectAllLessonsCurricula = createSelector(selectStaticLessonsCurricula, xs =>
  Object.values(xs),
)
export const selectAllLessonsGuidelines = createSelector(selectStaticLessonsGuidelines, xs =>
  Object.values(xs),
)
export const selectAllLiebesspielzeug = createSelector(selectStaticLiebesspielzeug, xs =>
  Object.values(xs),
)
export const selectAllLiturgicalChants = createSelector(selectStaticLiturgicalChants, xs =>
  Object.values(xs),
)
export const selectAllLiturgicalStyleSpecialAbilities = createSelector(
  selectStaticLiturgicalStyleSpecialAbilities,
  xs => Object.values(xs),
)
export const selectAllLocales = createSelector(selectStaticLocales, xs => Object.values(xs))
export const selectAllLuxuryGoods = createSelector(selectStaticLuxuryGoods, xs => Object.values(xs))
export const selectAllLycantropicGifts = createSelector(selectStaticLycantropicGifts, xs =>
  Object.values(xs),
)
export const selectAllMagicalArtifacts = createSelector(selectStaticMagicalArtifacts, xs =>
  Object.values(xs),
)
export const selectAllMagicalDances = createSelector(selectStaticMagicalDances, xs =>
  Object.values(xs),
)
export const selectAllMagicalMelodies = createSelector(selectStaticMagicalMelodies, xs =>
  Object.values(xs),
)
export const selectAllMagicalRunes = createSelector(selectStaticMagicalRunes, xs =>
  Object.values(xs),
)
export const selectAllMagicalSigns = createSelector(selectStaticMagicalSigns, xs =>
  Object.values(xs),
)
export const selectAllMagicalSpecialAbilities = createSelector(
  selectStaticMagicalSpecialAbilities,
  xs => Object.values(xs),
)
export const selectAllMagicalTraditions = createSelector(selectStaticMagicalTraditions, xs =>
  Object.values(xs),
)
export const selectAllMagicStyleSpecialAbilities = createSelector(
  selectStaticMagicStyleSpecialAbilities,
  xs => Object.values(xs),
)
export const selectAllMetaConditions = createSelector(selectStaticMetaConditions, xs =>
  Object.values(xs),
)
export const selectAllMusicalInstruments = createSelector(selectStaticMusicalInstruments, xs =>
  Object.values(xs),
)
export const selectAllOptionalRules = createSelector(selectStaticOptionalRules, xs =>
  Object.values(xs),
)
export const selectAllOrbEnchantments = createSelector(selectStaticOrbEnchantments, xs =>
  Object.values(xs),
)
export const selectAllOrienteeringAids = createSelector(selectStaticOrienteeringAids, xs =>
  Object.values(xs),
)
export const selectAllPactCategories = createSelector(selectStaticPactCategories, xs =>
  Object.values(xs),
)
export const selectAllPactGifts = createSelector(selectStaticPactGifts, xs => Object.values(xs))
export const selectAllPatronCategories = createSelector(selectStaticPatronCategories, xs =>
  Object.values(xs),
)
export const selectAllPatrons = createSelector(selectStaticPatrons, xs => Object.values(xs))
export const selectAllPersonalityTraits = createSelector(selectStaticPersonalityTraits, xs =>
  Object.values(xs),
)
export const selectAllPoisons = createSelector(selectStaticPoisons, xs => Object.values(xs))
export const selectAllProfessions = createSelector(selectStaticProfessions, xs => Object.values(xs))
export const selectAllProperties = createSelector(selectStaticProperties, xs => Object.values(xs))
export const selectAllProtectiveWardingCircleSpecialAbilities = createSelector(
  selectStaticProtectiveWardingCircleSpecialAbilities,
  xs => Object.values(xs),
)
export const selectAllPublications = createSelector(selectStaticPublications, xs =>
  Object.values(xs),
)
export const selectAllRaces = createSelector(selectStaticRaces, xs => Object.values(xs))
export const selectAllRangedCombatTechniques = createSelector(
  selectStaticRangedCombatTechniques,
  xs => Object.values(xs),
)
export const selectAllReaches = createSelector(selectStaticReaches, xs => Object.values(xs))
export const selectAllRegions = createSelector(selectStaticRegions, xs => Object.values(xs))
export const selectAllRingEnchantments = createSelector(selectStaticRingEnchantments, xs =>
  Object.values(xs),
)
export const selectAllRituals = createSelector(selectStaticRituals, xs => Object.values(xs))
export const selectAllRopesAndChains = createSelector(selectStaticRopesAndChains, xs =>
  Object.values(xs),
)
export const selectAllScripts = createSelector(selectStaticScripts, xs => Object.values(xs))
export const selectAllSermons = createSelector(selectStaticSermons, xs => Object.values(xs))
export const selectAllServices = createSelector(selectStaticServices, xs => Object.values(xs))
export const selectAllSexPractices = createSelector(selectStaticSexPractices, xs =>
  Object.values(xs),
)
export const selectAllSexSpecialAbilities = createSelector(selectStaticSexSpecialAbilities, xs =>
  Object.values(xs),
)
export const selectAllSickleRituals = createSelector(selectStaticSickleRituals, xs =>
  Object.values(xs),
)
export const selectAllSikaryanDrainSpecialAbilities = createSelector(
  selectStaticSikaryanDrainSpecialAbilities,
  xs => Object.values(xs),
)
export const selectAllSkillGroups = createSelector(selectStaticSkillGroups, xs => Object.values(xs))
export const selectAllSkillModificationLevels = createSelector(
  selectStaticSkillModificationLevels,
  xs => Object.values(xs),
)
export const selectAllSkills = createSelector(selectStaticSkills, xs => Object.values(xs))
export const selectAllSkillStyleSpecialAbilities = createSelector(
  selectStaticSkillStyleSpecialAbilities,
  xs => Object.values(xs),
)
export const selectAllSocialStatuses = createSelector(selectStaticSocialStatuses, xs =>
  Object.values(xs),
)
export const selectAllSpells = createSelector(selectStaticSpells, xs => Object.values(xs))
export const selectAllSpellSwordEnchantments = createSelector(
  selectStaticSpellSwordEnchantments,
  xs => Object.values(xs),
)
export const selectAllStaffEnchantments = createSelector(selectStaticStaffEnchantments, xs =>
  Object.values(xs),
)
export const selectAllStates = createSelector(selectStaticStates, xs => Object.values(xs))
export const selectAllStationary = createSelector(selectStaticStationary, xs => Object.values(xs))
export const selectAllTalismans = createSelector(selectStaticTalismans, xs => Object.values(xs))
export const selectAllTargetCategories = createSelector(selectStaticTargetCategories, xs =>
  Object.values(xs),
)
export const selectAllThievesTools = createSelector(selectStaticThievesTools, xs =>
  Object.values(xs),
)
export const selectAllToolsOfTheTrade = createSelector(selectStaticToolsOfTheTrade, xs =>
  Object.values(xs),
)
export const selectAllToyEnchantments = createSelector(selectStaticToyEnchantments, xs =>
  Object.values(xs),
)
export const selectAllTradeSecrets = createSelector(selectStaticTradeSecrets, xs =>
  Object.values(xs),
)
export const selectAllTravelGearAndTools = createSelector(selectStaticTravelGearAndTools, xs =>
  Object.values(xs),
)
export const selectAllTrinkhornzauber = createSelector(selectStaticTrinkhornzauber, xs =>
  Object.values(xs),
)
export const selectAllUi = createSelector(selectStaticUi, xs => Object.values(xs))
export const selectAllVampiricGifts = createSelector(selectStaticVampiricGifts, xs =>
  Object.values(xs),
)
export const selectAllVehicles = createSelector(selectStaticVehicles, xs => Object.values(xs))
export const selectAllVisions = createSelector(selectStaticVisions, xs => Object.values(xs))
export const selectAllWandEnchantments = createSelector(selectStaticWandEnchantments, xs =>
  Object.values(xs),
)
export const selectAllWeaponAccessories = createSelector(selectStaticWeaponAccessories, xs =>
  Object.values(xs),
)
export const selectAllWeaponEnchantments = createSelector(selectStaticWeaponEnchantments, xs =>
  Object.values(xs),
)
export const selectAllWeapons = createSelector(selectStaticWeapons, xs => Object.values(xs))
export const selectAllZibiljaRituals = createSelector(selectStaticZibiljaRituals, xs =>
  Object.values(xs),
)

export const selectGetAdvancedCombatSpecialAbility = createSelector(
  selectStaticAdvancedCombatSpecialAbilities,
  xs => (id: number) => xs[id],
)
export const selectGetAdvancedKarmaSpecialAbility = createSelector(
  selectStaticAdvancedKarmaSpecialAbilities,
  xs => (id: number) => xs[id],
)
export const selectGetAdvancedMagicalSpecialAbility = createSelector(
  selectStaticAdvancedMagicalSpecialAbilities,
  xs => (id: number) => xs[id],
)
export const selectGetAdvancedSkillSpecialAbility = createSelector(
  selectStaticAdvancedSkillSpecialAbilities,
  xs => (id: number) => xs[id],
)
export const selectGetAdvantage = createSelector(
  selectStaticAdvantages,
  xs => (id: number) => xs[id],
)
export const selectGetAmmunition = createSelector(
  selectStaticAmmunition,
  xs => (id: number) => xs[id],
)
export const selectGetAncestorGlyph = createSelector(
  selectStaticAncestorGlyphs,
  xs => (id: number) => xs[id],
)
export const selectGetAnimalCare = createSelector(
  selectStaticAnimalCare,
  xs => (id: number) => xs[id],
)
export const selectGetAnimalDisease = createSelector(
  selectStaticAnimalDiseases,
  xs => (id: number) => xs[id],
)
export const selectGetAnimal = createSelector(selectStaticAnimals, xs => (id: number) => xs[id])
export const selectGetAnimalShapePath = createSelector(
  selectStaticAnimalShapePaths,
  xs => (id: number) => xs[id],
)
export const selectGetAnimalShape = createSelector(
  selectStaticAnimalShapes,
  xs => (id: number) => xs[id],
)
export const selectGetAnimalShapeSize = createSelector(
  selectStaticAnimalShapeSizes,
  xs => (id: number) => xs[id],
)
export const selectGetAnimalType = createSelector(
  selectStaticAnimalTypes,
  xs => (id: number) => xs[id],
)
export const selectGetAnimistPower = createSelector(
  selectStaticAnimistPowers,
  xs => (id: number) => xs[id],
)
export const selectGetAnimistPowerTribe = createSelector(
  selectStaticAnimistPowerTribes,
  xs => (id: number) => xs[id],
)
export const selectGetArcaneBardTradition = createSelector(
  selectStaticArcaneBardTraditions,
  xs => (id: number) => xs[id],
)
export const selectGetArcaneDancerTradition = createSelector(
  selectStaticArcaneDancerTraditions,
  xs => (id: number) => xs[id],
)
export const selectGetArcaneOrbEnchantment = createSelector(
  selectStaticArcaneOrbEnchantments,
  xs => (id: number) => xs[id],
)
export const selectGetArmor = createSelector(selectStaticArmors, xs => (id: number) => xs[id])
export const selectGetArmorType = createSelector(
  selectStaticArmorTypes,
  xs => (id: number) => xs[id],
)
export const selectGetAspect = createSelector(selectStaticAspects, xs => (id: number) => xs[id])
export const selectGetAttireEnchantment = createSelector(
  selectStaticAttireEnchantments,
  xs => (id: number) => xs[id],
)
export const selectGetAttribute = createSelector(
  selectStaticAttributes,
  xs => (id: number) => xs[id],
)
export const selectGetBandagesAndRemedies = createSelector(
  selectStaticBandagesAndRemedies,
  xs => (id: number) => xs[id],
)
export const selectGetBlessedTradition = createSelector(
  selectStaticBlessedTraditions,
  xs => (id: number) => xs[id],
)
export const selectGetBlessing = createSelector(selectStaticBlessings, xs => (id: number) => xs[id])
export const selectGetBook = createSelector(selectStaticBooks, xs => (id: number) => xs[id])
export const selectGetBowlEnchantment = createSelector(
  selectStaticBowlEnchantments,
  xs => (id: number) => xs[id],
)
export const selectGetBrawlingSpecialAbility = createSelector(
  selectStaticBrawlingSpecialAbilities,
  xs => (id: number) => xs[id],
)
export const selectGetBrew = createSelector(selectStaticBrews, xs => (id: number) => xs[id])
export const selectGetCantrip = createSelector(selectStaticCantrips, xs => (id: number) => xs[id])
export const selectGetCauldronEnchantment = createSelector(
  selectStaticCauldronEnchantments,
  xs => (id: number) => xs[id],
)
export const selectGetCeremonialItem = createSelector(
  selectStaticCeremonialItems,
  xs => (id: number) => xs[id],
)
export const selectGetCeremonialItemSpecialAbility = createSelector(
  selectStaticCeremonialItemSpecialAbilities,
  xs => (id: number) => xs[id],
)
export const selectGetCeremony = createSelector(
  selectStaticCeremonies,
  xs => (id: number) => xs[id],
)
export const selectGetChronicleEnchantment = createSelector(
  selectStaticChronicleEnchantments,
  xs => (id: number) => xs[id],
)
export const selectGetCloseCombatTechnique = createSelector(
  selectStaticCloseCombatTechniques,
  xs => (id: number) => xs[id],
)
export const selectGetClothes = createSelector(selectStaticClothes, xs => (id: number) => xs[id])
export const selectGetCombatSpecialAbility = createSelector(
  selectStaticCombatSpecialAbilities,
  xs => (id: number) => xs[id],
)
export const selectGetCombatStyleSpecialAbility = createSelector(
  selectStaticCombatStyleSpecialAbilities,
  xs => (id: number) => xs[id],
)
export const selectGetCommandSpecialAbility = createSelector(
  selectStaticCommandSpecialAbilities,
  xs => (id: number) => xs[id],
)
export const selectGetCondition = createSelector(
  selectStaticConditions,
  xs => (id: number) => xs[id],
)
export const selectGetContainer = createSelector(
  selectStaticContainers,
  xs => (id: number) => xs[id],
)
export const selectGetContinent = createSelector(
  selectStaticContinents,
  xs => (id: number) => xs[id],
)
export const selectGetCoreRule = createSelector(selectStaticCoreRules, xs => (id: number) => xs[id])
export const selectGetCulture = createSelector(selectStaticCultures, xs => (id: number) => xs[id])
export const selectGetCurse = createSelector(selectStaticCurses, xs => (id: number) => xs[id])
export const selectGetDaggerRitual = createSelector(
  selectStaticDaggerRituals,
  xs => (id: number) => xs[id],
)
export const selectGetDerivedCharacteristic = createSelector(
  selectStaticDerivedCharacteristics,
  xs => (id: number) => xs[id],
)
export const selectGetDisadvantage = createSelector(
  selectStaticDisadvantages,
  xs => (id: number) => xs[id],
)
export const selectGetDisease = createSelector(selectStaticDiseases, xs => (id: number) => xs[id])
export const selectGetDominationRitual = createSelector(
  selectStaticDominationRituals,
  xs => (id: number) => xs[id],
)
export const selectGetElement = createSelector(selectStaticElements, xs => (id: number) => xs[id])
export const selectGetElixir = createSelector(selectStaticElixirs, xs => (id: number) => xs[id])
export const selectGetElvenMagicalSong = createSelector(
  selectStaticElvenMagicalSongs,
  xs => (id: number) => xs[id],
)
export const selectGetEquipmentOfBlessedOnes = createSelector(
  selectStaticEquipmentOfBlessedOnes,
  xs => (id: number) => xs[id],
)
export const selectGetEquipmentPackage = createSelector(
  selectStaticEquipmentPackages,
  xs => (id: number) => xs[id],
)
export const selectGetExperienceLevel = createSelector(
  selectStaticExperienceLevels,
  xs => (id: number) => xs[id],
)
export const selectGetEyeColor = createSelector(selectStaticEyeColors, xs => (id: number) => xs[id])
export const selectGetFamiliarSpecialAbility = createSelector(
  selectStaticFamiliarSpecialAbilities,
  xs => (id: number) => xs[id],
)
export const selectGetFamiliarsTrick = createSelector(
  selectStaticFamiliarsTricks,
  xs => (id: number) => xs[id],
)
export const selectGetFatePointSexSpecialAbility = createSelector(
  selectStaticFatePointSexSpecialAbilities,
  xs => (id: number) => xs[id],
)
export const selectGetFatePointSpecialAbility = createSelector(
  selectStaticFatePointSpecialAbilities,
  xs => (id: number) => xs[id],
)
export const selectGetFocusRule = createSelector(
  selectStaticFocusRules,
  xs => (id: number) => xs[id],
)
export const selectGetFocusRuleSubject = createSelector(
  selectStaticFocusRuleSubjects,
  xs => (id: number) => xs[id],
)
export const selectGetFoolsHatEnchantment = createSelector(
  selectStaticFoolsHatEnchantments,
  xs => (id: number) => xs[id],
)
export const selectGetGemsAndPreciousStone = createSelector(
  selectStaticGemsAndPreciousStones,
  xs => (id: number) => xs[id],
)
export const selectGetGeneralSpecialAbility = createSelector(
  selectStaticGeneralSpecialAbilities,
  xs => (id: number) => xs[id],
)
export const selectGetGeodeRitual = createSelector(
  selectStaticGeodeRituals,
  xs => (id: number) => xs[id],
)
export const selectGetHairColor = createSelector(
  selectStaticHairColors,
  xs => (id: number) => xs[id],
)
export const selectGetIlluminationLightSource = createSelector(
  selectStaticIlluminationLightSources,
  xs => (id: number) => xs[id],
)
export const selectGetIlluminationRefillsAndSupplies = createSelector(
  selectStaticIlluminationRefillsAndSupplies,
  xs => (id: number) => xs[id],
)
export const selectGetInstrumentEnchantment = createSelector(
  selectStaticInstrumentEnchantments,
  xs => (id: number) => xs[id],
)
export const selectGetJesterTrick = createSelector(
  selectStaticJesterTricks,
  xs => (id: number) => xs[id],
)
export const selectGetJewelr = createSelector(selectStaticJewelry, xs => (id: number) => xs[id])
export const selectGetKarmaSpecialAbility = createSelector(
  selectStaticKarmaSpecialAbilities,
  xs => (id: number) => xs[id],
)
export const selectGetKirchenpraegunge = createSelector(
  selectStaticKirchenpraegungen,
  xs => (id: number) => xs[id],
)
export const selectGetKrallenkettenzauber = createSelector(
  selectStaticKrallenkettenzauber,
  xs => (id: number) => xs[id],
)
export const selectGetLanguage = createSelector(selectStaticLanguages, xs => (id: number) => xs[id])
export const selectGetLessonsCurricul = createSelector(
  selectStaticLessonsCurricula,
  xs => (id: number) => xs[id],
)
export const selectGetLessonsGuideline = createSelector(
  selectStaticLessonsGuidelines,
  xs => (id: number) => xs[id],
)
export const selectGetLiebesspielzeu = createSelector(
  selectStaticLiebesspielzeug,
  xs => (id: number) => xs[id],
)
export const selectGetLiturgicalChant = createSelector(
  selectStaticLiturgicalChants,
  xs => (id: number) => xs[id],
)
export const selectGetLiturgicalStyleSpecialAbility = createSelector(
  selectStaticLiturgicalStyleSpecialAbilities,
  xs => (id: number) => xs[id],
)
export const selectGetLocale = createSelector(selectStaticLocales, xs => (id: string) => xs[id])
export const selectGetLuxuryGood = createSelector(
  selectStaticLuxuryGoods,
  xs => (id: number) => xs[id],
)
export const selectGetLycantropicGift = createSelector(
  selectStaticLycantropicGifts,
  xs => (id: number) => xs[id],
)
export const selectGetMagicalArtifact = createSelector(
  selectStaticMagicalArtifacts,
  xs => (id: number) => xs[id],
)
export const selectGetMagicalDance = createSelector(
  selectStaticMagicalDances,
  xs => (id: number) => xs[id],
)
export const selectGetMagicalMelody = createSelector(
  selectStaticMagicalMelodies,
  xs => (id: number) => xs[id],
)
export const selectGetMagicalRune = createSelector(
  selectStaticMagicalRunes,
  xs => (id: number) => xs[id],
)
export const selectGetMagicalSign = createSelector(
  selectStaticMagicalSigns,
  xs => (id: number) => xs[id],
)
export const selectGetMagicalSpecialAbility = createSelector(
  selectStaticMagicalSpecialAbilities,
  xs => (id: number) => xs[id],
)
export const selectGetMagicalTradition = createSelector(
  selectStaticMagicalTraditions,
  xs => (id: number) => xs[id],
)
export const selectGetMagicStyleSpecialAbility = createSelector(
  selectStaticMagicStyleSpecialAbilities,
  xs => (id: number) => xs[id],
)
export const selectGetMetaCondition = createSelector(
  selectStaticMetaConditions,
  xs => (id: number) => xs[id],
)
export const selectGetMusicalInstrument = createSelector(
  selectStaticMusicalInstruments,
  xs => (id: number) => xs[id],
)
export const selectGetOptionalRule = createSelector(
  selectStaticOptionalRules,
  xs => (id: number) => xs[id],
)
export const selectGetOrbEnchantment = createSelector(
  selectStaticOrbEnchantments,
  xs => (id: number) => xs[id],
)
export const selectGetOrienteeringAid = createSelector(
  selectStaticOrienteeringAids,
  xs => (id: number) => xs[id],
)
export const selectGetPactCategory = createSelector(
  selectStaticPactCategories,
  xs => (id: number) => xs[id],
)
export const selectGetPactGift = createSelector(selectStaticPactGifts, xs => (id: number) => xs[id])
export const selectGetPatronCategory = createSelector(
  selectStaticPatronCategories,
  xs => (id: number) => xs[id],
)
export const selectGetPatron = createSelector(selectStaticPatrons, xs => (id: number) => xs[id])
export const selectGetPersonalityTrait = createSelector(
  selectStaticPersonalityTraits,
  xs => (id: number) => xs[id],
)
export const selectGetPoison = createSelector(selectStaticPoisons, xs => (id: number) => xs[id])
export const selectGetProfession = createSelector(
  selectStaticProfessions,
  xs => (id: number) => xs[id],
)
export const selectGetProperty = createSelector(
  selectStaticProperties,
  xs => (id: number) => xs[id],
)
export const selectGetProtectiveWardingCircleSpecialAbility = createSelector(
  selectStaticProtectiveWardingCircleSpecialAbilities,
  xs => (id: number) => xs[id],
)
export const selectGetPublication = createSelector(
  selectStaticPublications,
  xs => (id: number) => xs[id],
)
export const selectGetRace = createSelector(selectStaticRaces, xs => (id: number) => xs[id])
export const selectGetRangedCombatTechnique = createSelector(
  selectStaticRangedCombatTechniques,
  xs => (id: number) => xs[id],
)
export const selectGetReache = createSelector(selectStaticReaches, xs => (id: number) => xs[id])
export const selectGetRegion = createSelector(selectStaticRegions, xs => (id: number) => xs[id])
export const selectGetRingEnchantment = createSelector(
  selectStaticRingEnchantments,
  xs => (id: number) => xs[id],
)
export const selectGetRitual = createSelector(selectStaticRituals, xs => (id: number) => xs[id])
export const selectGetRopesAndChain = createSelector(
  selectStaticRopesAndChains,
  xs => (id: number) => xs[id],
)
export const selectGetScript = createSelector(selectStaticScripts, xs => (id: number) => xs[id])
export const selectGetSermon = createSelector(selectStaticSermons, xs => (id: number) => xs[id])
export const selectGetService = createSelector(selectStaticServices, xs => (id: number) => xs[id])
export const selectGetSexPractice = createSelector(
  selectStaticSexPractices,
  xs => (id: number) => xs[id],
)
export const selectGetSexSpecialAbility = createSelector(
  selectStaticSexSpecialAbilities,
  xs => (id: number) => xs[id],
)
export const selectGetSickleRitual = createSelector(
  selectStaticSickleRituals,
  xs => (id: number) => xs[id],
)
export const selectGetSikaryanDrainSpecialAbility = createSelector(
  selectStaticSikaryanDrainSpecialAbilities,
  xs => (id: number) => xs[id],
)
export const selectGetSkillGroup = createSelector(
  selectStaticSkillGroups,
  xs => (id: number) => xs[id],
)
export const selectGetSkillModificationLevel = createSelector(
  selectStaticSkillModificationLevels,
  xs => (id: number) => xs[id],
)
export const selectGetSkill = createSelector(selectStaticSkills, xs => (id: number) => xs[id])
export const selectGetSkillStyleSpecialAbility = createSelector(
  selectStaticSkillStyleSpecialAbilities,
  xs => (id: number) => xs[id],
)
export const selectGetSocialStatuse = createSelector(
  selectStaticSocialStatuses,
  xs => (id: number) => xs[id],
)
export const selectGetSpell = createSelector(selectStaticSpells, xs => (id: number) => xs[id])
export const selectGetSpellSwordEnchantment = createSelector(
  selectStaticSpellSwordEnchantments,
  xs => (id: number) => xs[id],
)
export const selectGetStaffEnchantment = createSelector(
  selectStaticStaffEnchantments,
  xs => (id: number) => xs[id],
)
export const selectGetState = createSelector(selectStaticStates, xs => (id: number) => xs[id])
export const selectGetStationary = createSelector(
  selectStaticStationary,
  xs => (id: number) => xs[id],
)
export const selectGetTalisman = createSelector(selectStaticTalismans, xs => (id: number) => xs[id])
export const selectGetTargetCategory = createSelector(
  selectStaticTargetCategories,
  xs => (id: number) => xs[id],
)
export const selectGetThievesTool = createSelector(
  selectStaticThievesTools,
  xs => (id: number) => xs[id],
)
export const selectGetToolsOfTheTrad = createSelector(
  selectStaticToolsOfTheTrade,
  xs => (id: number) => xs[id],
)
export const selectGetToyEnchantment = createSelector(
  selectStaticToyEnchantments,
  xs => (id: number) => xs[id],
)
export const selectGetTradeSecret = createSelector(
  selectStaticTradeSecrets,
  xs => (id: number) => xs[id],
)
export const selectGetTravelGearAndTool = createSelector(
  selectStaticTravelGearAndTools,
  xs => (id: number) => xs[id],
)
export const selectGetTrinkhornzauber = createSelector(
  selectStaticTrinkhornzauber,
  xs => (id: number) => xs[id],
)
export const selectGetUI = createSelector(selectStaticUi, xs => (id: string) => xs[id])
export const selectGetVampiricGift = createSelector(
  selectStaticVampiricGifts,
  xs => (id: number) => xs[id],
)
export const selectGetVehicle = createSelector(selectStaticVehicles, xs => (id: number) => xs[id])
export const selectGetVision = createSelector(selectStaticVisions, xs => (id: number) => xs[id])
export const selectGetWandEnchantment = createSelector(
  selectStaticWandEnchantments,
  xs => (id: number) => xs[id],
)
export const selectGetWeaponAccessory = createSelector(
  selectStaticWeaponAccessories,
  xs => (id: number) => xs[id],
)
export const selectGetWeaponEnchantment = createSelector(
  selectStaticWeaponEnchantments,
  xs => (id: number) => xs[id],
)
export const selectGetWeapon = createSelector(selectStaticWeapons, xs => (id: number) => xs[id])
export const selectGetZibiljaRitual = createSelector(
  selectStaticZibiljaRituals,
  xs => (id: number) => xs[id],
)

export const databaseReducer = databaseSlice.reducer
