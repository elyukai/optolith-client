/* eslint-disable max-len */
import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { TypeId, TypeMap } from "optolith-database-schema/config/types"
import { Database as RawDatabase } from "../../database/index.ts"
import { RootState } from "../store.ts"

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


export const selectAdvancedCombatSpecialAbilities = (state: RootState) => state.database.advancedCombatSpecialAbilities
export const selectAdvancedKarmaSpecialAbilities = (state: RootState) => state.database.advancedKarmaSpecialAbilities
export const selectAdvancedMagicalSpecialAbilities = (state: RootState) => state.database.advancedMagicalSpecialAbilities
export const selectAdvancedSkillSpecialAbilities = (state: RootState) => state.database.advancedSkillSpecialAbilities
export const selectAdvantages = (state: RootState) => state.database.advantages
export const selectAlchemicae = (state: RootState) => state.database.alchemicae
export const selectAmmunition = (state: RootState) => state.database.ammunition
export const selectAncestorGlyphs = (state: RootState) => state.database.ancestorGlyphs
export const selectAnimalCare = (state: RootState) => state.database.animalCare
export const selectAnimalDiseases = (state: RootState) => state.database.animalDiseases
export const selectAnimals = (state: RootState) => state.database.animals
export const selectAnimalShapePaths = (state: RootState) => state.database.animalShapePaths
export const selectAnimalShapes = (state: RootState) => state.database.animalShapes
export const selectAnimalShapeSizes = (state: RootState) => state.database.animalShapeSizes
export const selectAnimalTypes = (state: RootState) => state.database.animalTypes
export const selectAnimistPowers = (state: RootState) => state.database.animistPowers
export const selectAnimistPowerTribes = (state: RootState) => state.database.animistPowerTribes
export const selectArcaneBardTraditions = (state: RootState) => state.database.arcaneBardTraditions
export const selectArcaneDancerTraditions = (state: RootState) => state.database.arcaneDancerTraditions
export const selectArcaneOrbEnchantments = (state: RootState) => state.database.arcaneOrbEnchantments
export const selectArmors = (state: RootState) => state.database.armors
export const selectArmorTypes = (state: RootState) => state.database.armorTypes
export const selectAspects = (state: RootState) => state.database.aspects
export const selectAttireEnchantments = (state: RootState) => state.database.attireEnchantments
export const selectAttributes = (state: RootState) => state.database.attributes
export const selectBandagesAndRemedies = (state: RootState) => state.database.bandagesAndRemedies
export const selectBlessedTraditions = (state: RootState) => state.database.blessedTraditions
export const selectBlessings = (state: RootState) => state.database.blessings
export const selectBooks = (state: RootState) => state.database.books
export const selectBowlEnchantments = (state: RootState) => state.database.bowlEnchantments
export const selectBrawlingSpecialAbilities = (state: RootState) => state.database.brawlingSpecialAbilities
export const selectBrews = (state: RootState) => state.database.brews
export const selectCantrips = (state: RootState) => state.database.cantrips
export const selectCauldronEnchantments = (state: RootState) => state.database.cauldronEnchantments
export const selectCeremonialItems = (state: RootState) => state.database.ceremonialItems
export const selectCeremonialItemSpecialAbilities = (state: RootState) => state.database.ceremonialItemSpecialAbilities
export const selectCeremonies = (state: RootState) => state.database.ceremonies
export const selectChronicleEnchantments = (state: RootState) => state.database.chronicleEnchantments
export const selectCloseCombatTechniques = (state: RootState) => state.database.closeCombatTechniques
export const selectClothes = (state: RootState) => state.database.clothes
export const selectCombatSpecialAbilities = (state: RootState) => state.database.combatSpecialAbilities
export const selectCombatStyleSpecialAbilities = (state: RootState) => state.database.combatStyleSpecialAbilities
export const selectCommandSpecialAbilities = (state: RootState) => state.database.commandSpecialAbilities
export const selectConditions = (state: RootState) => state.database.conditions
export const selectContainers = (state: RootState) => state.database.containers
export const selectContinents = (state: RootState) => state.database.continents
export const selectCoreRules = (state: RootState) => state.database.coreRules
export const selectCultures = (state: RootState) => state.database.cultures
export const selectCurses = (state: RootState) => state.database.curses
export const selectDaggerRituals = (state: RootState) => state.database.daggerRituals
export const selectDerivedCharacteristics = (state: RootState) => state.database.derivedCharacteristics
export const selectDisadvantages = (state: RootState) => state.database.disadvantages
export const selectDiseases = (state: RootState) => state.database.diseases
export const selectDominationRituals = (state: RootState) => state.database.dominationRituals
export const selectElements = (state: RootState) => state.database.elements
export const selectElixirs = (state: RootState) => state.database.elixirs
export const selectElvenMagicalSongs = (state: RootState) => state.database.elvenMagicalSongs
export const selectEquipmentOfBlessedOnes = (state: RootState) => state.database.equipmentOfBlessedOnes
export const selectEquipmentPackages = (state: RootState) => state.database.equipmentPackages
export const selectExperienceLevels = (state: RootState) => state.database.experienceLevels
export const selectEyeColors = (state: RootState) => state.database.eyeColors
export const selectFamiliarSpecialAbilities = (state: RootState) => state.database.familiarSpecialAbilities
export const selectFamiliarsTricks = (state: RootState) => state.database.familiarsTricks
export const selectFatePointSexSpecialAbilities = (state: RootState) => state.database.fatePointSexSpecialAbilities
export const selectFatePointSpecialAbilities = (state: RootState) => state.database.fatePointSpecialAbilities
export const selectFocusRules = (state: RootState) => state.database.focusRules
export const selectFocusRuleSubjects = (state: RootState) => state.database.focusRuleSubjects
export const selectFoolsHatEnchantments = (state: RootState) => state.database.foolsHatEnchantments
export const selectGemsAndPreciousStones = (state: RootState) => state.database.gemsAndPreciousStones
export const selectGeneralSpecialAbilities = (state: RootState) => state.database.generalSpecialAbilities
export const selectGeodeRituals = (state: RootState) => state.database.geodeRituals
export const selectHairColors = (state: RootState) => state.database.hairColors
export const selectIlluminationLightSources = (state: RootState) => state.database.illuminationLightSources
export const selectIlluminationRefillsAndSupplies = (state: RootState) => state.database.illuminationRefillsAndSupplies
export const selectInstrumentEnchantments = (state: RootState) => state.database.instrumentEnchantments
export const selectJesterTricks = (state: RootState) => state.database.jesterTricks
export const selectJewelry = (state: RootState) => state.database.jewelry
export const selectKarmaSpecialAbilities = (state: RootState) => state.database.karmaSpecialAbilities
export const selectKirchenpraegungen = (state: RootState) => state.database.kirchenpraegungen
export const selectKrallenkettenzauber = (state: RootState) => state.database.krallenkettenzauber
export const selectLanguages = (state: RootState) => state.database.languages
export const selectLessonsCurricula = (state: RootState) => state.database.lessonsCurricula
export const selectLessonsGuidelines = (state: RootState) => state.database.lessonsGuidelines
export const selectLiebesspielzeug = (state: RootState) => state.database.liebesspielzeug
export const selectLiturgicalChants = (state: RootState) => state.database.liturgicalChants
export const selectLiturgicalStyleSpecialAbilities = (state: RootState) => state.database.liturgicalStyleSpecialAbilities
export const selectLocales = (state: RootState) => state.database.locales
export const selectLuxuryGoods = (state: RootState) => state.database.luxuryGoods
export const selectLycantropicGifts = (state: RootState) => state.database.lycantropicGifts
export const selectMagicalArtifacts = (state: RootState) => state.database.magicalArtifacts
export const selectMagicalDances = (state: RootState) => state.database.magicalDances
export const selectMagicalMelodies = (state: RootState) => state.database.magicalMelodies
export const selectMagicalRunes = (state: RootState) => state.database.magicalRunes
export const selectMagicalSigns = (state: RootState) => state.database.magicalSigns
export const selectMagicalSpecialAbilities = (state: RootState) => state.database.magicalSpecialAbilities
export const selectMagicalTraditions = (state: RootState) => state.database.magicalTraditions
export const selectMagicStyleSpecialAbilities = (state: RootState) => state.database.magicStyleSpecialAbilities
export const selectMetaConditions = (state: RootState) => state.database.metaConditions
export const selectMusicalInstruments = (state: RootState) => state.database.musicalInstruments
export const selectOptionalRules = (state: RootState) => state.database.optionalRules
export const selectOrbEnchantments = (state: RootState) => state.database.orbEnchantments
export const selectOrienteeringAids = (state: RootState) => state.database.orienteeringAids
export const selectPactCategories = (state: RootState) => state.database.pactCategories
export const selectPactGifts = (state: RootState) => state.database.pactGifts
export const selectPatronCategories = (state: RootState) => state.database.patronCategories
export const selectPatrons = (state: RootState) => state.database.patrons
export const selectPersonalityTraits = (state: RootState) => state.database.personalityTraits
export const selectPoisons = (state: RootState) => state.database.poisons
export const selectProfessions = (state: RootState) => state.database.professions
export const selectProperties = (state: RootState) => state.database.properties
export const selectProtectiveWardingCircleSpecialAbilities = (state: RootState) => state.database.protectiveWardingCircleSpecialAbilities
export const selectPublications = (state: RootState) => state.database.publications
export const selectRaces = (state: RootState) => state.database.races
export const selectRangedCombatTechniques = (state: RootState) => state.database.rangedCombatTechniques
export const selectReaches = (state: RootState) => state.database.reaches
export const selectRegions = (state: RootState) => state.database.regions
export const selectRingEnchantments = (state: RootState) => state.database.ringEnchantments
export const selectRituals = (state: RootState) => state.database.rituals
export const selectRopesAndChains = (state: RootState) => state.database.ropesAndChains
export const selectScripts = (state: RootState) => state.database.scripts
export const selectSermons = (state: RootState) => state.database.sermons
export const selectServices = (state: RootState) => state.database.services
export const selectSexPractices = (state: RootState) => state.database.sexPractices
export const selectSexSpecialAbilities = (state: RootState) => state.database.sexSpecialAbilities
export const selectSickleRituals = (state: RootState) => state.database.sickleRituals
export const selectSikaryanDrainSpecialAbilities = (state: RootState) => state.database.sikaryanDrainSpecialAbilities
export const selectSkillGroups = (state: RootState) => state.database.skillGroups
export const selectSkillModificationLevels = (state: RootState) => state.database.skillModificationLevels
export const selectSkills = (state: RootState) => state.database.skills
export const selectSkillStyleSpecialAbilities = (state: RootState) => state.database.skillStyleSpecialAbilities
export const selectSocialStatuses = (state: RootState) => state.database.socialStatuses
export const selectSpells = (state: RootState) => state.database.spells
export const selectSpellSwordEnchantments = (state: RootState) => state.database.spellSwordEnchantments
export const selectStaffEnchantments = (state: RootState) => state.database.staffEnchantments
export const selectStates = (state: RootState) => state.database.states
export const selectStationary = (state: RootState) => state.database.stationary
export const selectTalismans = (state: RootState) => state.database.talismans
export const selectTargetCategories = (state: RootState) => state.database.targetCategories
export const selectThievesTools = (state: RootState) => state.database.thievesTools
export const selectToolsOfTheTrade = (state: RootState) => state.database.toolsOfTheTrade
export const selectToyEnchantments = (state: RootState) => state.database.toyEnchantments
export const selectTradeSecrets = (state: RootState) => state.database.tradeSecrets
export const selectTravelGearAndTools = (state: RootState) => state.database.travelGearAndTools
export const selectTrinkhornzauber = (state: RootState) => state.database.trinkhornzauber
export const selectUi = (state: RootState) => state.database.ui
export const selectVampiricGifts = (state: RootState) => state.database.vampiricGifts
export const selectVehicles = (state: RootState) => state.database.vehicles
export const selectVisions = (state: RootState) => state.database.visions
export const selectWandEnchantments = (state: RootState) => state.database.wandEnchantments
export const selectWeaponAccessories = (state: RootState) => state.database.weaponAccessories
export const selectWeaponEnchantments = (state: RootState) => state.database.weaponEnchantments
export const selectWeapons = (state: RootState) => state.database.weapons
export const selectZibiljaRituals = (state: RootState) => state.database.zibiljaRituals

export const databaseReducer = databaseSlice.reducer
