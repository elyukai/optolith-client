import { isNotNullish } from "@elyukai/utils/nullable"
import type { ImprovementCost } from "@optolith/adventure-points/improvement-cost"
import {
  AttributeReference,
  CloseCombatTechnique,
  CombatTechniqueIdentifier,
  RangedCombatTechnique,
  type Attribute,
  type EntityMap,
} from "@optolith/database-schema/gen"
import { computed } from "mobx"
import type { Database } from "../../database.ts"
import { Activatable, countOptions } from "../activatable/activatableEntry.ts"
import type { Character } from "../character.ts"
import { AttributeIdentifier } from "../identifier.ts"
import { getAttributeValue } from "./attribute.ts"
import {
  CharacterRatedEntries,
  CharacterRatedEntry,
  Rated,
  type DisplayedRated,
} from "./ratedEntry.ts"

export class CharacterCombatTechnique<
  Entity extends CombatTechniqueIdentifier["kind"],
> extends CharacterRatedEntry<Entity> {
  static override readonly minValue = 6

  get improvementCost(): ImprovementCost {
    return this.dbEntry.improvement_cost.kind
  }

  @computed
  get minValue() {
    const minimumValues = [
      6,
      // TODO ...flattenMinimumRestrictions(filterApplyingDependencies(dynamicCombatTechnique.dependencies)),
    ].filter(isNotNullish)

    return Math.max(...minimumValues)
  }

  @computed
  get maxValue() {
    const maximumValues = [
      Math.max(...this.primaryAttributeValues.map(pav => pav.value)) + 2,
      this.character.isInCharacterCreation
        ? this.character.experienceLevel.start?.max_combat_technique_rating
        : undefined,
    ].filter(isNotNullish)

    const exceptionalCombatTechniqueBonus = 0 /* TODO: countOptions(
      exceptionalCombatTechnique,
      Case(this.#entity, this.id)
    ) */

    return Math.min(...maximumValues) + exceptionalCombatTechniqueBonus
  }

  @computed
  get primaryAttributeValues() {
    return this.dbEntry.primary_attribute.map(attributeId => {
      const attribute = this.character.attributes.getByIdSafe(attributeId)
      return {
        id: attributeId,
        value: attribute.value,
        dbEntry: attribute.dbEntry,
      }
    })
  }

  static #getPrimaryAttributeModifier(values: number[]) {
    // return +1 for every 3 points above 8
    return Math.max(Math.floor((Math.max(...values) - 8) / 3), 0)
  }

  @computed
  get attackBase(): number {
    // TODO: use courage from settings for close combat techniques
    return (
      CharacterCombatTechnique.#getPrimaryAttributeModifier(
        this.primaryAttributeValues.map(pav => pav.value),
      ) + Math.round(this.value)
    )
  }

  @computed
  get parryBase(): Entity extends "CloseCombatTechnique" ? number : undefined {
    if (this.entityName === "CloseCombatTechnique") {
      return (CharacterCombatTechnique.#getPrimaryAttributeModifier(
        this.primaryAttributeValues.map(pav => pav.value),
      ) + Math.round(this.value / 2)) as Entity extends "CloseCombatTechnique" ? number : undefined
    }
    return undefined as Entity extends "CloseCombatTechnique" ? number : undefined
  }
}

/**
 * A combination of a static and corresponding dynamic skill entry, extended by value bounds and full logic for if the value can be increased or decreased.
 */
export type DisplayedCombatTechnique<
  Entity extends CombatTechniqueIdentifier["kind"] = CombatTechniqueIdentifier["kind"],
> = {
  [E in Entity]: DisplayedRated<EntityMap[E]> & {
    type: E
    primaryAttributeValues: { id: string; value: number; dbEntry: Attribute }[]
    groupPosition: number
    attackBase: number
    parryBase: E extends "CloseCombatTechnique" ? number : undefined
  }
}[Entity]

export type DisplayedCloseCombatTechnique = DisplayedCombatTechnique<"CloseCombatTechnique">
export type DisplayedRangedCombatTechnique = DisplayedCombatTechnique<"RangedCombatTechnique">

export class CharacterCombatTechniques<
  Entity extends CombatTechniqueIdentifier["kind"],
> extends CharacterRatedEntries<
  Entity,
  CharacterCombatTechnique<Entity>,
  {
    type: Entity
    primaryAttributeValues: { id: string; value: number; dbEntry: Attribute }[]
    groupPosition: number
    attackBase: number
    parryBase: Entity extends "CloseCombatTechnique" ? number : undefined
  }
> {
  constructor(db: Database, character: Character, entity: Entity) {
    super(db, character, entity, CharacterCombatTechnique)
  }

  // oxlint-disable-next-line class-methods-use-this
  getAdditionalValuesForDisplay(entry: CharacterCombatTechnique<Entity>) {
    return {
      groupPosition: entry.entityName === "CloseCombatTechnique" ? 0 : 1,
      type: entry.entityName,
      primaryAttributeValues: entry.primaryAttributeValues,
      attackBase: entry.attackBase,
      parryBase: entry.parryBase,
    }
  }

  @computed
  get combatTechniques() {
    return this.entries
  }
}

