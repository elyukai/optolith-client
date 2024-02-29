import { AnyAction, createAction } from "@reduxjs/toolkit"
import { Draft } from "immer"
import { Character } from "../../shared/domain/character.ts"
import {
  AdvantageIdentifier,
  BlessedTraditionIdentifier,
  MagicalTraditionIdentifier,
} from "../../shared/domain/identifier.ts"
import { createImmerReducer, reduceReducers } from "../../shared/utils/redux.ts"
import { RootState } from "../store.ts"
import { advantagesReducer } from "./advantagesSlice.ts"
import { attributesReducer } from "./attributesSlice.ts"
import { blessingsReducer } from "./blessingsSlice.ts"
import { cantripsReducer } from "./cantripsSlice.ts"
import { ceremoniesReducer } from "./ceremoniesSlice.ts"
import { closeCombatTechniquesReducer } from "./closeCombatTechniqueSlice.ts"
import { DatabaseState } from "./databaseSlice.ts"
import { derivedCharacteristicsReducer } from "./derivedCharacteristicsSlice.ts"
import { disadvantagesReducer } from "./disadvantagesSlice.ts"
import { liturgicalChantsReducer } from "./liturgicalChantsSlice.ts"
import { animistPowersReducer } from "./magicalActions/animistPowersSlice.ts"
import { cursesReducer } from "./magicalActions/cursesSlice.ts"
import { dominationRitualsReducer } from "./magicalActions/dominationRitualsSlice.ts"
import { elvenMagicalSongsReducer } from "./magicalActions/elvenMagicalSongsSlice.ts"
import { geodeRitualsReducer } from "./magicalActions/geodeRitualsSlice.ts"
import { jesterTricksReducer } from "./magicalActions/jesterTricksSlice.ts"
import { magicalDancesReducer } from "./magicalActions/magicalDancesSlice.ts"
import { magicalMelodiesReducer } from "./magicalActions/magicalMelodiesSlice.ts"
import { zibiljaRitualsReducer } from "./magicalActions/zibiljaRitualsSlice.ts"
import { personalDataReducer } from "./personalDataSlice.ts"
import { professionReducer } from "./professionSlice.ts"
import { raceReducer } from "./raceSlice.ts"
import { rangedCombatTechniquesReducer } from "./rangedCombatTechniqueSlice.ts"
import { ritualsReducer } from "./ritualsSlice.ts"
import { rulesReducer } from "./rulesSlice.ts"
import { skillsReducer } from "./skillsSlice.ts"
import { spellsReducer } from "./spellsSlice.ts"

/**
 * The full state of a single character.
 */
export type CharacterState = Character

