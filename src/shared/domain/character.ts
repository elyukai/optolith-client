import { isNotEmpty } from "@elyukai/utils/array/nonEmpty"
import { deepEqual } from "@elyukai/utils/equality"
import { isNotNullish } from "@elyukai/utils/nullable"
import { isInRange } from "@elyukai/utils/range"
import { assertExhaustive } from "@elyukai/utils/typeSafety"
import type {
  Character as RawCharacter,
  CharacterInRaceCultureProfessionSelection as RawCharacterInRaceCultureProfessionSelection,
  FullCharacter as RawFullCharacter,
} from "@optolith/character-schema/types"
import type {
  ActivatableIdentifier,
  Aspect_ID,
  EnhancementPrerequisite,
  MagicalTradition_ID,
  PrerequisitesElement,
  ProfessionActivatablePrerequisite,
  ProfessionPrerequisiteGroup,
  Property_ID,
  RatedIdentifier,
  SkillWithEnhancementsIdentifier,
  TinyActivatableIdentifier,
} from "@optolith/database-schema/gen"
import { action, computed, observable } from "mobx"
import { Case } from "tsondb/schema/gen"
import type { SerializedSelectedRCPOptions } from "../../main_window/routes/characters/character/raceCultureProfession/RCPOptionSelections/SelectedRCPOptions.ts"
import type { CharacterRoutePath, RoutePath } from "../../main_window/slices/routeSlice.ts"
import type { Global } from "../global.ts"
import type { CharacterIPCActions } from "../ipc.ts"
import type { StateActionsAsParameters } from "../state.ts"
import { ensureNonEmptyObject } from "../utils/object.ts"
import {
  CharacterActivatables,
  type ActivatableOption,
  type CharacterActivatable,
} from "./activatable/activatable.ts"
import { getMaximumAdventurePointsForMagicalAdvantagesAndDisadvantages } from "./activatable/advantagesDisadvantages.ts"
import { CharacterSpecialAbilities } from "./activatable/specialAbilities.ts"
import type { TinyActivatable, TinyActivatables } from "./activatable/tinyActivatable.ts"
import {
  CharacterCulture,
  type CultureForDisplay,
  type DisplayedCultureSelectOptions,
} from "./culture.ts"
import { CharacterCurriculum } from "./curriculum.ts"
import { fromUniformCase } from "./databaseEnum.ts"
import { CharacterDerivedCharacteristics } from "./energy.ts"
import { CharacterExperienceLevel } from "./experienceLevel.ts"
import type { CharacterPact } from "./pact.ts"
import { CharacterPersonalData } from "./personalData.ts"
import { CharacterPersonalityTraits } from "./personalityTraits.ts"
import {
  createCapabilitiesFromCharacter,
  type AllCapabilities,
} from "./prerequisites/single/index.ts"
import {
  CharacterProfession,
  checkProfessionSpecialAbilityRulePrerequisites,
  type DisplayedProfessionSelectOptions,
  type ProfessionForDisplay,
} from "./profession.ts"
import { Purse } from "./purse.ts"
import { CharacterRace, type DisplayedRaceSelectOptions, type RaceForDisplay } from "./race.ts"
import { CharacterAttributes } from "./rated/attribute.ts"
import { CharacterCombatTechniques } from "./rated/combatTechnique.ts"
import { CharacterBlessings, CharacterLiturgicalChants } from "./rated/liturgicalChant.ts"
import { CharacterMagicalActionCollections } from "./rated/magicalActions.ts"
import type { PrimaryAttributeDependency } from "./rated/primaryAttribute.ts"
import { CharacterActivatableRatedEntries, type ConsParamsTrim } from "./rated/ratedEntry.ts"
import { CharacterSkills } from "./rated/skill.ts"
import { CharacterCantrips, CharacterSpellworks } from "./rated/spell.ts"
import { CharacterRules } from "./rules.ts"
import { CharacterStates } from "./state.ts"

export abstract class BaseCharacter<Phase extends CharacterCreationPhase = CharacterCreationPhase> {
  readonly global: Global

  readonly id: string

  /**
   * A valid semantic version (https://semver.org), representing the Optolith
   * version this character was created with.
   */
  readonly version: string

  @observable accessor name: string

  @observable accessor avatar: string | undefined

  /**
   * Date of character creation, in ISO8601 format.
   */
  readonly dateCreated: Temporal.ZonedDateTime

  /**
   * Date of character last modified, in ISO8601 format.
   */
  @observable accessor dateLastModified: Temporal.ZonedDateTime

  /**
   * The rules settings for the character.
   */
  @observable accessor rules: CharacterRules

  /**
   * Describes whether the character creation is finished.
   */
  @computed
  get isCharacterCreationFinished(): boolean {
    return this.phase === "Finished"
  }

  @computed
  get isInCharacterCreation() {
    return !this.isCharacterCreationFinished
  }

  @computed
  get canRemove() {
    return this.isInCharacterCreation // TODO: || isEditingHeroAfterCreationPhaseEnabled
  }

  @computed
  get canFinishCharacterCreation() {
    return isInRange([0, 10], this.adventurePointsAvailable)
  }

  @observable accessor phase: Phase

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
  abstract race: CharacterRace | undefined

  /**
   * An object storing the identifier of the culture and if the cultural package has been applied.
   */
  abstract culture: CharacterCulture | undefined

  /**
   * An object storing the identifiers of the profession, its instance and its optional profession variant.
   */
  abstract profession: CharacterProfession | undefined

  @observable accessor areRCPValuesApplied = false

  @observable accessor curriculum: CharacterCurriculum | undefined

  readonly states: CharacterStates
  @observable accessor personalData: CharacterPersonalData
  readonly personalityTraits: CharacterPersonalityTraits
  @observable accessor pact: CharacterPact | undefined

  @observable accessor attributes: CharacterAttributes
  @observable accessor derivedCharacteristics: CharacterDerivedCharacteristics

  @observable accessor advantages: CharacterActivatables<"Advantage">
  @observable accessor disadvantages: CharacterActivatables<"Disadvantage">

  @observable accessor skills: CharacterSkills
  @observable accessor closeCombatTechniques: CharacterCombatTechniques<"CloseCombatTechnique">
  @observable accessor rangedCombatTechniques: CharacterCombatTechniques<"RangedCombatTechnique">

  @observable accessor cantrips: CharacterCantrips
  @observable accessor spells: CharacterSpellworks<"Spell">
  @observable accessor rituals: CharacterSpellworks<"Ritual">
  @observable accessor blessings: CharacterBlessings
  @observable accessor liturgicalChants: CharacterLiturgicalChants<"LiturgicalChant">
  @observable accessor ceremonies: CharacterLiturgicalChants<"Ceremony">

  readonly magicalActions: CharacterMagicalActionCollections

  @observable accessor specialAbilities: CharacterSpecialAbilities

  @observable accessor magicalPrimaryAttributeDependencies: PrimaryAttributeDependency[] = []
  @observable accessor blessedPrimaryAttributeDependencies: PrimaryAttributeDependency[] = []

  readonly prerequisiteCapabilities: AllCapabilities

  // items: {}
  // hitZoneArmors: {}
  purse: Purse
  // creatures: {}