/**
 * The minimum value of a combat technique.
 */
export const minimumCombatTechniqueValue = 6

/**
 * Returns the value for a dynamic combat technique entry that might not exist
 * yet.
 */
export const getCombatTechniqueValue = (dynamic: Rated | undefined): number =>
  dynamic?.value ?? minimumCombatTechniqueValue

/**
 * Creates an initial dynamic skill entry.
 */
export const createEmptyDynamicCombatTechnique = (id: number): Rated => ({
  id,
  value: minimumCombatTechniqueValue,
  cachedAdventurePoints: {
    general: 0,
    bound: 0,
  },
  dependencies: [],
  boundAdventurePoints: [],
})

/**
 * A combination of the different types of combat techniques.
 */
export type CombinedCombatTechnique =
  | { tag: "CloseCombatTechnique"; closeCombatTechnique: CloseCombatTechnique }
  | { tag: "RangedCombatTechnique"; rangedCombatTechnique: RangedCombatTechnique }

/**
 * Returns the identifier of a combined combat technique.
 */
export const getCombinedId = (
  combatTechnique: CombinedCombatTechnique,
): CombatTechniqueIdentifier =>
  combatTechnique.tag === "CloseCombatTechnique"
    ? {
        tag: "CloseCombatTechnique",
        close_combat_technique: combatTechnique.closeCombatTechnique.id,
      }
    : {
        tag: "RangedCombatTechnique",
        ranged_combat_technique: combatTechnique.rangedCombatTechnique.id,
      }

/**
 * Returns the primary attribute of a combined combat technique.
 */
export const getCombinedPrimaryAttribute = (
  combatTechnique: CombinedCombatTechnique,
): AttributeReference[] =>
  combatTechnique.tag === "CloseCombatTechnique"
    ? combatTechnique.closeCombatTechnique.primary_attribute
    : combatTechnique.rangedCombatTechnique.primary_attribute

const getPrimaryAttributeModifier = (
  getDynamicAttribute: (id: number) => Rated | undefined,
  ids: number[],
): number => {
  const primaryAttributeValues = ids.map(id => getAttributeValue(getDynamicAttribute(id)))
  // return +1 for every 3 points above 8
  return Math.max(Math.floor((Math.max(...primaryAttributeValues) - 8) / 3), 0)
}

const getAttackBase = (
  getDynamicAttribute: (id: number) => Rated | undefined,
  primaryAttributeIds: number[],
  dynamicEntry: Rated | undefined,
): number =>
  getPrimaryAttributeModifier(getDynamicAttribute, primaryAttributeIds) +
  getCombatTechniqueValue(dynamicEntry)

/**
 * Returns the attack base for a close combat technique.
 */
export const getAttackBaseForClose = (
  getDynamicAttribute: (id: number) => Rated | undefined,
  dynamicEntry: Rated | undefined,
): number => getAttackBase(getDynamicAttribute, [AttributeIdentifier.Courage], dynamicEntry)

/**
 * Returns the attack base for a ranged combat technique.
 */
export const getAttackBaseForRanged = (
  getDynamicAttribute: (id: number) => Rated | undefined,
  staticEntry: RangedCombatTechnique,
  dynamicEntry: Rated | undefined,
): number =>
  getAttackBase(
    getDynamicAttribute,
    staticEntry.primary_attribute.map(ref => ref.id.attribute),
    dynamicEntry,
  )

/**
 * Returns the parry base for a close combat technique.
 */
export const getParryBaseForClose = (
  getDynamicAttribute: (id: number) => Rated | undefined,
  staticEntry: CloseCombatTechnique,
  dynamicEntry: Rated | undefined,
): number | undefined => {
  if (staticEntry.special.can_parry) {
    const primaryAttributeModifier = getPrimaryAttributeModifier(
      getDynamicAttribute,
      staticEntry.primary_attribute.map(ref => ref.id.attribute),
    )
    const combatTechniqueRating = getCombatTechniqueValue(dynamicEntry)
    return primaryAttributeModifier + Math.round(combatTechniqueRating / 2)
  }

  return undefined
}

/**
 * Returns the highest required attribute and its value for a combat technique,
 * if any.
 */
export const getHighestRequiredAttributeForCombatTechnique = (
  getSingleHighestPrimaryAttributeId: (primaryAttributeIds: number[]) => number | undefined,
  staticCombatTechnique: CombinedCombatTechnique,
  dynamicCombatTechnique: Rated,
  exceptionalCombatTechnique: Activatable | undefined,
): { id: number; value: number } | undefined => {
  const idObject = getCombinedId(staticCombatTechnique)
  const primaryAttribute = getCombinedPrimaryAttribute(staticCombatTechnique)

  const singleHighestAttributeId = getSingleHighestPrimaryAttributeId(
    primaryAttribute.map(ref => ref.id.attribute),
  )

  if (singleHighestAttributeId === undefined) {
    return undefined
  }

  const exceptionalCombatTechniqueBonus = countOptions(exceptionalCombatTechnique, idObject)

  return {
    id: singleHighestAttributeId,
    value: dynamicCombatTechnique.value - 2 - exceptionalCombatTechniqueBonus,
  }
}
