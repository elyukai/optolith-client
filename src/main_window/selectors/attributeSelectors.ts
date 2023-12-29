import { createSelector } from "@reduxjs/toolkit"
import { Attribute } from "optolith-database-schema/types/Attribute"
import {
  AdvantageIdentifier,
  AttributeIdentifier,
  OptionalRuleIdentifier,
} from "../../shared/domain/identifier.ts"
import {
  getAttributeMaximum,
  getAttributeMinimaByAssociatedAttributes,
  getAttributeMinimum,
  isAttributeDecreasable,
  isAttributeIncreasable,
} from "../../shared/domain/rated/attributeBounds.ts"
import { Rated } from "../../shared/domain/rated/ratedEntry.ts"
import { isNotNullish } from "../../shared/utils/nullable.ts"
import { createPropertySelector } from "../../shared/utils/redux.ts"
import { attributeValue, createInitialDynamicAttribute } from "../slices/attributesSlice.ts"
import {
  selectActiveOptionalRules,
  selectAttributeAdjustmentId,
  selectBlessedPrimaryAttributeDependencies,
  selectDerivedCharacteristics,
  selectDynamicAdvantages,
  selectDynamicAnimistPowers,
  selectDynamicAttributes,
  selectDynamicCeremonies,
  selectDynamicCloseCombatTechniques,
  selectDynamicCurses,
  selectDynamicDominationRituals,
  selectDynamicElvenMagicalSongs,
  selectDynamicGeodeRituals,
  selectDynamicJesterTricks,
  selectDynamicLiturgicalChants,
  selectDynamicMagicalDances,
  selectDynamicMagicalMelodies,
  selectDynamicRangedCombatTechniques,
  selectDynamicRituals,
  selectDynamicSkills,
  selectDynamicSpells,
  selectDynamicZibiljaRituals,
  selectMagicalPrimaryAttributeDependencies,
} from "../slices/characterSlice.ts"
import {
  selectStaticAnimistPowers,
  selectStaticAttributes,
  selectStaticCeremonies,
  selectStaticCloseCombatTechniques,
  selectStaticCurses,
  selectStaticDominationRituals,
  selectStaticElvenMagicalSongs,
  selectStaticGeodeRituals,
  selectStaticJesterTricks,
  selectStaticLiturgicalChants,
  selectStaticMagicalDances,
  selectStaticMagicalMelodies,
  selectStaticRangedCombatTechniques,
  selectStaticRituals,
  selectStaticSkills,
  selectStaticSpells,
  selectStaticZibiljaRituals,
} from "../slices/databaseSlice.ts"
import { selectIsInCharacterCreation } from "./characterSelectors.ts"
import { selectFilterApplyingRatedDependencies } from "./dependencySelectors.ts"
import {
  selectCurrentExperienceLevel,
  selectMaximumTotalAttributePoints,
  selectStartExperienceLevel,
} from "./experienceLevelSelectors.ts"
import {
  selectBlessedPrimaryAttribute,
  selectHighestMagicalPrimaryAttributes,
} from "./primaryAttributeSelectors.ts"
import { selectCurrentRace } from "./raceSelectors.ts"

const selectAttributeMinimaByAssociatedAttributes = createSelector(
  selectStaticSkills,
  selectStaticCloseCombatTechniques,
  selectStaticRangedCombatTechniques,
  selectStaticSpells,
  selectStaticRituals,
  selectStaticLiturgicalChants,
  selectStaticCeremonies,
  selectStaticCurses,
  selectStaticElvenMagicalSongs,
  selectStaticDominationRituals,
  selectStaticMagicalDances,
  selectStaticMagicalMelodies,
  selectStaticJesterTricks,
  selectStaticAnimistPowers,
  selectStaticGeodeRituals,
  selectStaticZibiljaRituals,
  selectDynamicAttributes,
  selectDynamicSkills,
  selectDynamicCloseCombatTechniques,
  selectDynamicRangedCombatTechniques,
  selectDynamicSpells,
  selectDynamicRituals,
  selectDynamicLiturgicalChants,
  selectDynamicCeremonies,
  selectDynamicCurses,
  selectDynamicElvenMagicalSongs,
  selectDynamicDominationRituals,
  selectDynamicMagicalDances,
  selectDynamicMagicalMelodies,
  selectDynamicJesterTricks,
  selectDynamicAnimistPowers,
  selectDynamicGeodeRituals,
  selectDynamicZibiljaRituals,
  createPropertySelector(selectDynamicAdvantages, AdvantageIdentifier.ExceptionalSkill),
  createPropertySelector(selectDynamicAdvantages, AdvantageIdentifier.ExceptionalCombatTechnique),
  getAttributeMinimaByAssociatedAttributes,
)

/**
 * A combination of a static and corresponding dynamic attribute entry, extended
 * by value bounds and full logic for if the value can be increased or
 * decreased.
 */
export type DisplayedAttribute = {
  static: Attribute
  dynamic: Rated
  minimum: number
  maximum?: number
  isIncreasable: boolean
  isDecreasable: boolean
}

/**
 * Returns the sum of all attribute values.
 */
export const selectTotalPoints = createSelector(
  selectStaticAttributes,
  selectDynamicAttributes,
  (attributes, dynamicAttributes): number =>
    Object.values(attributes).reduce((sum, { id }) => sum + (dynamicAttributes[id]?.value ?? 8), 0),
)

/**
 * Returns all attributes with their corresponding dynamic values, extended by
 * value bounds and full logic for if the value can be increased or decreased.
 */
