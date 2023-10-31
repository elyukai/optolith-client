import { ActivatableMap, TinyActivatableSet } from "./activatableEntry.ts"
import { Color } from "./color.ts"
import { Energy, EnergyWithBuyBack } from "./energy.ts"
import { Pact } from "./pact.ts"
import { Purse } from "./purse.ts"
import { RatedDependency } from "./rated/ratedDependency.ts"
import { ActivatableRatedMap, ActivatableRatedWithEnhancementsMap, RatedMap } from "./ratedEntry.ts"
import { ActiveFocusRule, ActiveOptionalRule } from "./rules.ts"
import { Sex } from "./sex.ts"
import { SocialStatusDependency } from "./socialStatus.ts"
import { ActiveState } from "./state.ts"

/**
 * All dynamic information about a character. Static information about used
 * crunch elements is stored in the database only.
 */
export type Character = {
  id: string

  /**
   * A valid semantic version (https://semver.org), representing the Optolith
   * version this character was created with.
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

  activeStates: {
    [id: number]: ActiveState
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
  pact?: Pact
}