// TODO: Remove prefilled values for a real character
const staticInitialState: Omit<CharacterState, "dateCreated" | "dateLastModified"> = {
  id: "550e8400-e29b-11d4-a716-446655440000",
  version: undefined,
  name: "Alrik",
  totalAdventurePoints: 1100,
  experienceLevelStartId: 3,
  isCharacterCreationFinished: false,
  race: {
    id: 1,
    variantId: 1,
    selectedAttributeAdjustmentId: 1,
  },
  culture: {
    id: 1,
    isCulturalPackageApplied: false,
  },
  profession: {
    id: 1,
    instanceId: 1,
  },
  rules: {
    includeAllPublications: true,
    includePublications: [],
    focusRules: {},
    optionalRules: {},
  },
  states: {},
  personalData: {
    sex: { type: "Male" },
    socialStatus: {
      dependencies: [],
    },
  },
  advantages: {
    [AdvantageIdentifier.Blessed]: createDynamicActivatable(AdvantageIdentifier.Blessed, [{}], 25),
    [AdvantageIdentifier.Spellcaster]: createDynamicActivatable(
      AdvantageIdentifier.Spellcaster,
      [{}],
      25,
    ),
  },
  disadvantages: {},
  specialAbilities: {
    advancedCombatSpecialAbilities: {},
    advancedKarmaSpecialAbilities: {},
    advancedMagicalSpecialAbilities: {},
    advancedSkillSpecialAbilities: {},
    ancestorGlyphs: {},
    arcaneOrbEnchantments: {},
    attireEnchantments: {},
    blessedTraditions: {
      [BlessedTraditionIdentifier.Praios]: createDynamicActivatable(
        BlessedTraditionIdentifier.Praios,
        [{}],
        130,
      ),
    },
    bowlEnchantments: {},
    brawlingSpecialAbilities: {},
    cauldronEnchantments: {},
    ceremonialItemSpecialAbilities: {},
    chronicleEnchantments: {},
    combatSpecialAbilities: {},
    combatStyleSpecialAbilities: {},
    commandSpecialAbilities: {},
    daggerRituals: {},
    familiarSpecialAbilities: {},
    fatePointSexSpecialAbilities: {},
    fatePointSpecialAbilities: {},
    foolsHatEnchantments: {},
    generalSpecialAbilities: {},
    instrumentEnchantments: {},
    karmaSpecialAbilities: {},
    krallenkettenzauber: {},
    liturgicalStyleSpecialAbilities: {},
    lycantropicGifts: {},
    magicalRunes: {},
    magicalSigns: {},
    magicalSpecialAbilities: {},
    magicalTraditions: {
      [MagicalTraditionIdentifier.Witches]: createDynamicActivatable(
        MagicalTraditionIdentifier.Witches,
        [{}],
        135,
      ),
    },
    magicStyleSpecialAbilities: {},
    orbEnchantments: {},
    pactGifts: {},
    protectiveWardingCircleSpecialAbilities: {},
    ringEnchantments: {},
    sermons: {},
    sexSpecialAbilities: {},
    sickleRituals: {},
    sikaryanDrainSpecialAbilities: {},
    skillStyleSpecialAbilities: {},
    spellSwordEnchantments: {},
    staffEnchantments: {},
    toyEnchantments: {},
    trinkhornzauber: {},
    vampiricGifts: {},
    visions: {},
    wandEnchantments: {},
    weaponEnchantments: {},
  },
  magicalPrimaryAttributeDependencies: [],
  blessedPrimaryAttributeDependencies: [],
  derivedCharacteristics: {
    lifePoints: {
      purchased: 0,
      permanentlyLost: 0,
    },
    arcaneEnergy: {
      purchased: 0,
      permanentlyLost: 0,
      permanentlyLostBoughtBack: 0,
    },
    karmaPoints: {
      purchased: 0,
      permanentlyLost: 0,
      permanentlyLostBoughtBack: 0,
    },
  },
  skills: {},
  combatTechniques: {
    close: {},
    ranged: {},
  },
  cantrips: {
    1: {
      id: 1,
      active: true,
    },
  },
  spells: {
    1: {
      id: 1,
      boundAdventurePoints: [],
      cachedAdventurePoints: {
        bound: 0,
        general: 2,
      },
      dependencies: [],
      enhancements: {},
      value: 0,
    },
  },
  rituals: {
    1: {
      id: 1,
      boundAdventurePoints: [],
      cachedAdventurePoints: {
        bound: 0,
        general: 4,
      },
      dependencies: [],
      enhancements: {},
      value: 0,
    },
  },
  magicalActions: {
    curses: {},
    elvenMagicalSongs: {},
    dominationRituals: {},
    magicalDances: {},
    magicalMelodies: {},
    jesterTricks: {},
    animistPowers: {},
    geodeRituals: {},
    zibiljaRituals: {},
  },
  blessings: {
    1: {
      id: 1,
      active: true,
    },
  },
  liturgicalChants: {
    1: {
      id: 1,
      boundAdventurePoints: [],
      cachedAdventurePoints: {
        bound: 0,
        general: 1,
      },
      dependencies: [],
      enhancements: {},
      value: 0,
    },
  },
  ceremonies: {
    1: {
      id: 1,
      boundAdventurePoints: [],
      cachedAdventurePoints: {
        bound: 0,
        general: 2,
      },
      dependencies: [],
      enhancements: {},
      value: 0,
    },
  },
  // items: {}
  // hitZoneArmors: {}
  purse: {
    kreutzers: 0,
    halers: 0,
    silverthalers: 0,
    ducats: 0,
  },
  // creatures: {}
  // pact: {}
}

/**
 * Creates a new character state.
 */
export const initialCharacterState = (): CharacterState => ({
  ...staticInitialState,
  dateCreated: new Date().toISOString(),
  dateLastModified: new Date().toISOString(),
})

/**
 * Select the currently open character.
 */
