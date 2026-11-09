import { stripInlineMarkdown } from "@elyukai/markdown/render/strip"
import { count } from "@elyukai/utils/array/reductions"
import { on } from "@elyukai/utils/function"
import { isNotNullish } from "@elyukai/utils/nullable"
import { compareNullish, compareNumber, reduceCompare, type Compare } from "@elyukai/utils/ordering"
import { assertExhaustive } from "@elyukai/utils/typeSafety"
import {
  compareImprovementCost,
  type ImprovementCost,
} from "@optolith/adventure-points/improvement-cost"
import type {
  Enhancement_ID,
  Property_ID,
  SkillCheck,
  SpellworkIdentifier,
} from "@optolith/database-schema/gen"
import { renderSkillCheckPenalty } from "@optolith/entity-descriptions/entities/partial/rated/skillCheck"
import { ResponsiveTextSize } from "@optolith/entity-descriptions/entities/partial/responsiveText"
import { isEntryFromIncludedPublication } from "@optolith/entity-descriptions/publication-options"
import { computed } from "mobx"
import type { Global } from "../../global.ts"
import { TinyActivatable, TinyActivatables } from "../activatable/tinyActivatable.ts"
import type { BaseCharacter, Character } from "../character.ts"
import { Case } from "../databaseEnum.ts"
import { registerOrUnregisterPrerequisitesOfSpellworkAsDependencies } from "../dependencies/fullPrerequisiteRegistrationAsDependencyForType.ts"
import { RegistrationMethod } from "../dependencies/registrationHelpers.ts"
import { checkPrerequisitesOfSpellwork } from "../prerequisites/fullPrerequisiteValidationForType.ts"
import { SpellsSortOrder } from "../sortOrders.ts"
import {
  CharacterActivatableRatedEntriesWithEnhancements,
  CharacterActivatableRatedWithEnhancements,
  type DisplayedActiveActivatableRatedWithEnhancements,
  type DisplayedInactiveActivatableRatedWithEnhancements,
} from "./ratedEntry.ts"

export class CharacterCantrip extends TinyActivatable<"Cantrip"> {
  @computed
  get isUnfamiliar(): boolean {
    // TODO: Set in database?
    // if (
    //   isTraditionActive(activeMagicalTraditions, [
    //     MagicalTraditionIdentifier.IntuitiveMages,
    //     MagicalTraditionIdentifier.Schelme,
    //     MagicalTraditionIdentifier.Zauberalchimisten,
    //   ])
    // ) {
    //   return _ => false
    // }

    // TODO: Check transferred unfamiliar
    // all (pipe (TUA.id, trans_id => trans_id !== id && trans_id !== UnfamiliarGroup.Spells))
    //     (transferred_unfamiliar)
    const applicableTraditionIds = this.character.applicableMagicalTraditionIds

    switch (this.dbEntry.note?.kind) {
      case "Common":
        return !this.dbEntry.note.Common.list.some(trad => {
          switch (trad.kind) {
            case "Academy":
              return trad.Academy === this.character.curriculum?.educationalInstitutionId
            case "Tradition":
              return applicableTraditionIds.includes(trad.Tradition.id)
            default:
              return assertExhaustive(trad)
          }
        })
      case "Exclusive":
        return !this.dbEntry.note.Exclusive.traditions.some(trad =>
          applicableTraditionIds.includes(trad),
        )
      case undefined:
        return false
      default:
        return assertExhaustive(this.dbEntry.note)
    }
  }
}

export class CharacterCantrips extends TinyActivatables<"Cantrip", CharacterCantrip> {
  constructor(global: Global, character: BaseCharacter) {
    super(global, character, "Cantrip", CharacterCantrip)
  }

  @computed
  get inactiveForDisplay(): DisplayedCantrip[] {
    return this.character.canLearnCantrips
      ? this.activatables
          .values()
          .filter(({ id }) => !this.isActive(id))
          .map((container): DisplayedCantrip => ({
            type: "Cantrip",
            id: container.id,
            groupPosition: 0,
            name: this.global.locale.translateMap(container.dbEntry.translations)?.name ?? "",
            groupName: this.global.locale.translate("Cantrips"),
            associatedText:
              this.global.locale.translateMap(
                this.global.db.getInstanceOfEntityById("Property", container.dbEntry.property)
                  ?.translations,
              )?.name ?? "",
            isUnfamiliar: container.isUnfamiliar,
            isDisabled: false, // TODO: Check dependencies
          }))
          .toArray()
      : []
  }

