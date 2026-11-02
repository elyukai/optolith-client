import { isNotEmpty } from "@elyukai/utils/array/nonEmpty"
import { reduceWhile, sumWith } from "@elyukai/utils/array/reductions"
import { on } from "@elyukai/utils/function"
import { Lazy } from "@elyukai/utils/lazy"
import { isNotNullish } from "@elyukai/utils/nullable"
import { isInRange } from "@elyukai/utils/range"
import { assertExhaustive } from "@elyukai/utils/typeSafety"
import { getAdventurePointsForRatingRange } from "@optolith/adventure-points/improvement-cost"
import type {
  Character as RawCharacter,
  Character_ID as RawCharacter_ID,
  CharacterInRaceCultureProfessionSelection as RawCharacterInRaceCultureProfessionSelection,
  FullCharacter as RawFullCharacter,
} from "@optolith/character-schema/types"
import type {
  ActivatableIdentifier,
  Aspect_ID,
  MagicalTradition_ID,
  ProfessionPackage,
  Property_ID,
  RatedIdentifier,
  SkillWithEnhancementsIdentifier,
  TinyActivatableIdentifier,
} from "@optolith/database-schema/gen"
import { parensIf } from "@optolith/entity-descriptions/entities/partial/rated/activatable/parensIf"
import { isEntryFromIncludedPublication } from "@optolith/entity-descriptions/publication-options"
import { action, computed, observable } from "mobx"
import type { Case } from "tsondb/schema/gen"
import type { CharacterRoutePath, RoutePath } from "../../main_window/slices/routeSlice.ts"
import type { Global } from "../global.ts"
import type { CharacterIPCActions } from "../ipc.ts"
import type { StateActionsAsParameters } from "../state.ts"
import { ensureNonEmptyObject } from "../utils/object.ts"
import { CharacterActivatables, type CharacterActivatable } from "./activatable/activatable.ts"
import { getMaximumAdventurePointsForMagicalAdvantagesAndDisadvantages } from "./activatable/advantagesDisadvantages.ts"
import { CharacterSpecialAbilities } from "./activatable/specialAbilities.ts"
import type { TinyActivatable, TinyActivatables } from "./activatable/tinyActivatable.ts"
import { CharacterCulture, type CultureForDisplay } from "./culture.ts"
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
  extractActivatableFromProfessionPackage,
  professionNameToString,
  type ProfessionForDisplay,
} from "./profession.ts"
import { Purse } from "./purse.ts"
import { CharacterRace, type RaceForDisplay } from "./race.ts"
import { CharacterAttributes } from "./rated/attribute.ts"
import { CharacterCombatTechniques } from "./rated/combatTechnique.ts"
import { CharacterBlessings, CharacterLiturgicalChants } from "./rated/liturgicalChant.ts"
import type { PrimaryAttributeDependency } from "./rated/primaryAttribute.ts"
import { CharacterSkills } from "./rated/skill.ts"
import { CharacterCantrips, CharacterSpellworks } from "./rated/spell.ts"
import { CharacterRules } from "./rules.ts"
import { CharacterStates } from "./state.ts"

export abstract class BaseCharacter {
  readonly global: Global

  readonly id: string