  constructor(
    global: Global,
    id: string,
    ...args:
      | [raw: RawCharacter & { phase: Phase }]
      | [
          version: string,
          experienceLevelId: string,
          phase: Phase,
          dateCreated?: Temporal.ZonedDateTime,
          dateLastModified?: Temporal.ZonedDateTime,
        ]
  ) {
    const raw:
      | Omit<
          RawFullCharacter,
          "phase" | "derivedCharacteristics" | "purse" | "race" | "culture" | "profession"
        >
      | undefined = args.length === 1 ? args[0] : undefined
    const [version, experienceLevelId, phase, dateCreated, dateLastModified] =
      args.length === 1
        ? [
            args[0].version,
            args[0].experienceLevel.start,
            args[0].phase as Phase,
            Temporal.ZonedDateTime.from(args[0].dateCreated),
            Temporal.ZonedDateTime.from(args[0].dateLastModified),
          ]
        : args

    this.global = global
    this.id = id
    this.name = raw?.name ?? ""
    this.phase = phase
    this.version = version
    this.dateCreated = dateCreated ?? Temporal.Now.zonedDateTimeISO()
    this.dateLastModified = dateLastModified ?? this.dateCreated
    this.rules = new CharacterRules(global, this, raw?.rules)
    this.experienceLevel = new CharacterExperienceLevel(global, this, experienceLevelId)
    this.totalAdventurePoints =
      raw?.adventurePoints.total ?? this.experienceLevel.start?.adventure_points ?? 0
    this.states = new CharacterStates(global, this)
    this.personalData = new CharacterPersonalData(global, this, raw?.personalData)
    this.personalityTraits = new CharacterPersonalityTraits(global, this)
    this.curriculum = raw?.curriculum ? new CharacterCurriculum(raw.curriculum) : undefined
    this.attributes = new CharacterAttributes(global, this, raw?.attributes)
    this.derivedCharacteristics = new CharacterDerivedCharacteristics(global, this)
    this.advantages = new CharacterActivatables(global, this, "Advantage", raw?.advantages)
    this.disadvantages = new CharacterActivatables(global, this, "Disadvantage", raw?.disadvantages)
    this.skills = new CharacterSkills(global, this, raw?.skills)
    this.closeCombatTechniques = new CharacterCombatTechniques(
      "CloseCombatTechnique",
      global,
      this,
      raw?.combatTechniques?.melee,
    )
    this.rangedCombatTechniques = new CharacterCombatTechniques(
      "RangedCombatTechnique",
      global,
      this,
      raw?.combatTechniques?.ranged,
    )
    this.cantrips = new CharacterCantrips(global, this)
    this.spells = new CharacterSpellworks("Spell", global, this, raw?.spells)
    this.rituals = new CharacterSpellworks("Ritual", global, this, raw?.rituals)
    this.blessings = new CharacterBlessings(global, this)
    this.liturgicalChants = new CharacterLiturgicalChants(
      "LiturgicalChant",
      global,
      this,
      raw?.liturgicalChants,
    )
    this.ceremonies = new CharacterLiturgicalChants("Ceremony", global, this, raw?.ceremonies)
    this.magicalActions = new CharacterMagicalActionCollections(global, this, raw?.magicalActions)
    this.specialAbilities = new CharacterSpecialAbilities(global, this, raw?.specialAbilities)
    this.prerequisiteCapabilities = createCapabilitiesFromCharacter(global, this)
    this.purse = new Purse()
  }

  @computed
  get adventurePointsSpent(): number {
    return (
      (this.race?.adventurePoints ?? 0) +
      (this.phase === "RaceCultureProfession" ? (this.profession?.adventurePoints ?? 0) : 0) +
      this.attributes.adventurePointsTotal.general +
      this.derivedCharacteristics.adventurePointsTotal.general +
      this.advantages.adventurePointsTotal.general +
      this.disadvantages.adventurePointsTotal.general +
      this.skills.adventurePointsTotal.general +
      this.closeCombatTechniques.adventurePointsTotal.general +
      this.rangedCombatTechniques.adventurePointsTotal.general +
      this.cantrips.adventurePoints.general +
      this.spells.adventurePointsTotal.general +
      this.rituals.adventurePointsTotal.general +
      this.magicalActions.adventurePointsTotal.general +
      this.blessings.adventurePoints.general +
      this.liturgicalChants.adventurePointsTotal.general +
      this.ceremonies.adventurePointsTotal.general +
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
      spentOnAdvantages: this.advantages.adventurePointsTotal.getTotal(),
      spentOnMagicalAdvantages: this.advantages
        .getAdventurePointsTotalForSubtype("Magical")
        .getTotal(),
      spentOnBlessedAdvantages: this.advantages
        .getAdventurePointsTotalForSubtype("Blessed")
        .getTotal(),
      spentOnDisadvantages: this.disadvantages.adventurePointsTotal.getTotal(),
      spentOnMagicalDisadvantages: this.disadvantages
        .getAdventurePointsTotalForSubtype("Magical")
        .getTotal(),
      spentOnBlessedDisadvantages: this.disadvantages
        .getAdventurePointsTotalForSubtype("Blessed")
        .getTotal(),
      spentOnRace: this.race?.adventurePoints ?? 0,
      spentOnProfession: this.profession?.adventurePoints ?? 0,
      spentOnAttributes: this.attributes.adventurePointsTotal.getTotal(),
      spentOnSkills: this.skills.adventurePointsTotal.getTotal(),
      spentOnCombatTechniques:
        this.closeCombatTechniques.adventurePointsTotal.getTotal() +
        this.rangedCombatTechniques.adventurePointsTotal.getTotal(),
      spentOnCantrips: this.cantrips.adventurePoints.getTotal(),
      spentOnSpells:
        this.spells.adventurePointsTotal.getTotal() + this.rituals.adventurePointsTotal.getTotal(),
      spentOnMagicalActions: this.magicalActions.adventurePointsTotal.getTotal(),
      spentOnLiturgicalChants:
        this.liturgicalChants.adventurePointsTotal.getTotal() +
        this.ceremonies.adventurePointsTotal.getTotal(),
      spentOnBlessings: this.blessings.adventurePoints.getTotal(),
      spentOnSpecialAbilities: this.specialAbilities.adventurePointsTotal.getTotal(),
      spentOnEnergies: this.derivedCharacteristics.adventurePointsTotal.getTotal(),
    }
  }

  @computed
  get racesForDisplay(): RaceForDisplay[] {
    return CharacterRace.getRacesForDisplay(this)
  }

  @computed
  get culturesForDisplay(): CultureForDisplay[] {
    return CharacterCulture.getCulturesForDisplay(this)
  }

  @computed
  get professionsForDisplay(): ProfessionForDisplay[] {
    return CharacterProfession.getProfessionsForDisplay(this)
  }

  @computed
  get raceCultureProfessionSelectOptions():
    | DisplayedRaceCultureProfessionSelectOptions
    | undefined {
    if (this.race === undefined || this.culture === undefined || this.profession === undefined) {
      return undefined
    }

    return {
      race: this.race.selectOptions,
      culture: this.culture.selectOptions,
      profession: this.profession.selectOptions,
    }
  }

  getRatedCollection<E extends RatedIdentifier["kind"]>(entity: E): RatedCollectionByEntity<E> {
    switch (entity) {
      case "Attribute":
        return this.attributes as RatedCollectionByEntity<E>
      case "Skill":
        return this.skills as RatedCollectionByEntity<E>
      case "CloseCombatTechnique":
        return this.closeCombatTechniques as RatedCollectionByEntity<E>
      case "RangedCombatTechnique":
        return this.rangedCombatTechniques as RatedCollectionByEntity<E>
      case "Spell":
        return this.spells as RatedCollectionByEntity<E>
      case "Ritual":
        return this.rituals as RatedCollectionByEntity<E>
      case "LiturgicalChant":
        return this.liturgicalChants as RatedCollectionByEntity<E>
      case "Ceremony":
        return this.ceremonies as RatedCollectionByEntity<E>
      default:
        return assertExhaustive(entity)
    }
  }

  getRatingById(
    id: Case<"Attribute" | "Skill" | "CloseCombatTechnique" | "RangedCombatTechnique", string>,
  ): number {
    return this.getRatedCollection(id.kind).getValueById(fromUniformCase(id))
  }

  getActivatableRatingById(
    id: Case<"Spell" | "Ritual" | "LiturgicalChant" | "Ceremony", string>,
  ): number | undefined {
    return this.getRatedCollection(id.kind).getValueById(fromUniformCase(id))
  }

  getActivatableRatedWithEnhancementsCollection(entity: SkillWithEnhancementsIdentifier["kind"]) {
    switch (entity) {
      case "Spell":
        return this.spells
      case "Ritual":
        return this.rituals
      case "LiturgicalChant":
        return this.liturgicalChants
      case "Ceremony":
        return this.ceremonies
      default:
        return assertExhaustive(entity)
    }
  }

  getActivatableCollection<E extends ActivatableIdentifier["kind"]>(
    entity: E,
  ): CharacterActivatables<E> {
    switch (entity) {
      case "Advantage":
        return this.advantages as CharacterActivatables<E>
      case "Disadvantage":
        return this.disadvantages as CharacterActivatables<E>
      default:
        return this.specialAbilities.getSpecialAbilitiesCollection(
          entity,
        ) as CharacterActivatables<E>
    }
  }

