import { createSelector } from "@reduxjs/toolkit"
import { Attribute } from "optolith-database-schema/types/Attribute"
import { getAttributeMaximum, getAttributeMinimum, isAttributeDecreasable, isAttributeIncreasable } from "../../shared/domain/attribute.ts"
import { OptionalRuleIdentifier } from "../../shared/domain/identifier.ts"
import { Rated } from "../../shared/domain/ratedEntry.ts"
import { isNotNullish } from "../../shared/utils/nullable.ts"
import { createPropertySelector } from "../../shared/utils/redux.ts"
import { attributeValue, createInitialDynamicAttribute } from "../slices/attributesSlice.ts"
import { selectActiveOptionalRules, selectAttributeAdjustmentId, selectDerivedCharacteristics, selectAttributes as selectDynamicAttributes } from "../slices/characterSlice.ts"
import { selectAttributes as selectStaticAttributes } from "../slices/databaseSlice.ts"
import { selectIsInCharacterCreation } from "./characterSelectors.ts"
import { selectCurrentExperienceLevel, selectMaximumTotalAttributePoints, selectStartExperienceLevel } from "./experienceLevelSelectors.ts"
import { selectActiveBlessedTradition, selectActiveMagicalTraditions } from "./magicalTraditionSelectors.ts"
import { selectCurrentRace } from "./raceSelectors.ts"

export type DisplayedAttribute = {
  static: Attribute
  dynamic: Rated
  minimum: number
  maximum?: number
  isIncreasable: boolean
  isDecreasable: boolean
}

export const selectTotalPoints = createSelector(
  selectStaticAttributes,
  selectDynamicAttributes,
  (attributes, dynamicAttributes): number =>
    Object.values(attributes).reduce(
      (sum, { id }) => sum + (dynamicAttributes[id]?.value ?? 8),
      0
    )
)

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
  ): DisplayedAttribute[] =>
    Object.values(attributes)
      .sort((a, b) => a.id - b.id)
      .map(attribute => {
        const dynamicAttribute =
          dynamicAttributes[attribute.id] ?? createInitialDynamicAttribute(attribute.id)

        const minimum = getAttributeMinimum(
          derivedCharacteristics,
          dynamicAttribute,
        )

        const maximum = getAttributeMaximum(
          isInCharacterCreation,
          currentRace,
          startExperienceLevel,
          currentExperienceLevel,
          maximumAttributeScores !== undefined,
          attributeAdjustmentId,
          attribute.id,
        )

        return {
          static: attribute,
          dynamic: dynamicAttribute,
          minimum,
          maximum,
          isDecreasable:
            isAttributeDecreasable(
              dynamicAttribute,
              minimum
            ),
          isIncreasable:
            isAttributeIncreasable(
              dynamicAttribute,
              maximum,
              totalPoints,
              maxTotalPoints,
              isInCharacterCreation,
            ),
        }
      })
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

export type DisplayedPrimaryAttribute = {
  static: Attribute
  dynamic: Rated
}

export type DisplayedMagicalPrimaryAttributes = {
  list: DisplayedPrimaryAttribute[]
  halfed: boolean
}

export const selectHighestMagicalPrimaryAttributes = createSelector(
  selectActiveMagicalTraditions,
  selectStaticAttributes,
  selectDynamicAttributes,
  (
    activeMagicalTraditions,
    staticAttributes,
    dynamicAttributes
  ): DisplayedMagicalPrimaryAttributes => {
    const { map, halfed } = activeMagicalTraditions
      .reduce<{ map: Map<number, DisplayedPrimaryAttribute>; halfed: boolean }>(
        (currentlyHighest, magicalTradition) => {
          const staticPrimaryAttribute = magicalTradition.static.primary

          if (staticPrimaryAttribute === undefined) {
            return currentlyHighest
          }
          else {
            const { id: { attribute: id }, use_half_for_arcane_energy } = staticPrimaryAttribute
            const staticAttribute = staticAttributes[id]
            const dynamicAttribute = dynamicAttributes[id] ?? createInitialDynamicAttribute(id)

            if (staticAttribute === undefined) {
              return currentlyHighest
            }
            else if (
              currentlyHighest.map.size === 0
              || [ ...currentlyHighest.map.values() ][0]!.dynamic.value < dynamicAttribute.value
            ) {
              return {
                map: new Map([
                  [
                    id,
                    { static: staticAttribute, dynamic: dynamicAttribute },
                  ],
                ]),
                halfed: currentlyHighest.halfed || use_half_for_arcane_energy,
              }
            }
            else {
              return {
                map: currentlyHighest.map.set(
                  id,
                  { static: staticAttribute, dynamic: dynamicAttribute }
                ),
                halfed: currentlyHighest.halfed || use_half_for_arcane_energy,
              }
            }
          }
        },
        { map: new Map(), halfed: false }
      )

    return {
      list: [ ...map.values() ],
      halfed,
    }
  }
)

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
    }
    else {
      const staticAttribute = staticAttributes[id]
      const dynamicAttribute = dynamicAttributes[id] ?? createInitialDynamicAttribute(id)

      if (staticAttribute === undefined) {
        return undefined
      }
      else {
        return { static: staticAttribute, dynamic: dynamicAttribute }
      }
    }
  }
)

