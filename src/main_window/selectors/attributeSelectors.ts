import { createSelector } from "@reduxjs/toolkit"
import { Attribute } from "optolith-database-schema/types/Attribute"
import {
  getAttributeMaximum,
  getAttributeMinimaByAssociatedAttributes,
  getAttributeMinimum,
  isAttributeDecreasable,
  isAttributeIncreasable,
} from "../../shared/domain/attributeBounds.ts"
import { filterApplyingRatedDependencies } from "../../shared/domain/dependencies/filterApplyingDependencies.ts"
import {
  AdvantageIdentifier,
  AttributeIdentifier,
  OptionalRuleIdentifier,
} from "../../shared/domain/identifier.ts"
import { Rated } from "../../shared/domain/ratedEntry.ts"
import { isNotNullish } from "../../shared/utils/nullable.ts"
import { createPropertySelector } from "../../shared/utils/redux.ts"
import { attributeValue, createInitialDynamicAttribute } from "../slices/attributesSlice.ts"
import {
  selectActiveOptionalRules,
  selectAdvantages,
  selectAttributeAdjustmentId,
  selectBlessedPrimaryAttributeDependencies,
  selectDerivedCharacteristics,
  selectAnimistPowers as selectDynamicAnimistPowers,
  selectAttributes as selectDynamicAttributes,
  selectCeremonies as selectDynamicCeremonies,
  selectCloseCombatTechniques as selectDynamicCloseCombatTechniques,
  selectCurses as selectDynamicCurses,
  selectDominationRituals as selectDynamicDominationRituals,
  selectElvenMagicalSongs as selectDynamicElvenMagicalSongs,
  selectGeodeRituals as selectDynamicGeodeRituals,
  selectJesterTricks as selectDynamicJesterTricks,
  selectLiturgicalChants as selectDynamicLiturgicalChants,
  selectMagicalDances as selectDynamicMagicalDances,
  selectMagicalMelodies as selectDynamicMagicalMelodies,
  selectRangedCombatTechniques as selectDynamicRangedCombatTechniques,
  selectRituals as selectDynamicRituals,
  selectSkills as selectDynamicSkills,
  selectSpells as selectDynamicSpells,
  selectZibiljaRituals as selectDynamicZibiljaRituals,
  selectMagicalPrimaryAttributeDependencies,
} from "../slices/characterSlice.ts"
import {
  selectAnimistPowers as selectStaticAnimistPowers,
  selectAttributes as selectStaticAttributes,
  selectCeremonies as selectStaticCeremonies,
  selectCloseCombatTechniques as selectStaticCloseCombatTechniques,
  selectCurses as selectStaticCurses,
  selectDominationRituals as selectStaticDominationRituals,
  selectElvenMagicalSongs as selectStaticElvenMagicalSongs,
  selectGeodeRituals as selectStaticGeodeRituals,
  selectJesterTricks as selectStaticJesterTricks,
  selectLiturgicalChants as selectStaticLiturgicalChants,
  selectMagicalDances as selectStaticMagicalDances,
  selectMagicalMelodies as selectStaticMagicalMelodies,
  selectRangedCombatTechniques as selectStaticRangedCombatTechniques,
  selectRituals as selectStaticRituals,
  selectSkills as selectStaticSkills,
  selectSpells as selectStaticSpells,
  selectZibiljaRituals as selectStaticZibiljaRituals,
} from "../slices/databaseSlice.ts"
import { selectIsInCharacterCreation } from "./characterSelectors.ts"
import {
  selectCurrentExperienceLevel,
  selectMaximumTotalAttributePoints,
  selectStartExperienceLevel,
} from "./experienceLevelSelectors.ts"
import { selectCurrentRace } from "./raceSelectors.ts"
import {
  selectActiveBlessedTradition,
  selectActiveMagicalTraditions,
} from "./traditionSelectors.ts"

/**
 * A combination of a static and corresponding dynamic attribute entry.
 */
export type DisplayedPrimaryAttribute = {
  static: Attribute
  dynamic: Rated
}

/**
 * A list of the highest primary attributes of all active magical traditions,
 * and if they are halfed for calculating arcane energy.
 */
export type DisplayedMagicalPrimaryAttributes = {
  list: DisplayedPrimaryAttribute[]
  halfed: boolean
}

