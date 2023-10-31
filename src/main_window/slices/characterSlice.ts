import { AnyAction, createAction } from "@reduxjs/toolkit"
import { Draft } from "immer"
import { ActivatableMap } from "../../shared/domain/activatableEntry.ts"
import { RatedDependency } from "../../shared/domain/rated/ratedDependency.ts"
import {
  ActivatableRatedMap,
  ActivatableRatedWithEnhancementsMap,
  RatedMap,
} from "../../shared/domain/ratedEntry.ts"
import { Sex } from "../../shared/domain/sex.ts"
import { createImmerReducer, reduceReducers } from "../../shared/utils/redux.ts"
import { RootState } from "../store.ts"
import { attributesReducer } from "./attributesSlice.ts"
import { blessingsReducer } from "./blessingsSlice.ts"
import { cantripsReducer } from "./cantripsSlice.ts"
import { ceremoniesReducer } from "./ceremoniesSlice.ts"
import { closeCombatTechniquesReducer } from "./closeCombatTechniqueSlice.ts"
import { DatabaseState } from "./databaseSlice.ts"
import { derivedCharacteristicsReducer } from "./derivedCharacteristicsSlice.ts"
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

  magicalPrimaryAttributeDependencies: RatedDependency[]
  blessedPrimaryAttributeDependencies: RatedDependency[]

  // items: {}
  // hitZoneArmors: {}
  purse: Purse
  // creatures: {}
  // pact: {}
}

/**
 * An active focus rule instance.
 */
export type ActiveFocusRule = {
  /**
   * The focus rule identifier.
   */
  id: number
}

/**
 * An active optional rule instance.
 */
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

/**
 * A dependency on a social status.
 */
export type SocialStatusDependency = {
  id: number
}

/**
 * An eye or hair color selection.
 */
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

/**
 * Values related to spending and purchasing permanent energy points.
 */
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

/**
 * Values related to spending and purchasing permanent energy points with the
 * option to buy back permanently spent energy.
 */
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

/**
 * A simple set of activated activatable identifiers.
 */
export type TinyActivatableSet = number[]

/**
 * The money the character owns.
 */