// export const getPrimaryMagicalAttributes = createMaybeSelector (
//   getWikiAttributes,
//   getAttributes,
//   getMagicalTraditionsFromHero,
//   uncurryN3 (wiki_attributes =>
//              hero_attributes =>
//                mapMaybe (mapTradHeroEntryToAttrCombined (wiki_attributes) (hero_attributes)))
// )

// export const getHighestPrimaryMagicalAttributeValue = createMaybeSelector (
//   getPrimaryMagicalAttributes,
//   pipe (ensure (notNull), fmap (List.foldr (pipe (ACA_.value, max)) (0)))
// )

// export const getHighestPrimaryMagicalAttributes = createMaybeSelector (
//   getPrimaryMagicalAttributes,
//   getHighestPrimaryMagicalAttributeValue,
//   uncurryN (attrs => fmap (max_value => filter (pipe (ACA_.value, equals (max_value))) (attrs)))
// )

// type AttrCs = List<Record<AttributeCombined>>
// type NonEmptyAttrCs = NonEmptyList<Record<AttributeCombined>>

// export const getHighestPrimaryMagicalAttribute = createMaybeSelector (
//   getHighestPrimaryMagicalAttributes,
//   pipe (
//     bindF (ensure (pipe (flength, equals (1)) as (xs: AttrCs) => xs is NonEmptyAttrCs)),
//     fmap ((xs: NonEmptyAttrCs) => head (xs))
//   )
// )

// export const getPrimaryMagicalAttributeForSheet = createMaybeSelector (
//   getPrimaryMagicalAttributes,
//   map (ACA_.short)
// )

// export const getPrimaryBlessedAttribute = createMaybeSelector (
//   getBlessedTraditionFromState,
//   getAttributes,
//   getWikiAttributes,
//   (mtradition, hero_attributes, wiki_attributes) =>
//     bind (mtradition) (mapTradHeroEntryToAttrCombined (wiki_attributes) (hero_attributes))
// )

// export const getPrimaryBlessedAttributeForSheet = createMaybeSelector (
//   getPrimaryBlessedAttribute,
//   fmap (pipe (ACA.wikiEntry, AA.short))
// )

export const selectCarryingCapacity = createSelector(
  selectDynamicAttributes,
  (attributes): number => (attributes[8]?.value ?? 8) * 2
)

export const selectAvailableAdjustments = createSelector(
  selectCurrentRace,
  selectAttributeAdjustmentId,
  selectVisibleAttributes,
  (race, currentId, attributes) => {
    const selectableAdjustment = race?.attribute_adjustments.find(pair => pair.list.length > 1)

    if (selectableAdjustment === undefined) {
      return undefined
    }
    else {
      const current = attributes.find(attr => attr.static.id === currentId)

      const canNotSwitch = current !== undefined
        && current.maximum !== undefined
        && current.maximum - selectableAdjustment.value < attributeValue(current.dynamic)

      if (canNotSwitch) {
        return {
          value: selectableAdjustment.value,
          list: [ current ],
        }
      }
      else {
        return {
          value: selectableAdjustment.value,
          list: selectableAdjustment.list
            .map(id => attributes.find(attr => attr.static.id === id.id.attribute))
            .filter(isNotNullish),
        }
      }
    }
  }
)
