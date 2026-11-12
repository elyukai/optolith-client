import { stripInlineMarkdown } from "@elyukai/markdown/render/strip"
import { countByMany } from "@elyukai/utils/array/reductions"
import { on } from "@elyukai/utils/function"
import { isNotNullish } from "@elyukai/utils/nullable"
import { compareNullish, compareNumber, reduceCompare, type Compare } from "@elyukai/utils/ordering"
import { assertExhaustive } from "@elyukai/utils/typeSafety"
import {
  compareImprovementCost,
  type ImprovementCost,
} from "@optolith/adventure-points/improvement-cost"
import type {
  Aspect,
  Aspect_ID,
  BlessedTradition_ID,
  Blessing_ID,
  Ceremony,
  LiturgicalChant,
  LiturgyIdentifier,
  LiturgyTradition,
  SkillCheck,
} from "@optolith/database-schema/gen"
import {
  renderFastPerformanceParameters,
  renderSlowPerformanceParameters,
} from "@optolith/entity-descriptions/entities/partial/rated/activatable/index"
import { renderSkillCheckPenalty } from "@optolith/entity-descriptions/entities/partial/rated/skillCheck"
import { ResponsiveTextSize } from "@optolith/entity-descriptions/entities/partial/responsiveText"
import { isEntryFromIncludedPublication } from "@optolith/entity-descriptions/publication-options"
import { computed } from "mobx"
import type { Global } from "../../global.ts"
import type { TranslateMap } from "../../utils/locale.ts"
import type { CharacterActivatable } from "../activatable/activatable.ts"
import { TinyActivatable, TinyActivatables } from "../activatable/tinyActivatable.ts"
import type { BaseCharacter } from "../character.ts"
import { Case } from "../databaseEnum.ts"
import { registerOrUnregisterPrerequisitesOfLiturgyAsDependencies } from "../dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { RegistrationMethod } from "../dependencies/registrationHelpers.ts"
import { checkPrerequisitesOfLiturgy } from "../prerequisites/fullPrerequisiteValidationForType.ts"
import { LiturgiesSortOrder } from "../sortOrders.ts"
import {
  CharacterActivatableRatedEntriesWithEnhancements,
  CharacterActivatableRatedWithEnhancements,
  type ConsParamsTrim,
  type DisplayedActiveActivatableRatedWithEnhancements,
  type DisplayedInactiveActivatableRatedWithEnhancements,
} from "./ratedEntry.ts"

export class CharacterBlessing extends TinyActivatable<"Blessing"> {}

export class CharacterBlessings extends TinyActivatables<"Blessing", CharacterBlessing> {
  constructor(global: Global, character: BaseCharacter) {
    super(global, character, "Blessing", CharacterBlessing)
  }

  @computed
  get restrictedBlessings(): Blessing_ID[] {
    const entry = this.character.getActivatableCollection("BlessedTradition").active[0]?.dbEntry
    return entry?.type.kind !== "Church" || entry?.type.Church?.restrictedBlessings === undefined
      ? []
      : entry.type.Church.restrictedBlessings.kind === "Six"
        ? entry.type.Church.restrictedBlessings.Six
        : entry.type.Church.restrictedBlessings.Three
  }

  @computed
  get inactiveForDisplay(): DisplayedBlessing[] {
    return this.activatables
      .values()
      .filter(({ id }) => !this.isActive(id))
      .map((container): DisplayedBlessing => ({
        type: "Blessing",
        id: container.id,
        name: this.global.locale.translateMap(container.dbEntry.translations)?.name ?? "",
        groupName: this.global.locale.translate("Blessings"),
        groupPosition: 0,
        isDisabled: this.restrictedBlessings.includes(container.id),
      }))
      .toArray()
  }