  @computed
  get activeForDisplay(): DisplayedCantrip[] {
    return this.activatables
      .values()
      .filter(({ id }) => this.isActive(id))
      .map((entry): DisplayedCantrip => ({
        type: "Cantrip",
        id: entry.id,
        groupPosition: 0,
        name: this.global.locale.translateMap(entry.dbEntry.translations)?.name ?? "",
        groupName: this.global.locale.translate("Cantrips"),
        associatedText:
          this.global.locale.translateMap(
            this.global.db.getInstanceOfEntityById("Property", entry.dbEntry.property)
              ?.translations,
          )?.name ?? "",
        isUnfamiliar: entry.isUnfamiliar,
        isDisabled: false, // TODO: Check traditions
      }))
      .toArray()
  }

  static fromJSON(global: Global, character: Character, raw: string[] | undefined) {
    return super.fromAnyJSON(global, character, CharacterCantrips, raw)
  }
}

export type DisplayedCantrip = {
  type: "Cantrip"
  id: string
  name: string
  groupName: string
  groupPosition: number
  associatedText: string
  isUnfamiliar: boolean
  improvementCost?: undefined
  isDisabled: boolean
}

export class CharacterSpellwork<
  Entity extends "Spell" | "Ritual",
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
        Case<"Spell" | "Ritual", string>(this.entityName, this.id),
      ) ?? 0
    )
  }

  @computed
  get maxValue() {
    const maximumValues = [
      this.getMaxValue(this.dbEntry.check, "max_skill_rating", this.bonusMaximumValue),
      this.character.propertyIdsWithUnlockedMaximum.includes(this.dbEntry.property)
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
    const { translate, translateMap } = this.global.locale
    return this.dbEntry.check_penalty === undefined
      ? undefined
      : stripInlineMarkdown(
          renderSkillCheckPenalty(this.dbEntry.check_penalty).run({
            translate,
            translateMap,
            getInstanceById: this.global.db.getInstanceOfEntityById.bind(this.global.db),
            responsiveTextSize: ResponsiveTextSize.Compressed,
          }),
        )
  }

  override toJSON(): DisplayedSpellwork<Entity> {
    return {
      ...super.toJSON(),
      check: this.dbEntry.check,
      checkPenalty: this.skillCheckPenaltyText,
      improvementCost: this.improvementCost,
      groupPosition: this.entityName === "Spell" ? 1 : 2,
      type: this.entityName,
      isUnfamiliar: this.isUnfamiliar,
      name: this.global.locale.translateMap(this.dbEntry.translations)?.name ?? "",
      groupName:
        this.entityName === "Spell"
          ? this.global.locale.translate("Spells")
          : this.global.locale.translate("Rituals"),
      associatedText:
        this.global.locale.translateMap(
          this.global.db.getInstanceOfEntityById("Property", this.dbEntry.property)?.translations,
        )?.name ?? "",
    }
  }

  @computed
  get highestRequiredAttribute(): ReturnType<typeof this.getHighestRequiredAssociatedAttribute> {
    return super.getHighestRequiredAssociatedAttribute(this.dbEntry.check, this.bonusMaximumValue)
  }

  @computed
  get isAvailable(): boolean {
    return (
      !this.character.isMaximumOfSpellworksReached &&
      (!this.isUnfamiliar || !this.character.isMaximumOfUnfamiliarSpellworksReached) &&
      checkPrerequisitesOfSpellwork(
        this.dbEntry.prerequisites ?? [],
        this.character.prerequisiteCapabilities,
      )
    )
  }

  @computed
  get isUnfamiliar(): boolean {
    // TODO: Set in database?
    // if (
    //   isTraditionActive(activeMagicalTraditions, [
    //     MagicalTraditionIdentifier.IntuitiveMages,
    //     MagicalTraditionIdentifier.Schelme,
    //     MagicalTraditionIdentifier.Zauberalchimisten,
    //   ])
    // ) {
    //   return _ => false
    // }

    // TODO: Check transferred unfamiliar
    // all (pipe (TUA.id, trans_id => trans_id !== id && trans_id !== UnfamiliarGroup.Spells))
    //     (transferred_unfamiliar)

    switch (this.dbEntry.traditions.kind) {
      case "General":
        return false
      case "Specific": {
        const applicableTraditionIds = this.character.applicableMagicalTraditionIds
        return !this.dbEntry.traditions.Specific.some(trad => applicableTraditionIds.includes(trad))
      }
      default:
        return assertExhaustive(this.dbEntry.traditions)
    }
  }

  override activate(): void {
    super.activate()
    if (this.dbEntry.prerequisites !== undefined) {
      registerOrUnregisterPrerequisitesOfSpellworkAsDependencies(
        this.dbEntry.prerequisites,
        RegistrationMethod.Add,
        this.character,
        Case(this.entityName satisfies SpellworkIdentifier["kind"], this.id),
      )
    }
  }

  override deactivate(): void {
    super.deactivate()
    if (this.dbEntry.prerequisites !== undefined) {
      registerOrUnregisterPrerequisitesOfSpellworkAsDependencies(
        this.dbEntry.prerequisites,
        RegistrationMethod.Remove,
        this.character,
        Case(this.entityName satisfies SpellworkIdentifier["kind"], this.id),
      )
    }
  }
}