  getTinyActivatableCollection<E extends TinyActivatableIdentifier["kind"]>(
    entity: E,
  ): TinyActivatables<E, TinyActivatable<E>> {
    switch (entity) {
      case "Blessing":
        return this.blessings as unknown as TinyActivatables<E, TinyActivatable<E>>
      case "Cantrip":
        return this.cantrips as unknown as TinyActivatables<E, TinyActivatable<E>>
      default:
        return assertExhaustive(entity)
    }
  }

  @computed
  get maximumSkillRatingBonusEntry(): CharacterActivatable | undefined {
    const id = this.global.settings.skills.maximumSkillRatingBonusEntry
    return this.getActivatableCollection(id.kind).getById(fromUniformCase(id))
  }

  @computed
  get maximumCombatTechniqueRatingBonusEntry(): CharacterActivatable | undefined {
    const id = this.global.settings.combatTechniques.maximumCombatTechniqueRatingBonusEntry
    return this.getActivatableCollection(id.kind).getById(fromUniformCase(id))
  }

  @computed
  get activeMagicalTraditions(): CharacterActivatable<"MagicalTradition">[] {
    return this.specialAbilities.getSpecialAbilitiesCollection("MagicalTradition").active
  }

  @computed
  get isSpellcaster(): boolean {
    return (
      this.advantages.isActive(this.global.settings.supernaturalBaseAdvantages.spellcasters) &&
      this.specialAbilities.getSpecialAbilitiesCollection("MagicalTradition").hasActive
    )
  }

  @computed
  get canLearnCantrips(): boolean {
    return (
      isNotEmpty(this.activeMagicalTraditions) &&
      this.activeMagicalTraditions.every(trad => trad.dbEntry.can_learn_cantrips)
    )
  }

  @computed
  get canLearnSpells(): boolean {
    return (
      isNotEmpty(this.activeMagicalTraditions) &&
      this.activeMagicalTraditions.every(trad => trad.dbEntry.can_learn_spells)
    )
  }

  @computed
  get canLearnRituals(): boolean {
    return (
      isNotEmpty(this.activeMagicalTraditions) &&
      this.activeMagicalTraditions.every(trad => trad.dbEntry.can_learn_rituals)
    )
  }

  @computed
  get applicableMagicalTraditionIds(): MagicalTradition_ID[] {
    return this.activeMagicalTraditions
      .flatMap(trad => [trad.id, trad.dbEntry.use_arcane_spellworks_from_tradition])
      .filter(isNotNullish)
  }

  /**
   * Checks if the maximum number of spellworks has been reached.
   */
  @computed
  get isMaximumOfSpellworksReached() {
    //     TODO: if (isLastTrad (SpecialAbilityId.TraditionSchelme)) {
    //       const max_spellworks = pipe_ (
    //                                hero,
    //                                HA.specialAbilities,
    //                                lookup<string> (SpecialAbilityId.Imitationszauberei),
    //                                bindF (pipe (ADA.active, listToMaybe)),
    //                                bindF (AOA.tier),
    //                                fromMaybe (0)
    //                              )

    //       return current_count >= max_spellworks
    //     }

    //     // Count maximum for Intuitive Mages and Animisten
    //     const BASE_MAX_INTU_ANIM = 3

    //    TODO:  if (isLastTrad (SpecialAbilityId.TraditionIntuitiveMage)
    //         || isLastTrad (SpecialAbilityId.TraditionAnimisten)) {
    //       const mbonus = lookup<string> (AdvantageId.LargeSpellSelection) (HA.advantages (hero))
    //       const mmalus = lookup<string> (DisadvantageId.SmallSpellSelection) (HA.disadvantages (hero))

    //       const max_spells = modifyByLevel (BASE_MAX_INTU_ANIM) (mbonus) (mmalus)

    //       if (current_count >= max_spells) {
    //         return true
    //       }
    //     }

    return this.isInCharacterCreation
      ? this.spells.activeCount + this.rituals.activeCount >=
          (this.experienceLevel.start?.max_number_of_spells_liturgical_chants ?? 0)
      : false
  }

  @computed
  get activeUnfamiliarCount(): number {
    return this.spells.activeUnfamiliarCount + this.rituals.activeUnfamiliarCount
  }

  /**
   * Checks if the maximum number of spellworks has been reached.
   */
  @computed
  get isMaximumOfUnfamiliarSpellworksReached() {
    return this.isInCharacterCreation
      ? this.activeUnfamiliarCount >=
          (this.experienceLevel.start?.max_number_of_unfamiliar_spells ?? 0)
      : false
  }

  @computed
  get propertyIdsWithUnlockedMaximum(): Property_ID[] {
    const sourceId = this.global.settings.spellworks.maximumRatingUnlockEntry
    return (
      this.getActivatableCollection(sourceId.kind)
        .getById(fromUniformCase(sourceId))
        ?.getOptions()
        .flatMap(option =>
          option.type === "Predefined" && option.id.kind === "Property" ? [option.id.Property] : [],
        ) ?? []
    )
  }

  @computed
  get maximumAdventurePointsForMagicalAdvantagesAndDisadvantages(): number {
    return getMaximumAdventurePointsForMagicalAdvantagesAndDisadvantages(
      this.activeMagicalTraditions,
    )
  }

  @computed
  get isBlessedOne(): boolean {
    return (
      this.advantages.isActive(this.global.settings.supernaturalBaseAdvantages.blessed) &&
      this.specialAbilities.getSpecialAbilitiesCollection("BlessedTradition").hasActive
    )
  }

  @computed
  get activeBlessedTradition(): CharacterActivatable<"BlessedTradition"> | undefined {
    return this.specialAbilities.getSpecialAbilitiesCollection("BlessedTradition").active[0]
  }

  /**
   * Checks if the maximum number of spellworks has been reached.
   */
  @computed
  get isMaximumOfLiturgicalChantsReached() {
    return this.isInCharacterCreation
      ? this.liturgicalChants.activeCount + this.ceremonies.activeCount >=
          (this.experienceLevel.start?.max_number_of_spells_liturgical_chants ?? 0)
      : false
  }

  @computed
  get aspectIdsWithUnlockedMaximum(): Aspect_ID[] {
    const sourceId = this.global.settings.liturgicalChants.maximumRatingUnlockEntry
    return (
      this.getActivatableCollection(sourceId.kind)
        .getById(fromUniformCase(sourceId))
        ?.getOptions()
        .flatMap(option =>
          option.type === "Predefined" && option.id.kind === "Aspect" ? [option.id.Aspect] : [],
        ) ?? []
    )
  }

  @action
  setName(newName: string) {
    this.name = newName
  }