  @computed
  get activeForDisplay(): DisplayedBlessing[] {
    return this.activatables
      .values()
      .filter(({ id }) => this.isActive(id))
      .map((container): DisplayedBlessing => ({
        type: "Blessing",
        id: container.id,
        groupPosition: 0,
        name: this.global.locale.translateMap(container.dbEntry.translations)?.name ?? "",
        groupName: this.global.locale.translate("Blessings"),
        isDisabled: false,
      }))
      .toArray()
  }
}

export type DisplayedBlessing = {
  type: "Blessing"
  id: Blessing_ID
  groupPosition: number
  name: string
  groupName: string
  improvementCost?: undefined
  isDisabled: boolean
}

export class CharacterLiturgicalChant<
  Entity extends "LiturgicalChant" | "Ceremony",
> extends CharacterActivatableRatedWithEnhancements<Entity> {
  override readonly derivedDependencies = []
  readonly improvementCost = this.dbEntry.improvement_cost.kind

  @computed
  get minValue() {
    const minimumValues: number[] = [
      ...this.flatMinimumRestrictions,
      ...this.activeEnhancements.values().map(enhancement => enhancement.dbEntry.skill_rating),
    ].filter(isNotNullish)

    return minimumValues.length > 0 ? Math.max(...minimumValues) : undefined
  }

  @computed
  get bonusMaximumValue(): number {
    return (
      this.character.maximumSkillRatingBonusEntry?.countOptions(
        Case<"LiturgicalChant" | "Ceremony", string>(this.entityName, this.id),
      ) ?? 0
    )
  }

  @computed
  get maxValue() {
    const maximumValues = [
      this.getMaxValue(this.dbEntry.check, "max_skill_rating", this.bonusMaximumValue),
      this.character.aspectIdsWithUnlockedMaximum.some(aspectId => this.aspects.includes(aspectId))
        ? undefined
        : 14,
    ].filter(isNotNullish)

    return Math.min(...maximumValues) + this.bonusMaximumValue
  }

  @computed
  get skillCheckValues(): ReturnType<typeof this.getAssociatedAttributeValues> {
    return this.getAssociatedAttributeValues(this.dbEntry.check)
  }

  @computed
  get skillCheckPenaltyText(): string | undefined {
    return this.dbEntry.check_penalty === undefined
      ? undefined
      : stripInlineMarkdown(
          renderSkillCheckPenalty(this.dbEntry.check_penalty).run({
            translate: this.global.locale.translate,
            translateMap: this.global.locale.translateMap,
            getInstanceById: this.global.db.getInstanceOfEntityById.bind(this.global.db),
            responsiveTextSize: ResponsiveTextSize.Compressed,
          }),
        )
  }

  override toJSON(): DisplayedLiturgicalChant<Entity> {
    const { activeBlessedTradition } = this.character
    return {
      ...super.toJSON(),
      check: this.dbEntry.check,
      checkPenalty: this.skillCheckPenaltyText,
      improvementCost: this.improvementCost,
      groupPosition: this.entityName === "LiturgicalChant" ? 1 : 2,
      type: this.entityName,
      name: this.global.locale.translateMap(this.dbEntry.translations)?.name ?? "",
      groupName:
        this.entityName === "LiturgicalChant"
          ? this.global.locale.translate("Liturgical Chants")
          : this.global.locale.translate("Ceremonies"),
      associatedText:
        activeBlessedTradition === undefined
          ? ""
          : getAspectsForTranslation(
              this.dbEntry.traditions,
              activeBlessedTradition,
              aspectId => this.global.db.getInstanceOfEntityById("Aspect", aspectId),
              this.global.locale.translateMap,
            )
              .toSorted(this.global.locale.compare)
              .join(", "),
      parameters: (() => {
        const env = this.character.liturgicalChantParameterRenderingEnvironment
        switch (this.entityName) {
          case "LiturgicalChant":
            return renderFastPerformanceParameters(
              (this.dbEntry as LiturgicalChant).parameters,
            ).run(env)
          case "Ceremony":
            return renderSlowPerformanceParameters((this.dbEntry as Ceremony).parameters).run(env)
          default:
            return assertExhaustive(this.entityName)
        }
      })(),
    }
  }

  @computed
  get highestRequiredAttribute(): ReturnType<typeof this.getHighestRequiredAssociatedAttribute> {
    return super.getHighestRequiredAssociatedAttribute(this.dbEntry.check, this.bonusMaximumValue)
  }

  get isAvailable(): boolean {
    return (
      !this.character.isMaximumOfLiturgicalChantsReached &&
      checkPrerequisitesOfLiturgy(
        this.dbEntry.prerequisites ?? [],
        this.character.prerequisiteCapabilities,
      )
    )
  }

  hasAspectById(id: Aspect_ID): boolean {
    return hasAspectById(this.dbEntry.traditions, id)
  }

  @computed
  get aspects(): Aspect_ID[] {
    return flattenAspects(this.dbEntry.traditions)
  }

  @computed
  get isOwnTradition(): boolean {
    const { activeBlessedTradition } = this.character
    return activeBlessedTradition === undefined
      ? false
      : this.dbEntry.traditions.some(tradition => {
          switch (tradition.kind) {
            case "GeneralAspect":
              return (
                tradition.GeneralAspect ===
                (activeBlessedTradition.dbEntry.type.kind === "Shamanistic"
                  ? this.global.settings.liturgicalChants.generalAspectForShamanistic
                  : this.global.settings.liturgicalChants.generalAspectForChurch)
              )
            case "Tradition":
              return tradition.Tradition.tradition === activeBlessedTradition.id
            default:
              return assertExhaustive(tradition)
          }
        })
  }

  /**
   * Checks if any of the passed traditions matches the predicate. General
   * aspects are ignored.
   */
  anyBlessedTradition(predicate: (traditionId: BlessedTradition_ID) => boolean): boolean {
    return this.dbEntry.traditions.some(
      tradition => tradition.kind === "Tradition" && predicate(tradition.Tradition.tradition),
    )
  }

  override activate(): void {
    super.activate()
    if (this.dbEntry.prerequisites !== undefined) {
      registerOrUnregisterPrerequisitesOfLiturgyAsDependencies(
        this.dbEntry.prerequisites,
        RegistrationMethod.Add,
        this.character,
        Case(this.entityName satisfies LiturgyIdentifier["kind"], this.id),
      )
    }
  }

  override deactivate(): void {
    super.deactivate()
    if (this.dbEntry.prerequisites !== undefined) {
      registerOrUnregisterPrerequisitesOfLiturgyAsDependencies(
        this.dbEntry.prerequisites,
        RegistrationMethod.Remove,
        this.character,
        Case(this.entityName satisfies LiturgyIdentifier["kind"], this.id),
      )
    }
  }
}

