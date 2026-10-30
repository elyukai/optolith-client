import { isNotEmpty } from "@elyukai/utils/array/nonEmpty"
import { isNotNullish } from "@elyukai/utils/nullable"
import { isInRange } from "@elyukai/utils/range"
import { assertExhaustive } from "@elyukai/utils/typeSafety"
import type {
  ActivatableIdentifier,
  Aspect_ID,
  MagicalTradition_ID,
  Property_ID,
  RatedIdentifier,
  SkillWithEnhancementsIdentifier,
  TinyActivatableIdentifier,
} from "@optolith/database-schema/gen"
import { action, computed, observable } from "mobx"
import type { Case } from "tsondb/schema/gen"
import type { Global } from "../global.ts"
import type { CharacterIPCActions } from "../ipc.ts"
import type { StateActionsAsParameters } from "../state.ts"
import { CharacterActivatables, type CharacterActivatable } from "./activatable/activatable.ts"
import { getMaximumAdventurePointsForMagicalAdvantagesAndDisadvantages } from "./activatable/advantagesDisadvantages.ts"
import { CharacterSpecialAbilities } from "./activatable/specialAbilities.ts"
import type { TinyActivatable, TinyActivatables } from "./activatable/tinyActivatable.ts"
import { CharacterCulture } from "./culture.ts"
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
import { CharacterProfession } from "./profession.ts"
import type { Purse } from "./purse.ts"
import { CharacterRace } from "./race.ts"
import { CharacterAttributes } from "./rated/attribute.ts"
import { CharacterCombatTechniques } from "./rated/combatTechnique.ts"
import { CharacterBlessings, CharacterLiturgicalChants } from "./rated/liturgicalChant.ts"
import type { PrimaryAttributeDependency } from "./rated/primaryAttribute.ts"
import type { ActivatableRatedMap } from "./rated/ratedEntry.ts"
import { CharacterSkills } from "./rated/skill.ts"
import { CharacterCantrips, CharacterSpellworks } from "./rated/spell.ts"
import { CharacterRules } from "./rules.ts"
import { CharacterStates } from "./state.ts"

export class Character {
  readonly global: Global
  readonly #characters: Characters

  readonly id: string

  @observable accessor name: string

  @observable accessor avatar: string | undefined

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