  @action
  handleIPCAction(
    ...args: StateActionsAsParameters<CharacterIPCActions>
    // oxlint-disable-next-line typescript/no-invalid-void-type
  ): void | { transformedCharacter?: Character; newRoute?: CharacterRoutePath } {
    switch (args[0]) {
      case "setName":
        return this.setName(args[1][0])
      case "rerollHairColor":
        return this.personalData.rerollHairColor()
      case "rerollEyeColor":
        return this.personalData.rerollEyeColor()
      case "rerollSize":
        return this.personalData.rerollSize()
      case "rerollWeight":
        return this.personalData.rerollWeight()
      case "setAge":
        return this.personalData.setAge(args[1][0])
      case "setCharacteristics":
        return this.personalData.setCharacteristics(args[1][0])
      case "setDateOfBirth":
        return this.personalData.setDateOfBirth(args[1][0])
      case "setFamily":
        return this.personalData.setFamily(args[1][0])
      case "setOtherInfo":
        return this.personalData.setOtherInfo(args[1][0])
      case "setPlaceOfBirth":
        return this.personalData.setPlaceOfBirth(args[1][0])
      case "setPredefinedEyeColor":
        return this.personalData.setPredefinedEyeColor(args[1][0])
      case "setPredefinedHairColor":
        return this.personalData.setPredefinedHairColor(args[1][0])
      case "setSize":
        return this.personalData.setSize(args[1][0])
      case "setSocialStatus":
        return this.personalData.setSocialStatus(args[1][0])
      case "setTitle":
        return this.personalData.setTitle(args[1][0])
      case "setWeight":
        return this.personalData.setWeight(args[1][0])
      case "toggleIncludeAllPublications":
        return this.rules.toggleIncludeAllPublications()
      case "togglePublication":
        return this.rules.togglePublication(args[1][0])
      case "toggleFocusRule":
        return this.rules.toggleFocusRule(args[1][0])
      case "toggleOptionalRule":
        return this.rules.toggleOptionalRule(args[1][0])
      case "setOptionalRuleOption":
        return this.rules.setOptionalRuleOption(...args[1])
      case "toggleAlternativeRule":
        return this.rules.toggleAlternativeRule(args[1][0])
      case "setRaceVariant":
        this.race = new CharacterRace(this.global, this, args[1][0], undefined, [])
        if (this.phase === "RaceCultureProfession") {
          this.culture = undefined
          this.profession = undefined
        }
        return
      case "setAttributeAdjustment":
        if (this.race) {
          this.race.selectedAttributeAdjustmentId = args[1][0]
        }
        return
      case "setCulture":
        this.culture = new CharacterCulture(this.global, this, args[1][0], false, [])
        if (this.phase === "RaceCultureProfession") {
          this.profession = undefined
        }
        return
      case "setProfessionPackage":
        this.profession = new CharacterProfession(this.global, this, args[1][0])
        if (this.profession.isVariantSelectionRequired) {
          this.profession.variantId = this.profession.professionVariantsForDisplay[0]?.id
        }
        return
      case "setProfessionVariant":
        if (this.profession !== undefined) {
          this.profession.variantId = args[1][0]
        }
        return
      case "setCustomProfessionName":
        return this.profession?.setCustomProfessionName(args[1][0])
      case "applyRaceCultureProfession":
        if (
          this.race !== undefined &&
          this.culture !== undefined &&
          this.profession !== undefined &&
          this instanceof CharacterInRaceCultureProfessionSelection
        ) {
          const { race, culture, profession } = this

          const [_, [selectedOptions]] = args

          const transformedCharacter = FullCharacter.applyRaceCultureProfessionSelection(
            this,
            race,
            culture,
            profession,
            selectedOptions,
          )

          return {
            transformedCharacter,
            newRoute: "attributes",
          }
        }
        return
      case "incrementRated":
        switch (args[1][0]) {
          case "Attribute":
          case "Skill":
          case "CloseCombatTechnique":
          case "RangedCombatTechnique":
          case "Spell":
          case "Ritual":
          case "LiturgicalChant":
          case "Ceremony":
            return this.getRatedCollection(args[1][0])?.increment(args[1][1])
          case "AnimistPower":
          case "Bannzeichen":
          case "Curse":
          case "DominationRitual":
          case "ElvenMagicalSong":
          case "GeodeRitual":
          case "GoblinRitual":
          case "JesterTrick":
          case "MagicalDance":
          case "MagicalMelody":
          case "MagicalRune":
          case "ZibiljaRitual":
            return this.magicalActions.increment(args[1][0], args[1][1])
          default:
            return assertExhaustive(args[1][0])
        }
      case "decrementRated":
        switch (args[1][0]) {
          case "Attribute":
          case "Skill":
          case "CloseCombatTechnique":
          case "RangedCombatTechnique":
          case "Spell":
          case "Ritual":
          case "LiturgicalChant":
          case "Ceremony":
            return this.getRatedCollection(args[1][0])?.decrement(args[1][1])
          case "AnimistPower":
          case "Bannzeichen":
          case "Curse":
          case "DominationRitual":
          case "ElvenMagicalSong":
          case "GeodeRitual":
          case "GoblinRitual":
          case "JesterTrick":
          case "MagicalDance":
          case "MagicalMelody":
          case "MagicalRune":
          case "ZibiljaRitual":
            return this.magicalActions.decrement(args[1][0], args[1][1])
          default:
            return assertExhaustive(args[1][0])
        }
      case "incrementRatedToMax":
        switch (args[1][0]) {
          case "Attribute":
          case "Skill":
          case "CloseCombatTechnique":
          case "RangedCombatTechnique":
          case "Spell":
          case "Ritual":
          case "LiturgicalChant":
          case "Ceremony":
            return this.getRatedCollection(args[1][0])?.incrementToMax(args[1][1])
          case "AnimistPower":
          case "Bannzeichen":
          case "Curse":
          case "DominationRitual":
          case "ElvenMagicalSong":
          case "GeodeRitual":
          case "GoblinRitual":
          case "JesterTrick":
          case "MagicalDance":
          case "MagicalMelody":
          case "MagicalRune":
          case "ZibiljaRitual":
            return this.magicalActions.incrementToMax(args[1][0], args[1][1])
          default:
            return assertExhaustive(args[1][0])
        }
      case "decrementRatedToMin":
        switch (args[1][0]) {
          case "Attribute":
          case "Skill":
          case "CloseCombatTechnique":
          case "RangedCombatTechnique":
          case "Spell":
          case "Ritual":
          case "LiturgicalChant":
          case "Ceremony":
            return this.getRatedCollection(args[1][0])?.decrementToMin(args[1][1])
          case "AnimistPower":
          case "Bannzeichen":
          case "Curse":
          case "DominationRitual":
          case "ElvenMagicalSong":
          case "GeodeRitual":
          case "GoblinRitual":
          case "JesterTrick":
          case "MagicalDance":
          case "MagicalMelody":
          case "MagicalRune":
          case "ZibiljaRitual":
            return this.magicalActions.decrementToMin(args[1][0], args[1][1])
          default:
            return assertExhaustive(args[1][0])
        }
      case "incrementDerivedCharacteristic":
        return this.derivedCharacteristics.increment(...args[1])
      case "decrementDerivedCharacteristic":
        return this.derivedCharacteristics.decrement(...args[1])
      case "addDerivedCharacteristicPermanentlyLost":
        return this.derivedCharacteristics.addPermanentlyLost(...args[1])
      case "decrementDerivedCharacteristicBoughtBack":
        return this.derivedCharacteristics.decrementBoughtBack(...args[1])
      case "decrementDerivedCharacteristicPermanentlyLost":
        return this.derivedCharacteristics.decrementPermanentlyLost(...args[1])
      case "incrementDerivedCharacteristicBoughtBack":
        return this.derivedCharacteristics.incrementBoughtBack(...args[1])
      case "incrementDerivedCharacteristicPermanentlyLost":
        return this.derivedCharacteristics.incrementPermanentlyLost(...args[1])
      case "addTinyActivatable":
        return this.getTinyActivatableCollection(args[1][0]).activate(args[1][1])
      case "removeTinyActivatable":
        return this.getTinyActivatableCollection(args[1][0]).deactivate(args[1][1])
      case "activateRated":
        switch (args[1][0]) {
          case "Spell":
          case "Ritual":
          case "LiturgicalChant":
          case "Ceremony":
            return this.getActivatableRatedWithEnhancementsCollection(args[1][0])?.activate(
              args[1][1],
            )
          case "AnimistPower":
          case "Bannzeichen":
          case "Curse":
          case "DominationRitual":
          case "ElvenMagicalSong":
          case "GeodeRitual":
          case "GoblinRitual":
          case "JesterTrick":
          case "MagicalDance":
          case "MagicalMelody":
          case "MagicalRune":
          case "ZibiljaRitual":
            return this.magicalActions.activate(args[1][0], args[1][1])
          default:
            return assertExhaustive(args[1][0])
        }
      case "deactivateRated":
        switch (args[1][0]) {
          case "Spell":
          case "Ritual":
          case "LiturgicalChant":
          case "Ceremony":
            return this.getActivatableRatedWithEnhancementsCollection(args[1][0])?.deactivate(
              args[1][1],
            )
          case "AnimistPower":
          case "Bannzeichen":
          case "Curse":
          case "DominationRitual":
          case "ElvenMagicalSong":
          case "GeodeRitual":
          case "GoblinRitual":
          case "JesterTrick":
          case "MagicalDance":
          case "MagicalMelody":
          case "MagicalRune":
          case "ZibiljaRitual":
            return this.magicalActions.deactivate(args[1][0], args[1][1])
          default:
            return assertExhaustive(args[1][0])
        }
      case "addActivatable":
        return this.getActivatableCollection(args[1][0])?.add(args[1][1], args[1][2])
      case "setActivatableLevel":
        return this.getActivatableCollection(args[1][0])?.setLevel(
          args[1][1],
          args[1][2],
          args[1][3],
        )
      case "removeActivatable":
        return this.getActivatableCollection(args[1][0])?.remove(args[1][1], args[1][2])
      default:
        return assertExhaustive(args)
    }
  }