export const hasAspectById = (traditions: LiturgyTradition[], id: Aspect_ID): boolean =>
  traditions.some(t => {
    switch (t.kind) {
      case "GeneralAspect":
        return t.GeneralAspect === id
      case "Tradition":
        return t.Tradition.aspects?.includes(id) ?? false
      default:
        return assertExhaustive(t)
    }
  })

export const flattenAspects = (traditions: LiturgyTradition[]): Aspect_ID[] =>
  traditions.flatMap(t => {
    switch (t.kind) {
      case "GeneralAspect":
        return [t.GeneralAspect]
      case "Tradition":
        return t.Tradition.aspects ?? []
      default:
        return assertExhaustive(t)
    }
  })

export type DisplayedInactiveLiturgicalChant<
  Entity extends "LiturgicalChant" | "Ceremony" = "LiturgicalChant" | "Ceremony",
> = {
  [E in Entity]: DisplayedInactiveActivatableRatedWithEnhancements & {
    type: E
    check: SkillCheck
    checkPenalty: string | undefined
    groupPosition: number
    improvementCost: ImprovementCost
    name: string
    groupName: string
    associatedText: string
    parameters: {
      cost: string
      castingTime: string
      range: string
      duration: string
    }
  }
}[Entity]

export type DisplayedActiveLiturgicalChant<
  Entity extends "LiturgicalChant" | "Ceremony" = "LiturgicalChant" | "Ceremony",
