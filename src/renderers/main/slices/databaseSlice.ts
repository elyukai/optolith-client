import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { TypeId, TypeMap } from "optolith-database-schema/config/types"
import { Database as RawDatabase } from "../../../database.ts"

export type DatabaseState = {
  [K in keyof TypeMap]: Map<TypeId<K>, TypeMap[K]>
}

export const initialDatabaseState: DatabaseState = {
  advancedCombatSpecialAbilities: new Map(),
  advancedKarmaSpecialAbilities: new Map(),
  advancedMagicalSpecialAbilities: new Map(),
  advancedSkillSpecialAbilities: new Map(),
  advantages: new Map(),
  alchemicae: new Map(),
  ammunition: new Map(),
  ancestorGlyphs: new Map(),
  animalCare: new Map(),
  animalDiseases: new Map(),
  animals: new Map(),
  animalShapePaths: new Map(),
  animalShapes: new Map(),
  animalShapeSizes: new Map(),
  animalTypes: new Map(),
  animistPowers: new Map(),
  animistPowerTribes: new Map(),
  arcaneBardTraditions: new Map(),
  arcaneDancerTraditions: new Map(),
  arcaneOrbEnchantments: new Map(),
  armors: new Map(),
  armorTypes: new Map(),
  aspects: new Map(),
  attireEnchantments: new Map(),
  attributes: new Map(),
  bandagesAndRemedies: new Map(),
  blessedTraditions: new Map(),
  blessings: new Map(),
  books: new Map(),
  bowlEnchantments: new Map(),
  brawlingSpecialAbilities: new Map(),
  brews: new Map(),
  cantrips: new Map(),
  cauldronEnchantments: new Map(),
  ceremonialItems: new Map(),
  ceremonialItemSpecialAbilities: new Map(),
  ceremonies: new Map(),
  chronicleEnchantments: new Map(),
  closeCombatTechniques: new Map(),
  clothes: new Map(),
  combatSpecialAbilities: new Map(),
  combatStyleSpecialAbilities: new Map(),
  commandSpecialAbilities: new Map(),
  conditions: new Map(),
  containers: new Map(),
  continents: new Map(),
  coreRules: new Map(),
  cultures: new Map(),
  curses: new Map(),
  daggerRituals: new Map(),
  derivedCharacteristics: new Map(),
  disadvantages: new Map(),
  diseases: new Map(),
  dominationRituals: new Map(),
  elements: new Map(),
  elixirs: new Map(),
  elvenMagicalSongs: new Map(),
  equipmentOfBlessedOnes: new Map(),
  equipmentPackages: new Map(),
  experienceLevels: new Map(),
  eyeColors: new Map(),
  familiarSpecialAbilities: new Map(),
  familiarsTricks: new Map(),
  fatePointSexSpecialAbilities: new Map(),
  fatePointSpecialAbilities: new Map(),
  focusRules: new Map(),
  focusRuleSubjects: new Map(),
  foolsHatEnchantments: new Map(),
  gemsAndPreciousStones: new Map(),
  generalSpecialAbilities: new Map(),
  geodeRituals: new Map(),
  hairColors: new Map(),
  illuminationLightSources: new Map(),
  illuminationRefillsAndSupplies: new Map(),
  instrumentEnchantments: new Map(),
  jesterTricks: new Map(),
  jewelry: new Map(),
  karmaSpecialAbilities: new Map(),
  kirchenpraegungen: new Map(),
  krallenkettenzauber: new Map(),
  languages: new Map(),
  lessonsCurricula: new Map(),
  lessonsGuidelines: new Map(),
  liebesspielzeug: new Map(),
  liturgicalChants: new Map(),
  liturgicalStyleSpecialAbilities: new Map(),
  locales: new Map(),
  luxuryGoods: new Map(),
  lycantropicGifts: new Map(),
  magicalArtifacts: new Map(),
  magicalDances: new Map(),
  magicalMelodies: new Map(),
  magicalRunes: new Map(),
  magicalSigns: new Map(),
  magicalSpecialAbilities: new Map(),
  magicalTraditions: new Map(),
  magicStyleSpecialAbilities: new Map(),
  metaConditions: new Map(),
  musicalInstruments: new Map(),
  optionalRules: new Map(),
  orbEnchantments: new Map(),
  orienteeringAids: new Map(),
  pactCategories: new Map(),
  pactGifts: new Map(),
  patronCategories: new Map(),
  patrons: new Map(),
  personalityTraits: new Map(),
  poisons: new Map(),
  professions: new Map(),
  properties: new Map(),
  protectiveWardingCircleSpecialAbilities: new Map(),
  publications: new Map(),
  races: new Map(),
  rangedCombatTechniques: new Map(),
  reaches: new Map(),
  regions: new Map(),
  ringEnchantments: new Map(),
  rituals: new Map(),
  ropesAndChains: new Map(),
  scripts: new Map(),
  sermons: new Map(),
  services: new Map(),
  sexPractices: new Map(),
  sexSpecialAbilities: new Map(),
  sickleRituals: new Map(),
  sikaryanDrainSpecialAbilities: new Map(),
  skillGroups: new Map(),
  skillModificationLevels: new Map(),
  skills: new Map(),
  skillStyleSpecialAbilities: new Map(),
  socialStatuses: new Map(),
  spells: new Map(),
  spellSwordEnchantments: new Map(),
  staffEnchantments: new Map(),
  states: new Map(),
  stationary: new Map(),
  talismans: new Map(),
  targetCategories: new Map(),
  thievesTools: new Map(),
  toolsOfTheTrade: new Map(),
  toyEnchantments: new Map(),
  tradeSecrets: new Map(),
  travelGearAndTools: new Map(),
  trinkhornzauber: new Map(),
  ui: new Map(),
  vampiricGifts: new Map(),
  vehicles: new Map(),
  visions: new Map(),
  wandEnchantments: new Map(),
  weaponAccessories: new Map(),
  weaponEnchantments: new Map(),
  weapons: new Map(),
  zibiljaRituals: new Map(),
}