  get selectors() {
    return {
      id: () => this.id,
      name: () => this.name,
      avatar: () => this.avatar,
      sexName: () => this.personalData.sexName,
      showSexualCharacteristics: () => this.personalData.showSexualCharacteristics,
      startExperienceLevel: () => this.experienceLevel.start,
      currentExperienceLevel: () => this.experienceLevel.current,
      canAddAdventurePoints: () => this.isCharacterCreationFinished,
      showFinishCharacterCreation: () => !this.isCharacterCreationFinished,
      canFinishCharacterCreation: () => isInRange([0, 10], this.adventurePointsAvailable),
      canDefineCustomProfessionName: () => false, // TODO
      availableHairColors: () => this.personalData.availableHairColors,
      availableEyeColors: () => this.personalData.availableEyeColors,
      randomHeightCalculationString: () => this.personalData.randomHeightCalculationString,
      randomWeightCalculationString: () => this.personalData.randomWeightCalculationString,
      availableSocialStatuses: () => this.personalData.availableSocialStatuses,
      availableHairColorsIdDice: () => this.personalData.availableHairColorsIdDice,
      availableEyeColorsIdDice: () => this.personalData.availableEyeColorsIdDice,
      age: () => this.personalData.age,
      characteristics: () => this.personalData.characteristics,
      dateOfBirth: () => this.personalData.dateOfBirth,
      family: () => this.personalData.family,
      otherInfo: () => this.personalData.otherInfo,
      placeOfBirth: () => this.personalData.placeOfBirth,
      eyeColor: () => this.personalData.eyeColor,
      predefinedEyeColor: () => this.personalData.predefinedEyeColor,
      hairColor: () => this.personalData.hairColor,
      predefinedHairColor: () => this.personalData.predefinedHairColor,
      size: () => this.personalData.size,
      socialStatus: () => this.personalData.socialStatus,
      title: () => this.personalData.title,
      weight: () => this.personalData.weight,
      isRaceSelected: () => this.race !== undefined,
      race: () => this.race?.base,
      raceId: () => this.race?.id,
      raceVariant: () => this.race?.variant,
      raceVariantId: () => this.race?.variantId,
      raceName: () => this.race?.fullName,
      races: () => this.racesForDisplay,
      raceVariants: () => this.race?.raceVariantsForDisplay,
      selectedAttributeAdjustment: () => this.race?.selectedAttributeAdjustmentId,
      isCultureSelected: () => this.culture !== undefined,
      cultureId: () => this.culture?.id,
      cultureName: () => this.culture?.name,
      cultures: () => this.culturesForDisplay,
      professionId: () => this.profession?.baseId,
      professionVersionId: () => this.profession?.versionId,
      professionPackageId: () => this.profession?.packageId,
      professionVariantId: () => this.profession?.variantId,
      professionName: () => this.profession?.fullNameParts?.fullName,
      professions: () => this.professionsForDisplay,
      professionVariants: () => this.profession?.professionVariantsForDisplay,
      isVariantSelectionRequired: () => this.profession?.isVariantSelectionRequired,
      raceCultureProfessionSelectOptions: () => this.raceCultureProfessionSelectOptions,
      includeAllPublications: () => this.rules.includeAllPublications,
      publications: () => this.rules.publications,
      focusRules: () => this.rules.focusRules.rulesForDisplay,
      optionalRules: () => this.rules.optionalRules.rulesForDisplay,
      alternativeRules: () => this.rules.alternativeRules.rulesForDisplay,
      canRemove: () => this.canRemove,
      isInCharacterCreation: () => this.isInCharacterCreation,
      isCharacterCreationFinished: () => this.isCharacterCreationFinished,
      phase: () => this.phase,
      adventurePointsStats: () => this.adventurePointsStats,
      attributes: () => this.attributes.attributes,
      attributesTotal: () => this.attributes.attributesTotal,
      attributesTotalMaximum: () => this.attributes.attributesTotalMaximum,
      availableAdjustments: () => this.attributes.availableAdjustments,
      derivedCharacteristics: () => this.derivedCharacteristics.derivedCharacteristics,
      maximumAdventurePointsForMagicalAdvantagesAndDisadvantages: () =>
        this.maximumAdventurePointsForMagicalAdvantagesAndDisadvantages,
      activeAdvantages: () => this.advantages.activeForDisplay,
      inactiveAdvantages: () => this.advantages.inactive,
      activeDisadvantages: () => this.disadvantages.activeForDisplay,
      inactiveDisadvantages: () => this.disadvantages.inactive,
      skills: () => this.skills.skills,
      closeCombatTechniques: () => this.closeCombatTechniques.combatTechniques,
      rangedCombatTechniques: () => this.rangedCombatTechniques.combatTechniques,
      isSpellcaster: () => this.isSpellcaster,
      isBlessedOne: () => this.isBlessedOne,
      inactiveCantrips: () => this.cantrips.inactiveForDisplay,
      inactiveSpells: () => this.spells.inactiveForDisplay,
      inactiveRituals: () => this.rituals.inactiveForDisplay,
      inactiveMagicalActions: () => this.magicalActions.inactiveForDisplay,
      inactiveBlessings: () => this.blessings.inactiveForDisplay,
      inactiveLiturgicalChants: () => this.liturgicalChants.inactiveForDisplay,
      inactiveCeremonies: () => this.ceremonies.inactiveForDisplay,
      activeCantrips: () => this.cantrips.activeForDisplay,
      activeSpells: () => this.spells.activeForDisplay,
      activeRituals: () => this.rituals.activeForDisplay,
      activeMagicalActions: () => this.magicalActions.activeForDisplay,
      activeBlessings: () => this.blessings.activeForDisplay,
      activeLiturgicalChants: () => this.liturgicalChants.activeForDisplay,
      activeCeremonies: () => this.ceremonies.activeForDisplay,
      activeSpecialAbilities: () => this.specialAbilities.active,
      inactiveSpecialAbilities: () => this.specialAbilities.inactive,
    } satisfies Record<string, () => unknown>
  }

  @computed
  get overview(): CharacterOverview {
    return {
      id: this.id,
      name: this.name,
      avatar: this.avatar,
      dateCreated: this.dateCreated.toJSON(),
      dateLastModified: this.dateLastModified.toJSON(),
      raceName: this.race?.fullName,
      cultureName: this.culture?.name,
      professionName: this.profession?.fullNameParts?.fullName,
      totalAdventurePoints: this.totalAdventurePoints,
      adventurePointsSpent: this.adventurePointsSpent,
    }
  }

  static exampleCharacter(global: Global, id: string, version: string): Character {
    const character = new FullCharacter(
      global,
      id,
      version,
      "2b0a18c5-40a8-4c86-98b3-a93c85e82497",
      undefined,
      undefined,
      "Improvement",
      ["48a1fe0b-ec55-4992-b47b-e1086f2a583f", undefined, []],
      ["481c50a3-416c-4aa9-8ee9-dc93cc72c2b3", false, []],
      ["0a9b8d85-3d9e-4297-aea0-51549b520ed6"],
    )
    character.name = "Alrik"
    character.rules.includeAllPublications = true
    return character
  }

  abstract toJSON(): RawCharacter
}

export class CharacterInRaceCultureProfessionSelection extends BaseCharacter<"RaceCultureProfession"> {
  @observable accessor race: CharacterRace | undefined
  @observable accessor culture: CharacterCulture | undefined
  @observable accessor profession: CharacterProfession | undefined

  constructor(
    global: Global,
    id: string,
    ...args:
      | [raw: RawCharacterInRaceCultureProfessionSelection]
      | [
          version: string,
          experienceLevelId: string,
          dateCreated?: Temporal.ZonedDateTime,
          dateLastModified?: Temporal.ZonedDateTime,
        ]
  ) {
    if (args.length === 1) {
      const [raw] = args
      super(global, id, raw)
      this.race = raw.race ? new CharacterRace(global, this, raw.race) : undefined
      this.culture = raw.culture ? new CharacterCulture(global, this, raw.culture) : undefined
      this.profession = raw.profession
        ? new CharacterProfession(global, this, raw.profession)
        : undefined
    } else {
      const [version, experienceLevelId, dateCreated, dateLastModified] = args
      super(
        global,
        id,
        version,
        experienceLevelId,
        "RaceCultureProfession",
        dateCreated,
        dateLastModified,
      )
    }
  }