/**
 * Returns the highest primary attributes of all active magical traditions, and
 * if they are halfed for calculating arcane energy.
 */
export const selectHighestMagicalPrimaryAttributes = createSelector(
  selectActiveMagicalTraditions,
  selectStaticAttributes,
  selectDynamicAttributes,
  (
    activeMagicalTraditions,
    staticAttributes,
    dynamicAttributes,
  ): DisplayedMagicalPrimaryAttributes => {
    const { map, halfed } = activeMagicalTraditions.reduce<{
      map: Map<number, DisplayedPrimaryAttribute>
      halfed: boolean
    }>(
      (currentlyHighest, magicalTradition) => {
        const staticPrimaryAttribute = magicalTradition.static.primary

        if (staticPrimaryAttribute === undefined) {
          return currentlyHighest
        } else {
          const {
            id: { attribute: id },
            use_half_for_arcane_energy,
          } = staticPrimaryAttribute
          const staticAttribute = staticAttributes[id]
          const dynamicAttribute = dynamicAttributes[id] ?? createInitialDynamicAttribute(id)

          if (staticAttribute === undefined) {
            return currentlyHighest
          } else if (
            currentlyHighest.map.size === 0 ||
            [...currentlyHighest.map.values()][0]!.dynamic.value < dynamicAttribute.value
          ) {
            return {
              map: new Map([[id, { static: staticAttribute, dynamic: dynamicAttribute }]]),
              halfed: currentlyHighest.halfed || use_half_for_arcane_energy,
            }
          } else if (
            [...currentlyHighest.map.values()][0]!.dynamic.value === dynamicAttribute.value
          ) {
            return {
              map: currentlyHighest.map.set(id, {
                static: staticAttribute,
                dynamic: dynamicAttribute,
              }),
              halfed: currentlyHighest.halfed || use_half_for_arcane_energy,
            }
          } else {
            return currentlyHighest
          }
        }
      },
      { map: new Map(), halfed: false },
    )

    return {
      list: [...map.values()],
      halfed,
    }
  },
)

/**
 * Returns the primary attribute of the active blessed tradition, if any.
 */
export const selectBlessedPrimaryAttribute = createSelector(
  selectActiveBlessedTradition,
  selectStaticAttributes,
  selectDynamicAttributes,
  (
    activeBlessedTradition,
    staticAttributes,
    dynamicAttributes,
  ): DisplayedPrimaryAttribute | undefined => {
    const id = activeBlessedTradition?.static.primary?.id.attribute

    if (id === undefined) {
      return undefined
    } else {
      const staticAttribute = staticAttributes[id]
      const dynamicAttribute = dynamicAttributes[id] ?? createInitialDynamicAttribute(id)

      if (staticAttribute === undefined) {
        return undefined
      } else {
        return { static: staticAttribute, dynamic: dynamicAttribute }
      }
    }
  },
)

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
  createPropertySelector(selectAdvantages, AdvantageIdentifier.ExceptionalSkill),
  createPropertySelector(selectAdvantages, AdvantageIdentifier.ExceptionalCombatTechnique),
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
  selectDynamicSkills,
  selectDynamicCloseCombatTechniques,
  selectDynamicRangedCombatTechniques,
  selectDynamicSpells,
  selectDynamicRituals,
  selectDynamicLiturgicalChants,
  selectDynamicCeremonies,
  selectHighestMagicalPrimaryAttributes,
  selectBlessedPrimaryAttribute,
  selectAttributeMinimaByAssociatedAttributes,
  selectMagicalPrimaryAttributeDependencies,
  selectBlessedPrimaryAttributeDependencies,
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
    skills,
    closeCombatTechniques,
    rangedCombatTechniques,
    spells,
    rituals,
    liturgicalChants,
    ceremonies,
    highestMagicalPrimaryAttributes,
    blessedPrimaryAttribute,
    attributeMinimaByAssociatedAttributes,
    magicalPrimaryAttributeDependencies,
    blessedPrimaryAttributeDependencies,
  ): DisplayedAttribute[] => {
    const filterApplyingDependencies = filterApplyingRatedDependencies({
      attributes: dynamicAttributes,
      skills,
      closeCombatTechniques,
      rangedCombatTechniques,
      spells,
      rituals,
      liturgicalChants,
      ceremonies,
    })

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
