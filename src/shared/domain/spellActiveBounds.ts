import { ExperienceLevel } from "optolith-database-schema/types/ExperienceLevel"
import {
  MagicalActionIdentifier,
  SpellworkIdentifier,
} from "optolith-database-schema/types/_IdentifierGroup"
import {
  AttributeReference,
  PropertyReference,
} from "optolith-database-schema/types/_SimpleReferences"
import { SkillCheck } from "optolith-database-schema/types/_SkillCheck"
import { filterNonNullable } from "../utils/array.ts"
import { assertExhaustive } from "../utils/typeSafety.ts"
import { Activatable, countOptions } from "./activatableEntry.ts"
import { RatedDependency, flattenMinimumRestrictions } from "./rated/ratedDependency.ts"
import { ActivatableRated } from "./ratedEntry.ts"

const getSpellworkMinimumFromPropertyKnowledgePrerequistes = (
  spellsAbove10ByProperty: Record<number, number>,
  activePropertyKnowledges: number[],
  propertyId: number,
  value: number | undefined,
): number | undefined =>
  activePropertyKnowledges.includes(propertyId) &&
  (spellsAbove10ByProperty[propertyId] ?? 0) <= 3 &&
  value !== undefined &&
  value >= 10
    ? 10
    : undefined

/**
 * Returns the minimum value for a spellwork.
 */
export const getSpellworkMinimum = (
  spellsAbove10ByProperty: Record<number, number>,
  activePropertyKnowledges: number[],
  staticSpellwork: { property: PropertyReference },
  dynamicSpellwork: ActivatableRated,
  filterApplyingDependencies: (dependencies: RatedDependency[]) => RatedDependency[],
): number | undefined => {
  const minimumValues = filterNonNullable([
    ...flattenMinimumRestrictions(filterApplyingDependencies(dynamicSpellwork.dependencies)),
    getSpellworkMinimumFromPropertyKnowledgePrerequistes(
      spellsAbove10ByProperty,
      activePropertyKnowledges,
      staticSpellwork.property.id.property,
      dynamicSpellwork.value,
    ),
  ])

  return minimumValues.length > 0 ? Math.max(...minimumValues) : undefined
}

const getSpellworkMaximumFromPropertyKnowledge = (
  activePropertyKnowledges: number[],
  propertyId: number,
): number | undefined => (activePropertyKnowledges.includes(propertyId) ? undefined : 14)

/**
 * Returns the maximum value for a spellwork.
 */
export const getSpellworkMaximum = (
  getHighestAttributeValue: (attributes: AttributeReference[]) => number,
  activePropertyKnowledges: number[],
  staticSpellwork: { id: number; check: SkillCheck; property: PropertyReference },
  isInCharacterCreation: boolean,
  startExperienceLevel: ExperienceLevel,
  exceptionalSkill: Activatable | undefined,
  type: (SpellworkIdentifier | MagicalActionIdentifier)["tag"],
): number => {
  const maximumValues = filterNonNullable([
    getHighestAttributeValue(staticSpellwork.check) + 2,
    isInCharacterCreation ? startExperienceLevel.max_skill_rating : undefined,
    getSpellworkMaximumFromPropertyKnowledge(
      activePropertyKnowledges,
      staticSpellwork.property.id.property,
    ),
  ])

  const exceptionalSkillBonus =
    exceptionalSkill === undefined
      ? 0
      : (() => {
          switch (type) {
            case "Spell":
            case "Ritual":
              return countOptions(exceptionalSkill, {
                type,
                value: staticSpellwork.id,
              })
            case "Curse":
            case "ElvenMagicalSong":
            case "DominationRitual":
            case "MagicalMelody":
            case "MagicalDance":
            case "JesterTrick":
            case "AnimistPower":
            case "GeodeRitual":
            case "ZibiljaRitual":
              return 0
            default:
              return assertExhaustive(type)
          }
        })()

  return Math.min(...maximumValues) + exceptionalSkillBonus
}

/**
 * Checks if the spellwork is decreasable.
 * @param dynamicEntry The dynamic spellwork entry.
 * @param min The value returned from {@link getSpellworkMinimum}.
 */
export const isSpellworkDecreasable = (
  dynamicEntry: ActivatableRated,
  min: number | undefined,
  canRemove: boolean,
) =>
  (min === undefined ||
    (dynamicEntry.value !== undefined && dynamicEntry.value > Math.max(min, 0))) &&
  canRemove

/**
 * Checks if the spellwork is increasable.
 * @param dynamicEntry The dynamic spellwork entry.
 * @param max The value returned from {@link getSpellworkMaximum}.
 */
export const isSpellworkIncreasable = (dynamicEntry: ActivatableRated, max: number) =>
  dynamicEntry.value === undefined || dynamicEntry.value < max
