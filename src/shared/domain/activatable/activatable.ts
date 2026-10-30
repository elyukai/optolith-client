import { partition } from "@elyukai/utils/array/groups"
import { isNotEmpty } from "@elyukai/utils/array/nonEmpty"
import { count, sum, sumWith } from "@elyukai/utils/array/reductions"
import { deepEqual } from "@elyukai/utils/equality"
import { isNotNullish } from "@elyukai/utils/nullable"
import { range, type RangeBounds } from "@elyukai/utils/range"
import { assertExhaustive } from "@elyukai/utils/typeSafety"
import {
  getAdventurePointsDependingOnActiveForInactiveActivatableInstance,
  getAdventurePointsDependingOnActiveInstancesForInactiveActivatableInstance,
  getAdventurePointsForActiveActivatableInstances,
} from "@optolith/adventure-points/activatable"
import type {
  ResolvedSelectOption,
  ResolvedSelectOptionIdentifier,
} from "@optolith/database-schema/cache"
import type {
  ActivatableIdentifier,
  AdventurePointsValueByLevel,
  EntityMap,
  FixedAdventurePointsValue,
  GeneralPrerequisites,
  SpecialAbilityIdentifier,
} from "@optolith/database-schema/gen"
import {
  getNameComponents,
  renderActivatableNameComponents,
  renderActivatableNameComponentsWithoutLevel,
} from "@optolith/entity-descriptions/entities/partial/activatableNameChunks"
import { isEntryFromIncludedPublication } from "@optolith/entity-descriptions/publication-options"
import { action, computed, get, observable, toJS } from "mobx"
import type { Global } from "../../global.ts"
import {
  addAdventurePointsCaches,
  AdventurePointsCache,
  emptyAdventurePointsCache,
} from "../adventurePoints/cache.ts"
import type { Character } from "../character.ts"
import { Case, equalsCase, fromUniformCase } from "../databaseEnum.ts"
import {
  registerOrUnregisterPrerequisitesOfAdvantageOrDisadvantageAsDependencies,
  registerOrUnregisterPrerequisitesOfGeneralAsDependencies,
} from "../dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { addOrRemoveDependency, RegistrationMethod } from "../dependencies/registrationHelpers.ts"
import { checkMultipleDisjunctionPartsAreValid } from "../prerequisites/disjunctionPrerequisiteMultipartValidation.ts"
import {
  checkPreconditions,
  checkPrerequisitesOfAdvantageOrDisadvantage,
  checkPrerequisitesOfGeneralEntryWithLevels,
} from "../prerequisites/fullPrerequisiteValidationForType.ts"
import {
  getIsRemovable,
  getMinimumActiveLevel,
  type ActivatableNameComponentsWithFull,
  type DisplayedActiveActivatableCost,
} from "./activatableActive.ts"
import {
  appliesToInstanceLoose,
  appliesToInstanceStrict,
  type ActivatableDependency,
} from "./activatableDependency.ts"
import {
  getMaxLevelByPrerequisites,
  hasGeneralProhibitingDependency,
  hasReachedMaximumEntries,
  type DisplayedInactiveActivatableOption,
} from "./activatableInactive.ts"

/**
 * Bound adventure points are granted by the GM and can only be spent on the
 * entry. They don’t affect the costs of  buying the activatable entry. They may
 * specify for which configuration of  an entry they count, just like a
 * prerequisite.
 */
export type BoundAdventurePointsForActivatable = {
  /**
   * The granted adventure points.
   */
  adventurePoints: number

  /**
   * The level for which the adventure points have been granted.
   */
  level?: number

  /**
   * The set of options for which the adventure points have been granted.
   */
  options?: ActivatableOption[]
}

/**
 * A single activation of an activatable entry.
 */
export class CharacterActivatableInstance {
  /**
   * One or multiple options for the activatable. The meaning depends on the activatable.
   */
  @observable accessor options: ActivatableOption[] | undefined

  /**
   * The instance level (if the activatable has levels).
   */
  @observable accessor level: number | undefined

  /**
   * If provided, a custom adventure points value has been set for this instance.
   */
  @observable accessor customAdventurePointsValue: number | undefined

  /**
   * A list of used bound adventure points for this instance.
   */
  @observable accessor usedBoundAdventurePoints: BoundAdventurePointsForActivatable[]

  readonly parent: CharacterActivatable<ActivatableIdentifier["kind"]>

  constructor(
    instance: RawActivatableInstance,
    parent: CharacterActivatable<ActivatableIdentifier["kind"]>,
  ) {
    this.parent = parent
    this.options = instance.options
    this.level = instance.level
    this.customAdventurePointsValue = instance.customAdventurePointsValue
    this.usedBoundAdventurePoints = instance.usedBoundAdventurePoints ?? []
  }

  @computed
  get adventurePoints():
    | Case<"Fixed", number>
    | Case<"Range", { min: number; max: number; total: number; diffWhenRemoved: number }> {
    if (this.hasCustomAdventurePointsValue()) {
      return Case("Fixed", this.customAdventurePointsValue!)
    }

    const apValue = this.parent.preparedActiveAdventurePointsValue

    switch (apValue.kind) {
      case "Fixed":
        return Case("Fixed", apValue.Fixed * (this.level ?? 1))
      case "ByLevel":
        return Case(
          "Fixed",
          this.level === undefined ? 0 : (apValue.ByLevel.list[this.level - 1] ?? 0),
        )
      case "DerivedFromSelection": {
        const selectedOptions =
          this.options
            ?.filter(isPredefinedActivatableOption)
            .map(opt => this.parent.getSelectOptionById(opt.id)?.content.ap_value) ?? []

        return Case(
          "Fixed",
          selectedOptions.some(isNotNullish) ? sumWith(selectedOptions, opt => opt?.Fixed ?? 0) : 0,
        )
      }
      case "Range":
        return apValue
      default:
        return assertExhaustive(apValue)
    }
  }

  toJSON(): RawActivatableInstance {
    return {
      options: toJS(this.options),
      level: this.level,
      customAdventurePointsValue: this.customAdventurePointsValue,
      usedBoundAdventurePoints: toJS(this.usedBoundAdventurePoints),
    }
  }

  hasCustomAdventurePointsValue(): this is CharacterActivatableInstance & {
    customAdventurePointsValue: number
  } {
    return this.customAdventurePointsValue !== undefined
  }
}

export const getAdventurePointsForInactiveActivatableInstance = (
  apValue: DisplayedInactiveActivatable["apValue"],
  instance: RawActivatableInstance,
  getSelectOptionWithResolvedAPValueById: (
    id: ResolvedSelectOptionIdentifier,
  ) => ResolvedSelectOptionWithResolvedAPValue | undefined,
): number => {
  if (instance.customAdventurePointsValue !== undefined) {
    return instance.customAdventurePointsValue
  }

  switch (apValue.kind) {
    case "Fixed":
      return apValue.Fixed * (instance.level ?? 1)
    case "ByLevel":
      return instance.level === undefined ? 0 : (apValue.ByLevel.list[instance.level - 1] ?? 0)
    case "DerivedFromSelection": {
      const selectedOptions =
        instance.options
          ?.filter(isPredefinedActivatableOption)
          .map(opt => getSelectOptionWithResolvedAPValueById(opt.id)?.content.ap_value) ?? []

      return selectedOptions.some(isNotNullish)
        ? sumWith(selectedOptions, opt => opt?.Fixed ?? 0)
        : 0
    }
    default:
      return assertExhaustive(apValue)
  }
}

