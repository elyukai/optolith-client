/* eslint-disable max-len */
import { createReducer } from "@reduxjs/toolkit"
import { ActivatableRated, ActivatableRatedWithEnhancements, Rated } from "../../shared/domain/ratedEntry.ts"
import { RootState } from "../store.ts"
import { attributesReducer } from "./attributesSlice.ts"
import { derivedCharacteristicsReducer } from "./derivedCharacteristicsSlice.ts"

export type CharacterState = {
  /**
   * A valid semantic version (https://semver.org), representing the Optolith version this character was created with.
   */
  version: string | undefined

  /**
   * The character's name.
   */
  name: string

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

    /**
     * The social status identifier.
     */
    socialStatusId?: number

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

/**
 * The character's sex. It does not have to be binary, although it always must be specified how to handle it in the context of binary sex prerequisites. You can also provide a custom sex with a custom name.
 */
export type Sex =
  | BinarySex
  | NonBinarySex
  | CustomSex

/**
 * A binary sex option.
 */
export type BinarySex = {
  type: "Male" | "Female"
}

/**
 * A non-binary sex option.
 */
export type NonBinarySex ={
  type: "BalThani" | "Tsajana"

  /**
   * Defines how a non-binary sex should be treated when checking prerequisites.
   */
  binaryHandling: BinaryHandling
}

/**
 * A custom non-binary sex option.
 */
export type CustomSex = {
  type: "Custom"

  /**
   * The custom sex name.
   */
  name: string

  /**
   * Defines how a non-binary sex should be treated when checking prerequisites.
   */
  binaryHandling: BinaryHandling
}

/**
 * Defines how a non-binary sex should be treated when checking prerequisites.
 */
export type BinaryHandling = {
  /**
   * Defines if the sex should be treated as male when checking prerequisites.
   */
  asMale: boolean

  /**
   * Defines if the sex should be treated as female when checking prerequisites.
   */
  asFemale: boolean
}

export type Color =
  | PredefinedColor
  | CustomColor

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

export type RatedMap = {
  [id: number]: Rated
}

export type ActivatableRatedMap = {
  [id: number]: ActivatableRated
}

export type ActivatableRatedWithEnhancementsMap = {
  [id: number]: ActivatableRatedWithEnhancements
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

export type Activatable = {
  /**
   * The activatable identifier.
   * @integer
   */
  id: number

  /**
   * One or multiple activations of the activatable.
   */
  instances: {
    /**
     * One or multiple options for the activatable. The meaning depends on the activatable.
     * @minItems 1
     */
    options?: (
      | {
        type: "Predefined"

        /**
         * An identifier referencing a different entry.
         */
        id: {
          /**
           * The entry type or `"Generic"` if it references a select option local to the entry.
           */
          type:
            | "Generic"
            | "Blessing"
            | "Cantrip"
            | "TradeSecret"
            | "Script"
            | "AnimalShape"
            | "ArcaneBardTradition"
            | "ArcaneDancerTradition"
            | "SexPractice"
            | "Race"
            | "Culture"
            | "BlessedTradition"
            | "Element"
            | "Property"
            | "Aspect"
            | "Disease"
            | "Poison"
            | "Language"
            | "Skill"
            | "MeleeCombatTechnique"
            | "RangedCombatTechnique"
            | "LiturgicalChant"
            | "Ceremony"
            | "Spell"
            | "Ritual"

          /**
           * The numeric identifier.
           */
          value: number
        }
      }
      | {
        type: "Custom"

        /**
         * A user-entered text.
         */
        value: string
      }
    )[]

    /**
     * The instance level (if the activatable has levels).
     */
    level?: number

    /**
     * If provided, a custom adventure points value has been set for this instance.
     */
    customAdventurePointsValue?: number
  }[]
}

export type ActivatableMap = {
  [id: number]: Activatable
}

const initialState = (): CharacterState => ({
  version: undefined,
  name: "",
  dateCreated: new Date().toISOString(),
  dateLastModified: new Date().toISOString(),
  totalAdventurePoints: 1100,
  experienceLevelStartId: 3,
  isCharacterCreationFinished: false,
  race: {
    id: 1,
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
    activeFocusRules: [],
    activeOptionalRules: [],
  },
  personalData: {
    sex: { type: "Male" },
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
})

export const selectCurrentCharacter = (state: RootState) =>
  state.characters.selectedId === undefined
  ? undefined
  : state.characters.characters[state.characters.selectedId]

export const selectTotalAdventurePoints = (state: RootState) => selectCurrentCharacter(state)?.totalAdventurePoints
export const selectExperienceLevelStartId = (state: RootState) => selectCurrentCharacter(state)?.experienceLevelStartId
export const selectIsCharacterCreationFinished = (state: RootState) => selectCurrentCharacter(state)?.isCharacterCreationFinished ?? false
export const selectRaceId = (state: RootState) => selectCurrentCharacter(state)?.race.id
export const selectRaceVariantId = (state: RootState) => selectCurrentCharacter(state)?.race.variantId
export const selectAttributeAdjustmentId = (state: RootState) => selectCurrentCharacter(state)?.race.selectedAttributeAdjustmentId
export const selectActiveFocusRules = (state: RootState) => selectCurrentCharacter(state)?.rules.activeFocusRules ?? {}
export const selectActiveOptionalRules = (state: RootState) => selectCurrentCharacter(state)?.rules.activeOptionalRules ?? {}
export const selectAdvantages = (state: RootState) => selectCurrentCharacter(state)?.advantages ?? {}
export const selectDisadvantages = (state: RootState) => selectCurrentCharacter(state)?.disadvantages ?? {}
export const selectAdvancedCombatSpecialAbilities = (state: RootState) => selectCurrentCharacter(state)?.specialAbilities.advancedCombatSpecialAbilities ?? {}
export const selectAdvancedKarmaSpecialAbilities = (state: RootState) => selectCurrentCharacter(state)?.specialAbilities.advancedKarmaSpecialAbilities ?? {}
export const selectAdvancedMagicalSpecialAbilities = (state: RootState) => selectCurrentCharacter(state)?.specialAbilities.advancedMagicalSpecialAbilities ?? {}
export const selectAdvancedSkillSpecialAbilities = (state: RootState) => selectCurrentCharacter(state)?.specialAbilities.advancedSkillSpecialAbilities ?? {}
export const selectAncestorGlyphs = (state: RootState) => selectCurrentCharacter(state)?.specialAbilities.ancestorGlyphs ?? {}
export const selectArcaneOrbEnchantments = (state: RootState) => selectCurrentCharacter(state)?.specialAbilities.arcaneOrbEnchantments ?? {}
export const selectAttireEnchantments = (state: RootState) => selectCurrentCharacter(state)?.specialAbilities.attireEnchantments ?? {}
export const selectBlessedTraditions = (state: RootState) => selectCurrentCharacter(state)?.specialAbilities.blessedTraditions ?? {}
export const selectBowlEnchantments = (state: RootState) => selectCurrentCharacter(state)?.specialAbilities.bowlEnchantments ?? {}
export const selectBrawlingSpecialAbilities = (state: RootState) => selectCurrentCharacter(state)?.specialAbilities.brawlingSpecialAbilities ?? {}
export const selectCauldronEnchantments = (state: RootState) => selectCurrentCharacter(state)?.specialAbilities.cauldronEnchantments ?? {}
export const selectCeremonialItemSpecialAbilities = (state: RootState) => selectCurrentCharacter(state)?.specialAbilities.ceremonialItemSpecialAbilities ?? {}
export const selectChronicleEnchantments = (state: RootState) => selectCurrentCharacter(state)?.specialAbilities.chronicleEnchantments ?? {}
export const selectCombatSpecialAbilities = (state: RootState) => selectCurrentCharacter(state)?.specialAbilities.combatSpecialAbilities ?? {}
export const selectCombatStyleSpecialAbilities = (state: RootState) => selectCurrentCharacter(state)?.specialAbilities.combatStyleSpecialAbilities ?? {}
export const selectCommandSpecialAbilities = (state: RootState) => selectCurrentCharacter(state)?.specialAbilities.commandSpecialAbilities ?? {}
export const selectDaggerRituals = (state: RootState) => selectCurrentCharacter(state)?.specialAbilities.daggerRituals ?? {}
export const selectFamiliarSpecialAbilities = (state: RootState) => selectCurrentCharacter(state)?.specialAbilities.familiarSpecialAbilities ?? {}
export const selectFatePointSexSpecialAbilities = (state: RootState) => selectCurrentCharacter(state)?.specialAbilities.fatePointSexSpecialAbilities ?? {}
export const selectFatePointSpecialAbilities = (state: RootState) => selectCurrentCharacter(state)?.specialAbilities.fatePointSpecialAbilities ?? {}
export const selectFoolsHatEnchantments = (state: RootState) => selectCurrentCharacter(state)?.specialAbilities.foolsHatEnchantments ?? {}
export const selectGeneralSpecialAbilities = (state: RootState) => selectCurrentCharacter(state)?.specialAbilities.generalSpecialAbilities ?? {}
export const selectInstrumentEnchantments = (state: RootState) => selectCurrentCharacter(state)?.specialAbilities.instrumentEnchantments ?? {}
export const selectKarmaSpecialAbilities = (state: RootState) => selectCurrentCharacter(state)?.specialAbilities.karmaSpecialAbilities ?? {}
export const selectKrallenkettenzauber = (state: RootState) => selectCurrentCharacter(state)?.specialAbilities.krallenkettenzauber ?? {}
export const selectLiturgicalStyleSpecialAbilities = (state: RootState) => selectCurrentCharacter(state)?.specialAbilities.liturgicalStyleSpecialAbilities ?? {}
export const selectLycantropicGifts = (state: RootState) => selectCurrentCharacter(state)?.specialAbilities.lycantropicGifts ?? {}
export const selectMagicalRunes = (state: RootState) => selectCurrentCharacter(state)?.specialAbilities.magicalRunes ?? {}
export const selectMagicalSpecialAbilities = (state: RootState) => selectCurrentCharacter(state)?.specialAbilities.magicalSpecialAbilities ?? {}
export const selectMagicalTraditions = (state: RootState) => selectCurrentCharacter(state)?.specialAbilities.magicalTraditions ?? {}
export const selectMagicStyleSpecialAbilities = (state: RootState) => selectCurrentCharacter(state)?.specialAbilities.magicStyleSpecialAbilities ?? {}
export const selectOrbEnchantments = (state: RootState) => selectCurrentCharacter(state)?.specialAbilities.orbEnchantments ?? {}
export const selectPactGifts = (state: RootState) => selectCurrentCharacter(state)?.specialAbilities.pactGifts ?? {}
export const selectProtectiveWardingCircleSpecialAbilities = (state: RootState) => selectCurrentCharacter(state)?.specialAbilities.protectiveWardingCircleSpecialAbilities ?? {}
export const selectRingEnchantments = (state: RootState) => selectCurrentCharacter(state)?.specialAbilities.ringEnchantments ?? {}
export const selectSermons = (state: RootState) => selectCurrentCharacter(state)?.specialAbilities.sermons ?? {}
export const selectSexSpecialAbilities = (state: RootState) => selectCurrentCharacter(state)?.specialAbilities.sexSpecialAbilities ?? {}
export const selectSickleRituals = (state: RootState) => selectCurrentCharacter(state)?.specialAbilities.sickleRituals ?? {}
export const selectSikaryanDrainSpecialAbilities = (state: RootState) => selectCurrentCharacter(state)?.specialAbilities.sikaryanDrainSpecialAbilities ?? {}
export const selectSkillStyleSpecialAbilities = (state: RootState) => selectCurrentCharacter(state)?.specialAbilities.skillStyleSpecialAbilities ?? {}
export const selectSpellSwordEnchantments = (state: RootState) => selectCurrentCharacter(state)?.specialAbilities.spellSwordEnchantments ?? {}
export const selectStaffEnchantments = (state: RootState) => selectCurrentCharacter(state)?.specialAbilities.staffEnchantments ?? {}
export const selectToyEnchantments = (state: RootState) => selectCurrentCharacter(state)?.specialAbilities.toyEnchantments ?? {}
export const selectTrinkhornzauber = (state: RootState) => selectCurrentCharacter(state)?.specialAbilities.trinkhornzauber ?? {}
export const selectVampiricGifts = (state: RootState) => selectCurrentCharacter(state)?.specialAbilities.vampiricGifts ?? {}
export const selectVisions = (state: RootState) => selectCurrentCharacter(state)?.specialAbilities.visions ?? {}
export const selectWandEnchantments = (state: RootState) => selectCurrentCharacter(state)?.specialAbilities.wandEnchantments ?? {}
export const selectWeaponEnchantments = (state: RootState) => selectCurrentCharacter(state)?.specialAbilities.weaponEnchantments ?? {}
export const selectAttributes = (state: RootState) => selectCurrentCharacter(state)?.attributes ?? {}
export const selectDerivedCharacteristics = (state: RootState) => selectCurrentCharacter(state)?.derivedCharacteristics ?? {
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
}
export const selectPurchasedLifePoints = (state: RootState) => selectCurrentCharacter(state)?.derivedCharacteristics.lifePoints.purchased ?? 0
export const selectLifePointsPermanentlyLost = (state: RootState) => selectCurrentCharacter(state)?.derivedCharacteristics.lifePoints.permanentlyLost ?? 0
export const selectPurchasedArcaneEnergy = (state: RootState) => selectCurrentCharacter(state)?.derivedCharacteristics.arcaneEnergy.purchased ?? 0
export const selectArcaneEnergyPermanentlyLost = (state: RootState) => selectCurrentCharacter(state)?.derivedCharacteristics.arcaneEnergy.permanentlyLost ?? 0
export const selectArcaneEnergyPermanentlyLostBoughtBack = (state: RootState) => selectCurrentCharacter(state)?.derivedCharacteristics.arcaneEnergy.permanentlyLostBoughtBack ?? 0
export const selectPurchasedKarmaPoints = (state: RootState) => selectCurrentCharacter(state)?.derivedCharacteristics.karmaPoints.purchased ?? 0
export const selectKarmaPointsPermanentlyLost = (state: RootState) => selectCurrentCharacter(state)?.derivedCharacteristics.karmaPoints.permanentlyLost ?? 0
export const selectKarmaPointsPermanentlyLostBoughtBack = (state: RootState) => selectCurrentCharacter(state)?.derivedCharacteristics.karmaPoints.permanentlyLostBoughtBack ?? 0

export const characterReducer = createReducer(initialState, builder => {
  attributesReducer(builder)
  derivedCharacteristicsReducer(builder)
})