export type DisplayedInactiveSpellwork<Entity extends "Spell" | "Ritual" = "Spell" | "Ritual"> = {
  [E in Entity]: DisplayedInactiveActivatableRatedWithEnhancements & {
    type: E
    check: SkillCheck
    checkPenalty: string | undefined
    groupPosition: number
    isUnfamiliar: boolean
    improvementCost: ImprovementCost
    name: string
    groupName: string
    associatedText: string
  }
}[Entity]

export type DisplayedActiveSpellwork<Entity extends "Spell" | "Ritual" = "Spell" | "Ritual"> = {
  [E in Entity]: DisplayedActiveActivatableRatedWithEnhancements & {
    type: E
    check: SkillCheck
    checkPenalty: string | undefined
    groupPosition: number
    isUnfamiliar: boolean
    improvementCost: ImprovementCost
    name: string
    groupName: string
    associatedText: string
  }
}[Entity]

export type DisplayedSpellwork<Entity extends "Spell" | "Ritual" = "Spell" | "Ritual"> =
  | DisplayedActiveSpellwork<Entity>
  | DisplayedInactiveSpellwork<Entity>

export class CharacterSpellworks<
  Entity extends "Spell" | "Ritual",
> extends CharacterActivatableRatedEntriesWithEnhancements<Entity, CharacterSpellwork<Entity>> {
  constructor(global: Global, character: BaseCharacter, entity: Entity) {
    super(global, character, entity, CharacterSpellwork)
  }

  getActiveByProperty(propertyId: Property_ID): CharacterSpellwork<Entity>[] {
    return this.active.filter(spellwork => spellwork.dbEntry.property === propertyId)
  }

  @computed
  get canLearn(): boolean {
    switch (this.entityName) {
      case "Spell":
        return this.character.canLearnSpells
      case "Ritual":
        return this.character.canLearnRituals
      default:
        return assertExhaustive(this.entityName)
    }
  }

  @computed
  override get inactiveForDisplay(): DisplayedInactiveSpellwork<Entity>[] {
    // TODO: if (
    //   isTraditionActive(activeMagicalTraditions, [
    //     MagicalTraditionIdentifier.ArcaneBards,
    //     MagicalTraditionIdentifier.ArcaneDancers,
    //   ])
    // ) {
    //   return []
    // }

    const { additionalHardPredicate, additionalSoftPredicate } = ((): {
      additionalHardPredicate: (spellwork: CharacterSpellwork<Entity>) => boolean
      additionalSoftPredicate: (spellwork: CharacterSpellwork<Entity>) => boolean
    } =>
      // TODO:   if (
      //     isTraditionActive(activeMagicalTraditions, [
      //       MagicalTraditionIdentifier.IntuitiveMages,
      //       MagicalTraditionIdentifier.Animisten,
      //     ])
      //   ) {
      //     return {
      //       additionalHardPredicate: staticSpellwork =>
      //         compareImprovementCost(fromRaw(staticSpellwork.improvement_cost), ImprovementCost.C) <= 0,
      //       additionalSoftPredicate: staticSpellwork =>
      //         activeCount < 3 &&
      //         (fromRaw(staticSpellwork.improvement_cost) !== ImprovementCost.C ||
      //           (activeCountByImprovementCost[ImprovementCost.C] ?? 0) < 1),
      //     }
      //   }

      //   if (isTraditionActive(activeMagicalTraditions, [MagicalTraditionIdentifier.Schelme])) {
      //     const maxCount = firstLevel(imitationszauberei)

      //     if (maxCount > 0) {
      //       return {
      //         additionalHardPredicate: staticSpellwork =>
      //           compareImprovementCost(fromRaw(staticSpellwork.improvement_cost), ImprovementCost.C) <=
      //           0,
      //         additionalSoftPredicate: staticSpellwork =>
      //           activeCount < maxCount &&
      //           (fromRaw(staticSpellwork.improvement_cost) !== ImprovementCost.C ||
      //             (activeCountByImprovementCost[ImprovementCost.C] ?? 0) < 1),
      //       }
      //     }

      //     return {
      //       additionalHardPredicate: _ => true,
      //       additionalSoftPredicate: _ => true,
      //     }
      //   }

      ({
        additionalHardPredicate: _entry => true,
        additionalSoftPredicate: _entry => true,
      }))()

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
          additionalHardPredicate(entry),
      )
      .map((entry): DisplayedInactiveSpellwork<Entity> => {
        const base = entry.toJSON() as DisplayedInactiveSpellwork<Entity>
        return {
          ...base,
          isAvailable: base.isAvailable && additionalSoftPredicate(entry),
        }
      })
  }

  @computed
  get activeCountByImprovementCost(): Map<ImprovementCost, number> {
    return this.rated
      .values()
      .reduce(
        (map, entry) =>
          entry.active
            ? map.set(entry.improvementCost, (map.get(entry.improvementCost) ?? 0) + 1)
            : map,
        new Map<ImprovementCost, number>(),
      )
  }

  @computed
  get activeUnfamiliarCount(): number {
    return count(this.rated.values().toArray(), entry => entry.active && entry.isUnfamiliar)
  }

  static fromJSON<Entity extends "Spell" | "Ritual">(
    global: Global,
    character: Character,
    entity: Entity,
    raw: Record<string, { value: number; enhancements?: Enhancement_ID[] }> | undefined,
  ): CharacterSpellworks<Entity> {
    return super.fromAnyJSON<CharacterSpellworks<Entity>>(
      new CharacterSpellworks(global, character, entity),
      raw,
    )
  }
}

/**
 * Filters and sorts the displayed liturgies.
 */
export const filterAndSortDisplayed = <T extends DisplayedSpellwork | DisplayedCantrip>(
  visibileSpellworks: T[],
  filterText: string,
  sortOrder: SpellsSortOrder,
  localeCompare: Compare<string>,
) =>
  (filterText === ""
    ? visibileSpellworks
    : visibileSpellworks.filter(c => c.name.toLowerCase().includes(filterText.toLowerCase()))
  ).toSorted(
    (() => {
      switch (sortOrder) {
        case SpellsSortOrder.Name:
          return on(c => c.name, localeCompare)
        case SpellsSortOrder.Group:
          return reduceCompare(
            on(c => c.groupPosition, compareNumber),
            on(c => c.name, localeCompare),
          )
        case SpellsSortOrder.Property:
          return reduceCompare(
            on(c => c.associatedText, localeCompare),
            on(c => c.name, localeCompare),
          )
        case SpellsSortOrder.ImprovementCost:
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