  toJSON(): RawCharacterInRaceCultureProfessionSelection {
    return {
      phase: "RaceCultureProfession",
      version: this.version,
      name: this.name,
      dateCreated: this.dateCreated.toJSON(),
      dateLastModified: this.dateCreated.toJSON(),
      adventurePoints: {
        total: this.adventurePointsStats.total,
        available: this.adventurePointsStats.available,
        spent: this.adventurePointsStats.spent,
        spentOnAdvantages: this.adventurePointsStats.spentOnAdvantages,
        spentOnMagicalAdvantages: this.adventurePointsStats.spentOnMagicalAdvantages,
        spentOnBlessedAdvantages: this.adventurePointsStats.spentOnBlessedAdvantages,
        spentOnDisadvantages: this.adventurePointsStats.spentOnDisadvantages,
        spentOnMagicalDisadvantages: this.adventurePointsStats.spentOnMagicalDisadvantages,
        spentOnBlessedDisadvantages: this.adventurePointsStats.spentOnBlessedDisadvantages,
        spentOnRace: this.adventurePointsStats.spentOnRace,
        spentOnAttributes: this.adventurePointsStats.spentOnAttributes,
        spentOnSkills: this.adventurePointsStats.spentOnSkills,
        spentOnCombatTechniques: this.adventurePointsStats.spentOnCombatTechniques,
        spentOnSpells: this.adventurePointsStats.spentOnSpells,
        spentOnCantrips: this.adventurePointsStats.spentOnCantrips,
        spentOnMagicalActions: this.adventurePointsStats.spentOnMagicalActions,
        spentOnLiturgicalChants: this.adventurePointsStats.spentOnLiturgicalChants,
        spentOnBlessings: this.adventurePointsStats.spentOnBlessings,
        spentOnSpecialAbilities: this.adventurePointsStats.spentOnSpecialAbilities,
        spentOnEnergies: this.adventurePointsStats.spentOnEnergies,
      },
      experienceLevel: {
        current: this.experienceLevel.currentId,
        start: this.experienceLevel.startId,
      },
      race: this.race?.toJSON(),
      culture: this.culture?.toJSON(),
      profession: this.profession?.toJSON(),
      curriculum: this.curriculum?.toJSON(),
      rules: this.rules.toJSON(),
      personalData: this.personalData.toJSON(),
    }
  }
}

export class FullCharacter extends BaseCharacter<"Finished" | "Improvement"> {
  /**
   * An object storing the identifiers of the race and its optional race variant.
   */
  race: CharacterRace

  /**
   * An object storing the identifier of the culture and if the cultural package has been applied.
   */
  culture: CharacterCulture

  /**
   * An object storing the identifiers of the profession, its instance and its optional profession variant.
   */
  profession: CharacterProfession

  constructor(
    global: Global,
    id: string,
    ...args:
      | [raw: RawFullCharacter]
      | [
          version: string,
          experienceLevelId: string,
          dateCreated: Temporal.ZonedDateTime | undefined,
          dateLastModified: Temporal.ZonedDateTime | undefined,
          phase: "Finished" | "Improvement",
          race: CharacterRace | ConsParamsTrim<typeof CharacterRace, 2>,
          culture: CharacterCulture | ConsParamsTrim<typeof CharacterCulture, 2>,
          profession: CharacterProfession | ConsParamsTrim<typeof CharacterProfession, 2>,
        ]
  ) {
    if (args.length === 1) {
      const [json] = args
      super(global, id, json)
      this.race = new CharacterRace(global, this, json.race)
      this.culture = new CharacterCulture(global, this, json.culture)
      this.profession = new CharacterProfession(global, this, json.profession)
      this.phase = json.phase

      this.derivedCharacteristics = CharacterDerivedCharacteristics.fromJSON(
        global,
        this,
        json.derivedCharacteristics,
      )
      this.cantrips = CharacterCantrips.fromJSON(global, this, json.cantrips)
      this.blessings = CharacterBlessings.fromJSON(global, this, json.blessings)
      this.purse = Purse.fromJSON(json.purse)
    } else {
      const [
        version,
        experienceLevelId,
        dateCreated,
        dateLastModified,
        phase,
        race,
        culture,
        profession,
      ] = args
      super(global, id, version, experienceLevelId, phase, dateCreated, dateLastModified)
      this.race =
        race instanceof CharacterRace
          ? new CharacterRace(
              global,
              this,
              race.variantId,
              race.selectedAttributeAdjustmentId,
              race.dependencies,
            )
          : new CharacterRace(global, this, ...race)
      this.culture =
        culture instanceof CharacterCulture
          ? new CharacterCulture(
              global,
              this,
              culture.id,
              culture.isCulturalPackageApplied,
              culture.dependencies,
            )
          : new CharacterCulture(global, this, ...culture)
      this.profession =
        profession instanceof CharacterProfession
          ? new CharacterProfession(
              global,
              this,
              profession.packageId,
              profession.variantId,
              profession.customName,
            )
          : new CharacterProfession(global, this, ...profession)
    }
  }

  toJSON(): RawFullCharacter {
    return {
      phase: this.phase,
      version: this.version,
      name: this.name,
      dateCreated: this.dateCreated.toJSON(),
      dateLastModified: this.dateCreated.toJSON(),
      adventurePoints: {
        total: this.adventurePointsStats.total,
        available: this.adventurePointsStats.available,
        spent: this.adventurePointsStats.spent,
        spentOnAdvantages: this.adventurePointsStats.spentOnAdvantages,
        spentOnMagicalAdvantages: this.adventurePointsStats.spentOnMagicalAdvantages,
        spentOnBlessedAdvantages: this.adventurePointsStats.spentOnBlessedAdvantages,
        spentOnDisadvantages: this.adventurePointsStats.spentOnDisadvantages,
        spentOnMagicalDisadvantages: this.adventurePointsStats.spentOnMagicalDisadvantages,
        spentOnBlessedDisadvantages: this.adventurePointsStats.spentOnBlessedDisadvantages,
        spentOnRace: this.adventurePointsStats.spentOnRace,
        spentOnAttributes: this.adventurePointsStats.spentOnAttributes,
        spentOnSkills: this.adventurePointsStats.spentOnSkills,
        spentOnCombatTechniques: this.adventurePointsStats.spentOnCombatTechniques,
        spentOnSpells: this.adventurePointsStats.spentOnSpells,
        spentOnCantrips: this.adventurePointsStats.spentOnCantrips,
        spentOnMagicalActions: this.adventurePointsStats.spentOnMagicalActions,
        spentOnLiturgicalChants: this.adventurePointsStats.spentOnLiturgicalChants,
        spentOnBlessings: this.adventurePointsStats.spentOnBlessings,
        spentOnSpecialAbilities: this.adventurePointsStats.spentOnSpecialAbilities,
        spentOnEnergies: this.adventurePointsStats.spentOnEnergies,
      },
      experienceLevel: {
        current: this.experienceLevel.currentId,
        start: this.experienceLevel.startId,
      },
      race: this.race.toJSON(),
      culture: this.culture.toJSON(),
      profession: this.profession.toJSON(),
      curriculum: this.curriculum?.toJSON(),
      rules: this.rules.toJSON(),
      personalData: this.personalData.toJSON(),
      advantages: this.advantages.toJSON(),
      disadvantages: this.disadvantages.toJSON(),
      specialAbilities: this.specialAbilities.toJSON(),
      attributes: this.attributes.toJSON(),
      derivedCharacteristics: this.derivedCharacteristics.toJSON(),
      skills: this.skills.toJSON(),
      combatTechniques: ensureNonEmptyObject({
        melee: this.closeCombatTechniques.toJSON(),
        ranged: this.rangedCombatTechniques.toJSON(),
      }),
      cantrips: this.cantrips.toJSON(),
      spells: this.spells.toJSON(),
      rituals: this.rituals.toJSON(),
      magicalActions: this.magicalActions.toJSON(),
      blessings: this.blessings.toJSON(),
      liturgicalChants: this.liturgicalChants.toJSON(),
      ceremonies: this.ceremonies.toJSON(),
      purse: this.purse.toJSON(),
    }
  }