  /**
   * A valid semantic version (https://semver.org), representing the Optolith
   * version this character was created with.
   */
  version: string

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
    return !this.isCharacterCreationFinished
  }

  @computed
  get canFinishCharacterCreation() {
    return isInRange([0, 10], this.adventurePointsAvailable)
  }

  abstract get phase(): CharacterCreationPhase

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

  @observable accessor areRCPValuesApplied: boolean = false

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

  // TODO magicalActions: {
  //   curses: ActivatableRatedMap
  //   elvenMagicalSongs: ActivatableRatedMap
  //   dominationRituals: ActivatableRatedMap
  //   magicalDances: ActivatableRatedMap
  //   magicalMelodies: ActivatableRatedMap
  //   jesterTricks: ActivatableRatedMap
  //   animistPowers: ActivatableRatedMap
  //   geodeRituals: ActivatableRatedMap
  //   zibiljaRituals: ActivatableRatedMap
  //   magicalRunes: ActivatableRatedMap
  // }

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
    version: string,
    experienceLevelId: string,
    dateCreated: Temporal.ZonedDateTime = Temporal.Now.zonedDateTimeISO(),
    dateLastModified: Temporal.ZonedDateTime = dateCreated,
  ) {
    this.global = global
    this.id = id
    this.name = ""
    this.version = version
    this.dateCreated = dateCreated
    this.dateLastModified = dateLastModified
    this.rules = new CharacterRules(global, false, [])
    this.experienceLevel = new CharacterExperienceLevel(global, this, experienceLevelId)
    this.totalAdventurePoints = this.experienceLevel.start?.adventure_points ?? 0
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
    this.purse = new Purse()
  }

  @computed
  get adventurePointsSpent(): number {
    return (
      (this.race?.base?.ap_value ?? 0) +
      (this.phase === "RaceCultureProfession"
        ? (this.profession?.package?.ap_value ?? 0) + (this.profession?.variant?.ap_value ?? 0)
        : 0) +
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
      spentOnMagicalAdvantages: 0, // TODO
      spentOnBlessedAdvantages: 0, // TODO
      spentOnDisadvantages: this.disadvantages.adventurePointsTotal.getTotal(),
      spentOnMagicalDisadvantages: 0, // TODO
      spentOnBlessedDisadvantages: 0, // TODO
      spentOnRace: this.race?.base?.ap_value ?? 0,
      spentOnProfession:
        this.phase === "RaceCultureProfession"
          ? (this.profession?.package?.ap_value ?? 0) + (this.profession?.variant?.ap_value ?? 0)
          : 0,
      spentOnAttributes: this.attributes.adventurePointsTotal.getTotal(),
      spentOnSkills: this.skills.adventurePointsTotal.getTotal(),
      spentOnCombatTechniques:
        this.closeCombatTechniques.adventurePointsTotal.getTotal() +
        this.rangedCombatTechniques.adventurePointsTotal.getTotal(),
      spentOnCantrips: this.cantrips.adventurePoints.getTotal(),
      spentOnSpells:
        this.spells.adventurePointsTotal.getTotal() + this.rituals.adventurePointsTotal.getTotal(),
      spentOnMagicalActions: 0, // TODO
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
    return this.global.db
      .getAllInstanceContainersOfEntity("Race")
      .filter(race =>
        isEntryFromIncludedPublication(
          race.content,
          this.global.db.getInstanceOfEntityById.bind(this.global.db),
          this.global.locale.translateMap,
          this.rules.publicationOptions,
        ),
      )
      .map(race => ({
        id: race.id,
        name: this.global.locale.translateMap(race.content.translations)?.name ?? race.id,
        apValue: race.content.ap_value,
        variantId:
          this.global.db
            .getAllChildInstanceContainersForParent("RaceVariant", race.id)
            .toSorted(
              on(
                rv => this.global.locale.translateMap(rv.content.translations)?.name ?? "",
                this.global.locale.compare,
              ),
            )[0]?.id ?? race.id,
      }))
  }

  @computed
  get culturesForDisplay(): CultureForDisplay[] {
    return this.global.db
      .getAllInstanceContainersOfEntity("Culture")
      .filter(
        culture =>
          isEntryFromIncludedPublication(
            culture.content,
            this.global.db.getInstanceOfEntityById.bind(this.global.db),
            this.global.locale.translateMap,
            this.rules.publicationOptions,
          ) &&
          (this.race?.variant?.common_cultures?.includes(culture.id) ?? true),
      )
      .map(culture => ({
        id: culture.id,
        name: this.global.locale.translateMap(culture.content.translations)?.name ?? culture.id,
        apValue: sumWith(culture.content.cultural_package, item =>
          getAdventurePointsForRatingRange(
            this.global.db.getInstanceOfEntityById("Skill", item.id)?.improvement_cost.kind ?? "A",
            0,
            item.points,
          ),
        ),
      }))
  }

  @computed
  get professionsForDisplay(): ProfessionForDisplay[] {
    const commonProfessionValidator = this.culture?.getCommonProfessionPredicate() ?? (() => true)
    const startExperienceLevel = this.experienceLevel.start
    const lowerOrMatchingExperienceLevelsInReverseOrder =
      startExperienceLevel === undefined
        ? this.global.sortedExperienceLevels
        : this.global.sortedExperienceLevels
            .filter(el => el.adventurePoints <= startExperienceLevel.adventure_points)
            .reverse()

    return this.global.db
      .getAllInstanceContainersOfEntity("Profession")
      .flatMap(profession =>
        this.global.db
          .getAllChildInstanceContainersForParent("ProfessionVersion", profession.id)
          .filter(professionVersion =>
            isEntryFromIncludedPublication(
              professionVersion.content,
              this.global.db.getInstanceOfEntityById.bind(this.global.db),
              this.global.locale.translateMap,
              this.rules.publicationOptions,
            ),
          )
          .map(professionVersion => {
            const packages = this.global.db.getAllChildInstanceContainersForParent(
              "ProfessionPackage",
              professionVersion.id,
            )

            const professionPackage = reduceWhile(
              lowerOrMatchingExperienceLevelsInReverseOrder,
              (_acc: { id: string; content: ProfessionPackage } | undefined, el) =>
                packages.find(pkg => pkg.content.experience_level === el.id),
              acc => acc !== undefined,
              undefined,
            )

            if (professionPackage === undefined) {
              return undefined
            }

            return {
              parent: profession,
              version: professionVersion,
              package: professionPackage,
            }
          })
          .filter(
            (combined): combined is NonNullable<typeof combined> =>
              isNotNullish(combined) &&
              commonProfessionValidator({
                id: combined.parent.id,
                profession: combined.parent.content,
                magicalTraditions: Lazy.of(() =>
                  extractActivatableFromProfessionPackage(
                    combined.package.content,
                    "MagicalTradition",
                    this.global.db.getInstanceOfEntityById.bind(this.global.db),
                  ),
                ),
                blessedTraditions: Lazy.of(() =>
                  extractActivatableFromProfessionPackage(
                    combined.package.content,
                    "BlessedTradition",
                    this.global.db.getInstanceOfEntityById.bind(this.global.db),
                  ),
                ),
              }),
          ),
      )
      .map((profession): ProfessionForDisplay | undefined => {
        const translation = this.global.locale.translateMap(profession.version.content.translations)
        if (translation === undefined) {
          return undefined
        }
        return {
          id: profession.parent.id,
          name:
            professionNameToString(this.personalData.sex, translation.name) +
            parensIf(
              translation.specification === undefined
                ? undefined
                : professionNameToString(this.personalData.sex, translation.specification),
            ),
          apValue: profession.package.content.ap_value,
          sources: profession.version.content.src
            .map(
              src =>
                this.global.locale.translateMap(
                  this.global.db.getInstanceOfEntityById("Publication", src.id)?.translations,
                )?.abbreviation,
            )
            .filter(isNotNullish)
            .sort(this.global.locale.compare)
            .join(", "),
          versionId: profession.version.id,
          packageId: profession.package.id,
        }
      })
      .filter(isNotNullish)
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

  handleIPCAction(
    ...args: StateActionsAsParameters<CharacterIPCActions>
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
      case "toggleAlternativeRule":
        return this.rules.toggleAlternativeRule(args[1][0])
      case "setRaceVariant":
        this.race = new CharacterRace(this.global, this, args[1][0])
        if (this.phase === "RaceCultureProfession") {
          this.culture = undefined
          this.profession = undefined
        }
        return
      case "setCulture":
        this.culture = new CharacterCulture(this.global, this, args[1][0])
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
          return {
            transformedCharacter: this.transformIntoFullCharacter(
              this.race,
              this.culture,
              this.profession,
            ),
            newRoute: "attributes",
          }
        }
        return
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
      dateCreated: this.dateCreated.toJSON(),
      dateLastModified: this.dateLastModified.toJSON(),
      raceName: this.race?.fullName,
      cultureName: this.culture?.name,
      professionName: this.profession?.fullNameParts?.fullName,
      totalAdventurePoints: this.totalAdventurePoints,
      adventurePointsSpent: this.adventurePointsSpent,
    }
  }

  static fromJSON(global: Global, id: RawCharacter_ID, json: RawCharacter): Character {
    switch (json.phase) {
      case "RaceCultureProfession":
        return CharacterInRaceCultureProfessionSelection.fromJSON(global, id, json)
      case "Finished":
      case "Improvement":
        return FullCharacter.fromJSON(global, id, json)
      default:
        return assertExhaustive(json)
    }
  }

  static exampleCharacter(global: Global, id: string, version: string): Character {
    const character = new FullCharacter(
      global,
      id,
      version,
      "2b0a18c5-40a8-4c86-98b3-a93c85e82497",
      Temporal.Now.zonedDateTimeISO(),
      Temporal.Now.zonedDateTimeISO(),
      "Improvement",
      char => new CharacterRace(global, char, "48a1fe0b-ec55-4992-b47b-e1086f2a583f"),
      char => new CharacterCulture(global, char, "481c50a3-416c-4aa9-8ee9-dc93cc72c2b3"),
      char => new CharacterProfession(global, char, "0a9b8d85-3d9e-4297-aea0-51549b520ed6"),
    )
    character.name = "Alrik"
    character.rules.includeAllPublications = true
    return character
  }

  abstract toJSON(): RawCharacter
}

