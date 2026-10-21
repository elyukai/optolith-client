import { assertExhaustive } from "@elyukai/utils/typeSafety"
import { computed, observable } from "mobx"
import type { Database } from "../database.ts"
import type { CharacterIPCActions, CharacterIPCSelectors } from "../ipc.ts"
import type { StateActionsAsParameters, StateSelectors } from "../state.ts"
import {
  ActivatableMap,
  CharacterActivatables,
  TinyActivatableMap,
} from "./activatable/activatableEntry.ts"
import { CharacterSpecialAbilities } from "./activatable/specialAbilities.ts"
import { getTotalAdventurePointsFromCache } from "./adventurePoints/cache.ts"
import { Color } from "./color.ts"
import { CultureDependency } from "./culture.ts"
import { CharacterDerivedCharacteristics, Energy, EnergyWithBuyBack } from "./energy.ts"
import { CharacterExperienceLevel } from "./experienceLevel.ts"
import { Pact, PactDependency } from "./pact.ts"
import { Purse } from "./purse.ts"
import { CharacterRace, RaceDependency } from "./race.ts"
import { CharacterAttributes } from "./rated/attribute.ts"
import { CharacterCombatTechniques } from "./rated/combatTechnique.ts"
import { PrimaryAttributeDependency } from "./rated/primaryAttribute.ts"
import {
  ActivatableRatedMap,
  ActivatableRatedWithEnhancementsMap,
  RatedMap,
} from "./rated/ratedEntry.ts"
import { CharacterSkills } from "./rated/skill.ts"
import { CharacterRules } from "./rules.ts"
import { FocusRuleInstance } from "./rules/focusRule.ts"
import { OptionalRuleInstance } from "./rules/optionalRule.ts"
import { Sex, SexDependency } from "./sex.ts"
import { SocialStatusDependency } from "./socialStatus.ts"
import { PublicationDependency } from "./sources/publicationDependency.ts"
import { StateInstance } from "./state.ts"

export class Character {
  /**
   * The rules settings for the character.
   */
  readonly rules: CharacterRules

  /**
   * Describes whether the character creation is finished.
   */
  @observable accessor isCharacterCreationFinished: boolean

  @computed get isInCharacterCreation() {
    return !this.isCharacterCreationFinished
  }

  @computed get canRemove() {
    return !this.isCharacterCreationFinished
  }

  /**
   * Total adventure points.
   */
  @observable accessor totalAdventurePoints: number

  /**
   * The start experience level identifier.
   */
  readonly experienceLevel: CharacterExperienceLevel

  /**
   * An object storing the identifiers of the race and its optional race variant.
   */
  @observable accessor race: CharacterRace | undefined

  readonly attributes: CharacterAttributes
  readonly derivedCharacteristics: CharacterDerivedCharacteristics

  readonly advantages: CharacterActivatables<"Advantage">
  readonly disadvantages: CharacterActivatables<"Disadvantage">

  readonly skills: CharacterSkills
  readonly closeCombatTechniques: CharacterCombatTechniques<"CloseCombatTechnique">
  readonly rangedCombatTechniques: CharacterCombatTechniques<"RangedCombatTechnique">

  readonly specialAbilities: CharacterSpecialAbilities

  constructor(db: Database) {
    this.rules = new CharacterRules(db, this, false, [])
    this.isCharacterCreationFinished = false
    this.totalAdventurePoints = 1100
    this.experienceLevel = new CharacterExperienceLevel(
      db,
      this,
      "2b0a18c5-40a8-4c86-98b3-a93c85e82497",
    )
    this.race = new CharacterRace(
      db,
      "252841cf-f2d4-4fb9-af56-30de48531db5",
      "48a1fe0b-ec55-4992-b47b-e1086f2a583f",
    )
    this.attributes = new CharacterAttributes(db, this)
    this.derivedCharacteristics = new CharacterDerivedCharacteristics(db, this)
    this.advantages = new CharacterActivatables(db, this, "Advantage")
    this.disadvantages = new CharacterActivatables(db, this, "Disadvantage")
    this.skills = new CharacterSkills(db, this)
    this.closeCombatTechniques = new CharacterCombatTechniques(db, this, "CloseCombatTechnique")
    this.rangedCombatTechniques = new CharacterCombatTechniques(db, this, "RangedCombatTechnique")
    this.specialAbilities = new CharacterSpecialAbilities(db, this)
  }