export const selectVisibleAttributes = createSelector(
  selectStaticAttributes,
  selectDynamicAttributes,
  selectTotalPoints,
  selectMaximumTotalAttributePoints,
  selectIsInCharacterCreation,
  selectCurrentRace,
  selectStartExperienceLevel,
  selectCurrentExperienceLevel,
  createPropertySelector(selectActiveOptionalRules, OptionalRuleIdentifier.MaximumAttributeScores),
  selectAttributeAdjustmentId,
  selectDerivedCharacteristics,
  selectHighestMagicalPrimaryAttributes,
  selectBlessedPrimaryAttribute,
  selectAttributeMinimaByAssociatedAttributes,
  selectMagicalPrimaryAttributeDependencies,
  selectBlessedPrimaryAttributeDependencies,
  selectFilterApplyingRatedDependencies,
  (
    attributes,
    dynamicAttributes,
    totalPoints,
    maxTotalPoints,
    isInCharacterCreation,
    currentRace,
    startExperienceLevel,
    currentExperienceLevel,
    maximumAttributeScores,
    attributeAdjustmentId,
    derivedCharacteristics,
    highestMagicalPrimaryAttributes,
    blessedPrimaryAttribute,
    attributeMinimaByAssociatedAttributes,
    magicalPrimaryAttributeDependencies,
    blessedPrimaryAttributeDependencies,
    filterApplyingDependencies,
  ): DisplayedAttribute[] => {
    const singleHighestMagicalPrimaryAttribute =
      highestMagicalPrimaryAttributes.list.length === 1
        ? highestMagicalPrimaryAttributes.list[0]
        : undefined

    if (
      startExperienceLevel === undefined ||
      currentExperienceLevel === undefined ||
      currentRace === undefined
    ) {
      return []
    }

    return Object.values(attributes)
      .sort((a, b) => a.id - b.id)
      .map(attribute => {
        const dynamicAttribute =
          dynamicAttributes[attribute.id] ?? createInitialDynamicAttribute(attribute.id)

        const minimum = getAttributeMinimum(
          derivedCharacteristics.lifePoints.purchased,
          derivedCharacteristics.arcaneEnergy.purchased,
          derivedCharacteristics.karmaPoints.purchased,
          singleHighestMagicalPrimaryAttribute?.static.id,
          magicalPrimaryAttributeDependencies,
          blessedPrimaryAttribute?.static.id,
          blessedPrimaryAttributeDependencies,
          filterApplyingDependencies,
          id => attributeMinimaByAssociatedAttributes[id],
          dynamicAttribute,
        )

        const maximum = getAttributeMaximum(
          isInCharacterCreation,
          currentRace.attribute_adjustments,
          startExperienceLevel,
          currentExperienceLevel,
          maximumAttributeScores !== undefined,
          attributeAdjustmentId,
          dynamicAttribute,
        )

        return {
          static: attribute,
          dynamic: dynamicAttribute,
          minimum,
          maximum,
          isDecreasable: isAttributeDecreasable(dynamicAttribute, minimum),
          isIncreasable: isAttributeIncreasable(
            dynamicAttribute,
            maximum,
            totalPoints,
            maxTotalPoints,
            isInCharacterCreation,
          ),
        }
      })
  },
)

// const getAddedEnergies = createMaybeSelector (
//   getHeroProp,
//   hero => Tuple (
//     pipe_ (hero, HA.energies, EA.addedLifePoints),
//     pipe_ (hero, HA.energies, EA.addedArcaneEnergyPoints),
//     pipe_ (hero, HA.energies, EA.addedKarmaPoints)
//   )
// )

// /**
//  * Returns the maximum attribute value of the list of given attribute ids.
//  */
// export const getMaxAttributeValueByID =
//   (attributes: HeroModel["attributes"]) =>
//     pipe (
//       mapMaybe (pipe (lookupF (attributes), fmap (AtDA.value))),
//       consF (8),
//       maximum
//     )

/**
 * Returns the carrying capacity of the character.
 */
export const selectCarryingCapacity = createSelector(
  createPropertySelector(selectDynamicAttributes, AttributeIdentifier.Strength),
  (strength): number => (strength?.value ?? 8) * 2,
)

/**
 * An adjustment value for an attribute that can be applied to one of the
 * provided attributes.
 */
export type DisplayedAttributeAdjustment = {
  value: number
  list: DisplayedAttribute[]
}

/**
 * Returns an attribute adjustment option, if any is available.
 */
export const selectAvailableAdjustments = createSelector(
  selectCurrentRace,
  selectAttributeAdjustmentId,
  selectVisibleAttributes,
  (race, currentId, attributes): DisplayedAttributeAdjustment | undefined => {
    const selectableAdjustment = race?.attribute_adjustments?.selectable?.[0]

    if (selectableAdjustment === undefined) {
      return undefined
    } else {
      const current = attributes.find(attr => attr.static.id === currentId)

      const canNotSwitch =
        current !== undefined &&
        current.maximum !== undefined &&
        current.maximum - selectableAdjustment.value < attributeValue(current.dynamic)

      if (canNotSwitch) {
        return {
          value: selectableAdjustment.value,
          list: [current],
        }
      } else {
        return {
          value: selectableAdjustment.value,
          list: selectableAdjustment.list
            .map(id => attributes.find(attr => attr.static.id === id.id.attribute))
            .filter(isNotNullish),
        }
      }
    }
  },
)
