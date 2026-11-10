import { ensureNonEmpty, type NonEmptyArray } from "@elyukai/utils/array/nonEmpty"
import { sumWith } from "@elyukai/utils/array/reductions"
import { on } from "@elyukai/utils/function"
import { isNotNullish, mapNullable } from "@elyukai/utils/nullable"
import { compareNumber } from "@elyukai/utils/ordering"
import { sign } from "@elyukai/utils/string/number"
import type { ImprovementCost } from "@optolith/adventure-points/improvement-cost"
import type { Attribute, Attribute_ID, AttributeAdjustments } from "@optolith/database-schema/gen"
import { MISSING_VALUE } from "@optolith/entity-descriptions/entities/partial/unknown"
import { computed } from "mobx"
import type { Global } from "../../global.ts"
import { primaryAttributeDependencyToRatedDependency } from "./primaryAttribute.ts"
import type { RatedDependency } from "./ratedDependency.ts"
import {
  CharacterRatedEntries,
  CharacterRatedEntry,
  type ConsParamsTrim,
  type DisplayedRated,
} from "./ratedEntry.ts"

/**
 * Returns the modifier if the attribute specified by `id` is a member of the
 * race `race`
 */
const getModIfSelectedAdjustment = (id: string, staticAttributeAdjustments: AttributeAdjustments) =>
  staticAttributeAdjustments.selectable?.find(adjustment =>
    adjustment.list.some(attribute => attribute === id),
  )?.value ?? 0

const getModIfStaticAdjustment = (id: string, staticAttributeAdjustments: AttributeAdjustments) =>
  staticAttributeAdjustments.fixed
    ?.filter(adjustment => adjustment.id === id)
    .reduce((acc, adjustment) => acc + adjustment.value, 0) ?? 0

export class CharacterAttribute extends CharacterRatedEntry<"Attribute"> {
  static override readonly minValue = 8
  static readonly improvementCost: ImprovementCost = "E"

  readonly improvementCost = CharacterAttribute.improvementCost

  @computed
  override get derivedDependencies(): RatedDependency[] {
    const isHighestMagicalPrimaryAttribute =
      this.id === this.character.attributes.singleHighestMagicalPrimaryAttributeId
    const isBlessedPrimaryAttribute =
      this.id === this.character.attributes.primaryBlessedAttribute?.id

    return [
      ...(isHighestMagicalPrimaryAttribute
        ? this.character.magicalPrimaryAttributeDependencies.map(
            primaryAttributeDependencyToRatedDependency,
          )
        : []),
      ...(isBlessedPrimaryAttribute
        ? this.character.blessedPrimaryAttributeDependencies.map(
            primaryAttributeDependencyToRatedDependency,
          )
        : []),
    ]
  }

  get minValue() {
    const minimumValues = [
      CharacterAttribute.minValue,
      ...this.flatMinimumRestrictions,
      ...this.character.derivedCharacteristics.getMinimumValuesOfAttributeForPurchased(this.id),
      this.character.attributes.minimaFromSkillChecks.get(this.id),
    ].filter(isNotNullish)

    return Math.max(...minimumValues.flat())
  }

  @computed
  get maxValue() {
    if (this.character.isInCharacterCreation) {
      const selectedAdjustmentId = this.character.race?.selectedAttributeAdjustmentId
      const staticAdjustments = this.character.race?.variant?.attribute_adjustments

      const adjustment = staticAdjustments
        ? (selectedAdjustmentId === this.id
            ? getModIfSelectedAdjustment(this.id, staticAdjustments)
            : 0) + getModIfStaticAdjustment(this.id, staticAdjustments)
        : 0

      return (this.character.experienceLevel.start?.max_attribute_value ?? 0) + adjustment
    }

    if (true /* TODO: isAttributeValueLimitEnabled */) {
      return (this.character.experienceLevel.current?.max_attribute_value ?? 0) + 2
    }

    return undefined
  }

  @computed
  override get isIncreasable() {
    return (
      (this.character.isCharacterCreationFinished ||
        this.character.attributes.attributesTotalMaximum >
          this.character.attributes.attributesTotal) &&
      super.isIncreasable
    )
  }

  override toJSON(): DisplayedAttribute {
    return {
      ...super.toJSON(),
      translations: this.dbEntry.translations,
      color: this.dbEntry.color,
      position: this.dbEntry.position,
    }
  }
}

/**
 * A combination of a static and corresponding dynamic attribute entry, extended
 * by value bounds and full logic for if the value can be increased or
 * decreased.
 */
export type DisplayedAttribute = DisplayedRated & {
  position: number
  color: Attribute["color"]
  translations: Attribute["translations"]
}

export class CharacterAttributes extends CharacterRatedEntries<"Attribute", CharacterAttribute> {
  constructor(...args: ConsParamsTrim<typeof CharacterRatedEntries, 2>) {
    super(CharacterAttribute, "Attribute", ...args)
  }

  @computed
  get attributes() {
    return this.entries.toSorted(on(e => e.position, compareNumber))
  }

  @computed
  get attributesTotal(): number {
    return sumWith(
      this.global.db.getAllInstanceContainersOfEntity("Attribute"),
      container => this.getById(container.id)?.value ?? CharacterAttribute.minValue,
    )
  }

  @computed
  get attributesTotalMaximum(): number {
    return this.character.experienceLevel.start?.max_attribute_total ?? 0
  }