export class CharacterActivatable<
  Entity extends ActivatableIdentifier["kind"] = ActivatableIdentifier["kind"],
> {
  readonly global: Global
  readonly character: Character
  readonly entityName: Entity

  /**
   * The activatable identifier.
   */
  readonly id: string

  readonly dbEntry: EntityMap[Entity]
  readonly resolvedSelectOptions: ResolvedSelectOption[] | undefined

  /**
   * One or multiple activations of the activatable.
   */
  @observable accessor instances: CharacterActivatableInstance[]

  /**
   * The accumulated used adventure points value of all instances.
   */
  @computed
  get adventurePoints(): AdventurePointsCache {
    // TODO: Bound adventure points should be taken into account here

    // FOR INSTANCE ALONE
    //
    //   case DisadvantageIdentifier.PersonalityFlaw: {
    //     const isPersonalityFlawNotPaid = (generalId: number, paidEntries: number) => {
    //       const instanceOption = instance.options?.[0]
    //       if (instanceOption === undefined) {
    //         return false
    //       }
    //       const optionId: GeneralIdentifier = { tag: "General", general: generalId }
    //       return (
    //         matchesOptionId(optionId, instanceOption) &&
    //         countOptions(instances, optionId, { ignoreWithCustomAdventurePointsValue: true }) >
    //           (isEntryToAdd ? paidEntries - 1 : paidEntries)
    //       )
    //     }

    //     if (
    //       // 7 = "Prejudice" => more than one entry possible
    //       // more than one entry of Prejudice does not contribute to AP spent
    //       isPersonalityFlawNotPaid(7, 1) ||
    //       // 8 = "Unworldly" => more than one entry possible
    //       // more than two entries of Unworldly do not contribute to AP spent
    //       isPersonalityFlawNotPaid(8, 2)
    //     ) {
    //       return 0
    //     }

    //     return undefined
    //   }

    //   case DisadvantageIdentifier.Principles:
    //   case DisadvantageIdentifier.Obligations: {
    //     if (count(instances, not(hasCustomAdventurePointsValue)) < 2) {
    //       return undefined
    //     }

    //     const highestLevel = instances.reduce<{ level: number; count: number }>(
    //       (acc, ins) =>
    //         ins.level === undefined || hasCustomAdventurePointsValue(ins)
    //           ? acc
    //           : ins.level > acc.level
    //             ? { level: ins.level, count: 1 }
    //             : ins.level === acc.level
    //               ? { level: acc.level, count: acc.count + 1 }
    //               : acc,
    //       { level: 0, count: 0 },
    //     )

    //     const singleHighestLevel = ensure(highestLevel, x => x.count === 1)?.level

    //     const secondHighestLevel =
    //       singleHighestLevel === undefined
    //         ? undefined
    //         : instances.reduce<number | undefined>(
    //             (acc, ins) =>
    //               ins.level === undefined || hasCustomAdventurePointsValue(ins)
    //                 ? acc
    //                 : acc === undefined || (ins.level > acc && ins.level < singleHighestLevel)
    //                   ? ins.level
    //                   : acc,
    //             undefined,
    //           )

    //     if (instance.level === undefined || apValue.tag !== "Fixed") {
    //       return undefined
    //     }

    //     if (highestLevel.level > instance.level) {
    //       return 0
    //     }

    //     if (highestLevel.level === instance.level) {
    //       return singleHighestLevel === undefined || isEntryToAdd
    //         ? 0
    //         : secondHighestLevel === undefined
    //           ? instance.level * apValue.fixed
    //           : (instance.level - secondHighestLevel) * apValue.fixed
    //     }

    //     return isEntryToAdd ? (instance.level - highestLevel.level) * apValue.fixed : 0
    //   }

    //   case DisadvantageIdentifier.BadHabit: {
    //     // more than three entries cannot contribute to AP spent; entries with
    //     // custom cost are ignored for the rule's effect
    //     return count(instances, not(hasCustomAdventurePointsValue)) > (isEntryToAdd ? 2 : 3)
    //       ? 0
    //       : undefined
    //   }

    //   default:
    //     return undefined
    // }

    // TODO: case SpecialAbilityId.SkillSpecialization: {
    //   return pipe_ (
    //     mcurrent_sid,
    //     misStringM,
    //     bindF (
    //       current_sid =>
    //         fmapF (lookup (current_sid)
    //                       (StaticData.A.skills (wiki)))
    //               (skill =>

    //                 // Multiply number of final occurences of the
    //                 // same skill...
    //                 (countWith ((e: Record<ActiveObject>) =>
    //                             pipe (
    //                                    ActiveObject.AL.sid,
    //                                    elem<string | number> (current_sid)
    //                                  )
    //                                  (e)

    //                             // Entries with custom cost are ignored for the rule
    //                             && isNothing (ActiveObject.AL.cost (e)))
    //                           (all_active) + (isEntryToAdd ? 1 : 0))

    //                 // ...with the skill's IC
    //                 * getAPForActivatation (Skill.AL.ic (skill)))
    //     )
    //   )
    // }

    // TODO: case SpecialAbilityId.Language: {
    //   // Native Tongue (level 4) does not cost anything
    //   return elem (4) (mcurrent_level) ? Nothing : mcurrent_cost
    // }

    // TODO: case SpecialAbilityId.PropertyKnowledge:
    // case SpecialAbilityId.AspectKnowledge: {
    //   // Does not include custom cost activations in terms of calculated cost
    //   const amount = countWith (pipe (ActiveObject.AL.cost, isNothing))
    //                            (all_active)

    //   const index = amount + (isEntryToAdd ? 0 : -1)

    //   if (isNothing (mcurrent_cost)) {
    //     return Nothing
    //   }

    //   const current_cost = fromJust (mcurrent_cost)

    //   return isList (current_cost) ? subscript (current_cost) (index) : Nothing
    // }

    // TODO: case SpecialAbilityId.TraditionWitches: {
    //   // There are two disadvantages that, when active, decrease the cost of
    //   // this tradition by 10 AP each
    //   const decreaseCost = (id: string) => (cost: number) =>
    //     isDisadvantageActive (id) (hero) ? cost - 10 : cost

    //   return pipe_ (
    //     mcurrent_cost,
    //     misNumberM,
    //     fmap (pipe (
    //       decreaseCost (DisadvantageId.NoFlyingBalm),
    //       decreaseCost (DisadvantageId.NoFamiliar)
    //     ))
    //   )
    // }

    // TODO: case SpecialAbilityId.Recherchegespuer: {
    //   // The AP cost for this SA consist of two parts: AP based on the IC of
    //   // the main subject (from "SA_531"/Wissensdurst) in addition to AP based
    //   // on the IC of the side subject selected in this SA.

    //   const mhero_entry_SA_531 = lookup<string> (SpecialAbilityId.Wissensdurst)
    //                                             (HA.specialAbilities (hero))

    //   if (isNothing (mhero_entry_SA_531)) {
    //     return Nothing
    //   }

    //   if (isNothing (mcurrent_cost) || isNothing (mcurrent_cost)) {
    //     return Nothing
    //   }

    //   const current_cost = fromJust (mcurrent_cost)

    //   if (isNumber (current_cost)) {
    //     return Nothing
    //   }

    //   const hero_entry_SA_531 = fromJust (mhero_entry_SA_531)

    //   const getCostFromHeroEntry =
    //     pipe (
    //       ActiveObject.AL.sid,
    //       misStringM,
    //       bindF (lookupF (StaticData.A.skills (wiki))),
    //       bindF (pipe (Skill.A.ic, icToIx, subscript (current_cost)))
    //     )

    //   return liftM2 (add)
    //                 (getCostFromHeroEntry (entry))
    //                 (pipe_ (
    //                   hero_entry_SA_531,
    //                   ActivatableDependent.A.active,
    //                   listToMaybe,
    //                   bindF (getCostFromHeroEntry)
    //                 ))
    // }

    // FOR DIFFS IN ADDING INSTANCE COST

    // TODO: Calculare DependingOnActiveInstances for select options correctly (do not use resolved value alone)
    // case "DisadvantageIdentifier.PersonalityFlaw": {
    //   const getPersonalityFlawNotPaidDifference = (generalId: number, paidEntries: number) => {
    //     const optionId = createIdentifierObject("General", generalId)
    //     return countOptions(instances, optionId, {
    //       ignoreWithCustomAdventurePointsValue: true,
    //     }) > paidEntries
    //       ? (getSelectOptionById(optionId)?.ap_value ?? 0) * paidEntries
    //       : 0
    //   }

    //   return sum([
    //     // 7 = "Prejudice" => more than one entry possible
    //     // more than one entry of Prejudice does not contribute to AP spent
    //     getPersonalityFlawNotPaidDifference(7, 1),
    //     // 8 = "Unworldly" => more than one entry possible
    //     // more than two entries of Unworldly do not contribute to AP spent
    //     getPersonalityFlawNotPaidDifference(8, 2),
    //   ])
    // }

    // TODO: Add to schema for generalized handling of this case
    // case "DisadvantageIdentifier.Principles":
    // case "DisadvantageIdentifier.Obligations": {
    //   if (count(instances, not(hasCustomAdventurePointsValue)) < 2 || apValue.tag !== "Fixed") {
    //     return 0
    //   }

    //   const highestLevel = instances.reduce<{ level: number; count: number }>(
    //     (acc, ins) =>
    //       ins.level === undefined || hasCustomAdventurePointsValue(ins)
    //         ? acc
    //         : ins.level > acc.level
    //           ? { level: ins.level, count: 1 }
    //           : ins.level === acc.level
    //             ? { level: acc.level, count: acc.count + 1 }
    //             : acc,
    //     { level: 0, count: 0 },
    //   )

    //   const singleHighestLevel = ensure(highestLevel, x => x.count === 1)?.level

    //   if (singleHighestLevel === undefined) {
    //     return highestLevel.level * apValue.fixed
    //   }

    //   const secondHighestLevel = instances.reduce<number | undefined>(
    //     (acc, ins) =>
    //       ins.level === undefined || hasCustomAdventurePointsValue(ins)
    //         ? acc
    //         : acc === undefined || (ins.level > acc && ins.level < singleHighestLevel)
    //           ? ins.level
    //           : acc,
    //     undefined,
    //   )

    //   return (secondHighestLevel ?? 0) * apValue.fixed
    // }

    // TODO: case SpecialAbilityId.SkillSpecialization: {
    //   return pipe_ (
    //     mcurrent_sid,
    //     misStringM,
    //     bindF (
    //       current_sid =>
    //         fmapF (lookup (current_sid)
    //                       (StaticData.A.skills (wiki)))
    //               (skill =>

    //                 // Multiply number of final occurences of the
    //                 // same skill...
    //                 (countWith ((e: Record<ActiveObject>) =>
    //                             pipe (
    //                                    ActiveObject.AL.sid,
    //                                    elem<string | number> (current_sid)
    //                                  )
    //                                  (e)

    //                             // Entries with custom cost are ignored for the rule
    //                             && isNothing (ActiveObject.AL.cost (e)))
    //                           (all_active) + (isEntryToAdd ? 1 : 0))

    //                 // ...with the skill's IC
    //                 * getAPForActivatation (Skill.AL.ic (skill)))
    //     )
    //   )
    // }

    // TODO: case SpecialAbilityId.Language: {
    //   // Native Tongue (level 4) does not cost anything
    //   return elem (4) (mcurrent_level) ? Nothing : mcurrent_cost
    // }

    // TODO: case SpecialAbilityId.TraditionWitches: {
    //   // There are two disadvantages that, when active, decrease the cost of
    //   // this tradition by 10 AP each
    //   const decreaseCost = (id: string) => (cost: number) =>
    //     isDisadvantageActive (id) (hero) ? cost - 10 : cost

    //   return pipe_ (
    //     mcurrent_cost,
    //     misNumberM,
    //     fmap (pipe (
    //       decreaseCost (DisadvantageId.NoFlyingBalm),
    //       decreaseCost (DisadvantageId.NoFamiliar)
    //     ))
    //   )
    // }

    // TODO: case SpecialAbilityId.Recherchegespuer: {
    //   // The AP cost for this SA consist of two parts: AP based on the IC of
    //   // the main subject (from "SA_531"/Wissensdurst) in addition to AP based
    //   // on the IC of the side subject selected in this SA.

    //   const mhero_entry_SA_531 = lookup<string> (SpecialAbilityId.Wissensdurst)
    //                                             (HA.specialAbilities (hero))

    //   if (isNothing (mhero_entry_SA_531)) {
    //     return Nothing
    //   }

    //   if (isNothing (mcurrent_cost) || isNothing (mcurrent_cost)) {
    //     return Nothing
    //   }

    //   const current_cost = fromJust (mcurrent_cost)

    //   if (isNumber (current_cost)) {
    //     return Nothing
    //   }

    //   const hero_entry_SA_531 = fromJust (mhero_entry_SA_531)

    //   const getCostFromHeroEntry =
    //     pipe (
    //       ActiveObject.AL.sid,
    //       misStringM,
    //       bindF (lookupF (StaticData.A.skills (wiki))),
    //       bindF (pipe (Skill.A.ic, icToIx, subscript (current_cost)))
    //     )

    //   return liftM2 (add)
    //                 (getCostFromHeroEntry (entry))
    //                 (pipe_ (
    //                   hero_entry_SA_531,
    //                   ActivatableDependent.A.active,
    //                   listToMaybe,
    //                   bindF (getCostFromHeroEntry)
    //                 ))
    // }

    const [instancesWithCustom, instancesWithoutCustom] = partition(this.instances, instance =>
      instance.hasCustomAdventurePointsValue(),
    )

    const withCustom = isNotEmpty(instancesWithCustom)
      ? new AdventurePointsCache(
          sumWith(instancesWithCustom, instance => instance.customAdventurePointsValue),
          0,
        )
      : AdventurePointsCache.empty

    const withoutCustom = isNotEmpty(instancesWithoutCustom)
      ? new AdventurePointsCache(
          getAdventurePointsForActiveActivatableInstances(
            typeof this.dbEntry.ap_value === "number"
              ? Case("Fixed", this.dbEntry.ap_value)
              : this.dbEntry.ap_value,
            instancesWithoutCustom,
            option =>
              option.type === "Custom"
                ? 0
                : (this.getSelectOptionById(option.id)?.content.ap_value?.Fixed ?? 0),
            id =>
              this.character.getActivatableCollection(id.kind).getById(fromUniformCase(id))
                ?.isActive ?? false,
            "medium",
          ),
          0,
        )
      : AdventurePointsCache.empty

    return withCustom.add(withoutCustom)
  }

  /**
   * The activatable's dependencies.
   */
  @observable accessor dependencies: ActivatableDependency[]

  /**
   * A list of bound adventure points. Bound adventure points are granted by the
   * GM and can only be spent on the entry. They don’t affect the costs of
   * buying the activatable entry. They may specify for which configuration of
   * an entry they count, just like a prerequisite.
   */
  @observable accessor boundAdventurePoints: BoundAdventurePointsForActivatable[]

  constructor(
    global: Global,
    character: Character,
    id: string,
    entity: Entity,
    dbEntry: EntityMap[Entity],
    instances: RawActivatableInstance[],
    dependencies: ActivatableDependency[],
    boundAdventurePoints: BoundAdventurePointsForActivatable[],
  ) {
    this.global = global
    this.character = character
    this.entityName = entity
    this.id = id
    this.dbEntry = dbEntry
    this.instances = instances.map(instance => new CharacterActivatableInstance(instance, this))
    this.dependencies = dependencies
    this.boundAdventurePoints = boundAdventurePoints
    this.resolvedSelectOptions = global.cache.activatableSelectOptions[entity][id]
  }

  @action
  static createEmpty<Entity extends ActivatableIdentifier["kind"]>(
    global: Global,
    character: Character,
    entity: Entity,
    id: string,
    dbEntry: EntityMap[Entity] | undefined,
  ): CharacterActivatable<Entity> {
    if (!dbEntry) {
      throw new Error(`Attribute with id ${id} not provided.`)
    }
    return new CharacterActivatable(global, character, id, entity, dbEntry, [], [], [])
  }

  /**
   * Get the level of the first instance of a given activatable entry, if it is
   * active.
   */
  @computed
  get firstLevel(): number | undefined {
    return this.instances?.[0]?.level
  }

  /**
   * Returns the number of instances of a given activatable entry.
   */
  @computed
  get activationsCount(): number {
    return this.instances.length
  }

  /**
   * Returns the number of instances of a given activatable entry.
   */
  @computed
  get activationsCountWithoutCustomAPValues(): number {
    return count(this.instances, instance => !instance.hasCustomAdventurePointsValue())
  }

  /**
   * Returns if a present activatable entry is active. Defaults to `false`.
   */
  @computed
  get isActive(): boolean {
    return this.activationsCount > 0
  }

  /**
   * Returns if a given option is active in any instance of a given activatable.
   * It defaults to the first option in the options array, but a different index
   * can be specified.
   */
  isOptionActive(optionId: PredefinedActivatableOption["id"], atIndex = 0): boolean {
    return (
      this.instances.some(instance => {
        const optionAtIndex = instance.options?.[atIndex]
        return optionAtIndex?.type === "Predefined" && equalsCase(optionAtIndex.id, optionId)
      }) ?? false
    )
  }

  /**
   * Returns if a given activatable entry is active with a given configuration.
   */
  isActiveWithConfiguration(config: {
    level?: number
    options?: PredefinedActivatableOption["id"][]
  }): boolean {
    return this.getInstanceIndexWithConfiguration(config) > -1
  }

  /**
   * Returns if a given activatable entry is active with a given configuration.
   */
  getInstanceIndexWithConfiguration(config: {
    level?: number
    options?: PredefinedActivatableOption["id"][]
  }): number {
    const { level, options } = config
    return this.instances.findIndex(instance => {
      const levelMatches = level === undefined || instance.level === level
      const optionsMatch =
        options === undefined ||
        (instance.options ?? []).some(
          option => option.type === "Predefined" && options.some(id => equalsCase(option.id, id)),
        )
      return levelMatches && optionsMatch
    })
  }

  /**
   * Returns the number of instances of a given activatable entry that have a
   * given option active. It defaults to the first option in the options array,
   * but a different index can be specified.
   */
  countOptions(
    optionId: ResolvedSelectOptionIdentifier,
    options: { atIndex?: number; ignoreWithCustomAdventurePointsValue?: boolean } = {},
  ): number {
    const { atIndex = 0, ignoreWithCustomAdventurePointsValue = false } = options
    return this.instances.filter(instance => {
      const optionAtIndex = instance.options?.[atIndex]
      return (
        optionAtIndex?.type === "Predefined" &&
        equalsCase(optionAtIndex.id, optionId) &&
        (!ignoreWithCustomAdventurePointsValue || !instance.hasCustomAdventurePointsValue())
      )
    }).length
  }

  /**
   * Returns the option value of the first instance of a given activatable entry.
   * It defaults to the first option in the options array, but a different index
   * can be specified.
   */
  getFirstOption(atIndex = 0): ActivatableOption | undefined {
    return this.instances[0]?.options?.[atIndex]
  }

  /**
   * Returns the option value of the first instance of a given activatable entry
   * if it corresponds to a given predefined type. It defaults to the first option
   * in the options array, but a different index can be specified.
   */
  getFirstOptionOfType(
    tag: ResolvedSelectOptionIdentifier["kind"],
    atIndex = 0,
  ): string | undefined {
    const firstOption = this.getFirstOption(atIndex)
    if (firstOption?.type === "Predefined" && firstOption.id.kind === tag) {
      return fromUniformCase(firstOption.id)
    }
    return undefined
  }

  /**
   * Returns option values of instances of a given activatable entry. It defaults
   * to the first option in the options array, but a different index can be
   * specified.
   */
  getOptions(atIndex = 0): ActivatableOption[] {
    return this.instances.map(instance => instance.options?.[atIndex]).filter(isNotNullish)
  }

  toJSON() {
    return {
      type: this.entityName,
      id: this.id,
      instances: this.instances.map(instance => instance.toJSON()),
      boundAdventurePoints: toJS(this.boundAdventurePoints),
    }
  }

  /**
   * Returns the maximum level of an activatable entry.
   */
  getMaximumLevel(
    instance: CharacterActivatableInstance,
    dependencies: ActivatableDependency[],
  ): number | undefined {
    const levels = "levels" in this.dbEntry ? this.dbEntry.levels : undefined

    if (levels === undefined) {
      return undefined
    }

    return Math.min(
      getMaxLevelByPrerequisites(l => this.checkPrerequisitesForLevel(l), levels),
      dependencies.reduce(
        (acc, dep) =>
          dep.active === false &&
          dep.level !== undefined &&
          deepEqual(
            instance.options,
            dep.options?.map(opt => ({ type: "Predefined", id: opt }) as const),
          )
            ? Math.min(acc, dep.level - 1)
            : acc,
        Infinity,
      ),
      /* TODO: getEntrySpecificMaximumLevel(id, caps) ?? */ levels,
    )
  }

  toJSONActive(): DisplayedActiveActivatable<Entity>[] {
    const idObject = Case(this.entityName satisfies ActivatableIdentifier["kind"], this.id)
    const dependencies = this.applyingDependencies.filter(
      dep =>
        dep.active === false ||
        count(this.instances, instance => appliesToInstanceStrict(dep, instance)) < 2,
    )

    const caps = {
      startExperienceLevel: this.character.experienceLevel.start,
      activeCantripsCount: this.character.cantrips.activeCount,
      activeSpellworksCount: this.character.spells.activeCount + this.character.rituals.activeCount,
      activeMagicalActionsCount: 0, // TODO
      activeBlessingsCount: this.character.blessings.activeCount,
      activeLiturgicalChantsCount: this.character.liturgicalChants.activeCount,
      activeCeremoniesCount: this.character.ceremonies.activeCount,
      activeSermonsCount:
        this.character.specialAbilities.getSpecialAbilitiesCollection("Sermon").activeCount,
      activeVisionsCount:
        this.character.specialAbilities.getSpecialAbilitiesCollection("Vision").activeCount,
      getRatingById: this.character.getRatingById.bind(this.character),
      getActivatableRatingById: this.character.getActivatableRatingById.bind(this.character),
    }

    return this.instances.map((instance, instanceIndex): DisplayedActiveActivatable<Entity> => {
      const minLevel = getMinimumActiveLevel(idObject, dependencies, instance, caps)
      const maxLevel = this.getMaximumLevel(instance, dependencies)

      const isRemovable = getIsRemovable(minLevel, dependencies, instance, caps)

      //   TODO: Ignore selection for name when above level 1
      // case SpecialAbilityId.Exorzist:
      //     return pipe_ (
      //       hero_entry,
      //       AOWIA.tier,
      //       Maybe.product,
      //       ensure (equals (1)),
      //       thenF (AOWIA.sid (hero_entry)),
      //       findSelectOption (wiki_entry),
      //       fmap (SOA.name)
      //     )

      // TODO: AnySpecialAbilityOfGroup dependency handling

      const nameComponents = getNameComponents<{ name: string }>(
        this.global.locale.translate,
        Case(this.entityName satisfies ActivatableIdentifier["kind"], this.id),
        instance.options?.map(o => {
          switch (o.type) {
            case "Predefined":
              return o.id
            case "Custom":
              return Case("Text", o.value)
            default:
              return assertExhaustive(o)
          }
        }),
        instance.level,
        "nameBuilderRules" in this.dbEntry ? this.dbEntry.nameBuilderRules : undefined,
        this.dbEntry.translations,
        t => t.name,
        this.global.db.getInstanceOfEntityById.bind(this.global.db),
        (id, optionId) =>
          this.global.cache.activatableSelectOptions[id.kind][fromUniformCase(id)]?.find(o =>
            equalsCase(o.id, optionId),
          ),
        false,
      )

      const fullWithoutLevel = renderActivatableNameComponentsWithoutLevel(
        this.global.locale.translateMap,
        nameComponents,
      )

      return {
        type: this.entityName,
        active: true,
        id: this.id,
        instance: instance.toJSON(),
        instanceIndex,
        isRemovable,
        levels: "levels" in this.dbEntry ? this.dbEntry.levels : undefined,
        minLevel,
        maxLevel,
        cost: instance.adventurePoints,
        name: {
          ...nameComponents,
          full: renderActivatableNameComponents(
            this.global.locale.translateMap,
            nameComponents,
            false,
          ),
          fullWithoutLevel, // TODO: This is a hack to make the type system happy. The function should return the array directly.
        },
      }
    })
  }

  checkOtherPrerequisitesForLevel(
    prerequisites: GeneralPrerequisites | undefined,
    level: number,
  ): boolean {
    return prerequisites === undefined
      ? true
      : checkPrerequisitesOfGeneralEntryWithLevels(
          prerequisites,
          level,
          this.character.prerequisiteCapabilities,
        )
  }

  checkPrerequisitesForLevel(level: number): boolean {
    return this.dbEntry.prerequisites === undefined
      ? true
      : this.entityName === "Advantage" || this.entityName === "Disadvantage"
        ? checkPrerequisitesOfAdvantageOrDisadvantage(
            (this.dbEntry as EntityMap[Extract<Entity, "Advantage" | "Disadvantage">])
              .prerequisites!,
            level,
            this.entityName,
            this.id,
            this.character.prerequisiteCapabilities,
          )
        : checkPrerequisitesOfGeneralEntryWithLevels(
            (this.dbEntry as EntityMap[Exclude<Entity, "Advantage" | "Disadvantage">])
              .prerequisites!,
            level,
            this.character.prerequisiteCapabilities,
          )
  }

  /**
   * Returns the activatable entry with its corresponding dynamic entry,
   * extended by whether it can be activated and configuration options.
   */
  toJSONInactive(): DisplayedInactiveActivatable<Entity> | undefined {
    if (
      hasReachedMaximumEntries(
        this.activationsCount,
        "maximum" in this.dbEntry ? this.dbEntry.maximum : undefined,
        this.entityName === "Advantage" || this.entityName === "Disadvantage" ? 1 : Infinity,
      )
    ) {
      return undefined
    }

    // TODO const idObject = Case(this.entityName satisfies ActivatableIdentifier["kind"], this.id)
    const dependencies = this.applyingDependencies

    // TODO const countOptionsForCurrent = (optionId: ResolvedSelectOptionIdentifier, atIndex?: number) =>
    //   this.countOptions(optionId, { atIndex })

    // TODO const hasProhibitingDependency = (optionId: ResolvedSelectOptionIdentifier) =>
    //   dependencies.some(
    //     dep =>
    //       dep.active === false &&
    //       appliesToInstanceLoose(dep, { options: [{ type: "Predefined", id: optionId }] }),
    //   )

    const maxLevel = this.getMaximumLevel(new CharacterActivatableInstance({}, this), dependencies)

    if (this.isActive) {
      const defaultMaximum =
        this.entityName === "Advantage" || this.entityName === "Disadvantage"
          ? 1
          : (this.resolvedSelectOptions?.length ?? 0) > 0
            ? undefined
            : 1

      const maximum =
        "maximum" in this.dbEntry && this.dbEntry.maximum !== undefined
          ? this.dbEntry.maximum
          : defaultMaximum

      if (maximum !== undefined && this.activationsCount >= maximum) {
        return undefined
      }
    }

    return {
      type: this.entityName,
      active: false,
      id: this.id,
      name:
        this.global.locale.translateMap<{ name: string }>(this.dbEntry.translations)?.name ?? "",
      instances: this.instances.map(instance => instance.toJSON()),
      isAvailable:
        !hasGeneralProhibitingDependency(dependencies) &&
        this.checkPrerequisitesForLevel(1) &&
        this.selectOptionConfiguration.every(
          config => config.kind === "text" || isNotEmpty(config.options),
        ) &&
        (maxLevel === undefined || maxLevel > 0),
      options: this.selectOptionConfiguration,
      apValue: this.preparedInactiveAdventurePointsValue,
      level:
        "levels" in this.dbEntry && this.dbEntry.levels !== undefined && maxLevel !== undefined
          ? {
              maximum: maxLevel,
              placement:
                this.dbEntry.nameBuilderRules?.levelPlacement?.kind === "BeforeOptions"
                  ? "before"
                  : "after",
            }
          : undefined,
    }
  }

  @action
  add(instance: RawActivatableInstance) {
    this.instances.push(new CharacterActivatableInstance(instance, this))
    if (this.dbEntry.prerequisites !== undefined) {
      const levelRange: RangeBounds = [1, instance.level ?? 1]
      if (this.entityName === "Advantage" || this.entityName === "Disadvantage") {
        registerOrUnregisterPrerequisitesOfAdvantageOrDisadvantageAsDependencies(
          this.dbEntry.prerequisites,
          RegistrationMethod.Add,
          this.character,
          Case(this.entityName satisfies "Advantage" | "Disadvantage", this.id),
          levelRange,
        )
      } else {
        registerOrUnregisterPrerequisitesOfGeneralAsDependencies(
          this.dbEntry.prerequisites as GeneralPrerequisites,
          RegistrationMethod.Add,
          this.character,
          Case(this.entityName satisfies SpecialAbilityIdentifier["kind"], this.id),
          levelRange,
        )
      }
    }
  }

  @action
  setLevel(index: number, newLevel: number) {
    if (this.instances[index]?.level !== undefined) {
      const oldLevel = this.instances[index].level
      this.instances[index].level = newLevel
      if (this.dbEntry.prerequisites !== undefined) {
        const method = newLevel > oldLevel ? RegistrationMethod.Add : RegistrationMethod.Remove
        const levelRange: RangeBounds =
          newLevel > oldLevel ? [oldLevel + 1, newLevel] : [newLevel + 1, oldLevel]
        if (this.entityName === "Advantage" || this.entityName === "Disadvantage") {
          registerOrUnregisterPrerequisitesOfAdvantageOrDisadvantageAsDependencies(
            this.dbEntry.prerequisites,
            method,
            this.character,
            Case(this.entityName satisfies "Advantage" | "Disadvantage", this.id),
            levelRange,
          )
        } else {
          registerOrUnregisterPrerequisitesOfGeneralAsDependencies(
            this.dbEntry.prerequisites as GeneralPrerequisites,
            method,
            this.character,
            Case(this.entityName satisfies SpecialAbilityIdentifier["kind"], this.id),
            levelRange,
          )
        }
      }
    }
  }

  @action
  remove(index: number) {
    const instance = this.instances[index]
    if (instance === undefined) {
      return
    }
    this.instances.splice(index, 1)
    if (this.dbEntry.prerequisites !== undefined) {
      const levelRange: RangeBounds = [1, instance.level ?? 1]
      if (this.entityName === "Advantage" || this.entityName === "Disadvantage") {
        registerOrUnregisterPrerequisitesOfAdvantageOrDisadvantageAsDependencies(
          this.dbEntry.prerequisites,
          RegistrationMethod.Remove,
          this.character,
          Case(this.entityName satisfies "Advantage" | "Disadvantage", this.id),
          levelRange,
        )
      } else {
        registerOrUnregisterPrerequisitesOfGeneralAsDependencies(
          this.dbEntry.prerequisites as GeneralPrerequisites,
          RegistrationMethod.Remove,
          this.character,
          Case(this.entityName satisfies SpecialAbilityIdentifier["kind"], this.id),
          levelRange,
        )
      }
    }
  }

  get resolvedSelectOptionsWithResolvedAPValue():
    | ResolvedSelectOptionWithResolvedAPValue[]
    | undefined {
    return this.resolvedSelectOptions
      ?.filter(
        rated =>
          isEntryFromIncludedPublication(
            rated.content,
            this.global.db.getInstanceOfEntityById.bind(this.global.db),
            this.global.locale.translateMap,
            this.character.rules.publicationOptions,
          ) &&
          this.applyingDependencies.some(
            dep =>
              dep.active === false &&
              appliesToInstanceLoose(dep, { options: [{ type: "Predefined", id: rated.id }] }),
          ),
      )
      .map((option): ResolvedSelectOptionWithResolvedAPValue => ({
        ...option,
        content: {
          ...option.content,
          ap_value:
            option.content.ap_value?.kind === "DependingOnActiveInstances"
              ? Case(
                  "Fixed",
                  getAdventurePointsDependingOnActiveInstancesForInactiveActivatableInstance(
                    option.content.ap_value.DependingOnActiveInstances,
                    this.countOptions(option.id, { ignoreWithCustomAdventurePointsValue: true }),
                  ),
                )
              : option.content.ap_value,
        },
      }))
  }

  getSelectOptionById(
    id: ResolvedSelectOptionIdentifier,
  ): ResolvedSelectOptionWithResolvedAPValue | undefined {
    return this.resolvedSelectOptionsWithResolvedAPValue?.find(ro => equalsCase(ro.id, id))
  }

  get selectOptionConfiguration(): DisplayedInactiveActivatableOption[] {
    // TODO: Do not allow the same select option (combination?) to be selected multiple times unless specified otherwise
    // TODO: Select Options may restrict available levels with prerequisites or in general with Languages
    if (this.resolvedSelectOptionsWithResolvedAPValue) {
      const options = this.resolvedSelectOptionsWithResolvedAPValue

      if ("select_options" in this.dbEntry && this.dbEntry.select_options?.rules !== undefined) {
        return this.dbEntry.select_options.rules.map((rule): DisplayedInactiveActivatableOption => {
          switch (rule.value.kind) {
            case "Child":
              return {
                kind: "choice",
                options: this.global.db
                  .getAllInstanceContainersOfEntity(rule.value.Child.entity.kind)
                  .map((container): ResolvedSelectOptionWithResolvedAPValue => ({
                    id: Case("SkillApplication", container.id),
                    content: {
                      ...container.content,
                      parent: Case(
                        this.entityName satisfies ActivatableIdentifier["kind"],
                        this.id,
                      ),
                    },
                    newApplications: [],
                    uses: [],
                    parentSelectOption: Case("Skill", container.content.parent),
                  })),
                parentIndex: rule.value.Child.parentIndex,
              }
            case "Predefined":
              return {
                kind: "choice",
                options,
              }
            case "PredefinedOrTextInput":
              return {
                kind: "choiceOrCustomizableText",
                options,
                textLabel: rule.value.PredefinedOrTextInput.translations,
              }
            case "TextInput":
              return {
                kind: "text",
                textLabel: rule.value.TextInput.translations,
              }
            default:
              return assertExhaustive(rule.value)
          }
        })
      } else {
        return [
          {
            kind: "choice",
            options,
          },
        ]
      }
    } else {
      return []
    }
  }

  @computed
  get preparedActiveAdventurePointsValue():
    | Case<"Fixed", number>
    | Case<"ByLevel", AdventurePointsValueByLevel>
    | Case<"DerivedFromSelection">
    | Case<"Range", { min: number; max: number; total: number; diffWhenRemoved: number }> {
    if (typeof this.dbEntry.ap_value === "number") {
      return Case("Fixed", this.dbEntry.ap_value)
    }

    switch (this.dbEntry.ap_value.kind) {
      case "Fixed":
      case "ByLevel":
      case "DerivedFromSelection":
        return this.dbEntry.ap_value
      case "DependingOnActive":
        return Case(
          "Fixed",
          getAdventurePointsDependingOnActiveForInactiveActivatableInstance(
            this.dbEntry.ap_value.DependingOnActive,
            id =>
              this.character.getActivatableCollection(id.kind).getById(fromUniformCase(id))
                ?.isActive ?? false,
          ),
        )
      case "DependingOnActiveInstances": {
        const config = this.dbEntry.ap_value.DependingOnActiveInstances
        const values = range(0, this.activationsCountWithoutCustomAPValues - 1).map(i =>
          getAdventurePointsDependingOnActiveInstancesForInactiveActivatableInstance(config, i),
        )
        const total = sum(values)
        const diffWhenRemoved = values.at(-1) ?? 0
        const min = Math.min(...values)
        const max = Math.max(...values)
        return Case("Range", {
          min,
          max,
          total,
          diffWhenRemoved,
        })
      }
      case "Indefinite":
        return Case("Fixed", 0)
      default:
        return assertExhaustive(this.dbEntry.ap_value)
    }
  }

  @computed
  get preparedInactiveAdventurePointsValue():
    | Case<"Fixed", number>
    | Case<"ByLevel", AdventurePointsValueByLevel>
    | Case<"DerivedFromSelection"> {
    if (typeof this.dbEntry.ap_value === "number") {
      return Case("Fixed", this.dbEntry.ap_value)
    }

    switch (this.dbEntry.ap_value.kind) {
      case "Fixed":
      case "ByLevel":
      case "DerivedFromSelection":
        return this.dbEntry.ap_value
      case "DependingOnActive":
        return Case(
          "Fixed",
          getAdventurePointsDependingOnActiveForInactiveActivatableInstance(
            this.dbEntry.ap_value.DependingOnActive,
            id =>
              this.character.getActivatableCollection(id.kind).getById(fromUniformCase(id))
                ?.isActive ?? false,
          ),
        )
      case "DependingOnActiveInstances":
        return Case(
          "Fixed",
          getAdventurePointsDependingOnActiveInstancesForInactiveActivatableInstance(
            this.dbEntry.ap_value.DependingOnActiveInstances,
            this.activationsCountWithoutCustomAPValues,
          ),
        )
      case "Indefinite":
        return Case("Fixed", 0)
      default:
        return assertExhaustive(this.dbEntry.ap_value)
    }
  }

  /**
   * Flattens the list of dependencies to
   * usable values. That means, optional dependencies (objects) will be evaluated
   * and will be included in the resulting list, depending on whether it has to
   * follow the optional dependency or not. The result is a plain `List` of all
   * non-optional dependencies.
   */
  @computed
  get applyingDependencies(): ActivatableDependency[] {
    return this.dependencies.filter(dep => {
      if (
        dep.when !== undefined &&
        !checkPreconditions(dep.when, this.character.prerequisiteCapabilities)
      ) {
        return false
      }

      if (dep.isPartOfDisjunction) {
        return checkMultipleDisjunctionPartsAreValid(
          this.global.db.getInstanceOfEntityById,
          this.character.prerequisiteCapabilities,
          dep.sourceId,
          dep.index,
        )
      }

      return true
    })
  }
}