  static applyRaceCultureProfessionSelection(
    character: CharacterInRaceCultureProfessionSelection,
    race: CharacterRace,
    culture: CharacterCulture,
    profession: CharacterProfession,
    selectedOptions: SerializedSelectedRCPOptions,
  ): FullCharacter {
    const { global } = character
    const json = character.toJSON()
    const transformedCharacter = new FullCharacter(
      character.global,
      character.id,
      Object.assign(json, {
        phase: "Improvement" as const,
      }),
    )

    transformedCharacter.personalityTraits.insertFrom(character.personalityTraits)

    // Race

    for (const advantage of race.variant?.automatic_advantages ?? []) {
      transformedCharacter.advantages.add(advantage.id, {
        level: advantage.level,
        options: advantage.options?.map(option => ({
          type: "Predefined",
          id: option,
        })),
      })
    }

    for (const disadvantage of race.variant?.automatic_disadvantages ?? []) {
      transformedCharacter.disadvantages.add(disadvantage.id, {
        level: disadvantage.level,
        options: disadvantage.options?.map(option => ({
          type: "Predefined",
          id: option,
        })),
      })
    }

    for (const advantage of race.variant?.strongly_recommended_advantages ?? []) {
      transformedCharacter.advantages.add(advantage.id, {
        level: advantage.level,
        options: advantage.options?.map(option => ({
          type: "Predefined",
          id: option,
        })),
      })
    }

    for (const disadvantage of race.variant?.strongly_recommended_disadvantages ?? []) {
      transformedCharacter.disadvantages.add(disadvantage.id, {
        level: disadvantage.level,
        options: disadvantage.options?.map(option => ({
          type: "Predefined",
          id: option,
        })),
      })
    }

    race.selectedAttributeAdjustmentId = selectedOptions.attributeAdjustmentId

    // Culture

    if (selectedOptions.buyCulturalPackage) {
      for (const skill of culture.base?.cultural_package ?? []) {
        transformedCharacter.skills.increment(skill.id, skill.points)
      }
    }

    const nativeTongue = selectedOptions.nativeTongue ?? culture.base?.language[0]?.id

    if (nativeTongue !== undefined) {
      transformedCharacter
        .getActivatableCollection(global.settings.language.kind)
        .add(fromUniformCase(global.settings.language), {
          level: 4,
          options: [{ type: "Predefined", id: Case("Language", nativeTongue) }],
        })
    }

    const nativeScript = selectedOptions.buyScript
      ? (selectedOptions.script ?? culture.base?.script?.[0])
      : undefined

    if (nativeScript !== undefined) {
      transformedCharacter
        .getActivatableCollection(global.settings.script.kind)
        .add(fromUniformCase(global.settings.script), {
          options: [{ type: "Predefined", id: Case("Script", nativeScript) }],
        })
    }

    // Profession

    const curriculum =
      profession.base?.group.kind === "Magical"
        ? profession.base.group.Magical.curriculum
        : undefined

    if (curriculum !== undefined) {
      transformedCharacter.curriculum = new CharacterCurriculum(curriculum)
    }

    if (
      selectedOptions.skillSpecialization !== undefined &&
      selectedOptions.skillSpecializationApplication !== undefined
    ) {
      transformedCharacter
        .getActivatableCollection(global.settings.skillSpecialization.kind)
        .add(fromUniformCase(global.settings.skillSpecialization), {
          options: [
            { type: "Predefined", id: Case("Skill", selectedOptions.skillSpecialization) },
            { type: "Predefined", id: selectedOptions.skillSpecializationApplication },
          ],
        })
    }

    for (const [language, languageLevel] of selectedOptions.languages) {
      transformedCharacter
        .getActivatableCollection(global.settings.language.kind)
        .add(fromUniformCase(global.settings.language), {
          level: languageLevel,
          options: [{ type: "Predefined", id: Case("Language", language) }],
        })
    }

    for (const script of selectedOptions.scripts) {
      transformedCharacter
        .getActivatableCollection(global.settings.script.kind)
        .add(fromUniformCase(global.settings.script), {
          options: [{ type: "Predefined", id: Case("Script", script) }],
        })
    }

    for (const [skill, skillRating] of selectedOptions.skills) {
      transformedCharacter.skills.increment(skill, skillRating)
    }

    for (const { id: combatTechnique, ratingModifier } of selectedOptions.combatTechniques) {
      switch (combatTechnique.kind) {
        case "CloseCombatTechnique":
          transformedCharacter.closeCombatTechniques.increment(
            fromUniformCase(combatTechnique),
            ratingModifier,
          )
          break
        case "RangedCombatTechnique":
          transformedCharacter.rangedCombatTechniques.increment(
            fromUniformCase(combatTechnique),
            ratingModifier,
          )
          break
        default:
          return assertExhaustive(combatTechnique)
      }
    }

    for (const cantrip of selectedOptions.cantrips) {
      transformedCharacter.cantrips.activate(cantrip)
    }

    for (const [entity, entityMap] of selectedOptions.spellworks) {
      switch (entity) {
        case "Spell":
          for (const [id, rating] of entityMap) {
            transformedCharacter.spells.activate(id)
            transformedCharacter.spells.increment(id, rating)
          }
          break
        case "Ritual":
          for (const [id, rating] of entityMap) {
            transformedCharacter.rituals.activate(id)
            transformedCharacter.rituals.increment(id, rating)
          }
          break
        default:
          return assertExhaustive(entity)
      }
    }

    // TODO: Uncomment once magical actions are implemented
    // for (const [id, rating] of selectedOptions.curses) {
    //   transformedCharacter.magicalActions.curses.activate(id)
    //   transformedCharacter.magicalActions.curses.increment(id, rating)
    // }

    for (const [entity, entityMap] of selectedOptions.liturgies) {
      switch (entity) {
        case "LiturgicalChant":
          for (const [id, rating] of entityMap) {
            transformedCharacter.liturgicalChants.activate(id)
            transformedCharacter.liturgicalChants.increment(id, rating)
          }
          break
        case "Ceremony":
          for (const [id, rating] of entityMap) {
            transformedCharacter.ceremonies.activate(id)
            transformedCharacter.ceremonies.increment(id, rating)
          }
          break
        default:
          return assertExhaustive(entity)
      }
    }

    const applyActivatablePrerequisite = (
      p: Omit<ProfessionActivatablePrerequisite, "active">,
    ): void => {
      if (p.options?.every(opt => opt.kind !== "Select")) {
        transformedCharacter.getActivatableCollection(p.id.kind).add(fromUniformCase(p.id), {
          level: p.level,
          options: p.options?.map((option): ActivatableOption => {
            switch (option.kind) {
              case "Identifier":
                return {
                  type: "Predefined",
                  id: option.Identifier,
                }
              case "Text":
                return {
                  type: "Custom",
                  value: global.locale.translateMap(option.Text.translations)?.text ?? "",
                }
              default:
                return assertExhaustive(option)
            }
          }),
        })
      }
    }

    const applyPrerequisite = (p: ProfessionPrerequisiteGroup): void => {
      switch (p.kind) {
        case "Activatable":
          applyActivatablePrerequisite(p.Activatable)
          break
        case "Rated": {
          const collection = transformedCharacter.getRatedCollection(p.Rated.id.kind)
          if (collection instanceof CharacterActivatableRatedEntries) {
            collection.activate(fromUniformCase(p.Rated.id))
          }
          collection.increment(fromUniformCase(p.Rated.id), p.Rated.value)
          break
        }
        case "Energy":
          // TODO: How to do this?
          break
        case "Culture":
        case "Race":
        case "RatedMinimumNumber":
        case "Rule":
        case "Sex":
          break
        default:
          return assertExhaustive(p)
      }
    }

    const applyEnhancementPrerequisite = (p: EnhancementPrerequisite): void => {
      const parent = global.db.getInstanceOfEntityById("Enhancement", p.id)?.parent
      if (parent !== undefined) {
        const collection = transformedCharacter.getActivatableRatedWithEnhancementsCollection(
          parent.kind,
        )
        if (collection instanceof CharacterActivatableRatedEntries) {
          collection.activateEnhancement(fromUniformCase(parent), p.id)
        }
      }
    }

    for (const separate of selectedOptions.separate) {
      switch (separate.kind) {
        case "IncompleteActivatable":
          transformedCharacter
            .getActivatableCollection(separate.IncompleteActivatable.id.kind)
            .add(
              fromUniformCase(separate.IncompleteActivatable.id),
              separate.IncompleteActivatable.instance,
            )
          break
        case "Enhancement": {
          applyEnhancementPrerequisite(separate.Enhancement)
          break
        }
        default:
          applyPrerequisite(separate)
      }
    }

    const applyPrerequisiteElement = (
      p: PrerequisitesElement<ProfessionPrerequisiteGroup>,
    ): void => {
      switch (p.kind) {
        case "Single":
          applyPrerequisite(p.Single)
          break
        case "Disjunction":
          break
        case "Group":
          for (const gp of p.Group.list) {
            applyPrerequisite(gp)
          }
          break
        default:
          return assertExhaustive(p)
      }
    }

    for (const prerequisite of profession.package?.prerequisites ?? []) {
      if (
        !(
          profession.variant?.prerequisites?.some(
            vp => vp.kind === "Remove" && deepEqual(prerequisite, vp.Remove),
          ) ?? false
        )
      ) {
        applyPrerequisiteElement(prerequisite)
      }
    }

    for (const prerequisite of profession.variant?.prerequisites ?? []) {
      if (prerequisite.kind === "Add") {
        applyPrerequisiteElement(prerequisite.Add)
      }
    }

    for (const specialAbility of (
      profession.package?.special_abilities?.filter(
        p =>
          !(
            profession.variant?.special_abilities?.some(
              sa => sa.action.kind === "Remove" && deepEqual(p, sa.value),
            ) ?? false
          ),
      ) ?? []
    ).concat(
      profession.variant?.special_abilities
        ?.filter(p => p.action.kind === "Override")
        .map(p => p.value) ?? [],
    )) {
      if (specialAbility.kind === "Constant") {
        if (specialAbility.Constant.id.kind === "Enhancement") {
          applyEnhancementPrerequisite({ id: specialAbility.Constant.id.Enhancement })
        } else if (
          checkProfessionSpecialAbilityRulePrerequisites(
            specialAbility.Constant,
            global,
            transformedCharacter,
          )
        ) {
          applyActivatablePrerequisite({
            ...specialAbility.Constant,
            id: specialAbility.Constant.id,
          })
        }
      } else {
        const selection = specialAbility.Selection.options.filter(sa =>
          checkProfessionSpecialAbilityRulePrerequisites(sa, global, transformedCharacter),
        )
        if (isNotEmpty(selection) && selection.length === 1) {
          if (selection[0].id.kind === "Enhancement") {
            applyEnhancementPrerequisite({ id: selection[0].id.Enhancement })
          } else {
            applyActivatablePrerequisite({
              ...selection[0],
              id: selection[0].id,
            })
          }
        }
      }
    }

    for (const { id, rating_modifier } of (profession.package?.skills ?? []).concat(
      profession.variant?.skills ?? [],
    )) {
      transformedCharacter.skills.increment(id, rating_modifier)
    }

    for (const { id, rating_modifier } of (profession.package?.combat_techniques ?? []).concat(
      profession.variant?.combat_techniques ?? [],
    )) {
      const stringId = fromUniformCase(id)
      switch (id.kind) {
        case "CloseCombatTechnique":
          transformedCharacter.closeCombatTechniques.increment(stringId, rating_modifier)
          break
        case "RangedCombatTechnique":
          transformedCharacter.rangedCombatTechniques.increment(stringId, rating_modifier)
          break
        default:
          return assertExhaustive(id)
      }
    }

    for (const cantrip of profession.package?.cantrips ?? []) {
      transformedCharacter.cantrips.activate(cantrip)
    }

    for (const { id, rating_modifier: rating } of (profession.package?.spells ?? []).concat(
      profession.variant?.spells ?? [],
    )) {
      if (isNotEmpty(id) && id.length === 1) {
        switch (id[0].kind) {
          case "MagicalAction":
            // TODO
            break
          case "Spellwork":
            switch (id[0].Spellwork.id.kind) {
              case "Spell":
                transformedCharacter.spells.activate(id[0].Spellwork.id.Spell)
                transformedCharacter.spells.increment(id[0].Spellwork.id.Spell, rating)
                break
              case "Ritual":
                transformedCharacter.rituals.activate(id[0].Spellwork.id.Ritual)
                transformedCharacter.rituals.increment(id[0].Spellwork.id.Ritual, rating)
                break
              default:
                return assertExhaustive(id[0].Spellwork.id)
            }
            break
          default:
            return assertExhaustive(id[0])
        }
      }
    }

    for (const { id, rating_modifier: rating } of (
      profession.package?.liturgical_chants ?? []
    ).concat(profession.variant?.liturgical_chants ?? [])) {
      if (isNotEmpty(id) && id.length === 1) {
        switch (id[0].kind) {
          case "LiturgicalChant":
            transformedCharacter.liturgicalChants.activate(id[0].LiturgicalChant)
            transformedCharacter.liturgicalChants.increment(id[0].LiturgicalChant, rating)
            break
          case "Ceremony":
            transformedCharacter.ceremonies.activate(id[0].Ceremony)
            transformedCharacter.ceremonies.increment(id[0].Ceremony, rating)
            break
          default:
            return assertExhaustive(id[0])
        }
      }
    }

    return transformedCharacter
  }
}

