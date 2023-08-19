import { ExperienceLevel } from "optolith-database-schema/types/ExperienceLevel"
import { Race } from "optolith-database-schema/types/Race"
import { mapNullable } from "../utils/nullable.ts"
import { Energy, EnergyWithBuyBack } from "./energy.ts"
import { AttributeIdentifier } from "./identifier.ts"
import { Dependency, Rated, flattenMinimumRestrictions } from "./ratedEntry.ts"

export const getAttributeValue = (dynamic: Rated | undefined): number => dynamic?.value ?? 8

export const getAttributeMinimum = (
  lifePoints: Energy,
  arcaneEnergy: EnergyWithBuyBack,
  karmaPoints: EnergyWithBuyBack,
  dynamicAttribute: Rated,
  singleHighestMagicalPrimaryAttributeId: number | undefined,
  magicalPrimaryAttributeDependencies: Dependency[],
  blessedPrimaryAttributeId: number | undefined,
  blessedPrimaryAttributeDependencies: Dependency[],
  filterApplyingDependencies: (dependencies: Dependency[]) => Dependency[],
  getSkillCheckAttributeMinimum: (id: number) => number | undefined,
): number => {
  const isConstitution = dynamicAttribute.id === AttributeIdentifier.Constitution
  const isHighestMagicalPrimaryAttribute =
    dynamicAttribute.id === singleHighestMagicalPrimaryAttributeId
  const isBlessedPrimaryAttribute = dynamicAttribute.id === blessedPrimaryAttributeId

  const minimumValues: number[][] = [
    [8],
    flattenMinimumRestrictions(filterApplyingDependencies(dynamicAttribute.dependencies)),
    isConstitution ? [lifePoints.purchased] : [],
    isHighestMagicalPrimaryAttribute
      ? [arcaneEnergy.purchased, ...flattenMinimumRestrictions(magicalPrimaryAttributeDependencies)]
      : [],
    isBlessedPrimaryAttribute
      ? [karmaPoints.purchased, ...flattenMinimumRestrictions(blessedPrimaryAttributeDependencies)]
      : [],
    mapNullable(getSkillCheckAttributeMinimum(dynamicAttribute.id), min => [min]) ?? [],
  ]

  return Math.max(...minimumValues.flat())
}

/**
 * Returns the modifier if the attribute specified by `id` is a member of the
 * race `race`
 */
const getModIfSelectedAdjustment = (id: number, race: Race) =>
  race.attribute_adjustments.selectable?.find(adjustment =>
    adjustment.list.some(attribute => attribute.id.attribute === id),
  )?.value ?? 0

const getModIfStaticAdjustment = (id: number, race: Race) =>
  race.attribute_adjustments.fixed
    ?.filter(adjustment => adjustment.id.attribute === id)
    .reduce((acc, adjustment) => acc + adjustment.value, 0) ?? 0

export const getAttributeMaximum = (
  isInCharacterCreation: boolean,
  race: Race | undefined,
  startExperienceLevel: ExperienceLevel | undefined,
  currentExperienceLevel: ExperienceLevel | undefined,
  isAttributeValueLimitEnabled: boolean,
  adjustmentId: number | undefined,
  id: number,
): number | undefined => {
  if (isInCharacterCreation && race !== undefined && startExperienceLevel !== undefined) {
    const selectedAdjustment = adjustmentId === id ? getModIfSelectedAdjustment(id, race) : 0
    const staticAdjustment = getModIfStaticAdjustment(id, race)

    return startExperienceLevel.max_attribute_value + selectedAdjustment + staticAdjustment
  }

  if (isAttributeValueLimitEnabled && currentExperienceLevel !== undefined) {
    return currentExperienceLevel.max_attribute_value + 2
  }

  return undefined
}

export const isAttributeDecreasable = (dynamic: Rated, min: number) => min < dynamic.value

export const isAttributeIncreasable = (
  dynamic: Rated,
  max: number | undefined,
  totalPoints: number,
  maxTotalPoints: number,
  isInCharacterCreation: boolean,
) =>
  (!isInCharacterCreation || totalPoints < maxTotalPoints) &&
  (max === undefined || dynamic.value < max)