export type ResolvedSelectOptionWithResolvedAPValue = ResolvedSelectOption & {
  content: {
    ap_value?: Case<"Fixed", number>
  }
  parentSelectOption?: ResolvedSelectOptionIdentifier
}

/**
 * A combination of a static and corresponding dynamic skill entry, extended by value bounds and full logic for if the value can be increased or decreased.
 */
export type DisplayedActiveActivatable<
  Entity extends ActivatableIdentifier["kind"] = ActivatableIdentifier["kind"],
> = {
  [E in Entity]: {
    type: E
    active: true
    id: string
    instance: RawActivatableInstance
    instanceIndex: number
    isRemovable: boolean
    levels?: number
    minLevel?: number
    maxLevel?: number
    cost: DisplayedActiveActivatableCost
    name: ActivatableNameComponentsWithFull
  }
}[Entity]

/**
 * A combination of a static and corresponding dynamic skill entry, extended by value bounds and full logic for if the value can be increased or decreased.
 */
export type DisplayedInactiveActivatable<
  Entity extends ActivatableIdentifier["kind"] = ActivatableIdentifier["kind"],
> = {
  [E in Entity]: {
    type: E
    active: false
    id: string
    name: string
    instances: RawActivatableInstance[]
    isAvailable: boolean
    options: DisplayedInactiveActivatableOption[]
    level?: {
      maximum: number
      placement: "before" | "after"
    }
    /**
     * A modified version or the adventure points value of the entry.
     */
    apValue:
      | Case<"Fixed", FixedAdventurePointsValue>
      | Case<"ByLevel", AdventurePointsValueByLevel>
      | Case<"DerivedFromSelection">
  }
}[Entity]