export class CharacterInRaceCultureProfessionSelection extends BaseCharacter {
  phase = "RaceCultureProfession" as const

  @observable accessor race: CharacterRace | undefined
  @observable accessor culture: CharacterCulture | undefined
  @observable accessor profession: CharacterProfession | undefined

  transformIntoFullCharacter(
    race: CharacterRace,
    culture: CharacterCulture,
    profession: CharacterProfession,
  ): FullCharacter {
    const fullCharacter = new FullCharacter(
      this.global,
      this.id,
      this.version,
      this.experienceLevel.startId,
      this.dateCreated,
      this.dateLastModified,
      "Improvement",
      char =>
        new CharacterRace(this.global, char, race.variantId, race.selectedAttributeAdjustmentId),
      char => new CharacterCulture(this.global, char, culture.id, culture.isCulturalPackageApplied),
      char =>
        new CharacterProfession(
          this.global,
          char,
          profession.packageId,
          profession.variantId,
          profession.customName,
        ),
    )

    fullCharacter.name = this.name
    fullCharacter.totalAdventurePoints = this.totalAdventurePoints
    fullCharacter.rules = new CharacterRules(
      this.global,
      this.rules.includeAllPublications,
      this.rules.includePublications,
      this.rules.focusRules.rules,
      this.rules.optionalRules.rules,
      this.rules.alternativeRules.rules,
    )
    fullCharacter.personalData = CharacterPersonalData.fromJSON(
      this.global,
      fullCharacter,
      this.personalData,
    )
    fullCharacter.curriculum =
      this.curriculum === undefined
        ? undefined
        : new CharacterCurriculum(
            this.curriculum.educationalInstitutionId,
            this.curriculum.lessonPackageId,
          )

    return fullCharacter
  }