export const selectCurrentCharacter = (state: RootState): CharacterState | undefined => {
  const selectedId = state.route.path[0] === "characters" ? state.route.path[1] : undefined

  return selectedId === undefined ? undefined : state.characters[selectedId]
}

/**
 * Select the name of the currently open character.
 */
export const selectName = (state: RootState) => selectCurrentCharacter(state)?.name

/**
 * Select the avatar of the currently open character.
 */
export const selectAvatar = (state: RootState) => selectCurrentCharacter(state)?.avatar

/**
 * Select the total adventure points of the currently open character.
 */
export const selectTotalAdventurePoints = (state: RootState) =>
  selectCurrentCharacter(state)?.totalAdventurePoints

/**
 * Select the experience level start identifier of the currently open character.
 */
export const selectExperienceLevelStartId = (state: RootState) =>
  selectCurrentCharacter(state)?.experienceLevelStartId

/**
 * Select if the character creation is finished for the currently open
 * character.
 */
export const selectIsCharacterCreationFinished = (state: RootState) =>
  selectCurrentCharacter(state)?.isCharacterCreationFinished ?? false

/**
 * Select the race identifier of the currently open character.
 */
export const selectRaceId = (state: RootState) => selectCurrentCharacter(state)?.race.id

/**
 * Select the race variant start identifier of the currently open character.
 */
export const selectRaceVariantId = (state: RootState) =>
  selectCurrentCharacter(state)?.race.variantId

/**
 * Select the attribute adjustment identifier of the currently open character.
 */
export const selectAttributeAdjustmentId = (state: RootState) =>
  selectCurrentCharacter(state)?.race.selectedAttributeAdjustmentId

/**
 * Select the culture identifier of the currently open character.
 */
export const selectCultureId = (state: RootState) => selectCurrentCharacter(state)?.culture.id

/**
 * Select the profession identifier of the currently open character.
 */
export const selectProfessionId = (state: RootState) => selectCurrentCharacter(state)?.profession.id

/**
 * Select the profession instance identifier of the currently open character.
 */
export const selectProfessionInstanceId = (state: RootState) =>
  selectCurrentCharacter(state)?.profession.instanceId

/**
 * Select the profession variant identifier of the currently open character.
 */
export const selectProfessionVariantId = (state: RootState) =>
  selectCurrentCharacter(state)?.profession.variantId

/**
 * Select the custom profession name of the currently open character.
 */
export const selectCustomProfessionName = (state: RootState) =>
  selectCurrentCharacter(state)?.profession.customName

/**
 * Select if all publication should be included for the currently open
 * character.
 */
export const selectIncludeAllPublications = (state: RootState) =>
  selectCurrentCharacter(state)?.rules.includeAllPublications ?? false

/**
 * Select the explicitly included publications for the currently open character.
 */
export const selectIncludePublications = (state: RootState) =>
  selectCurrentCharacter(state)?.rules.includePublications

/**
 * Select the active focus rules of the currently open character.
 */
export const selectDynamicFocusRules = (state: RootState) =>
  selectCurrentCharacter(state)?.rules.focusRules

/**
 * Select the active optional rules of the currently open character.
 */
export const selectDynamicOptionalRules = (state: RootState) =>
  selectCurrentCharacter(state)?.rules.optionalRules

/**
 * Select the active states of the currently open character.
 */
export const selectDynamicStates = (state: RootState) => selectCurrentCharacter(state)?.states

/**
 * Select the personal data of the currently open character.
 */
export const selectPersonalData = (state: RootState): CharacterState["personalData"] =>
  selectCurrentCharacter(state)?.personalData ?? staticInitialState.personalData

/**
 * Select the sex of the currently open character.
 */
export const selectSex = (state: RootState) => selectPersonalData(state).sex

/**
 * Select the family of the currently open character.
 */
export const selectFamily = (state: RootState) => selectPersonalData(state).family

/**
 * Select the place of birth of the currently open character.
 */
export const selectPlaceOfBirth = (state: RootState) => selectPersonalData(state).placeOfBirth

/**
 * Select the date of birth of the currently open character.
 */
export const selectDateOfBirth = (state: RootState) => selectPersonalData(state).dateOfBirth

/**
 * Select the age of the currently open character.
 */
export const selectAge = (state: RootState) => selectPersonalData(state).age

/**
 * Select the hair color of the currently open character.
 */