> = {
  [E in Entity]: DisplayedActiveActivatableRatedWithEnhancements & {
    type: E
    check: SkillCheck
    checkPenalty: string | undefined
    groupPosition: number
    improvementCost: ImprovementCost
    name: string
    groupName: string
    associatedText: string
    parameters: {
      cost: string
      castingTime: string
      range: string
      duration: string
    }
  }
}[Entity]

export type DisplayedLiturgicalChant<
  Entity extends "LiturgicalChant" | "Ceremony" = "LiturgicalChant" | "Ceremony",
> = DisplayedActiveLiturgicalChant<Entity> | DisplayedInactiveLiturgicalChant<Entity>

export class CharacterLiturgicalChants<
  Entity extends "LiturgicalChant" | "Ceremony",
> extends CharacterActivatableRatedEntriesWithEnhancements<
  Entity,
  CharacterLiturgicalChant<Entity>
> {
  constructor(
    ...args: ConsParamsTrim<
      typeof CharacterActivatableRatedEntriesWithEnhancements<
        Entity,
        CharacterLiturgicalChant<Entity>
      >,
      1
    >
  ) {
    super(CharacterLiturgicalChant, ...args)
  }

  getActiveByAspect(aspectId: Aspect_ID): CharacterLiturgicalChant<Entity>[] {
    return this.active.filter(e => e.hasAspectById(aspectId))
  }

  @computed
  override get inactiveForDisplay() {
    const checkAdditionalUnlocked: (
      staticLiturgicalChant: CharacterLiturgicalChant<Entity>,
    ) => boolean = () => false
    // TODO: Serializable in database?
    // if (isActive(birdsOfPassage)) {
    //   const phexCount =
    //     activeUnfamiliarLiturgicalChantsAndCeremoniesCount[BlessedTraditionIdentifier.Phex] ?? 0

    //   const rahjaCount =
    //     activeUnfamiliarLiturgicalChantsAndCeremoniesCount[BlessedTraditionIdentifier.Rahja] ?? 0

    //   return ({ traditions, improvement_cost }) =>
    //     (phexCount === 0 &&
    //       anyBlessedTradition(
    //         traditions,
    //         tradition => tradition === BlessedTraditionIdentifier.Phex,
    //       ) &&
    //       compareImprovementCost(fromRaw(improvement_cost), ImprovementCost.C) <= 0) ||
    //     (rahjaCount === 0 &&
    //       anyBlessedTradition(
    //         traditions,
    //         tradition => tradition === BlessedTraditionIdentifier.Rahja,
    //       ) &&
    //       compareImprovementCost(fromRaw(improvement_cost), ImprovementCost.C) <= 0)
    // }

    // if (isActive(huntressesOfTheWhiteMaiden)) {
    //   // This checks for either liturgical chants or ceremonies, depending on
    //   // context the function is used in.
    //   const firunLiturgicalChantCount =
    //     activeUnfamiliarLiturgicalChantsCount[BlessedTraditionIdentifier.Firun] ?? 0

    //   return ({ traditions, improvement_cost }) =>
    //     firunLiturgicalChantCount === 0 &&
    //     anyBlessedTradition(
    //       traditions,
    //       tradition => tradition === BlessedTraditionIdentifier.Firun,
    //     ) &&
    //     compareImprovementCost(fromRaw(improvement_cost), ImprovementCost.C) <= 0
    // }

    // if (isActive(followersOfTheGoldenOne)) {
    //   return ({ traditions, improvement_cost }) =>
    //     (Object.keys(activeUnfamiliarLiturgicalChantsAndCeremoniesCount).length === 0 ||
    //       anyBlessedTradition(traditions, tradition =>
    //         unfamiliarTraditionsWithHighestActiveCount.includes(tradition),
    //       )) &&
    //     compareImprovementCost(fromRaw(improvement_cost), ImprovementCost.B) <= 0
    // }

    return this.global.db
      .getAllInstanceContainersOfEntity(this.entityName)
      .map(
        container =>
          this.getById(container.id) ?? this.createEmpty(container.id, container.content),
      )
      .filter(
        entry =>
          isEntryFromIncludedPublication(
            entry.dbEntry,
            this.global.db.getInstanceOfEntityById.bind(this.global.db),
            this.global.locale.translateMap,
            this.character.rules.publicationOptions,
          ) &&
          entry.value === undefined &&
          (entry.isOwnTradition || checkAdditionalUnlocked(entry)),
      )
      .map(entry => entry.toJSON() as DisplayedInactiveLiturgicalChant<Entity>)
  }

  /**
   * Counts the number of active liturgical chants that belong to a blessed
   * tradition that is not the active one, by tradition.
   */
  @computed
  get activeUnfamiliarCountByTradition(): Partial<Record<BlessedTradition_ID, number>> {
    return countByMany(
      this.rated
        .values()
        .filter(entry => entry.active && !entry.isOwnTradition)
        .toArray(),
      entry =>
        entry.dbEntry.traditions.flatMap(t =>
          t.kind === "Tradition" ? [t.Tradition.tradition] : [],
        ),
    )
  }
}