  @computed
  get primaryMagicalAttributes(): {
    id: Attribute_ID
    value: number
    useHalfForArcaneEnergy: boolean
  }[] {
    return this.character.specialAbilities
      .getSpecialAbilitiesCollection("MagicalTradition")
      .active.map(entry =>
        entry.dbEntry.primary === undefined
          ? undefined
          : {
              id: entry.dbEntry.primary.id,
              value: this.getValueById(entry.dbEntry.primary.id),
              useHalfForArcaneEnergy: entry.dbEntry.primary.use_half_for_arcane_energy,
            },
      )
      .filter(isNotNullish)
  }

  @computed
  get highestPrimaryMagicalAttributes():
    | { id: NonEmptyArray<Attribute_ID>; value: number }
    | undefined {
    const list = ensureNonEmpty(this.primaryMagicalAttributes)

    if (list === undefined) {
      return undefined
    }

    const [first, ...rest] = list

    return rest.reduce<{ id: NonEmptyArray<Attribute_ID>; value: number }>(
      (acc, entry) =>
        entry.value > acc.value
          ? { ...entry, id: [entry.id] }
          : entry.value === acc.value
            ? Object.assign(acc, { id: [...acc.id, entry.id] })
            : acc,
      { id: [first.id], value: first.value },
    )
  }

  @computed
  get singleHighestMagicalPrimaryAttributeId(): Attribute_ID | undefined {
    const highest = this.highestPrimaryMagicalAttributes
    return highest !== undefined && highest.id.length === 1 ? highest.id[0] : undefined
  }

  @computed
  get highestPrimaryMagicalAttributeForArcaneEnergy(): number | undefined {
    return ensureNonEmpty(this.primaryMagicalAttributes)?.reduce(
      (acc, entry) =>
        Math.max(acc, entry.useHalfForArcaneEnergy ? Math.round(entry.value / 2) : entry.value),
      0,
    )
  }

  @computed
  get primaryBlessedAttribute(): { id: Attribute_ID; value: number } | undefined {
    const attributeId = this.character.activeBlessedTradition?.dbEntry.primary
    if (attributeId === undefined) {
      return undefined
    }
    return { id: attributeId, value: this.getValueById(attributeId) }
  }

  getHighestAttributeValueOfList(ids: Attribute_ID[]): number {
    return Math.max(CharacterAttribute.minValue, ...ids.map(id => this.getValueById(id)))
  }

  getSingleHighestAttributeOfList(
    ids: Attribute_ID[],
  ): { id: Attribute_ID; value: number } | undefined {
    const { id: resId, value } = ids
      .map(id => ({ id, value: this.getValueById(id) }))
      .reduce<{ id: string | null; value: number }>(
        (currentHighest, attr) =>
          attr.value > currentHighest.value
            ? attr
            : attr.value === currentHighest.value && attr.id !== currentHighest.id
              ? // different pairs with the same value, if it’s already "multiple"
                // it stays "multiple", in which case the id comparison will always be
                // true
                { id: null, value: currentHighest.value }
              : currentHighest,
        { id: null, value: 0 },
      )

    return resId !== null ? { id: resId, value } : undefined
  }

  @computed
  get minimaFromSkillChecks(): Map<Attribute_ID, number> {
    const minima = new Map<Attribute_ID, number>()
    collectMinima(minima, this.character.skills.values)
    collectMinima(minima, this.character.closeCombatTechniques.values)
    collectMinima(minima, this.character.rangedCombatTechniques.values)
    collectMinima(minima, this.character.spells.values)
    collectMinima(minima, this.character.rituals.values)
    collectMinima(minima, this.character.liturgicalChants.values)
    collectMinima(minima, this.character.ceremonies.values)
    // TODO: magical actions
    return minima
  }

  /**
   * Returns an attribute adjustment option, if any is available.
   */
  @computed
  get availableAdjustments(): DisplayedAttributeAdjustment | undefined {
    const selectableAdjustment =
      this.character.race?.variant?.attribute_adjustments?.selectable?.[0]
    const currentId = this.character.race?.selectedAttributeAdjustmentId

    if (selectableAdjustment === undefined) {
      return undefined
    } else {
      const current = mapNullable(currentId, id => this.getById(id))

      const canNotSwitch =
        current !== undefined &&
        current.maxValue !== undefined &&
        current.maxValue - selectableAdjustment.value < current.value

      if (canNotSwitch) {
        return {
          value: selectableAdjustment.value,
          list: [getAttributeValuesForAdjustment(current, this.global, selectableAdjustment.value)],
        }
      } else {
        return {
          value: selectableAdjustment.value,
          list: selectableAdjustment.list
            .map(id => this.getByIdSafe(id))
            .toSorted(on(e => e.dbEntry.position, compareNumber))
            .map(attr =>
              getAttributeValuesForAdjustment(attr, this.global, selectableAdjustment.value),
            ),
        }
      }
    }
  }
}

const getAttributeValuesForAdjustment = (
  attribute: CharacterAttribute,
  global: Global,
  modifier: number,
): { id: string; name: string } => ({
  id: attribute.id,
  name: `${global.locale.translateMap(attribute.dbEntry.translations)?.name ?? MISSING_VALUE} ${sign(modifier)}`,
})

/**
 * An adjustment value for an attribute that can be applied to one of the
 * provided attributes.
 */
export type DisplayedAttributeAdjustment = {
  value: number
  list: { id: string; name: string }[]
}

const collectMinima = (
  map: Map<Attribute_ID, number>,
  entries: {
    get highestRequiredAttribute():
      | {
          id: Attribute_ID
          value: number
        }
      | undefined
  }[],
) => {
  for (const entry of entries) {
    if (entry.highestRequiredAttribute !== undefined) {
      const { id, value } = entry.highestRequiredAttribute
      map.set(id, Math.max(map.get(id) ?? 0, value))
    }
  }
}