  @computed get canFinishCharacterCreation() {
    return isInRange([0, 10], this.adventurePointsAvailable)
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

  /**
   * An object storing the identifier of the culture and if the cultural package has been applied.
   */
  @observable accessor culture: CharacterCulture | undefined

  /**
   * An object storing the identifiers of the profession, its instance and its optional profession variant.
   */
  @observable accessor profession: CharacterProfession | undefined

  @observable accessor curriculum: CharacterCurriculum | undefined

  readonly states: CharacterStates
  readonly personalData: CharacterPersonalData
  readonly personalityTraits: CharacterPersonalityTraits
  @observable accessor pact: CharacterPact | undefined

  readonly attributes: CharacterAttributes
  readonly derivedCharacteristics: CharacterDerivedCharacteristics

  readonly advantages: CharacterActivatables<"Advantage">
  readonly disadvantages: CharacterActivatables<"Disadvantage">

  readonly skills: CharacterSkills
  readonly closeCombatTechniques: CharacterCombatTechniques<"CloseCombatTechnique">
  readonly rangedCombatTechniques: CharacterCombatTechniques<"RangedCombatTechnique">

  readonly cantrips: CharacterCantrips
  readonly spells: CharacterSpellworks<"Spell">
  readonly rituals: CharacterSpellworks<"Ritual">
  readonly blessings: CharacterBlessings
  readonly liturgicalChants: CharacterLiturgicalChants<"LiturgicalChant">
  readonly ceremonies: CharacterLiturgicalChants<"Ceremony">

  readonly specialAbilities: CharacterSpecialAbilities

  @observable accessor magicalPrimaryAttributeDependencies: PrimaryAttributeDependency[] = []
  @observable accessor blessedPrimaryAttributeDependencies: PrimaryAttributeDependency[] = []

  readonly prerequisiteCapabilities: AllCapabilities

  constructor(global: Global, characters: Characters, id: string) {
    this.global = global
    this.#characters = characters
    this.id = id
    this.name = "Alrik"
    this.rules = new CharacterRules(global, true, [])
    this.isCharacterCreationFinished = false
    this.totalAdventurePoints = 1100
    this.experienceLevel = new CharacterExperienceLevel(
      global,
      this,
      "2b0a18c5-40a8-4c86-98b3-a93c85e82497",
    )
    this.race = new CharacterRace(
      global,
      "252841cf-f2d4-4fb9-af56-30de48531db5",
      "48a1fe0b-ec55-4992-b47b-e1086f2a583f",
    )
    this.culture = new CharacterCulture(global, "481c50a3-416c-4aa9-8ee9-dc93cc72c2b3")
    this.profession = new CharacterProfession(global, this, "0a9b8d85-3d9e-4297-aea0-51549b520ed6")
    this.states = new CharacterStates(global, this)
    this.personalData = new CharacterPersonalData(global, this)
    this.personalityTraits = new CharacterPersonalityTraits()
    this.attributes = new CharacterAttributes(global, this)
    this.derivedCharacteristics = new CharacterDerivedCharacteristics(global, this)
    this.advantages = new CharacterActivatables(global, this, "Advantage")
    this.disadvantages = new CharacterActivatables(global, this, "Disadvantage")
    this.skills = new CharacterSkills(global, this)
    this.closeCombatTechniques = new CharacterCombatTechniques(global, this, "CloseCombatTechnique")
    this.rangedCombatTechniques = new CharacterCombatTechniques(
      global,
      this,
      "RangedCombatTechnique",
    )
    this.cantrips = new CharacterCantrips(global, this)
    this.spells = new CharacterSpellworks(global, this, "Spell")
    this.blessings = new CharacterBlessings(global, this)
    this.rituals = new CharacterSpellworks(global, this, "Ritual")
    this.liturgicalChants = new CharacterLiturgicalChants(global, this, "LiturgicalChant")
    this.ceremonies = new CharacterLiturgicalChants(global, this, "Ceremony")
    this.specialAbilities = new CharacterSpecialAbilities(global, this)
    this.prerequisiteCapabilities = createCapabilitiesFromCharacter(global, this)
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
      this.spells.adventurePointsTotal.general +
      this.rituals.adventurePointsTotal.general +
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
      spentOnMagicalAdvantages: 0,
      spentOnBlessedAdvantages: 0,
      spentOnDisadvantages: this.disadvantages.adventurePointsTotal.getTotal(),
      spentOnMagicalDisadvantages: 0,
      spentOnBlessedDisadvantages: 0,
      spentOnRace: 0,
      spentOnProfession: 0,
      spentOnAttributes: this.attributes.adventurePointsTotal.getTotal(),
      spentOnSkills: this.skills.adventurePointsTotal.getTotal(),
      spentOnCombatTechniques:
        this.closeCombatTechniques.adventurePointsTotal.getTotal() +
        this.rangedCombatTechniques.adventurePointsTotal.getTotal(),
      spentOnSpells:
        this.spells.adventurePointsTotal.getTotal() + this.rituals.adventurePointsTotal.getTotal(),
      spentOnCantrips: 0,
      spentOnLiturgicalChants:
        this.liturgicalChants.adventurePointsTotal.getTotal() +
        this.ceremonies.adventurePointsTotal.getTotal(),
      spentOnBlessings: 0,
      spentOnSpecialAbilities: this.specialAbilities.adventurePointsTotal.getTotal(),
      spentOnEnergies: this.derivedCharacteristics.adventurePointsTotal.getTotal(),
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

  handleIPCAction(...args: StateActionsAsParameters<CharacterIPCActions>) {
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
      case "setCustomProfessionName":
        return this.profession?.setCustomProfessionName(args[1][0])
      case "incrementRated":
        return this.getRatedCollection(args[1][0])?.increment(args[1][1])
      case "decrementRated":
        return this.getRatedCollection(args[1][0])?.decrement(args[1][1])
      case "incrementRatedToMax":
        return this.getRatedCollection(args[1][0])?.incrementToMax(args[1][1])
      case "decrementRatedToMin":
        return this.getRatedCollection(args[1][0])?.decrementToMin(args[1][1])
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
        return this.getActivatableRatedWithEnhancementsCollection(args[1][0])?.activate(args[1][1])
      case "deactivateRated":
        return this.getActivatableRatedWithEnhancementsCollection(args[1][0])?.deactivate(
          args[1][1],
        )
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
      characterOverviews: () => this.#characters.characterOverviews,
      name: () => this.name,
      avatar: () => this.avatar,
      sexName: () => this.personalData.sexName,
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
      raceVariant: () => this.race?.variant,
      raceName: () => this.race?.fullName,
      isCultureSelected: () => this.culture !== undefined,
      cultureName: () => this.culture?.name,
      professionName: () => this.profession?.fullNameParts?.fullName,
      includeAllPublications: () => this.rules.includeAllPublications,
      publications: () => this.rules.publications,
      focusRules: () => this.rules.focusRules.rulesForDisplay,
      optionalRules: () => this.rules.optionalRules.rulesForDisplay,
      canRemove: () => this.canRemove,
      isInCharacterCreation: () => this.isInCharacterCreation,
      isCharacterCreationFinished: () => this.isCharacterCreationFinished,
      adventurePointsStats: () => this.adventurePointsStats,
      attributes: () => this.attributes.attributes,
      attributesTotal: () => this.attributes.attributesTotal,
      attributesTotalMaximum: () => this.attributes.attributesTotalMaximum,
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
      isSpellcaster: () => this.activeMagicalTraditions.length > 0,
      isBlessedOne: () => this.activeBlessedTradition !== undefined,
      inactiveCantrips: () => this.cantrips.inactiveForDisplay,
      inactiveSpells: () => this.spells.inactiveForDisplay,
      inactiveRituals: () => this.rituals.inactiveForDisplay,
      inactiveBlessings: () => this.blessings.inactiveForDisplay,
      inactiveLiturgicalChants: () => this.liturgicalChants.inactiveForDisplay,
      inactiveCeremonies: () => this.ceremonies.inactiveForDisplay,
      activeCantrips: () => this.cantrips.activeForDisplay,
      activeSpells: () => this.spells.activeForDisplay,
      activeRituals: () => this.rituals.activeForDisplay,
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
      dateCreated: new Date().toISOString(), // TODO: this.dateCreated
      dateLastModified: new Date().toISOString(), // TODO: this.dateLastModified
      raceName: this.race?.fullName,
      cultureName: this.culture?.name,
      professionName: this.profession?.fullNameParts?.fullName,
      totalAdventurePoints: this.totalAdventurePoints,
      adventurePointsSpent: this.adventurePointsSpent,
    }
  }
}

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
  @observable accessor characters: Record<string, Character>

  constructor(global: Global) {
    this.characters = {
      "550e8400-e29b-11d4-a716-446655440000": new Character(
        global,
        this,
        "550e8400-e29b-11d4-a716-446655440000",
      ),
    }
  }

  @computed
  get characterOverviews() {
    return Object.values(this.characters).map(character => character.overview)
  }

  @action
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

  // items: {}
  // hitZoneArmors: {}
  purse: Purse
  // creatures: {}
}