export type Purse = {
  /**
   * The number of kreutzers the character owns.
   */
  kreutzers: number

  /**
   * The number of halers the character owns.
   */
  halers: number

  /**
   * The number of silverthalers the character owns.
   */
  silverthalers: number

  /**
   * The number of ducats the character owns.
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
  selectCurrentCharacter(state)?.rules.includePublications ?? []

/**
 * Select the active focus rules of the currently open character.
 */
export const selectActiveFocusRules = (state: RootState) =>
  selectCurrentCharacter(state)?.rules.activeFocusRules ?? {}

/**
 * Select the active optional rules of the currently open character.
 */
export const selectActiveOptionalRules = (state: RootState) =>
  selectCurrentCharacter(state)?.rules.activeOptionalRules ?? {}

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
export const selectAdvantages = (state: RootState) =>
  selectCurrentCharacter(state)?.advantages ?? {}

/**
 * Select the disadvantages of the currently open character.
 */
export const selectDisadvantages = (state: RootState) =>
  selectCurrentCharacter(state)?.disadvantages ?? {}

/**
 * Select the advanced combat special abilities of the currently open character.
 */
export const selectAdvancedCombatSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.advancedCombatSpecialAbilities ?? {}

/**
 * Select the advanced karma special abilities of the currently open character.
 */
export const selectAdvancedKarmaSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.advancedKarmaSpecialAbilities ?? {}

/**
 * Select the advanced magical special abilities of the currently open character.
 */
export const selectAdvancedMagicalSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.advancedMagicalSpecialAbilities ?? {}

/**
 * Select the advanced skill special abilities of the currently open character.
 */
export const selectAdvancedSkillSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.advancedSkillSpecialAbilities ?? {}

/**
 * Select the ancestor glyphs of the currently open character.
 */
export const selectAncestorGlyphs = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.ancestorGlyphs ?? {}

/**
 * Select the arcane orb enchantments of the currently open character.
 */
export const selectArcaneOrbEnchantments = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.arcaneOrbEnchantments ?? {}

/**
 * Select the attire enchantments of the currently open character.
 */
export const selectAttireEnchantments = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.attireEnchantments ?? {}

/**
 * Select the blessed traditions of the currently open character.
 */
export const selectBlessedTraditions = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.blessedTraditions ?? {}

/**
 * Select the bowl enchantments of the currently open character.
 */
export const selectBowlEnchantments = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.bowlEnchantments ?? {}

/**
 * Select the brawling special abilities of the currently open character.
 */
export const selectBrawlingSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.brawlingSpecialAbilities ?? {}

/**
 * Select the cauldron enchantments of the currently open character.
 */
export const selectCauldronEnchantments = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.cauldronEnchantments ?? {}

/**
 * Select the ceremonial item special abilities of the currently open character.
 */
export const selectCeremonialItemSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.ceremonialItemSpecialAbilities ?? {}

/**
 * Select the chronicle enchantments of the currently open character.
 */
export const selectChronicleEnchantments = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.chronicleEnchantments ?? {}

/**
 * Select the combat special abilities of the currently open character.
 */
export const selectCombatSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.combatSpecialAbilities ?? {}

/**
 * Select the combat style special abilities of the currently open character.
 */
export const selectCombatStyleSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.combatStyleSpecialAbilities ?? {}

/**
 * Select the command special abilities of the currently open character.
 */
export const selectCommandSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.commandSpecialAbilities ?? {}

/**
 * Select the dagger rituals of the currently open character.
 */
export const selectDaggerRituals = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.daggerRituals ?? {}

/**
 * Select the familiar special abilities of the currently open character.
 */
export const selectFamiliarSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.familiarSpecialAbilities ?? {}

/**
 * Select the fate point sex special abilities of the currently open character.
 */
export const selectFatePointSexSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.fatePointSexSpecialAbilities ?? {}

/**
 * Select the fate point special abilities of the currently open character.
 */
export const selectFatePointSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.fatePointSpecialAbilities ?? {}

/**
 * Select the fools hat enchantments of the currently open character.
 */
export const selectFoolsHatEnchantments = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.foolsHatEnchantments ?? {}

/**
 * Select the general special abilities of the currently open character.
 */
export const selectGeneralSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.generalSpecialAbilities ?? {}

/**
 * Select the instrument enchantments of the currently open character.
 */
export const selectInstrumentEnchantments = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.instrumentEnchantments ?? {}

/**
 * Select the karma special abilities of the currently open character.
 */
export const selectKarmaSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.karmaSpecialAbilities ?? {}

/**
 * Select the krallenkettenzauber of the currently open character.
 */
export const selectKrallenkettenzauber = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.krallenkettenzauber ?? {}

/**
 * Select the liturgical style special abilities of the currently open character.
 */
export const selectLiturgicalStyleSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.liturgicalStyleSpecialAbilities ?? {}

/**
 * Select the lycantropic gifts of the currently open character.
 */
export const selectLycantropicGifts = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.lycantropicGifts ?? {}

/**
 * Select the magical runes of the currently open character.
 */
export const selectMagicalRunes = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.magicalRunes ?? {}

/**
 * Select the magical special abilities of the currently open character.
 */
export const selectMagicalSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.magicalSpecialAbilities ?? {}

/**
 * Select the magical traditions of the currently open character.
 */
export const selectMagicalTraditions = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.magicalTraditions ?? {}

/**
 * Select the magic style special abilities of the currently open character.
 */
export const selectMagicStyleSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.magicStyleSpecialAbilities ?? {}

/**
 * Select the orb enchantments of the currently open character.
 */
export const selectOrbEnchantments = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.orbEnchantments ?? {}

/**
 * Select the pact gifts of the currently open character.
 */
export const selectPactGifts = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.pactGifts ?? {}

/**
 * Select the protective warding circle special abilities of the currently open character.
 */
export const selectProtectiveWardingCircleSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.protectiveWardingCircleSpecialAbilities ?? {}

/**
 * Select the ring enchantments of the currently open character.
 */
export const selectRingEnchantments = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.ringEnchantments ?? {}

/**
 * Select the sermons of the currently open character.
 */
export const selectSermons = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.sermons ?? {}

/**
 * Select the sex special abilities of the currently open character.
 */
export const selectSexSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.sexSpecialAbilities ?? {}

/**
 * Select the sickle rituals of the currently open character.
 */
export const selectSickleRituals = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.sickleRituals ?? {}

/**
 * Select the sikaryan drain special abilities of the currently open character.
 */
export const selectSikaryanDrainSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.sikaryanDrainSpecialAbilities ?? {}

/**
 * Select the skill style special abilities of the currently open character.
 */
export const selectSkillStyleSpecialAbilities = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.skillStyleSpecialAbilities ?? {}

/**
 * Select the spell sword enchantments of the currently open character.
 */
export const selectSpellSwordEnchantments = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.spellSwordEnchantments ?? {}

/**
 * Select the staff enchantments of the currently open character.
 */
export const selectStaffEnchantments = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.staffEnchantments ?? {}

/**
 * Select the toy enchantments of the currently open character.
 */
export const selectToyEnchantments = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.toyEnchantments ?? {}

/**
 * Select the Trinkhornzauber of the currently open character.
 */
export const selectTrinkhornzauber = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.trinkhornzauber ?? {}

/**
 * Select the vampiric gifts of the currently open character.
 */
export const selectVampiricGifts = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.vampiricGifts ?? {}

/**
 * Select the visions of the currently open character.
 */
export const selectVisions = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.visions ?? {}

/**
 * Select the wand enchantments of the currently open character.
 */
export const selectWandEnchantments = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.wandEnchantments ?? {}

/**
 * Select the weapon enchantments of the currently open character.
 */
export const selectWeaponEnchantments = (state: RootState) =>
  selectCurrentCharacter(state)?.specialAbilities.weaponEnchantments ?? {}

/**
 * Select the attributes of the currently open character.
 */
export const selectAttributes = (state: RootState) =>
  selectCurrentCharacter(state)?.attributes ?? {}

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
export const selectSkills = (state: RootState) => selectCurrentCharacter(state)?.skills ?? {}

/**
 * Select the close combat techniques of the currently open character.
 */
export const selectCloseCombatTechniques = (state: RootState) =>
  selectCurrentCharacter(state)?.combatTechniques.close ?? {}

/**
 * Select the ranged combat techniques of the currently open character.
 */
export const selectRangedCombatTechniques = (state: RootState) =>
  selectCurrentCharacter(state)?.combatTechniques.ranged ?? {}

/**
 * Select the cantrips of the currently open character.
 */
export const selectCantrips = (state: RootState) => selectCurrentCharacter(state)?.cantrips ?? []

/**
 * Select the spells of the currently open character.
 */
export const selectSpells = (state: RootState) => selectCurrentCharacter(state)?.spells ?? {}

/**
 * Select the rituals of the currently open character.
 */
export const selectRituals = (state: RootState) => selectCurrentCharacter(state)?.rituals ?? {}

/**
 * Select the curses of the currently open character.
 */
export const selectCurses = (state: RootState) =>
  selectCurrentCharacter(state)?.magicalActions.curses ?? {}

/**
 * Select the elven magical songs of the currently open character.
 */
export const selectElvenMagicalSongs = (state: RootState) =>
  selectCurrentCharacter(state)?.magicalActions.elvenMagicalSongs ?? {}

/**
 * Select the domination rituals of the currently open character.
 */
export const selectDominationRituals = (state: RootState) =>
  selectCurrentCharacter(state)?.magicalActions.dominationRituals ?? {}

/**
 * Select the magical dances of the currently open character.
 */
export const selectMagicalDances = (state: RootState) =>
  selectCurrentCharacter(state)?.magicalActions.magicalDances ?? {}

/**
 * Select the magical melodies of the currently open character.
 */
export const selectMagicalMelodies = (state: RootState) =>
  selectCurrentCharacter(state)?.magicalActions.magicalMelodies ?? {}

/**
 * Select the jester tricks of the currently open character.
 */
export const selectJesterTricks = (state: RootState) =>
  selectCurrentCharacter(state)?.magicalActions.jesterTricks ?? {}

/**
 * Select the animist powers of the currently open character.
 */
export const selectAnimistPowers = (state: RootState) =>
  selectCurrentCharacter(state)?.magicalActions.animistPowers ?? {}

/**
 * Select the geode rituals of the currently open character.
 */
export const selectGeodeRituals = (state: RootState) =>
  selectCurrentCharacter(state)?.magicalActions.geodeRituals ?? {}

/**
 * Select the zibilja rituals of the currently open character.
 */
export const selectZibiljaRituals = (state: RootState) =>
  selectCurrentCharacter(state)?.magicalActions.zibiljaRituals ?? {}

/**
 * Select the blessings of the currently open character.
 */
export const selectBlessings = (state: RootState) => selectCurrentCharacter(state)?.blessings ?? []

/**
 * Select the liturgical chants of the currently open character.
 */
export const selectLiturgicalChants = (state: RootState) =>
  selectCurrentCharacter(state)?.liturgicalChants ?? {}

/**
 * Select the ceremonies of the currently open character.
 */
export const selectCeremonies = (state: RootState) =>
  selectCurrentCharacter(state)?.ceremonies ?? {}

/**
 * Select the magical primary attribute dependencies of the currently open character.
 */
export const selectMagicalPrimaryAttributeDependencies = (state: RootState) =>
  selectCurrentCharacter(state)?.magicalPrimaryAttributeDependencies ?? []

/**
 * Select the blessed primary attribute dependencies of the currently open character.
 */
export const selectBlessedPrimaryAttributeDependencies = (state: RootState) =>
  selectCurrentCharacter(state)?.blessedPrimaryAttributeDependencies ?? []

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
