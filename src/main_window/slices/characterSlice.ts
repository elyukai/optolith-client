import { AnyAction, createAction } from "@reduxjs/toolkit"
import { Draft } from "immer"
import { ActivatableMap } from "../../shared/domain/activatableEntry.ts"
import {
  ActivatableRatedMap,
  ActivatableRatedWithEnhancementsMap,
  Dependency,
  RatedMap,
} from "../../shared/domain/ratedEntry.ts"
import { Sex } from "../../shared/domain/sex.ts"
import { createImmerReducer, reduceReducers } from "../../shared/utils/redux.ts"
import { RootState } from "../store.ts"
import { attributesReducer } from "./attributesSlice.ts"
import { closeCombatTechniquesReducer } from "./closeCombatTechniqueSlice.ts"
import { DatabaseState } from "./databaseSlice.ts"
import { derivedCharacteristicsReducer } from "./derivedCharacteristicsSlice.ts"
import { personalDataReducer } from "./personalDataSlice.ts"
import { professionReducer } from "./professionSlice.ts"
import { raceReducer } from "./raceSlice.ts"
import { rangedCombatTechniquesReducer } from "./rangedCombatTechniqueSlice.ts"
import { rulesReducer } from "./rulesSlice.ts"
import { skillsReducer } from "./skillsSlice.ts"