export class CharacterActivatables<Entity extends ActivatableIdentifier["kind"]> {
  readonly global: Global
  readonly #character: Character
  readonly #entity: Entity
  @observable accessor #activatables: Map<string, CharacterActivatable<Entity>> = new Map()

  constructor(global: Global, character: Character, entity: Entity) {
    this.global = global
    this.#character = character
    this.#entity = entity
  }

  getById(id: string): CharacterActivatable<Entity> | undefined {
    return get(this.#activatables, id)
  }

  getByIdSafe(id: string, dbEntry?: EntityMap[Entity]): CharacterActivatable<Entity> {
    return this.getById(id) ?? this.#createEmpty(id, dbEntry)
  }

  getInstancesById(id: string): RawActivatableInstance[] {
    return this.getById(id)?.instances ?? []
  }

  #createEmpty(
    id: string,
    dbEntry: EntityMap[Entity] | undefined = this.global.db.getInstanceOfEntityById(
      this.#entity,
      id,
    ),
  ): CharacterActivatable<Entity> {
    return CharacterActivatable.createEmpty(this.global, this.#character, this.#entity, id, dbEntry)
  }

  @computed
  get adventurePointsTotal() {
    return this.#activatables
      .values()
      .reduce(
        (acc, entry) =>
          entry.isActive ? addAdventurePointsCaches(acc, entry.adventurePoints) : acc,
        emptyAdventurePointsCache,
      )
  }

  #ensureEntryExists(id: string): CharacterActivatable<Entity> {
    return this.#activatables.getOrInsertComputed(id, () => this.#createEmpty(id))
  }