export const databaseSlice = createSlice({
  name: "database",
  initialState: initialDatabaseState,
  reducers: {
    initDatabase: (state, action: PayloadAction<RawDatabase>) => {
      state.advancedCombatSpecialAbilities = new Map(action.payload.advancedCombatSpecialAbilities)
      state.advancedKarmaSpecialAbilities = new Map(action.payload.advancedKarmaSpecialAbilities)
      state.advancedMagicalSpecialAbilities =
        new Map(action.payload.advancedMagicalSpecialAbilities)
      state.advancedSkillSpecialAbilities = new Map(action.payload.advancedSkillSpecialAbilities)
      state.advantages = new Map(action.payload.advantages)
      state.alchemicae = new Map(action.payload.alchemicae)
      state.ammunition = new Map(action.payload.ammunition)
      state.ancestorGlyphs = new Map(action.payload.ancestorGlyphs)
      state.animalCare = new Map(action.payload.animalCare)
      state.animalDiseases = new Map(action.payload.animalDiseases)
      state.animals = new Map(action.payload.animals)
      state.animalShapePaths = new Map(action.payload.animalShapePaths)
      state.animalShapes = new Map(action.payload.animalShapes)
      state.animalShapeSizes = new Map(action.payload.animalShapeSizes)
      state.animalTypes = new Map(action.payload.animalTypes)
      state.animistPowers = new Map(action.payload.animistPowers)
      state.animistPowerTribes = new Map(action.payload.animistPowerTribes)
      state.arcaneBardTraditions = new Map(action.payload.arcaneBardTraditions)
      state.arcaneDancerTraditions = new Map(action.payload.arcaneDancerTraditions)
      state.arcaneOrbEnchantments = new Map(action.payload.arcaneOrbEnchantments)
      state.armors = new Map(action.payload.armors)
      state.armorTypes = new Map(action.payload.armorTypes)
      state.aspects = new Map(action.payload.aspects)
      state.attireEnchantments = new Map(action.payload.attireEnchantments)
      state.attributes = new Map(action.payload.attributes)
      state.bandagesAndRemedies = new Map(action.payload.bandagesAndRemedies)
      state.blessedTraditions = new Map(action.payload.blessedTraditions)
      state.blessings = new Map(action.payload.blessings)
      state.books = new Map(action.payload.books)
      state.bowlEnchantments = new Map(action.payload.bowlEnchantments)
      state.brawlingSpecialAbilities = new Map(action.payload.brawlingSpecialAbilities)
      state.brews = new Map(action.payload.brews)
      state.cantrips = new Map(action.payload.cantrips)
      state.cauldronEnchantments = new Map(action.payload.cauldronEnchantments)
      state.ceremonialItems = new Map(action.payload.ceremonialItems)
      state.ceremonialItemSpecialAbilities = new Map(action.payload.ceremonialItemSpecialAbilities)
      state.ceremonies = new Map(action.payload.ceremonies)
      state.chronicleEnchantments = new Map(action.payload.chronicleEnchantments)
      state.closeCombatTechniques = new Map(action.payload.closeCombatTechniques)
      state.clothes = new Map(action.payload.clothes)
      state.combatSpecialAbilities = new Map(action.payload.combatSpecialAbilities)
      state.combatStyleSpecialAbilities = new Map(action.payload.combatStyleSpecialAbilities)
      state.commandSpecialAbilities = new Map(action.payload.commandSpecialAbilities)
      state.conditions = new Map(action.payload.conditions)
      state.containers = new Map(action.payload.containers)
      state.continents = new Map(action.payload.continents)
      state.coreRules = new Map(action.payload.coreRules)
      state.cultures = new Map(action.payload.cultures)
      state.curses = new Map(action.payload.curses)
      state.daggerRituals = new Map(action.payload.daggerRituals)
      state.derivedCharacteristics = new Map(action.payload.derivedCharacteristics)
      state.disadvantages = new Map(action.payload.disadvantages)
      state.diseases = new Map(action.payload.diseases)
      state.dominationRituals = new Map(action.payload.dominationRituals)
      state.elements = new Map(action.payload.elements)
      state.elixirs = new Map(action.payload.elixirs)
      state.elvenMagicalSongs = new Map(action.payload.elvenMagicalSongs)
      state.equipmentOfBlessedOnes = new Map(action.payload.equipmentOfBlessedOnes)
      state.equipmentPackages = new Map(action.payload.equipmentPackages)
      state.experienceLevels = new Map(action.payload.experienceLevels)
      state.eyeColors = new Map(action.payload.eyeColors)
      state.familiarSpecialAbilities = new Map(action.payload.familiarSpecialAbilities)
      state.familiarsTricks = new Map(action.payload.familiarsTricks)
      state.fatePointSexSpecialAbilities = new Map(action.payload.fatePointSexSpecialAbilities)
      state.fatePointSpecialAbilities = new Map(action.payload.fatePointSpecialAbilities)
      state.focusRules = new Map(action.payload.focusRules)
      state.focusRuleSubjects = new Map(action.payload.focusRuleSubjects)
      state.foolsHatEnchantments = new Map(action.payload.foolsHatEnchantments)
      state.gemsAndPreciousStones = new Map(action.payload.gemsAndPreciousStones)
      state.generalSpecialAbilities = new Map(action.payload.generalSpecialAbilities)
      state.geodeRituals = new Map(action.payload.geodeRituals)
      state.hairColors = new Map(action.payload.hairColors)
      state.illuminationLightSources = new Map(action.payload.illuminationLightSources)
      state.illuminationRefillsAndSupplies = new Map(action.payload.illuminationRefillsAndSupplies)
      state.instrumentEnchantments = new Map(action.payload.instrumentEnchantments)
      state.jesterTricks = new Map(action.payload.jesterTricks)
      state.jewelry = new Map(action.payload.jewelry)
      state.karmaSpecialAbilities = new Map(action.payload.karmaSpecialAbilities)
      state.kirchenpraegungen = new Map(action.payload.kirchenpraegungen)
      state.krallenkettenzauber = new Map(action.payload.krallenkettenzauber)
      state.languages = new Map(action.payload.languages)
      state.lessonsCurricula = new Map(action.payload.lessonsCurricula)
      state.lessonsGuidelines = new Map(action.payload.lessonsGuidelines)
      state.liebesspielzeug = new Map(action.payload.liebesspielzeug)
      state.liturgicalChants = new Map(action.payload.liturgicalChants)
      state.liturgicalStyleSpecialAbilities =
        new Map(action.payload.liturgicalStyleSpecialAbilities)
      state.locales = new Map(action.payload.locales)
      state.luxuryGoods = new Map(action.payload.luxuryGoods)
      state.lycantropicGifts = new Map(action.payload.lycantropicGifts)
      state.magicalArtifacts = new Map(action.payload.magicalArtifacts)
      state.magicalDances = new Map(action.payload.magicalDances)
      state.magicalMelodies = new Map(action.payload.magicalMelodies)
      state.magicalRunes = new Map(action.payload.magicalRunes)
      state.magicalSigns = new Map(action.payload.magicalSigns)
      state.magicalSpecialAbilities = new Map(action.payload.magicalSpecialAbilities)
      state.magicalTraditions = new Map(action.payload.magicalTraditions)
      state.magicStyleSpecialAbilities = new Map(action.payload.magicStyleSpecialAbilities)
      state.metaConditions = new Map(action.payload.metaConditions)
      state.musicalInstruments = new Map(action.payload.musicalInstruments)
      state.optionalRules = new Map(action.payload.optionalRules)
      state.orbEnchantments = new Map(action.payload.orbEnchantments)
      state.orienteeringAids = new Map(action.payload.orienteeringAids)
      state.pactCategories = new Map(action.payload.pactCategories)
      state.pactGifts = new Map(action.payload.pactGifts)
      state.patronCategories = new Map(action.payload.patronCategories)
      state.patrons = new Map(action.payload.patrons)
      state.personalityTraits = new Map(action.payload.personalityTraits)
      state.poisons = new Map(action.payload.poisons)
      state.professions = new Map(action.payload.professions)
      state.properties = new Map(action.payload.properties)
      state.protectiveWardingCircleSpecialAbilities =
        new Map(action.payload.protectiveWardingCircleSpecialAbilities)
      state.publications = new Map(action.payload.publications)
      state.races = new Map(action.payload.races)
      state.rangedCombatTechniques = new Map(action.payload.rangedCombatTechniques)
      state.reaches = new Map(action.payload.reaches)
      state.regions = new Map(action.payload.regions)
      state.ringEnchantments = new Map(action.payload.ringEnchantments)
      state.rituals = new Map(action.payload.rituals)
      state.ropesAndChains = new Map(action.payload.ropesAndChains)
      state.scripts = new Map(action.payload.scripts)
      state.sermons = new Map(action.payload.sermons)
      state.services = new Map(action.payload.services)
      state.sexPractices = new Map(action.payload.sexPractices)
      state.sexSpecialAbilities = new Map(action.payload.sexSpecialAbilities)
      state.sickleRituals = new Map(action.payload.sickleRituals)
      state.sikaryanDrainSpecialAbilities = new Map(action.payload.sikaryanDrainSpecialAbilities)
      state.skillGroups = new Map(action.payload.skillGroups)
      state.skillModificationLevels = new Map(action.payload.skillModificationLevels)
      state.skills = new Map(action.payload.skills)
      state.skillStyleSpecialAbilities = new Map(action.payload.skillStyleSpecialAbilities)
      state.socialStatuses = new Map(action.payload.socialStatuses)
      state.spells = new Map(action.payload.spells)
      state.spellSwordEnchantments = new Map(action.payload.spellSwordEnchantments)
      state.staffEnchantments = new Map(action.payload.staffEnchantments)
      state.states = new Map(action.payload.states)
      state.stationary = new Map(action.payload.stationary)
      state.talismans = new Map(action.payload.talismans)
      state.targetCategories = new Map(action.payload.targetCategories)
      state.thievesTools = new Map(action.payload.thievesTools)
      state.toolsOfTheTrade = new Map(action.payload.toolsOfTheTrade)
      state.toyEnchantments = new Map(action.payload.toyEnchantments)
      state.tradeSecrets = new Map(action.payload.tradeSecrets)
      state.travelGearAndTools = new Map(action.payload.travelGearAndTools)
      state.trinkhornzauber = new Map(action.payload.trinkhornzauber)
      state.ui = new Map(action.payload.ui)
      state.vampiricGifts = new Map(action.payload.vampiricGifts)
      state.vehicles = new Map(action.payload.vehicles)
      state.visions = new Map(action.payload.visions)
      state.wandEnchantments = new Map(action.payload.wandEnchantments)
      state.weaponAccessories = new Map(action.payload.weaponAccessories)
      state.weaponEnchantments = new Map(action.payload.weaponEnchantments)
      state.weapons = new Map(action.payload.weapons)
      state.zibiljaRituals = new Map(action.payload.zibiljaRituals)
    },
  },
})

export const { initDatabase } = databaseSlice.actions

export const databaseReducer = databaseSlice.reducer