export const selectHairColor = (state: RootState) => selectPersonalData(state).hairColor

/**
 * Select the hair color identifier of the currently open character, if it is
 * predefined.
 */
export const selectPredefinedHairColor = (state: RootState) => {
  const hairColor = selectHairColor(state)
  return hairColor?.type === "Predefined" ? hairColor.id : undefined
}

/**
 * Select the eye color of the currently open character.
 */
export const selectEyeColor = (state: RootState) => selectPersonalData(state).eyeColor

/**
 * Select the hair color identifier of the currently open character, if it is
 * predefined.
 */
export const selectPredefinedEyeColor = (state: RootState) => {
  const eyeColor = selectEyeColor(state)
  return eyeColor?.type === "Predefined" ? eyeColor.id : undefined
}

/**
 * Select the size of the currently open character.
 */
export const selectSize = (state: RootState) => selectPersonalData(state).size

/**
 * Select the weight of the currently open character.
 */
export const selectWeight = (state: RootState) => selectPersonalData(state).weight

/**
 * Select the title of the currently open character.
 */
export const selectTitle = (state: RootState) => selectPersonalData(state).title

/**
 * Select the social status identifier of the currently open character.
 */
export const selectSocialStatusId = (state: RootState) => selectPersonalData(state).socialStatus.id

/**
 * Select the social status dependencies of the currently open character.
 */
export const selectSocialStatusDependencies = (state: RootState) =>
  selectPersonalData(state).socialStatus.dependencies

/**
 * Select the characteristics of the currently open character.
 */
export const selectCharacteristics = (state: RootState) => selectPersonalData(state).characteristics

/**
 * Select the other info about the currently open character.
 */
export const selectOtherInfo = (state: RootState) => selectPersonalData(state).otherInfo

/**
 * Select the advantages of the currently open character.
 */
export const selectDynamicAdvantages = (state: RootState) =>
  selectCurrentCharacter(state)?.advantages

/**
 * Select the disadvantages of the currently open character.
 */
export const selectDynamicDisadvantages = (state: RootState) =>
  selectCurrentCharacter(state)?.disadvantages

/**
 * Select the special abilities of the currently open character.
 */
export const selectDynamicSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities

/**
 * Select the advanced combat special abilities of the currently open character.
 */
export const selectDynamicAdvancedCombatSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.advancedCombatSpecialAbilities

/**
 * Select the advanced karma special abilities of the currently open character.
 */
export const selectDynamicAdvancedKarmaSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.advancedKarmaSpecialAbilities

/**
 * Select the advanced magical special abilities of the currently open character.
 */
export const selectDynamicAdvancedMagicalSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.advancedMagicalSpecialAbilities

/**
 * Select the advanced skill special abilities of the currently open character.
 */
export const selectDynamicAdvancedSkillSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.advancedSkillSpecialAbilities

/**
 * Select the ancestor glyphs of the currently open character.
 */
export const selectDynamicAncestorGlyphs = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.ancestorGlyphs

/**
 * Select the arcane orb enchantments of the currently open character.
 */
export const selectDynamicArcaneOrbEnchantments = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.arcaneOrbEnchantments

/**
 * Select the attire enchantments of the currently open character.
 */
export const selectDynamicAttireEnchantments = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.attireEnchantments

/**
 * Select the blessed traditions of the currently open character.
 */
export const selectDynamicBlessedTraditions = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.blessedTraditions

/**
 * Select the bowl enchantments of the currently open character.
 */
export const selectDynamicBowlEnchantments = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.bowlEnchantments

/**
 * Select the brawling special abilities of the currently open character.
 */
export const selectDynamicBrawlingSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.brawlingSpecialAbilities

/**
 * Select the cauldron enchantments of the currently open character.
 */
export const selectDynamicCauldronEnchantments = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.cauldronEnchantments

/**
 * Select the ceremonial item special abilities of the currently open character.
 */
export const selectDynamicCeremonialItemSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.ceremonialItemSpecialAbilities

/**
 * Select the chronicle enchantments of the currently open character.
 */
export const selectDynamicChronicleEnchantments = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.chronicleEnchantments

/**
 * Select the combat special abilities of the currently open character.
 */
export const selectDynamicCombatSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.combatSpecialAbilities

/**
 * Select the combat style special abilities of the currently open character.
 */
export const selectDynamicCombatStyleSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.combatStyleSpecialAbilities

/**
 * Select the command special abilities of the currently open character.
 */
export const selectDynamicCommandSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.commandSpecialAbilities

/**
 * Select the dagger rituals of the currently open character.
 */
export const selectDynamicDaggerRituals = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.daggerRituals

/**
 * Select the familiar special abilities of the currently open character.
 */
export const selectDynamicFamiliarSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.familiarSpecialAbilities

/**
 * Select the fate point sex special abilities of the currently open character.
 */
export const selectDynamicFatePointSexSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.fatePointSexSpecialAbilities

/**
 * Select the fate point special abilities of the currently open character.
 */
export const selectDynamicFatePointSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.fatePointSpecialAbilities

/**
 * Select the fools hat enchantments of the currently open character.
 */
export const selectDynamicFoolsHatEnchantments = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.foolsHatEnchantments

/**
 * Select the general special abilities of the currently open character.
 */
export const selectDynamicGeneralSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.generalSpecialAbilities

/**
 * Select the instrument enchantments of the currently open character.
 */
export const selectDynamicInstrumentEnchantments = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.instrumentEnchantments

/**
 * Select the karma special abilities of the currently open character.
 */
export const selectDynamicKarmaSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.karmaSpecialAbilities

/**
 * Select the krallenkettenzauber of the currently open character.
 */
export const selectDynamicKrallenkettenzauber = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.krallenkettenzauber

/**
 * Select the liturgical style special abilities of the currently open character.
 */
export const selectDynamicLiturgicalStyleSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.liturgicalStyleSpecialAbilities

/**
 * Select the lycantropic gifts of the currently open character.
 */
export const selectDynamicLycantropicGifts = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.lycantropicGifts

/**
 * Select the magical runes of the currently open character.
 */
export const selectDynamicMagicalRunes = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.magicalRunes

/**
 * Select the magical signs of the currently open character.
 */
export const selectDynamicMagicalSigns = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.magicalSigns

/**
 * Select the magical special abilities of the currently open character.
 */
export const selectDynamicMagicalSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.magicalSpecialAbilities

/**
 * Select the magical traditions of the currently open character.
 */
export const selectDynamicMagicalTraditions = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.magicalTraditions

/**
 * Select the magic style special abilities of the currently open character.
 */
export const selectDynamicMagicStyleSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.magicStyleSpecialAbilities

/**
 * Select the orb enchantments of the currently open character.
 */
export const selectDynamicOrbEnchantments = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.orbEnchantments

/**
 * Select the pact gifts of the currently open character.
 */
export const selectDynamicPactGifts = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.pactGifts

/**
 * Select the protective warding circle special abilities of the currently open character.
 */
export const selectDynamicProtectiveWardingCircleSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.protectiveWardingCircleSpecialAbilities

/**
 * Select the ring enchantments of the currently open character.
 */
export const selectDynamicRingEnchantments = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.ringEnchantments

/**
 * Select the sermons of the currently open character.
 */
export const selectDynamicSermons = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.sermons

/**
 * Select the sex special abilities of the currently open character.
 */
export const selectDynamicSexSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.sexSpecialAbilities

/**
 * Select the sickle rituals of the currently open character.
 */
export const selectDynamicSickleRituals = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.sickleRituals

/**
 * Select the sikaryan drain special abilities of the currently open character.
 */
export const selectDynamicSikaryanDrainSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.sikaryanDrainSpecialAbilities

/**
 * Select the skill style special abilities of the currently open character.
 */
export const selectDynamicSkillStyleSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.skillStyleSpecialAbilities

/**
 * Select the spell sword enchantments of the currently open character.
 */
export const selectDynamicSpellSwordEnchantments = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.spellSwordEnchantments

/**
 * Select the staff enchantments of the currently open character.
 */
export const selectDynamicStaffEnchantments = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.staffEnchantments

/**
 * Select the toy enchantments of the currently open character.
 */
export const selectDynamicToyEnchantments = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.toyEnchantments

/**
 * Select the Trinkhornzauber of the currently open character.
 */
export const selectDynamicTrinkhornzauber = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.trinkhornzauber

/**
 * Select the vampiric gifts of the currently open character.
 */
export const selectDynamicVampiricGifts = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.vampiricGifts

/**
 * Select the visions of the currently open character.
 */