  @computed
  get hasActive(): boolean {
    return this.#activatables.values().some(entry => entry.isActive)
  }

  @computed
  get activeCount(): number {
    return this.#activatables.values().reduce((acc, entry) => (entry.isActive ? acc + 1 : acc), 0)
  }

  @computed
  get active(): CharacterActivatable<Entity>[] {
    return this.#activatables
      .values()
      .filter(entry => entry.isActive)
      .toArray()
  }

  @computed
  get activeForDisplay(): DisplayedActiveActivatable<Entity>[] {
    return this.#activatables
      .values()
      .flatMap(entry => entry.toJSONActive())
      .toArray()
  }

  @computed
  get inactive(): DisplayedInactiveActivatable<Entity>[] {
    return this.global.db
      .getAllInstanceContainersOfEntity(this.#entity)
      .map((container): DisplayedInactiveActivatable<Entity> | undefined => {
        if (
          !isEntryFromIncludedPublication(
            container.content,
            this.global.db.getInstanceOfEntityById.bind(this.global.db),
            this.global.locale.translateMap,
            this.#character.rules.publicationOptions,
          )
        ) {
          return undefined
        }

        return this.getByIdSafe(container.id, container.content).toJSONInactive()
      })
      .filter(isNotNullish)
  }

  @action
  add(id: string, instance: RawActivatableInstance) {
    const entry = this.#ensureEntryExists(id)
    entry.add(instance)
  }

  @action
  setLevel(id: string, index: number, newLevel: number) {
    const entry = this.#ensureEntryExists(id)
    entry.setLevel(index, newLevel)
  }

  @action
  remove(id: string, index: number) {
    const entry = this.#ensureEntryExists(id)
    entry.remove(index)
  }

  addOrRemoveDependency(id: string, method: RegistrationMethod, dependency: ActivatableDependency) {
    const entry = this.#ensureEntryExists(id)
    addOrRemoveDependency(method, entry.dependencies, dependency)
  }
}

/**
 * A single activation of an activatable entry.
 */
export type RawActivatableInstance = {
  /**
   * One or multiple options for the activatable. The meaning depends on the activatable.
   */
  options?: ActivatableOption[]

  /**
   * The instance level (if the activatable has levels).
   */
  level?: number

  /**
   * If provided, a custom adventure points value has been set for this instance.
   */
  customAdventurePointsValue?: number

  /**
   * A list of used bound adventure points for this instance.
   */
  usedBoundAdventurePoints?: BoundAdventurePointsForActivatable[]
}

/**
 * An option for an activatable entry.
 */
export type ActivatableOption = PredefinedActivatableOption | CustomActivatableOption

/**
 * A predefined option for an activatable entry.
 */
export type PredefinedActivatableOption = {
  type: "Predefined"

  /**
   * An identifier referencing a different entry.
   */
  id: ResolvedSelectOptionIdentifier
}

/**
 * A predicate for a predefined option on an activatable entry.
 */
export const isPredefinedActivatableOption = (
  option: ActivatableOption,
): option is PredefinedActivatableOption => option.type === "Predefined"

/**
 * A custom option for an activatable entry, handled as user-entered text.
 */
export type CustomActivatableOption = {
  type: "Custom"

  /**
   * A user-entered text.
   */
  value: string
}

/**
 * A predicate for a custom option on an activatable entry.
 */
export const isCustomActivatableOption = (
  option: ActivatableOption,
): option is CustomActivatableOption => option.type === "Custom"

/**
 * Returns whether a select option matches a given activatable option.
 */
export const matchesOptionId = (id: ResolvedSelectOptionIdentifier, option: ActivatableOption) =>
  isPredefinedActivatableOption(option) && equalsCase(option.id, id)

/**
 * Maps the special ability tag names to their corresponding translations.
 */
// prettier-ignore
export const activatableGroupTranslationKeys = Object.freeze({
  Advantage: undefined,
  Disadvantage: undefined,
  Adoruzepterzauber: "Adoruzepterzauber",
  AdvancedCombatSpecialAbility: "Advanced Combat Special Abilities",
  AdvancedKarmaSpecialAbility: "Advanced Karma Special Abilities",
  AdvancedMagicalSpecialAbility: "Advanced Magical Special Abilities",
  AdvancedSkillSpecialAbility: "Advanced Skill Special Abilities",
  AncestorGlyph: "Ancestor Glyphs",
  ArcaneOrbEnchantment: "Arcane Orb Enchantments",
  AttireEnchantment: "Attire Enchantments",
  Beutelzauber: "Beutelzauber",
  BlessedTradition: "Blessed Traditions",
  BowlEnchantment: "Bowl Enchantments",
  BrawlingSpecialAbility: "Brawling Special Abilities",
  CauldronEnchantment: "Cauldron Enchantments",
  CeremonialItemSpecialAbility: "Ceremonial Item Special Abilities",
  ChronicleEnchantment: "Chronicle Enchantments",
  CombatSpecialAbility: "Combat Special Abilities",
  CombatStyleSpecialAbility: "Combat Style Special Abilities",
  CommandSpecialAbility: "Command Special Abilities",
  DaggerRitual: "Dagger Rituals",
  FamiliarSpecialAbility: "Familiar Special Abilities",
  FatePointSexSpecialAbility: "Fate Point Sex Special Abilities",
  FatePointSpecialAbility: "Fate Point Special Abilities",
  FoolsHatEnchantment: "Fools Hat Enchantments",
  GeneralSpecialAbility: "General Special Abilities",
  Haubenzauber: "Haubenzauber",
  Hauerkettenzauber: "Hauerkettenzauber",
  InstrumentEnchantment: "Instrument Enchantments",
  KarmaSpecialAbility: "Karma Special Abilities",
  Keulenzauber: "Keulenzauber",
  Krallenkettenzauber: "Krallenkettenzauber",
  Kristallkugelzauber: "Kristallkugelzauber",
  LiturgicalStyleSpecialAbility: "Liturgical Style Special Abilities",
  LycantropicGift: "Lycantropic Gifts",
  MagicalSign: "Magical Signs",
  MagicalSpecialAbility: "Magical Special Abilities",
  MagicalTradition: "Magical Traditions",
  MagicStyleSpecialAbility: "Magic Style Special Abilities",
  OrbEnchantment: "Orb Enchantments",
  PactGift: "Pact Gifts",
  ProtectiveWardingCircleSpecialAbility: "Protective/Warding Circle Special Abilities",
  RingEnchantment: "Ring Enchantments",
  Schweinetrommelzauber: "Schweinetrommelzauber",
  Sermon: "Sermons",
  SexSpecialAbility: "Sex Special Abilities",
  SickleRitual: "Sickle Rituals",
  SikaryanDrainSpecialAbility: "Sikaryan Drain Special Abilities",
  SkillStyleSpecialAbility: "Skill Style Special Abilities",
  SpellSwordEnchantment: "Spell Sword Enchantments",
  StaffEnchantment: "Staff Enchantments",
  ToyEnchantment: "Toy Enchantments",
  Trinkhornzauber: "Trinkhornzauber",
  VampiricGift: "Vampiric Gifts",
  Vision: "Visions",
  WandEnchantment: "Wand Enchantments",
  WeaponEnchantment: "Weapon Enchantments",
})
