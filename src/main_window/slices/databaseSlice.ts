/* eslint-disable max-len */
import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { TypeId, TypeMap } from "optolith-database-schema/config/types"
import { Database as RawDatabase } from "../../database/index.ts"

export type DatabaseState = {
  [K in keyof TypeMap]: Record<TypeId<K>, TypeMap[K]>
}

const initialDatabaseState: DatabaseState = {
  advancedCombatSpecialAbilities: {},
  advancedKarmaSpecialAbilities: {},
  advancedMagicalSpecialAbilities: {},
  advancedSkillSpecialAbilities: {},
  advantages: {},
  alchemicae: {},
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
  reducers: {
    initDatabase: (state, action: PayloadAction<RawDatabase>) => {
      state.advancedCombatSpecialAbilities = Object.fromEntries(action.payload.advancedCombatSpecialAbilities)
      state.advancedKarmaSpecialAbilities = Object.fromEntries(action.payload.advancedKarmaSpecialAbilities)
      state.advancedMagicalSpecialAbilities = Object.fromEntries(action.payload.advancedMagicalSpecialAbilities)
      state.advancedSkillSpecialAbilities = Object.fromEntries(action.payload.advancedSkillSpecialAbilities)
      state.advantages = Object.fromEntries(action.payload.advantages)
      state.alchemicae = Object.fromEntries(action.payload.alchemicae)
      state.ammunition = Object.fromEntries(action.payload.ammunition)
      state.ancestorGlyphs = Object.fromEntries(action.payload.ancestorGlyphs)
      state.animalCare = Object.fromEntries(action.payload.animalCare)
      state.animalDiseases = Object.fromEntries(action.payload.animalDiseases)
      state.animals = Object.fromEntries(action.payload.animals)
      state.animalShapePaths = Object.fromEntries(action.payload.animalShapePaths)
      state.animalShapes = Object.fromEntries(action.payload.animalShapes)
      state.animalShapeSizes = Object.fromEntries(action.payload.animalShapeSizes)
      state.animalTypes = Object.fromEntries(action.payload.animalTypes)
      state.animistPowers = Object.fromEntries(action.payload.animistPowers)
      state.animistPowerTribes = Object.fromEntries(action.payload.animistPowerTribes)
      state.arcaneBardTraditions = Object.fromEntries(action.payload.arcaneBardTraditions)
      state.arcaneDancerTraditions = Object.fromEntries(action.payload.arcaneDancerTraditions)
      state.arcaneOrbEnchantments = Object.fromEntries(action.payload.arcaneOrbEnchantments)
      state.armors = Object.fromEntries(action.payload.armors)
      state.armorTypes = Object.fromEntries(action.payload.armorTypes)
      state.aspects = Object.fromEntries(action.payload.aspects)
      state.attireEnchantments = Object.fromEntries(action.payload.attireEnchantments)
      state.attributes = Object.fromEntries(action.payload.attributes)
      state.bandagesAndRemedies = Object.fromEntries(action.payload.bandagesAndRemedies)
      state.blessedTraditions = Object.fromEntries(action.payload.blessedTraditions)
      state.blessings = Object.fromEntries(action.payload.blessings)
      state.books = Object.fromEntries(action.payload.books)
      state.bowlEnchantments = Object.fromEntries(action.payload.bowlEnchantments)
      state.brawlingSpecialAbilities = Object.fromEntries(action.payload.brawlingSpecialAbilities)
      state.brews = Object.fromEntries(action.payload.brews)
      state.cantrips = Object.fromEntries(action.payload.cantrips)
      state.cauldronEnchantments = Object.fromEntries(action.payload.cauldronEnchantments)
      state.ceremonialItems = Object.fromEntries(action.payload.ceremonialItems)
      state.ceremonialItemSpecialAbilities = Object.fromEntries(action.payload.ceremonialItemSpecialAbilities)
      state.ceremonies = Object.fromEntries(action.payload.ceremonies)
      state.chronicleEnchantments = Object.fromEntries(action.payload.chronicleEnchantments)
      state.closeCombatTechniques = Object.fromEntries(action.payload.closeCombatTechniques)
      state.clothes = Object.fromEntries(action.payload.clothes)
      state.combatSpecialAbilities = Object.fromEntries(action.payload.combatSpecialAbilities)
      state.combatStyleSpecialAbilities = Object.fromEntries(action.payload.combatStyleSpecialAbilities)
      state.commandSpecialAbilities = Object.fromEntries(action.payload.commandSpecialAbilities)
      state.conditions = Object.fromEntries(action.payload.conditions)
      state.containers = Object.fromEntries(action.payload.containers)
      state.continents = Object.fromEntries(action.payload.continents)
      state.coreRules = Object.fromEntries(action.payload.coreRules)
      state.cultures = Object.fromEntries(action.payload.cultures)
      state.curses = Object.fromEntries(action.payload.curses)
      state.daggerRituals = Object.fromEntries(action.payload.daggerRituals)
      state.derivedCharacteristics = Object.fromEntries(action.payload.derivedCharacteristics)
      state.disadvantages = Object.fromEntries(action.payload.disadvantages)
      state.diseases = Object.fromEntries(action.payload.diseases)
      state.dominationRituals = Object.fromEntries(action.payload.dominationRituals)
      state.elements = Object.fromEntries(action.payload.elements)
      state.elixirs = Object.fromEntries(action.payload.elixirs)
      state.elvenMagicalSongs = Object.fromEntries(action.payload.elvenMagicalSongs)
      state.equipmentOfBlessedOnes = Object.fromEntries(action.payload.equipmentOfBlessedOnes)
      state.equipmentPackages = Object.fromEntries(action.payload.equipmentPackages)
      state.experienceLevels = Object.fromEntries(action.payload.experienceLevels)
      state.eyeColors = Object.fromEntries(action.payload.eyeColors)
      state.familiarSpecialAbilities = Object.fromEntries(action.payload.familiarSpecialAbilities)
      state.familiarsTricks = Object.fromEntries(action.payload.familiarsTricks)
      state.fatePointSexSpecialAbilities = Object.fromEntries(action.payload.fatePointSexSpecialAbilities)
      state.fatePointSpecialAbilities = Object.fromEntries(action.payload.fatePointSpecialAbilities)
      state.focusRules = Object.fromEntries(action.payload.focusRules)
      state.focusRuleSubjects = Object.fromEntries(action.payload.focusRuleSubjects)
      state.foolsHatEnchantments = Object.fromEntries(action.payload.foolsHatEnchantments)
      state.gemsAndPreciousStones = Object.fromEntries(action.payload.gemsAndPreciousStones)
      state.generalSpecialAbilities = Object.fromEntries(action.payload.generalSpecialAbilities)
      state.geodeRituals = Object.fromEntries(action.payload.geodeRituals)
      state.hairColors = Object.fromEntries(action.payload.hairColors)
      state.illuminationLightSources = Object.fromEntries(action.payload.illuminationLightSources)
      state.illuminationRefillsAndSupplies = Object.fromEntries(action.payload.illuminationRefillsAndSupplies)
      state.instrumentEnchantments = Object.fromEntries(action.payload.instrumentEnchantments)
      state.jesterTricks = Object.fromEntries(action.payload.jesterTricks)
      state.jewelry = Object.fromEntries(action.payload.jewelry)
      state.karmaSpecialAbilities = Object.fromEntries(action.payload.karmaSpecialAbilities)
      state.kirchenpraegungen = Object.fromEntries(action.payload.kirchenpraegungen)
      state.krallenkettenzauber = Object.fromEntries(action.payload.krallenkettenzauber)
      state.languages = Object.fromEntries(action.payload.languages)
      state.lessonsCurricula = Object.fromEntries(action.payload.lessonsCurricula)
      state.lessonsGuidelines = Object.fromEntries(action.payload.lessonsGuidelines)
      state.liebesspielzeug = Object.fromEntries(action.payload.liebesspielzeug)
      state.liturgicalChants = Object.fromEntries(action.payload.liturgicalChants)
      state.liturgicalStyleSpecialAbilities = Object.fromEntries(action.payload.liturgicalStyleSpecialAbilities)
      state.locales = Object.fromEntries(action.payload.locales)
      state.luxuryGoods = Object.fromEntries(action.payload.luxuryGoods)
      state.lycantropicGifts = Object.fromEntries(action.payload.lycantropicGifts)
      state.magicalArtifacts = Object.fromEntries(action.payload.magicalArtifacts)
      state.magicalDances = Object.fromEntries(action.payload.magicalDances)
      state.magicalMelodies = Object.fromEntries(action.payload.magicalMelodies)
      state.magicalRunes = Object.fromEntries(action.payload.magicalRunes)
      state.magicalSigns = Object.fromEntries(action.payload.magicalSigns)
      state.magicalSpecialAbilities = Object.fromEntries(action.payload.magicalSpecialAbilities)
      state.magicalTraditions = Object.fromEntries(action.payload.magicalTraditions)
      state.magicStyleSpecialAbilities = Object.fromEntries(action.payload.magicStyleSpecialAbilities)
      state.metaConditions = Object.fromEntries(action.payload.metaConditions)
      state.musicalInstruments = Object.fromEntries(action.payload.musicalInstruments)
      state.optionalRules = Object.fromEntries(action.payload.optionalRules)
      state.orbEnchantments = Object.fromEntries(action.payload.orbEnchantments)
      state.orienteeringAids = Object.fromEntries(action.payload.orienteeringAids)
      state.pactCategories = Object.fromEntries(action.payload.pactCategories)
      state.pactGifts = Object.fromEntries(action.payload.pactGifts)
      state.patronCategories = Object.fromEntries(action.payload.patronCategories)
      state.patrons = Object.fromEntries(action.payload.patrons)
      state.personalityTraits = Object.fromEntries(action.payload.personalityTraits)
      state.poisons = Object.fromEntries(action.payload.poisons)
      state.professions = Object.fromEntries(action.payload.professions)
      state.properties = Object.fromEntries(action.payload.properties)
      state.protectiveWardingCircleSpecialAbilities = Object.fromEntries(action.payload.protectiveWardingCircleSpecialAbilities)
      state.publications = Object.fromEntries(action.payload.publications)
      state.races = Object.fromEntries(action.payload.races)
      state.rangedCombatTechniques = Object.fromEntries(action.payload.rangedCombatTechniques)
      state.reaches = Object.fromEntries(action.payload.reaches)
      state.regions = Object.fromEntries(action.payload.regions)
      state.ringEnchantments = Object.fromEntries(action.payload.ringEnchantments)
      state.rituals = Object.fromEntries(action.payload.rituals)
      state.ropesAndChains = Object.fromEntries(action.payload.ropesAndChains)
      state.scripts = Object.fromEntries(action.payload.scripts)
      state.sermons = Object.fromEntries(action.payload.sermons)
      state.services = Object.fromEntries(action.payload.services)
      state.sexPractices = Object.fromEntries(action.payload.sexPractices)
      state.sexSpecialAbilities = Object.fromEntries(action.payload.sexSpecialAbilities)
      state.sickleRituals = Object.fromEntries(action.payload.sickleRituals)
      state.sikaryanDrainSpecialAbilities = Object.fromEntries(action.payload.sikaryanDrainSpecialAbilities)
      state.skillGroups = Object.fromEntries(action.payload.skillGroups)
      state.skillModificationLevels = Object.fromEntries(action.payload.skillModificationLevels)
      state.skills = Object.fromEntries(action.payload.skills)
      state.skillStyleSpecialAbilities = Object.fromEntries(action.payload.skillStyleSpecialAbilities)
      state.socialStatuses = Object.fromEntries(action.payload.socialStatuses)
      state.spells = Object.fromEntries(action.payload.spells)
      state.spellSwordEnchantments = Object.fromEntries(action.payload.spellSwordEnchantments)
      state.staffEnchantments = Object.fromEntries(action.payload.staffEnchantments)
      state.states = Object.fromEntries(action.payload.states)
      state.stationary = Object.fromEntries(action.payload.stationary)
      state.talismans = Object.fromEntries(action.payload.talismans)
      state.targetCategories = Object.fromEntries(action.payload.targetCategories)
      state.thievesTools = Object.fromEntries(action.payload.thievesTools)
      state.toolsOfTheTrade = Object.fromEntries(action.payload.toolsOfTheTrade)
      state.toyEnchantments = Object.fromEntries(action.payload.toyEnchantments)
      state.tradeSecrets = Object.fromEntries(action.payload.tradeSecrets)
      state.travelGearAndTools = Object.fromEntries(action.payload.travelGearAndTools)
      state.trinkhornzauber = Object.fromEntries(action.payload.trinkhornzauber)
      state.ui = Object.fromEntries(action.payload.ui)
      state.vampiricGifts = Object.fromEntries(action.payload.vampiricGifts)
      state.vehicles = Object.fromEntries(action.payload.vehicles)
      state.visions = Object.fromEntries(action.payload.visions)
      state.wandEnchantments = Object.fromEntries(action.payload.wandEnchantments)
      state.weaponAccessories = Object.fromEntries(action.payload.weaponAccessories)
      state.weaponEnchantments = Object.fromEntries(action.payload.weaponEnchantments)
      state.weapons = Object.fromEntries(action.payload.weapons)
      state.zibiljaRituals = Object.fromEntries(action.payload.zibiljaRituals)
    },
  },
})

export const { initDatabase } = databaseSlice.actions

export const databaseReducer = databaseSlice.reducer