  @computed
  get adventurePointsSpent(): number {
    return (
      this.attributes.adventurePointsTotal.general +
      this.derivedCharacteristics.adventurePointsTotal.general +
      this.advantages.adventurePointsTotal.general +
      this.disadvantages.adventurePointsTotal.general +
      this.skills.adventurePointsTotal.general +
      this.closeCombatTechniques.adventurePointsTotal.general +
      this.rangedCombatTechniques.adventurePointsTotal.general +
      this.specialAbilities.adventurePointsTotal.general
    )
  }

  @computed
  get adventurePointsAvailable(): number {
    return this.totalAdventurePoints - this.adventurePointsSpent
  }

  @computed
  get adventurePointsStats(): AdventurePointsStats {
    return {
      total: this.totalAdventurePoints,
      spent: this.adventurePointsSpent,
      available: this.adventurePointsAvailable,
      spentOnAdvantages: getTotalAdventurePointsFromCache(this.advantages.adventurePointsTotal),
      spentOnMagicalAdvantages: 0,
      spentOnBlessedAdvantages: 0,
      spentOnDisadvantages: getTotalAdventurePointsFromCache(
        this.disadvantages.adventurePointsTotal,
      ),
      spentOnMagicalDisadvantages: 0,
      spentOnBlessedDisadvantages: 0,
      spentOnRace: 0,
      spentOnProfession: 0,
      spentOnAttributes: getTotalAdventurePointsFromCache(this.attributes.adventurePointsTotal),
      spentOnSkills: getTotalAdventurePointsFromCache(this.skills.adventurePointsTotal),
      spentOnCombatTechniques:
        getTotalAdventurePointsFromCache(this.closeCombatTechniques.adventurePointsTotal) +
        getTotalAdventurePointsFromCache(this.rangedCombatTechniques.adventurePointsTotal),
      spentOnSpells: 0,
      spentOnCantrips: 0,
      spentOnLiturgicalChants: 0,
      spentOnBlessings: 0,
      spentOnSpecialAbilities: getTotalAdventurePointsFromCache(
        this.specialAbilities.adventurePointsTotal,
      ),
      spentOnEnergies: getTotalAdventurePointsFromCache(
        this.derivedCharacteristics.adventurePointsTotal,
      ),
    }
  }

  handleIPCAction(...args: StateActionsAsParameters<CharacterIPCActions>) {
    switch (args[0]) {
      case "incrementRated":
        switch (args[1][0]) {
          case "Attribute":
            this.attributes.increment(args[1][1])
            break
          case "Skill":
            this.skills.increment(args[1][1])
            break
          case "CloseCombatTechnique":
            this.closeCombatTechniques.increment(args[1][1])
            break
          case "RangedCombatTechnique":
            this.rangedCombatTechniques.increment(args[1][1])
            break
          default:
            return assertExhaustive(args[1][0])
        }
        break
      case "decrementRated":
        switch (args[1][0]) {
          case "Attribute":
            this.attributes.decrement(args[1][1])
            break
          case "Skill":
            this.skills.decrement(args[1][1])
            break
          case "CloseCombatTechnique":
            this.closeCombatTechniques.decrement(args[1][1])
            break
          case "RangedCombatTechnique":
            this.rangedCombatTechniques.decrement(args[1][1])
            break
          default:
            return assertExhaustive(args[1][0])
        }
        break
      case "incrementRatedToMax":
        switch (args[1][0]) {
          case "Attribute":
            this.attributes.incrementToMax(args[1][1])
            break
          case "Skill":
            this.skills.incrementToMax(args[1][1])
            break
          case "CloseCombatTechnique":
            this.closeCombatTechniques.incrementToMax(args[1][1])
            break
          case "RangedCombatTechnique":
            this.rangedCombatTechniques.incrementToMax(args[1][1])
            break
          default:
            return assertExhaustive(args[1][0])
        }
        break
      case "decrementRatedToMin":
        switch (args[1][0]) {
          case "Attribute":
            this.attributes.decrementToMin(args[1][1])
            break
          case "Skill":
            this.skills.decrementToMin(args[1][1])
            break
          case "CloseCombatTechnique":
            this.closeCombatTechniques.decrementToMin(args[1][1])
            break
          case "RangedCombatTechnique":
            this.rangedCombatTechniques.decrementToMin(args[1][1])
            break
          default:
            return assertExhaustive(args[1][0])
        }
        break
      case "incrementDerivedCharacteristic":
        this.derivedCharacteristics.increment(...args[1])
        break
      case "decrementDerivedCharacteristic":
        this.derivedCharacteristics.decrement(...args[1])
        break
      default:
        return assertExhaustive(args)
    }
  }