  static override fromJSON(
    global: Global,
    id: RawCharacter_ID,
    json: RawCharacterInRaceCultureProfessionSelection,
  ): CharacterInRaceCultureProfessionSelection {
    const character = new CharacterInRaceCultureProfessionSelection(
      global,
      id,
      json.version,
      json.experienceLevel.start,
      Temporal.ZonedDateTime.from(json.dateCreated),
      Temporal.ZonedDateTime.from(json.dateLastModified),
    )

    character.name = json.name
    character.totalAdventurePoints = json.adventurePoints.total
    character.race = json.race ? CharacterRace.fromJSON(global, character, json.race) : undefined
    character.culture = json.culture
      ? CharacterCulture.fromJSON(global, character, json.culture)
      : undefined
    character.profession = json.profession
      ? CharacterProfession.fromJSON(global, character, json.profession)
      : undefined
    character.curriculum = json.curriculum
      ? CharacterCurriculum.fromJSON(json.curriculum)
      : undefined
    character.rules = CharacterRules.fromJSON(global, json.rules)
    character.personalData = CharacterPersonalData.fromJSON(global, character, json.personalData)

    return character
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

export class FullCharacter extends BaseCharacter {
  @observable accessor phase: "Finished" | "Improvement"

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
    ...args: [
      ...ConstructorParameters<typeof BaseCharacter>,
      phase: "Finished" | "Improvement",
      (char: FullCharacter) => CharacterRace,
      (char: FullCharacter) => CharacterCulture,
      (char: FullCharacter) => CharacterProfession,
    ]
  ) {
    const [
      global,
      id,
      version,
      experienceLevelId,
      dateCreated,
      dateLastModified,
      phase,
      race,
      culture,
      profession,
    ] = args
    super(global, id, version, experienceLevelId, dateCreated, dateLastModified)
    this.phase = phase
    this.race = race(this)
    this.culture = culture(this)
    this.profession = profession(this)
  }

  static override fromJSON(
    global: Global,
    id: RawCharacter_ID,
    json: RawFullCharacter,
  ): FullCharacter {
    const character = new FullCharacter(
      global,
      id,
      json.version,
      json.experienceLevel.start,
      Temporal.ZonedDateTime.from(json.dateCreated),
      Temporal.ZonedDateTime.from(json.dateLastModified),
      json.phase,
      char => CharacterRace.fromJSON(global, char, json.race),
      char => CharacterCulture.fromJSON(global, char, json.culture),
      char => CharacterProfession.fromJSON(global, char, json.profession),
    )

    character.name = json.name
    character.totalAdventurePoints = json.adventurePoints.total
    character.curriculum = json.curriculum
      ? CharacterCurriculum.fromJSON(json.curriculum)
      : undefined
    character.rules = CharacterRules.fromJSON(global, json.rules)
    character.personalData = CharacterPersonalData.fromJSON(global, character, json.personalData)
    character.advantages = CharacterActivatables.fromJSON(
      global,
      character,
      "Advantage",
      json.advantages,
    )
    character.disadvantages = CharacterActivatables.fromJSON(
      global,
      character,
      "Disadvantage",
      json.disadvantages,
    )
    character.specialAbilities =
      json.specialAbilities === undefined
        ? character.specialAbilities
        : CharacterSpecialAbilities.fromJSON(global, character, json.specialAbilities)
    character.attributes = CharacterAttributes.fromJSON(global, character, json.attributes)
    character.derivedCharacteristics = CharacterDerivedCharacteristics.fromJSON(
      global,
      character,
      json.derivedCharacteristics,
    )
    character.skills = CharacterSkills.fromJSON(global, character, json.skills)
    character.closeCombatTechniques = CharacterCombatTechniques.fromJSON(
      global,
      character,
      "CloseCombatTechnique",
      json.combatTechniques?.melee,
    )
    character.rangedCombatTechniques = CharacterCombatTechniques.fromJSON(
      global,
      character,
      "RangedCombatTechnique",
      json.combatTechniques?.ranged,
    )
    character.cantrips = CharacterCantrips.fromJSON(global, character, json.cantrips)
    character.spells = CharacterSpellworks.fromJSON(global, character, "Spell", json.spells)
    character.rituals = CharacterSpellworks.fromJSON(global, character, "Ritual", json.rituals)

    // TODO: magicalActions?: {
    //   bannzeichen?: ActivatableRated[]
    //   curses?: ActivatableRated[]
    //   elvenMagicalSongs?: ActivatableRated[]
    //   dominationRituals?: ActivatableRated[]
    //   magicalMelodies?: ActivatableRated[]
    //   magicalDances?: ActivatableRated[]
    //   jesterTricks?: ActivatableRated[]
    //   animistPowers?: ActivatableRated[]
    //   geodeRituals?: ActivatableRated[]
    //   goblinRituals?: ActivatableRated[]
    //   zibiljaRituals?: ActivatableRated[]
    //   magicalRunes?: ActivatableRated[]
    // }

    character.blessings = CharacterBlessings.fromJSON(global, character, json.blessings)
    character.liturgicalChants = CharacterLiturgicalChants.fromJSON(
      global,
      character,
      "LiturgicalChant",
      json.liturgicalChants,
    )
    character.ceremonies = CharacterLiturgicalChants.fromJSON(
      global,
      character,
      "Ceremony",
      json.ceremonies,
    )
    character.purse = Purse.fromJSON(json.purse)

    return character
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
      // TODO: magicalActions?: {
      //   bannzeichen?: ActivatableRated[]
      //   curses?: ActivatableRated[]
      //   elvenMagicalSongs?: ActivatableRated[]
      //   dominationRituals?: ActivatableRated[]
      //   magicalMelodies?: ActivatableRated[]
      //   magicalDances?: ActivatableRated[]
      //   jesterTricks?: ActivatableRated[]
      //   animistPowers?: ActivatableRated[]
      //   geodeRituals?: ActivatableRated[]
      //   goblinRituals?: ActivatableRated[]
      //   zibiljaRituals?: ActivatableRated[]
      //   magicalRunes?: ActivatableRated[]
      // }
      blessings: this.blessings.toJSON(),
      liturgicalChants: this.liturgicalChants.toJSON(),
      ceremonies: this.ceremonies.toJSON(),
      purse: this.purse.toJSON(),
    }
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
    const newCharacter = BaseCharacter.fromJSON(this.global, id, json)
    this.characters.set(id, newCharacter)
  }
}