export type CharacterState = {
  id: string

  /**
   * A valid semantic version (https://semver.org), representing the Optolith version this character was created with.
   */
  version: string | undefined

  /**
   * The character's name.
   */
  name: string

  /**
   * The character's avatar. This is a base64 encoded image.
   */
  avatar?: string

  /**
   * Date of character creation, in ISO8601 format.
   */
  dateCreated: string

  /**
   * Date of character last modified, in ISO8601 format.
   */
  dateLastModified: string

  /**
   * Total adventure points.
   */
  totalAdventurePoints: number

  /**
   * The start experience level identifier.
   */
  experienceLevelStartId: number

  /**
   * Describes whether the character creation is finished.
   */
  isCharacterCreationFinished: boolean

  /**
   * An object storing the identifiers of the race and its optional race variant.
   */
  race: {
    /**
     * The base race identifier.
     */
    id: number

    /**
     * The race variant identifier.
     */
    variantId?: number

    /**
     * The identifier of the attribute adjustment that has been selected from the race.
     */
    selectedAttributeAdjustmentId: number
  }

  /**
   * An object storing the identifier of the culture and if the cultural package has been applied.
   */
  culture: {
    /**
     * The culture identifier.
     */
    id: number

    /**
     * Describes whether the cultural package has been applied when creating the character.
     */
    isCulturalPackageApplied: boolean
  }

  /**
   * An object storing the identifiers of the profession, its instance and its optional profession variant.
   */
  profession: {
    /**
     * The base profession identifier.
     */
    id: number

    /**
     * The profession instance identifier. Profession instances are versions of the same profession but slightly different values, such as in extension rule books existing professions might get an additional style special ability.
     */
    instanceId: number

    /**
     * The profession variant identifier.
     */
    variantId?: number

    /**
     * A custom name for the profession, if provided.
     */
    customName?: string
  }

  /**
   * An object storing the identifiers of the profession, its instance and its optional race variant.
   */
  curriculum?: {
    /**
     * The educational institution's curriculum identifier.
     */
    educationalInstitutionId: number

    /**
     * The lesson package identifier.
     */
    lessonPackageId?: number
  }

  /**
   * The rules settings for the character.
   */
  rules: {
    /**
     * Whether the character makes use of all publications except for publications with adult content, which have to be specified explicitly using `include_publications`.
     */
    includeAllPublications: boolean

    /**
     * Explicitly used publications. If `include_all_publications` is set to `true`, only affects publications that are not covered by `include_all_publications`.
     */
    includePublications: number[]

    /**
     * Active focus rules.
     */
    activeFocusRules: {
      [id: number]: ActiveFocusRule
    }

    /**
     * Active optional rules.
     */
    activeOptionalRules: {
      [id: number]: ActiveOptionalRule
    }
  }

  /**
   * Personal data such as hair color and place of birth.
   */
  personalData: {
    /**
     * The character's sex. It does not have to be binary, although it always must be specified how to handle it in the context of binary sex prerequisites. You can also provide a custom sex with a custom name.
     */
    sex: Sex

    /**
     * The family names and/or family members.
     */
    family?: string

    /**
     * The place where the character was born.
     */
    placeOfBirth?: string

    /**
     * The date when the character was born.
     */
    dateOfBirth?: string

    /**
     * The age of the character.
     */
    age?: string

    /**
     * The hair color of the character.
     */
    hairColor?: Color

    /**
     * The eye color of the character.
     */
    eyeColor?: Color

    /**
     * The size of the character.
     */
    size?: string

    /**
     * The weight of the character.
     */
    weight?: string

    /**
     * The character's title(s).
     */
    title?: string

    socialStatus: {
      /**
       * The social status identifier.
       */
      id?: number

      /**
       * The social status dependencies.
       */
      dependencies: SocialStatusDependency[]
    }

    /**
     * The character's characteristics.
     */
    characteristics?: string

    /**
     * Other information about the character.
     */
    otherInfo?: string
  }

  advantages: ActivatableMap
  disadvantages: ActivatableMap

  /**
   * Lists of active special abilities, by group.
   */
  specialAbilities: {
    advancedCombatSpecialAbilities: ActivatableMap
    advancedKarmaSpecialAbilities: ActivatableMap
    advancedMagicalSpecialAbilities: ActivatableMap
    advancedSkillSpecialAbilities: ActivatableMap
    ancestorGlyphs: ActivatableMap
    arcaneOrbEnchantments: ActivatableMap
    attireEnchantments: ActivatableMap
    blessedTraditions: ActivatableMap
    bowlEnchantments: ActivatableMap
    brawlingSpecialAbilities: ActivatableMap
    cauldronEnchantments: ActivatableMap
    ceremonialItemSpecialAbilities: ActivatableMap
    chronicleEnchantments: ActivatableMap
    combatSpecialAbilities: ActivatableMap
    combatStyleSpecialAbilities: ActivatableMap
    commandSpecialAbilities: ActivatableMap
    daggerRituals: ActivatableMap
    familiarSpecialAbilities: ActivatableMap
    fatePointSexSpecialAbilities: ActivatableMap
    fatePointSpecialAbilities: ActivatableMap
    foolsHatEnchantments: ActivatableMap
    generalSpecialAbilities: ActivatableMap
    instrumentEnchantments: ActivatableMap
    karmaSpecialAbilities: ActivatableMap
    krallenkettenzauber: ActivatableMap
    liturgicalStyleSpecialAbilities: ActivatableMap
    lycantropicGifts: ActivatableMap
    magicalRunes: ActivatableMap
    magicalSpecialAbilities: ActivatableMap
    magicalTraditions: ActivatableMap
    magicStyleSpecialAbilities: ActivatableMap
    orbEnchantments: ActivatableMap
    pactGifts: ActivatableMap
    protectiveWardingCircleSpecialAbilities: ActivatableMap
    ringEnchantments: ActivatableMap
    sermons: ActivatableMap
    sexSpecialAbilities: ActivatableMap
    sickleRituals: ActivatableMap
    sikaryanDrainSpecialAbilities: ActivatableMap
    skillStyleSpecialAbilities: ActivatableMap
    spellSwordEnchantments: ActivatableMap
    staffEnchantments: ActivatableMap
    toyEnchantments: ActivatableMap
    trinkhornzauber: ActivatableMap
    vampiricGifts: ActivatableMap
    visions: ActivatableMap
    wandEnchantments: ActivatableMap
    weaponEnchantments: ActivatableMap
  }

  attributes: RatedMap

  derivedCharacteristics: {
    lifePoints: Energy
    arcaneEnergy: EnergyWithBuyBack
    karmaPoints: EnergyWithBuyBack
  }

  skills: RatedMap

  combatTechniques: {
    close: RatedMap
    ranged: RatedMap
  }

  cantrips: TinyActivatableSet
  spells: ActivatableRatedWithEnhancementsMap
  rituals: ActivatableRatedWithEnhancementsMap

  magicalActions: {
    curses: ActivatableRatedMap
    elvenMagicalSongs: ActivatableRatedMap
    dominationRituals: ActivatableRatedMap
    magicalDances: ActivatableRatedMap
    magicalMelodies: ActivatableRatedMap
    jesterTricks: ActivatableRatedMap
    animistPowers: ActivatableRatedMap
    geodeRituals: ActivatableRatedMap
    zibiljaRituals: ActivatableRatedMap
  }

  blessings: TinyActivatableSet
  liturgicalChants: ActivatableRatedWithEnhancementsMap
  ceremonies: ActivatableRatedWithEnhancementsMap

  magicalPrimaryAttributeDependencies: Dependency[]
  blessedPrimaryAttributeDependencies: Dependency[]

  // items: {}
  // hitZoneArmors: {}
  purse: Purse
  // creatures: {}
  // pact: {}
}