export const selectDynamicVisions = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.visions

/**
 * Select the wand enchantments of the currently open character.
 */
export const selectDynamicWandEnchantments = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.wandEnchantments

/**
 * Select the weapon enchantments of the currently open character.
 */
export const selectDynamicWeaponEnchantments = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.weaponEnchantments

/**
 * Select the attributes of the currently open character.
 */
export const selectDynamicAttributes = (state: RootState) =>
  selectCurrentCharacter(state)?.attributes

/**
 * Select the derived characteristics of the currently open character.
 */
export const selectDerivedCharacteristics = (state: RootState) =>
  selectCurrentCharacter(state)?.derivedCharacteristics ?? staticInitialState.derivedCharacteristics

/**
 * Select the purchased life points of the currently open character.
 */
export const selectPurchasedLifePoints = (state: RootState) =>
  selectCurrentCharacter(state)?.derivedCharacteristics.lifePoints.purchased ?? 0

/**
 * Select the permanently lost life points of the currently open character.
 */
export const selectLifePointsPermanentlyLost = (state: RootState) =>
  selectCurrentCharacter(state)?.derivedCharacteristics.lifePoints.permanentlyLost ?? 0

/**
 * Select the purchased arcane energy of the currently open character.
 */
export const selectPurchasedArcaneEnergy = (state: RootState) =>
  selectCurrentCharacter(state)?.derivedCharacteristics.arcaneEnergy.purchased ?? 0

/**
 * Select the permanently lost arcane energy of the currently open character.
 */
export const selectArcaneEnergyPermanentlyLost = (state: RootState) =>
  selectCurrentCharacter(state)?.derivedCharacteristics.arcaneEnergy.permanentlyLost ?? 0

/**
 * Select the bought back arcane energy of the currently open character.
 */
export const selectArcaneEnergyPermanentlyLostBoughtBack = (state: RootState) =>
  selectCurrentCharacter(state)?.derivedCharacteristics.arcaneEnergy.permanentlyLostBoughtBack ?? 0

/**
 * Select the purchased karma points of the currently open character.
 */
export const selectPurchasedKarmaPoints = (state: RootState) =>
  selectCurrentCharacter(state)?.derivedCharacteristics.karmaPoints.purchased ?? 0

/**
 * Select the permanently lost karma points of the currently open character.
 */
export const selectKarmaPointsPermanentlyLost = (state: RootState) =>
  selectCurrentCharacter(state)?.derivedCharacteristics.karmaPoints.permanentlyLost ?? 0

/**
 * Select the bought back karma points of the currently open character.
 */
export const selectKarmaPointsPermanentlyLostBoughtBack = (state: RootState) =>
  selectCurrentCharacter(state)?.derivedCharacteristics.karmaPoints.permanentlyLostBoughtBack ?? 0

/**
 * Select the skills of the currently open character.
 */
export const selectDynamicSkills = (state: RootState) => selectCurrentCharacter(state)?.skills

/**
 * Select the close combat techniques of the currently open character.
 */
export const selectDynamicCloseCombatTechniques = (state: RootState) =>
  selectCurrentCharacter(state)?.combatTechniques.close

/**
 * Select the ranged combat techniques of the currently open character.
 */
export const selectDynamicRangedCombatTechniques = (state: RootState) =>
  selectCurrentCharacter(state)?.combatTechniques.ranged

/**
 * Select the cantrips of the currently open character.
 */
export const selectDynamicCantrips = (state: RootState) => selectCurrentCharacter(state)?.cantrips

/**
 * Select the spells of the currently open character.
 */
export const selectDynamicSpells = (state: RootState) => selectCurrentCharacter(state)?.spells

/**
 * Select the rituals of the currently open character.
 */
export const selectDynamicRituals = (state: RootState) => selectCurrentCharacter(state)?.rituals

/**
 * Select the curses of the currently open character.
 */
export const selectDynamicCurses = (state: RootState) =>
  selectCurrentCharacter(state)?.magicalActions.curses

/**
 * Select the elven magical songs of the currently open character.
 */
export const selectDynamicElvenMagicalSongs = (state: RootState) =>
  selectCurrentCharacter(state)?.magicalActions.elvenMagicalSongs

/**
 * Select the domination rituals of the currently open character.
 */