/**
 * Returns the translation of all aspects relevant to the current active blessed
 * tradition. If the tradition has no aspects, the name of the tradition is used
 * instead.
 */
export const getAspectsForTranslation = (
  traditions: LiturgyTradition[],
  activeBlessedTradition: CharacterActivatable<"BlessedTradition">,
  getAspectById: (id: string) => Aspect | undefined,
  translateMap: TranslateMap,
): string[] =>
  traditions
    .flatMap(tradition => {
      switch (tradition.kind) {
        case "GeneralAspect":
          return translateMap(getAspectById(tradition.GeneralAspect)?.translations)?.name
        case "Tradition": {
          if (tradition.Tradition.tradition === activeBlessedTradition.id) {
            if (activeBlessedTradition.dbEntry.aspects === undefined) {
              return translateMap(activeBlessedTradition.dbEntry.translations)?.name
            } else {
              return (
                tradition.Tradition.aspects?.map(
                  aspectId => translateMap(getAspectById(aspectId)?.translations)?.name,
                ) ?? []
              )
            }
          }

          return []
        }
        default:
          return assertExhaustive(tradition)
      }
    })
    .filter(isNotNullish)

/**
 * Filters and sorts the displayed liturgies.
 */
export const filterAndSortDisplayed = <T extends DisplayedLiturgicalChant | DisplayedBlessing>(
  visibileLiturgies: T[],
  filterText: string,
  sortOrder: LiturgiesSortOrder,
  localeCompare: Compare<string>,
) =>
  (filterText === ""
    ? visibileLiturgies
    : visibileLiturgies.filter(c => c.name.toLowerCase().includes(filterText.toLowerCase()))
  ).toSorted(
    (() => {
      switch (sortOrder) {
        case LiturgiesSortOrder.Name:
          return on(c => c.name, localeCompare)
        case LiturgiesSortOrder.Group:
          return reduceCompare(
            on(c => c.groupPosition, compareNumber),
            on(c => c.name, localeCompare),
          )
        case LiturgiesSortOrder.ImprovementCost:
          return reduceCompare(
            on(c => Math.min(c.groupPosition, 1), compareNumber),
            on(c => c.improvementCost, compareNullish(compareImprovementCost)),
            on(c => c.name, localeCompare),
          )
        default:
          return assertExhaustive(sortOrder)
      }
    })(),
  )