  get selectors(): StateSelectors<CharacterIPCSelectors> {
    return {
      canRemove: () => this.canRemove,
      isInCharacterCreation: () => this.isInCharacterCreation,
      adventurePointsStats: () => this.adventurePointsStats,
      attributes: () => this.attributes.attributes,
      attributesTotal: () => this.attributes.attributesTotal,
      derivedCharacteristics: () => this.derivedCharacteristics.derivedCharacteristics,
      activeAdvantages: () => this.advantages.active,
      inactiveAdvantages: () => this.advantages.inactive,
      activeDisadvantages: () => this.disadvantages.active,
      inactiveDisadvantages: () => this.disadvantages.inactive,
      skills: () => this.skills.skills,
      closeCombatTechniques: () => this.closeCombatTechniques.combatTechniques,
      rangedCombatTechniques: () => this.rangedCombatTechniques.combatTechniques,
      activeSpecialAbilities: () => this.specialAbilities.active,
      inactiveSpecialAbilities: () => this.specialAbilities.inactive,
    }
  }
}

export type AdventurePointsStats = {
  total: number
  spent: number
  available: number
  spentOnAdvantages: number
  spentOnMagicalAdvantages: number
  spentOnBlessedAdvantages: number
  spentOnDisadvantages: number
  spentOnMagicalDisadvantages: number
  spentOnBlessedDisadvantages: number
  spentOnRace: number
  spentOnProfession: number
  spentOnAttributes: number
  spentOnSkills: number
  spentOnCombatTechniques: number
  spentOnSpells: number
  spentOnCantrips: number
  spentOnLiturgicalChants: number
  spentOnBlessings: number
  spentOnSpecialAbilities: number
  spentOnEnergies: number
}

export class Characters {
  @observable accessor characters: Record<string, Character>

  constructor(db: Database) {
    this.characters = {
      "550e8400-e29b-11d4-a716-446655440000": new Character(db),
    }
  }

  handleIPCAction(...args: StateActionsAsParameters<CharacterIPCActions>) {
    this.characters["550e8400-e29b-11d4-a716-446655440000"]!.handleIPCAction(...args)
  }
}

/**
 * All dynamic information about a character. Static information about used
 * crunch elements is stored in the database only.
 */
export type _Character = {
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

    /**
     * Dependencies on the selected race.
     */
    dependencies: RaceDependency[]
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

    /**
     * Dependencies on the selected culture.
     */
    dependencies: CultureDependency[]
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
     * Dependencies on certain publications.
     */
    publicationDependencies: PublicationDependency[]

    /**
     * A map of focus rules that may be active for the character.
     */
    focusRules: {
      [id: number]: FocusRuleInstance
    }

    /**
     * A map of optional rules that maybe be active for the character.
     */
    optionalRules: {
      [id: number]: OptionalRuleInstance
    }
  }

  /**
   * A map of states that may be active for the character.
   */
  states: {
    [id: number]: StateInstance
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
     * Dependencies on the character’s sex.
     */
    sexDependencies: SexDependency[]

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
    magicalSigns: ActivatableMap
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

  magicalPrimaryAttributeDependencies: PrimaryAttributeDependency[]
  blessedPrimaryAttributeDependencies: PrimaryAttributeDependency[]

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

  cantrips: TinyActivatableMap
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
    magicalRunes: ActivatableRatedMap
  }

  blessings: TinyActivatableMap
  liturgicalChants: ActivatableRatedWithEnhancementsMap
  ceremonies: ActivatableRatedWithEnhancementsMap

  // items: {}
  // hitZoneArmors: {}
  purse: Purse
  // creatures: {}
  pact?: Pact
  pactDependencies: PactDependency[]
}
