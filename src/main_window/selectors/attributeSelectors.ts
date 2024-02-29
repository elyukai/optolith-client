import { createSelector } from "@reduxjs/toolkit"
import { Attribute } from "optolith-database-schema/types/Attribute"
import { getCarryingCapacity } from "../../shared/domain/equipment.ts"
import {
  AdvantageIdentifier,
  AttributeIdentifier,
  OptionalRuleIdentifier,
} from "../../shared/domain/identifier.ts"
import {
  createEmptyDynamicAttribute,
  getAttributeValue,
} from "../../shared/domain/rated/attribute.ts"
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
import {
  selectAttributeAdjustmentId,
  selectBlessedPrimaryAttributeDependencies,
  selectDerivedCharacteristics,
  selectDynamicAdvantages,
  selectDynamicAttributes,
  selectDynamicOptionalRules,
  selectMagicalPrimaryAttributeDependencies,
} from "../slices/characterSlice.ts"
import { SelectAll, SelectGetById } from "./basicCapabilitySelectors.ts"
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
  SelectGetById.Static.Skill,
  SelectGetById.Static.CloseCombatTechnique,
  SelectGetById.Static.RangedCombatTechnique,
  SelectGetById.Static.Spell,
  SelectGetById.Static.Ritual,
  SelectGetById.Static.LiturgicalChant,
  SelectGetById.Static.Ceremony,
  SelectGetById.Static.Curse,
  SelectGetById.Static.ElvenMagicalSong,
  SelectGetById.Static.DominationRitual,
  SelectGetById.Static.MagicalDance,
  SelectGetById.Static.MagicalMelody,
  SelectGetById.Static.JesterTrick,
  SelectGetById.Static.AnimistPower,
  SelectGetById.Static.GeodeRitual,
  SelectGetById.Static.ZibiljaRitual,
  SelectGetById.Dynamic.Attribute,
  SelectAll.Dynamic.Skills,
  SelectAll.Dynamic.CloseCombatTechniques,
  SelectAll.Dynamic.RangedCombatTechniques,
  SelectAll.Dynamic.Spells,
  SelectAll.Dynamic.Rituals,
  SelectAll.Dynamic.LiturgicalChants,
  SelectAll.Dynamic.Ceremonies,
  SelectAll.Dynamic.Curses,
  SelectAll.Dynamic.ElvenMagicalSongs,
  SelectAll.Dynamic.DominationRituals,
  SelectAll.Dynamic.MagicalDances,
  SelectAll.Dynamic.MagicalMelodies,
  SelectAll.Dynamic.JesterTricks,
  SelectAll.Dynamic.AnimistPowers,
  SelectAll.Dynamic.GeodeRituals,
  SelectAll.Dynamic.ZibiljaRituals,
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
  SelectAll.Static.Attributes,
  SelectGetById.Dynamic.Attribute,
  (staticAttributes, getDynamicAttributeById): number =>
    staticAttributes.reduce((sum, { id }) => sum + (getDynamicAttributeById(id)?.value ?? 8), 0),
)

/**
 * Returns all attributes with their corresponding dynamic values, extended by
 * value bounds and full logic for if the value can be increased or decreased.
 */
export const selectVisibleAttributes = createSelector(
  SelectAll.Static.Attributes,
  SelectGetById.Dynamic.Attribute,
  selectTotalPoints,
  selectMaximumTotalAttributePoints,
  selectIsInCharacterCreation,
  selectCurrentRace,
  selectStartExperienceLevel,
  selectCurrentExperienceLevel,
  createPropertySelector(selectDynamicOptionalRules, OptionalRuleIdentifier.MaximumAttributeScores),
  selectAttributeAdjustmentId,
  selectDerivedCharacteristics,
  selectHighestMagicalPrimaryAttributes,
  selectBlessedPrimaryAttribute,
  selectAttributeMinimaByAssociatedAttributes,
  selectMagicalPrimaryAttributeDependencies,
  selectBlessedPrimaryAttributeDependencies,
  selectFilterApplyingRatedDependencies,
  (
    staticAttributes,
    getDynamicAttributeById,
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

    return staticAttributes
      .sort((a, b) => a.id - b.id)
      .map(attribute => {
        const dynamicAttribute =
          getDynamicAttributeById(attribute.id) ?? createEmptyDynamicAttribute(attribute.id)

        const minimum = getAttributeMinimum(
          derivedCharacteristics.lifePoints.purchased,
          derivedCharacteristics.arcaneEnergy.purchased,
          derivedCharacteristics.karmaPoints.purchased,
          singleHighestMagicalPrimaryAttribute?.static.id,
          magicalPrimaryAttributeDependencies ?? [],
          blessedPrimaryAttribute?.static.id,
          blessedPrimaryAttributeDependencies ?? [],
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
  (strength): number => getCarryingCapacity(getAttributeValue(strength)),
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
        current.maximum - selectableAdjustment.value < getAttributeValue(current.dynamic)

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