export type CharacterCreationPhase = "RaceCultureProfession" | "Improvement" | "Finished"

export type Character = CharacterInRaceCultureProfessionSelection | FullCharacter

type RatedCollectionByEntity<E extends RatedIdentifier["kind"]> = {
  Attribute: CharacterAttributes
  Skill: CharacterSkills
  CloseCombatTechnique: CharacterCombatTechniques<"CloseCombatTechnique">
  RangedCombatTechnique: CharacterCombatTechniques<"RangedCombatTechnique">
  Spell: CharacterSpellworks<"Spell">
  Ritual: CharacterSpellworks<"Ritual">
  LiturgicalChant: CharacterLiturgicalChants<"LiturgicalChant">
  Ceremony: CharacterLiturgicalChants<"Ceremony">
}[E]

export type DisplayedRaceCultureProfessionSelectOptions = {
  race: DisplayedRaceSelectOptions
  culture: DisplayedCultureSelectOptions
  profession: DisplayedProfessionSelectOptions
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
  spentOnMagicalActions: number
  spentOnLiturgicalChants: number
  spentOnBlessings: number
  spentOnSpecialAbilities: number
  spentOnEnergies: number
}

export type CharacterOverview = {
  id: string
  name: string
  avatar?: string
  dateCreated: string
  dateLastModified: string
  raceName: string | undefined
  cultureName: string | undefined
  professionName: string | undefined
  totalAdventurePoints: number
  adventurePointsSpent: number
}

export class Characters {
  readonly global: Global
  readonly appVersion: string

  constructor(global: Global, appVersion: string) {
    this.global = global
    this.appVersion = appVersion
  }

  @observable accessor characters: Map<string, Character> = new Map()

  @computed
  get characterOverviews(): CharacterOverview[] {
    return this.characters
      .values()
      .map(character => character.overview)
      .toArray()
  }

  @action
  handleIPCAction(
    id: string,
    ...args: StateActionsAsParameters<CharacterIPCActions>
  ): void | RoutePath {
    const result = this.characters.get(id)?.handleIPCAction(...args)

    if (result !== undefined) {
      if (result.transformedCharacter !== undefined) {
        this.characters.set(id, result.transformedCharacter)
      }
      if (result.newRoute !== undefined) {
        return ["characters", id, result.newRoute]
      }
    }
  }

  @action
  addCharacter(character: Character) {
    this.characters.set(character.id, character)
  }

  @action
  addCharacterFromJSON(id: string, json: RawCharacter) {
    switch (json.phase) {
      case "RaceCultureProfession":
        return this.characters.set(
          id,
          new CharacterInRaceCultureProfessionSelection(this.global, id, json),
        )
      case "Finished":
      case "Improvement":
        return this.characters.set(id, new FullCharacter(this.global, id, json))
      default:
        return assertExhaustive(json)
    }
  }
}