export type ActiveFocusRule = {
  /**
   * The focus rule identifier.
   */
  id: number
}

export type ActiveOptionalRule = {
  /**
   * The optional rule identifier.
   */
  id: number

  /**
   * An array of one or more options. The exact meaning of each option varies based on the optional rule.
   */
  options?: number[]
}

export type SocialStatusDependency = {
  id: number
}

export type Color = PredefinedColor | CustomColor

/**
 * A predefined color.
 */
export type PredefinedColor = {
  type: "Predefined"

  /**
   * The color identifier.
   */
  id: number
}

/**
 * A custom color.
 */
export type CustomColor = {
  type: "Custom"

  /**
   * The custom color name.
   */
  name: string
}

export type Energy = {
  /**
   * The number of points purchased.
   */
  purchased: number

  /**
   * The number of points permanently lost.
   */
  permanentlyLost: number
}

export type EnergyWithBuyBack = {
  /**
   * The number of points purchased.
   */
  purchased: number

  /**
   * The number of points permanently lost.
   */
  permanentlyLost: number

  /**
   * The number of permanently lost points that have been bought back.
   */
  permanentlyLostBoughtBack: number
}

export type TinyActivatableSet = number[]

/**
 * The money the character owns.
 * @title Purse
 */
export type Purse = {
  /**
   * The number of kreutzers the character owns.
   * @minimum 0
   * @integer
   */
  kreutzers: number

  /**
   * The number of halers the character owns.
   * @minimum 0
   * @integer
   */
  halers: number

  /**
   * The number of silverthalers the character owns.
   * @minimum 0
   * @integer
   */
  silverthalers: number

  /**
   * The number of ducats the character owns.
   * @minimum 0
   * @integer
   */
  ducats: number
}

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
    includeAllPublications: false,
    includePublications: [],
    activeFocusRules: {},
    activeOptionalRules: {},
  },
  personalData: {
    sex: { type: "Male" },
    socialStatus: {
      dependencies: [],
    },
  },
  advantages: {},
  disadvantages: {},
  specialAbilities: {
    advancedCombatSpecialAbilities: {},
    advancedKarmaSpecialAbilities: {},
    advancedMagicalSpecialAbilities: {},
    advancedSkillSpecialAbilities: {},
    ancestorGlyphs: {},
    arcaneOrbEnchantments: {},
    attireEnchantments: {},
    blessedTraditions: {},
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
    magicalSpecialAbilities: {},
    magicalTraditions: {},
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
  attributes: {},
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
  cantrips: [],
  spells: {},
  rituals: {},
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
  blessings: [],
  liturgicalChants: {},
  ceremonies: {},
  magicalPrimaryAttributeDependencies: [],
  blessedPrimaryAttributeDependencies: [],
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

const initialState = (): CharacterState => ({
  ...staticInitialState,
  dateCreated: new Date().toISOString(),
  dateLastModified: new Date().toISOString(),
})

export { initialState as initialCharacterState }

export const selectCurrentCharacter = (state: RootState): CharacterState | undefined => {
  const selectedId = state.route.path[0] === "characters" ? state.route.path[1] : undefined

  return selectedId === undefined ? undefined : state.characters[selectedId]
}

export const selectName = (state: RootState) => selectCurrentCharacter(state)?.name
export const selectAvatar = (state: RootState) => selectCurrentCharacter(state)?.avatar
export const selectTotalAdventurePoints = (state: RootState) =>
  selectCurrentCharacter(state)?.totalAdventurePoints
export const selectExperienceLevelStartId = (state: RootState) =>
  selectCurrentCharacter(state)?.experienceLevelStartId
export const selectIsCharacterCreationFinished = (state: RootState) =>
  selectCurrentCharacter(state)?.isCharacterCreationFinished ?? false
export const selectRaceId = (state: RootState) => selectCurrentCharacter(state)?.race.id
export const selectRaceVariantId = (state: RootState) =>
  selectCurrentCharacter(state)?.race.variantId
export const selectAttributeAdjustmentId = (state: RootState) =>
  selectCurrentCharacter(state)?.race.selectedAttributeAdjustmentId
export const selectCultureId = (state: RootState) => selectCurrentCharacter(state)?.culture.id
export const selectProfessionId = (state: RootState) => selectCurrentCharacter(state)?.profession.id
export const selectProfessionInstanceId = (state: RootState) =>
  selectCurrentCharacter(state)?.profession.instanceId
export const selectProfessionVariantId = (state: RootState) =>
  selectCurrentCharacter(state)?.profession.variantId
export const selectCustomProfessionName = (state: RootState) =>
  selectCurrentCharacter(state)?.profession.customName
export const selectIncludeAllPublications = (state: RootState) =>
  selectCurrentCharacter(state)?.rules.includeAllPublications
export const selectIncludePublications = (state: RootState) =>
  selectCurrentCharacter(state)?.rules.includePublications
export const selectActiveFocusRules = (state: RootState) =>
  selectCurrentCharacter(state)?.rules.activeFocusRules ?? {}
export const selectActiveOptionalRules = (state: RootState) =>
  selectCurrentCharacter(state)?.rules.activeOptionalRules ?? {}
export const selectPersonalData = (state: RootState): CharacterState["personalData"] =>
  selectCurrentCharacter(state)?.personalData ?? staticInitialState.personalData
export const selectSex = (state: RootState) => selectPersonalData(state).sex
export const selectFamily = (state: RootState) => selectPersonalData(state).family
export const selectPlaceOfBirth = (state: RootState) => selectPersonalData(state).placeOfBirth
export const selectDateOfBirth = (state: RootState) => selectPersonalData(state).dateOfBirth
export const selectAge = (state: RootState) => selectPersonalData(state).age
export const selectHairColor = (state: RootState) => selectPersonalData(state).hairColor
export const selectPredefinedHairColor = (state: RootState) => {
  const hairColor = selectHairColor(state)
  return hairColor?.type === "Predefined" ? hairColor.id : undefined
}
export const selectEyeColor = (state: RootState) => selectPersonalData(state).eyeColor
export const selectPredefinedEyeColor = (state: RootState) => {
  const eyeColor = selectEyeColor(state)
  return eyeColor?.type === "Predefined" ? eyeColor.id : undefined
}
export const selectSize = (state: RootState) => selectPersonalData(state).size
export const selectWeight = (state: RootState) => selectPersonalData(state).weight
export const selectTitle = (state: RootState) => selectPersonalData(state).title
export const selectSocialStatusId = (state: RootState) => selectPersonalData(state).socialStatus.id
export const selectSocialStatusDependencies = (state: RootState) =>
  selectPersonalData(state).socialStatus.dependencies
export const selectCharacteristics = (state: RootState) => selectPersonalData(state).characteristics
export const selectOtherInfo = (state: RootState) => selectPersonalData(state).otherInfo
export const selectAdvantages = (state: RootState) =>
  selectCurrentCharacter(state)?.advantages ?? {}
export const selectDisadvantages = (state: RootState) =>
  selectCurrentCharacter(state)?.disadvantages ?? {}
export const selectAdvancedCombatSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.advancedCombatSpecialAbilities ?? {}
export const selectAdvancedKarmaSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.advancedKarmaSpecialAbilities ?? {}
export const selectAdvancedMagicalSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.advancedMagicalSpecialAbilities ?? {}
export const selectAdvancedSkillSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.advancedSkillSpecialAbilities ?? {}
export const selectAncestorGlyphs = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.ancestorGlyphs ?? {}
export const selectArcaneOrbEnchantments = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.arcaneOrbEnchantments ?? {}
export const selectAttireEnchantments = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.attireEnchantments ?? {}
export const selectBlessedTraditions = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.blessedTraditions ?? {}
export const selectBowlEnchantments = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.bowlEnchantments ?? {}
export const selectBrawlingSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.brawlingSpecialAbilities ?? {}
export const selectCauldronEnchantments = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.cauldronEnchantments ?? {}
export const selectCeremonialItemSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.ceremonialItemSpecialAbilities ?? {}
export const selectChronicleEnchantments = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.chronicleEnchantments ?? {}
export const selectCombatSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.combatSpecialAbilities ?? {}
export const selectCombatStyleSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.combatStyleSpecialAbilities ?? {}
export const selectCommandSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.commandSpecialAbilities ?? {}
export const selectDaggerRituals = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.daggerRituals ?? {}
export const selectFamiliarSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.familiarSpecialAbilities ?? {}
export const selectFatePointSexSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.fatePointSexSpecialAbilities ?? {}
export const selectFatePointSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.fatePointSpecialAbilities ?? {}
export const selectFoolsHatEnchantments = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.foolsHatEnchantments ?? {}
export const selectGeneralSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.generalSpecialAbilities ?? {}
export const selectInstrumentEnchantments = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.instrumentEnchantments ?? {}
export const selectKarmaSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.karmaSpecialAbilities ?? {}
export const selectKrallenkettenzauber = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.krallenkettenzauber ?? {}
export const selectLiturgicalStyleSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.liturgicalStyleSpecialAbilities ?? {}
export const selectLycantropicGifts = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.lycantropicGifts ?? {}
export const selectMagicalRunes = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.magicalRunes ?? {}
export const selectMagicalSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.magicalSpecialAbilities ?? {}
export const selectMagicalTraditions = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.magicalTraditions ?? {}
export const selectMagicStyleSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.magicStyleSpecialAbilities ?? {}
export const selectOrbEnchantments = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.orbEnchantments ?? {}
export const selectPactGifts = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.pactGifts ?? {}
export const selectProtectiveWardingCircleSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.protectiveWardingCircleSpecialAbilities ?? {}
export const selectRingEnchantments = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.ringEnchantments ?? {}
export const selectSermons = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.sermons ?? {}
export const selectSexSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.sexSpecialAbilities ?? {}
export const selectSickleRituals = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.sickleRituals ?? {}
export const selectSikaryanDrainSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.sikaryanDrainSpecialAbilities ?? {}
export const selectSkillStyleSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.skillStyleSpecialAbilities ?? {}
export const selectSpellSwordEnchantments = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.spellSwordEnchantments ?? {}
export const selectStaffEnchantments = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.staffEnchantments ?? {}
export const selectToyEnchantments = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.toyEnchantments ?? {}
export const selectTrinkhornzauber = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.trinkhornzauber ?? {}
export const selectVampiricGifts = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.vampiricGifts ?? {}
export const selectVisions = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.visions ?? {}
export const selectWandEnchantments = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.wandEnchantments ?? {}
export const selectWeaponEnchantments = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.weaponEnchantments ?? {}
export const selectAttributes = (state: RootState) =>
  selectCurrentCharacter(state)?.attributes ?? {}
export const selectDerivedCharacteristics = (state: RootState) =>
  selectCurrentCharacter(state)?.derivedCharacteristics ?? staticInitialState.derivedCharacteristics
export const selectPurchasedLifePoints = (state: RootState) =>
  selectCurrentCharacter(state)?.derivedCharacteristics.lifePoints.purchased ?? 0
export const selectLifePointsPermanentlyLost = (state: RootState) =>
  selectCurrentCharacter(state)?.derivedCharacteristics.lifePoints.permanentlyLost ?? 0
export const selectPurchasedArcaneEnergy = (state: RootState) =>
  selectCurrentCharacter(state)?.derivedCharacteristics.arcaneEnergy.purchased ?? 0
export const selectArcaneEnergyPermanentlyLost = (state: RootState) =>
  selectCurrentCharacter(state)?.derivedCharacteristics.arcaneEnergy.permanentlyLost ?? 0
export const selectArcaneEnergyPermanentlyLostBoughtBack = (state: RootState) =>
  selectCurrentCharacter(state)?.derivedCharacteristics.arcaneEnergy.permanentlyLostBoughtBack ?? 0
export const selectPurchasedKarmaPoints = (state: RootState) =>
  selectCurrentCharacter(state)?.derivedCharacteristics.karmaPoints.purchased ?? 0
export const selectKarmaPointsPermanentlyLost = (state: RootState) =>
  selectCurrentCharacter(state)?.derivedCharacteristics.karmaPoints.permanentlyLost ?? 0
export const selectKarmaPointsPermanentlyLostBoughtBack = (state: RootState) =>
  selectCurrentCharacter(state)?.derivedCharacteristics.karmaPoints.permanentlyLostBoughtBack ?? 0
export const selectSkills = (state: RootState) => selectCurrentCharacter(state)?.skills ?? {}
export const selectCloseCombatTechniques = (state: RootState) =>
  selectCurrentCharacter(state)?.combatTechniques.close ?? {}
export const selectRangedCombatTechniques = (state: RootState) =>
  selectCurrentCharacter(state)?.combatTechniques.ranged ?? {}
export const selectCantrips = (state: RootState) => selectCurrentCharacter(state)?.cantrips ?? []
export const selectSpells = (state: RootState) => selectCurrentCharacter(state)?.spells ?? {}
export const selectRituals = (state: RootState) => selectCurrentCharacter(state)?.rituals ?? {}
export const selectCurses = (state: RootState) =>
  selectCurrentCharacter(state)?.magicalActions.curses ?? {}
export const selectElvenMagicalSongs = (state: RootState) =>
  selectCurrentCharacter(state)?.magicalActions.elvenMagicalSongs ?? {}
export const selectDominationRituals = (state: RootState) =>
  selectCurrentCharacter(state)?.magicalActions.dominationRituals ?? {}
export const selectMagicalDances = (state: RootState) =>
  selectCurrentCharacter(state)?.magicalActions.magicalDances ?? {}
export const selectMagicalMelodies = (state: RootState) =>
  selectCurrentCharacter(state)?.magicalActions.magicalMelodies ?? {}
export const selectJesterTricks = (state: RootState) =>
  selectCurrentCharacter(state)?.magicalActions.jesterTricks ?? {}
export const selectAnimistPowers = (state: RootState) =>
  selectCurrentCharacter(state)?.magicalActions.animistPowers ?? {}
export const selectGeodeRituals = (state: RootState) =>
  selectCurrentCharacter(state)?.magicalActions.geodeRituals ?? {}
export const selectZibiljaRituals = (state: RootState) =>
  selectCurrentCharacter(state)?.magicalActions.zibiljaRituals ?? {}
export const selectBlessings = (state: RootState) => selectCurrentCharacter(state)?.blessings ?? []
export const selectLiturgicalChants = (state: RootState) =>
  selectCurrentCharacter(state)?.liturgicalChants ?? {}
export const selectCeremonies = (state: RootState) =>
  selectCurrentCharacter(state)?.ceremonies ?? {}
export const selectMagicalPrimaryAttributeDependencies = (state: RootState) =>
  selectCurrentCharacter(state)?.magicalPrimaryAttributeDependencies ?? []
export const selectBlessedPrimaryAttributeDependencies = (state: RootState) =>
  selectCurrentCharacter(state)?.blessedPrimaryAttributeDependencies ?? []

export const setName = createAction<string>("character/setName")
export const setAvatar = createAction<string>("character/setAvatar")
export const deleteAvatar = createAction("character/deleteAvatar")
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
  skillsReducer,
  closeCombatTechniquesReducer,
  rangedCombatTechniquesReducer,
)