export const selectDynamicDominationRituals = (state: RootState) =>
  selectCurrentCharacter(state)?.magicalActions.dominationRituals

/**
 * Select the magical dances of the currently open character.
 */
export const selectDynamicMagicalDances = (state: RootState) =>
  selectCurrentCharacter(state)?.magicalActions.magicalDances

/**
 * Select the magical melodies of the currently open character.
 */
export const selectDynamicMagicalMelodies = (state: RootState) =>
  selectCurrentCharacter(state)?.magicalActions.magicalMelodies

/**
 * Select the jester tricks of the currently open character.
 */
export const selectDynamicJesterTricks = (state: RootState) =>
  selectCurrentCharacter(state)?.magicalActions.jesterTricks

/**
 * Select the animist powers of the currently open character.
 */
export const selectDynamicAnimistPowers = (state: RootState) =>
  selectCurrentCharacter(state)?.magicalActions.animistPowers

/**
 * Select the geode rituals of the currently open character.
 */
export const selectDynamicGeodeRituals = (state: RootState) =>
  selectCurrentCharacter(state)?.magicalActions.geodeRituals

/**
 * Select the zibilja rituals of the currently open character.
 */
export const selectDynamicZibiljaRituals = (state: RootState) =>
  selectCurrentCharacter(state)?.magicalActions.zibiljaRituals

/**
 * Select the blessings of the currently open character.
 */
export const selectDynamicBlessings = (state: RootState) => selectCurrentCharacter(state)?.blessings

/**
 * Select the liturgical chants of the currently open character.
 */
export const selectDynamicLiturgicalChants = (state: RootState) =>
  selectCurrentCharacter(state)?.liturgicalChants

/**
 * Select the ceremonies of the currently open character.
 */
export const selectDynamicCeremonies = (state: RootState) =>
  selectCurrentCharacter(state)?.ceremonies

/**
 * Select the magical primary attribute dependencies of the currently open character.
 */
export const selectMagicalPrimaryAttributeDependencies = (state: RootState) =>
  selectCurrentCharacter(state)?.magicalPrimaryAttributeDependencies

/**
 * Select the blessed primary attribute dependencies of the currently open character.
 */
export const selectBlessedPrimaryAttributeDependencies = (state: RootState) =>
  selectCurrentCharacter(state)?.blessedPrimaryAttributeDependencies

/**
 * Select the pact of the currently open character, if any.
 */
export const selectPact = (state: RootState) => selectCurrentCharacter(state)?.pact

/**
 * Action to change the name of the currently open character.
 */
export const setName = createAction<string>("character/setName")

/**
 * Action to change the avatar of the currently open character.
 */
export const setAvatar = createAction<string>("character/setAvatar")

/**
 * Action to delete the avatar of the currently open character.
 */
export const deleteAvatar = createAction("character/deleteAvatar")

/**
 * Action to finish character creation for the currently open character.
 */
export const finishCharacterCreation = createAction("character/finishCharacterCreation")

const generalCharacterReducer = createImmerReducer((state: Draft<CharacterState>, action) => {
  if (setName.match(action)) {
    state.name = action.payload
  } else if (setAvatar.match(action)) {
    state.avatar = action.payload
  } else if (deleteAvatar.match(action)) {
    state.avatar = undefined
  } else if (finishCharacterCreation.match(action)) {
    state.isCharacterCreationFinished = true
  }
})

/**
 * The state reducer for a character.
 */
export const characterReducer = reduceReducers<
  Draft<CharacterState>,
  AnyAction,
  [database: DatabaseState]
>(
  generalCharacterReducer,
  attributesReducer,
  derivedCharacteristicsReducer,
  personalDataReducer,
  raceReducer,
  professionReducer,
  rulesReducer,
  advantagesReducer,
  disadvantagesReducer,
  skillsReducer,
  closeCombatTechniquesReducer,
  rangedCombatTechniquesReducer,
  cantripsReducer,
  spellsReducer,
  ritualsReducer,
  cursesReducer,
  elvenMagicalSongsReducer,
  dominationRitualsReducer,
  magicalDancesReducer,
  magicalMelodiesReducer,
  jesterTricksReducer,
  animistPowersReducer,
  geodeRitualsReducer,
  zibiljaRitualsReducer,
  blessingsReducer,
  liturgicalChantsReducer,
  ceremoniesReducer,
)
