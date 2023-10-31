import { createSelector } from "@reduxjs/toolkit"
import {
  DerivedCharacteristic,
  DerivedCharacteristicTranslation,
} from "optolith-database-schema/types/DerivedCharacteristic"
import { firstLevel, isActive } from "../../shared/domain/activatableEntry.ts"
import {
  modifierByIsActive,
  modifierByIsActives,
  modifierByLevel,
} from "../../shared/domain/activatableModifiers.ts"
import {
  AdvantageIdentifier,
  AttributeIdentifier,
  CombatSpecialAbilityIdentifier,
  DerivedCharacteristicIdentifier as DCId,
  DisadvantageIdentifier,
  EnergyIdentifier,
  KarmaSpecialAbilityIdentifier,
  MagicalSpecialAbilityIdentifier,
  OptionalRuleIdentifier,
} from "../../shared/domain/identifier.ts"
import { Rated } from "../../shared/domain/ratedEntry.ts"
import { filterNonNullable } from "../../shared/utils/array.ts"
import { createPropertySelector } from "../../shared/utils/redux.ts"
import { attributeValue } from "../slices/attributesSlice.ts"
import {
  selectActiveOptionalRules,
  selectArcaneEnergyPermanentlyLost,
  selectArcaneEnergyPermanentlyLostBoughtBack,
  selectDynamicAdvantages,
  selectDynamicAttributes,
  selectDynamicBlessedTraditions,
  selectDynamicCombatSpecialAbilities,
  selectDynamicDisadvantages,
  selectDynamicKarmaSpecialAbilities,
  selectDynamicMagicalSpecialAbilities,
  selectDynamicMagicalTraditions,
  selectKarmaPointsPermanentlyLost,
  selectKarmaPointsPermanentlyLostBoughtBack,
  selectLifePointsPermanentlyLost,
  selectPurchasedArcaneEnergy,
  selectPurchasedKarmaPoints,
  selectPurchasedLifePoints,
} from "../slices/characterSlice.ts"
import { selectStaticDerivedCharacteristics } from "../slices/databaseSlice.ts"
import {
  selectBlessedPrimaryAttribute,
  selectHighestMagicalPrimaryAttributes,
} from "./attributeSelectors.ts"
import { selectIsInCharacterCreation } from "./characterSelectors.ts"
import { selectCurrentRace } from "./raceSelectors.ts"

/**
 * A combination of a static derived characteristic and its corresponding
 * derived values, extended by value bounds.
 */
export type DisplayedDerivedCharacteristic<T extends DCId = DCId> = {
  id: T
  base: number
  value: number
  modifier: number
  purchaseMaximum?: number
  purchased?: number
  isIncreasable?: boolean
  isDecreasable?: boolean
  permanentlyLost?: number
  permanentlyLostBoughtBack?: number
  calculation?: keyof NonNullable<DerivedCharacteristicTranslation["calculation"]>
  static: DerivedCharacteristic
}

/**
 * A combination of a static energy and its corresponding derived values,
 * extended by value bounds.
 */
export type DisplayedEnergy<T extends EnergyIdentifier = EnergyIdentifier> = {
  id: T
  base: number
  value: number
  modifier: number
  purchaseMaximum: number
  purchased: number
  isIncreasable: boolean
  isDecreasable: boolean
  permanentlyLost: number
  permanentlyLostBoughtBack?: number
  calculation?: keyof NonNullable<DerivedCharacteristicTranslation["calculation"]>
  static: DerivedCharacteristic
}

/**
 * Checks if a displayed derived characteristic is an energy.
 */
export const isDisplayedEnergy = (dc: DisplayedDerivedCharacteristic): dc is DisplayedEnergy =>
  dc.id === DCId.LifePoints || dc.id === DCId.ArcaneEnergy || dc.id === DCId.KarmaPoints

/**
 * Returns the static and dynamic values for life points.
 */
export const selectLifePoints = createSelector(
  selectCurrentRace,
  createPropertySelector(selectDynamicAttributes, AttributeIdentifier.Constitution),
  createPropertySelector(selectDynamicAdvantages, AdvantageIdentifier.IncreasedLifePoints),
  createPropertySelector(selectDynamicDisadvantages, DisadvantageIdentifier.DecreasedLifePoints),
  selectLifePointsPermanentlyLost,
  selectPurchasedLifePoints,
  createPropertySelector(selectStaticDerivedCharacteristics, DCId.LifePoints),
  selectIsInCharacterCreation,
  (
    race,
    con,
    incrementor,
    decrementor,
    permanentlyLost,
    purchased,
    staticEntry,
    isInCharacterCreation,
  ): DisplayedEnergy<DCId.LifePoints> | undefined => {
    if (race === undefined || staticEntry === undefined) {
      return undefined
    } else {
      const conValue = attributeValue(con)
      const base = race.base_values.life_points + conValue * 2
      const modifier = modifierByLevel(incrementor, decrementor)
      const value = base + modifier + purchased - permanentlyLost

      return {
        id: DCId.LifePoints,
        base,
        value,
        modifier,
        purchaseMaximum: conValue,
        purchased,
        isDecreasable: !isInCharacterCreation && purchased > 0,
        isIncreasable: !isInCharacterCreation && purchased < conValue,
        permanentlyLost,
        static: staticEntry,
      }
    }
  },
)

/**
 * Returns the static and dynamic values for arcane energy.
 */
export const selectArcaneEnergy = createSelector(
  createPropertySelector(selectDynamicAdvantages, AdvantageIdentifier.Spellcaster),
  selectDynamicMagicalTraditions,
  selectHighestMagicalPrimaryAttributes,
  createPropertySelector(selectDynamicAdvantages, AdvantageIdentifier.IncreasedAstralPower),
  createPropertySelector(selectDynamicDisadvantages, DisadvantageIdentifier.DecreasedArcanePower),
  selectArcaneEnergyPermanentlyLost,
  selectArcaneEnergyPermanentlyLostBoughtBack,
  selectPurchasedArcaneEnergy,
  // eslint-disable-next-line max-len
  createPropertySelector(
    selectDynamicMagicalSpecialAbilities,
    MagicalSpecialAbilityIdentifier.GrosseMeditation,
  ),
  createPropertySelector(selectStaticDerivedCharacteristics, DCId.ArcaneEnergy),
  selectIsInCharacterCreation,
  (
    spellcaster,
    magicalTraditionsMap,
    { list: highestMagicalPrimaryAttributes, halfed: useHalf },
    incrementor,
    decrementor,
    permanentlyLost,
    permanentlyLostBoughtBack,
    purchased,
    grosseMeditation,
    staticEntry,
    isInCharacterCreation,
  ): DisplayedEnergy<DCId.ArcaneEnergy> | undefined => {
    const magicalTraditions = Object.values(magicalTraditionsMap)

    if (!isActive(spellcaster) || !magicalTraditions.some(isActive) || staticEntry === undefined) {
      return undefined
    } else {
      const primaryAttrValue = highestMagicalPrimaryAttributes[0]?.dynamic.value
      const primaryAttrBase =
        primaryAttrValue === undefined
          ? 0
          : useHalf
          ? Math.round(primaryAttrValue / 2)
          : primaryAttrValue

      const base = 20 + primaryAttrBase
      const modifier = firstLevel(grosseMeditation) * 6 + modifierByLevel(incrementor, decrementor)

      const value = base + modifier + purchased - permanentlyLost + permanentlyLostBoughtBack

      return {
        id: DCId.ArcaneEnergy,
        base,
        value,
        modifier,
        purchaseMaximum: primaryAttrBase,
        purchased,
        isDecreasable:
          !isInCharacterCreation && permanentlyLost >= permanentlyLostBoughtBack && purchased > 0,
        isIncreasable:
          !isInCharacterCreation &&
          permanentlyLost >= permanentlyLostBoughtBack &&
          purchased < primaryAttrBase,
        permanentlyLost,
        permanentlyLostBoughtBack,
        calculation:
          highestMagicalPrimaryAttributes.length === 0
            ? "no_primary"
            : useHalf
            ? "half_primary"
            : "default",
        static: staticEntry,
      }
    }
  },
)

/**
 * Returns the static and dynamic values for karma points.
 */
export const selectKarmaPoints = createSelector(
  createPropertySelector(selectDynamicAdvantages, AdvantageIdentifier.Blessed),
  selectDynamicBlessedTraditions,
  selectBlessedPrimaryAttribute,
  createPropertySelector(selectDynamicAdvantages, AdvantageIdentifier.IncreasedKarmaPoints),
  createPropertySelector(selectDynamicDisadvantages, DisadvantageIdentifier.DecreasedKarmaPoints),
  selectKarmaPointsPermanentlyLost,
  selectKarmaPointsPermanentlyLostBoughtBack,
  selectPurchasedKarmaPoints,
  // eslint-disable-next-line max-len
  createPropertySelector(
    selectDynamicKarmaSpecialAbilities,
    KarmaSpecialAbilityIdentifier.HigherOrdination,
  ),
  createPropertySelector(selectStaticDerivedCharacteristics, DCId.KarmaPoints),
  selectIsInCharacterCreation,
  (
    blessed,
    blessedTraditionsMap,
    blessedPrimaryAttribute,
    incrementor,
    decrementor,
    permanentlyLost,
    permanentlyLostBoughtBack,
    purchased,
    higherOrdination,
    staticEntry,
    isInCharacterCreation,
  ): DisplayedEnergy<DCId.KarmaPoints> | undefined => {
    const blessedTraditions = Object.values(blessedTraditionsMap)

    if (!isActive(blessed) || !blessedTraditions.some(isActive) || staticEntry === undefined) {
      return undefined
    } else {
      const primaryAttrValue = blessedPrimaryAttribute?.dynamic.value
      const primaryAttrBase = primaryAttrValue === undefined ? 0 : primaryAttrValue

      const base = 20 + primaryAttrBase
      const modifier = firstLevel(higherOrdination) * 6 + modifierByLevel(incrementor, decrementor)

      const value = base + modifier + purchased - permanentlyLost + permanentlyLostBoughtBack

      return {
        id: DCId.KarmaPoints,
        base,
        value,
        modifier,
        purchaseMaximum: primaryAttrBase,
        purchased,
        isDecreasable:
          !isInCharacterCreation && permanentlyLost >= permanentlyLostBoughtBack && purchased > 0,
        isIncreasable:
          !isInCharacterCreation &&
          permanentlyLost >= permanentlyLostBoughtBack &&
          purchased < primaryAttrBase,
        permanentlyLost,
        permanentlyLostBoughtBack,
        calculation: primaryAttrValue === undefined ? "no_primary" : "default",
        static: staticEntry,
      }
    }
  },
)

const divideAttributeSumByRound = (attributes: (Rated | undefined)[], divisor: number) =>
  Math.round(attributes.reduce((acc, attr) => acc + attributeValue(attr), 0) / divisor)

/**
 * Returns the static and dynamic values for spirit.
 */
export const selectSpirit = createSelector(
  selectCurrentRace,
  createPropertySelector(selectDynamicAttributes, AttributeIdentifier.Courage),
  createPropertySelector(selectDynamicAttributes, AttributeIdentifier.Sagacity),
  createPropertySelector(selectDynamicAttributes, AttributeIdentifier.Intuition),
  createPropertySelector(selectDynamicAdvantages, AdvantageIdentifier.IncreasedSpirit),
  createPropertySelector(selectDynamicDisadvantages, DisadvantageIdentifier.DecreasedSpirit),
  createPropertySelector(selectStaticDerivedCharacteristics, DCId.Spirit),
  (
    race,
    cou,
    sgc,
    int,
    incrementor,
    decrementor,
    staticEntry,
  ): DisplayedDerivedCharacteristic<DCId.Spirit> | undefined => {
    if (race === undefined || staticEntry === undefined) {
      return undefined
    } else {
      const base = race.base_values.spirit + divideAttributeSumByRound([cou, sgc, int], 6)
      const modifier = modifierByIsActive(incrementor, decrementor)
      const value = base + modifier

      return {
        id: DCId.Spirit,
        base,
        value,
        modifier,
        static: staticEntry,
      }
    }
  },
)

/**
 * Returns the static and dynamic values for toughness.
 */
export const selectToughness = createSelector(
  selectCurrentRace,
  createPropertySelector(selectDynamicAttributes, AttributeIdentifier.Constitution),
  createPropertySelector(selectDynamicAttributes, AttributeIdentifier.Strength),
  createPropertySelector(selectDynamicAdvantages, AdvantageIdentifier.IncreasedToughness),
  createPropertySelector(selectDynamicDisadvantages, DisadvantageIdentifier.DecreasedToughness),
  createPropertySelector(selectStaticDerivedCharacteristics, DCId.Toughness),
  (
    race,
    con,
    str,
    incrementor,
    decrementor,
    staticEntry,
  ): DisplayedDerivedCharacteristic<DCId.Toughness> | undefined => {
    if (race === undefined || staticEntry === undefined) {
      return undefined
    } else {
      const base = race.base_values.toughness + divideAttributeSumByRound([con, con, str], 6)
      const modifier = modifierByIsActive(incrementor, decrementor)
      const value = base + modifier

      return {
        id: DCId.Toughness,
        base,
        value,
        modifier,
        static: staticEntry,
      }
    }
  },
)

/**
 * Returns the static and dynamic values for dodge.
 */
export const selectDodge = createSelector(
  createPropertySelector(selectDynamicAttributes, AttributeIdentifier.Agility),
  createPropertySelector(selectActiveOptionalRules, OptionalRuleIdentifier.HigherDefenseStats),
  createPropertySelector(selectStaticDerivedCharacteristics, DCId.Dodge),
  (
    agi,
    higherDefenseStats,
    staticEntry,
  ): DisplayedDerivedCharacteristic<DCId.Dodge> | undefined => {
    if (staticEntry === undefined) {
      return undefined
    } else {
      const base = divideAttributeSumByRound([agi], 2)
      const modifier = (higherDefenseStats?.options?.[0] ?? 2) / 2
      const value = base + modifier

      return {
        id: DCId.Dodge,
        base,
        value,
        modifier,
        static: staticEntry,
      }
    }
  },
)

/**
 * Returns the static and dynamic values for initiative.
 */
export const selectInitiative = createSelector(
  createPropertySelector(selectDynamicAttributes, AttributeIdentifier.Courage),
  createPropertySelector(selectDynamicAttributes, AttributeIdentifier.Agility),
  // eslint-disable-next-line max-len
  createPropertySelector(
    selectDynamicCombatSpecialAbilities,
    CombatSpecialAbilityIdentifier.CombatReflexes,
  ),
  createPropertySelector(selectStaticDerivedCharacteristics, DCId.Initiative),
  (
    cou,
    agi,
    combatReflexes,
    staticEntry,
  ): DisplayedDerivedCharacteristic<DCId.Initiative> | undefined => {
    if (staticEntry === undefined) {
      return undefined
    } else {
      const base = divideAttributeSumByRound([cou, agi], 2)
      const modifier = firstLevel(combatReflexes)
      const value = base + modifier

      return {
        id: DCId.Initiative,
        base,
        value,
        modifier,
        static: staticEntry,
      }
    }
  },
)

/**
 * Returns the static and dynamic values for movement.
 */
export const selectMovement = createSelector(
  selectCurrentRace,
  createPropertySelector(selectDynamicAdvantages, AdvantageIdentifier.Nimble),
  createPropertySelector(selectDynamicAdvantages, AdvantageIdentifier.LeichterGang),
  createPropertySelector(selectDynamicDisadvantages, DisadvantageIdentifier.Maimed),
  createPropertySelector(selectDynamicDisadvantages, DisadvantageIdentifier.Slow),
  createPropertySelector(selectStaticDerivedCharacteristics, DCId.Movement),
  (
    race,
    mimble,
    leichterGang,
    maimed,
    slow,
    staticEntry,
  ): DisplayedDerivedCharacteristic<DCId.Movement> | undefined => {
    if (race === undefined || staticEntry === undefined) {
      return undefined
    } else {
      const oneLegged = 3
      const isOneLeggedActive =
        maimed?.instances.some(
          instance =>
            instance.options?.[0]?.type === "Predefined" &&
            instance.options?.[0]?.id.type === "Generic" &&
            instance.options?.[0]?.id.value === oneLegged,
        ) ?? false

      const base = isOneLeggedActive
        ? Math.round(race.base_values.movement / 2)
        : race.base_values.movement

      const modifier = modifierByIsActives([mimble, leichterGang], [slow])
      const value = base + modifier

      return {
        id: DCId.Movement,
        base,
        value,
        modifier,
        static: staticEntry,
      }
    }
  },
)

/**
 * Returns the static and dynamic values for wound threshold.
 */
export const selectWoundThreshold = createSelector(
  createPropertySelector(selectDynamicAttributes, AttributeIdentifier.Constitution),
  createPropertySelector(selectDynamicAdvantages, AdvantageIdentifier.Unyielding),
  createPropertySelector(selectDynamicDisadvantages, DisadvantageIdentifier.BrittleBones),
  createPropertySelector(selectStaticDerivedCharacteristics, DCId.WoundThreshold),
  (
    con,
    incrementor,
    decrementor,
    staticEntry,
  ): DisplayedDerivedCharacteristic<DCId.WoundThreshold> | undefined => {
    // TODO: Implement conditional wound threshold
    //     const isWoundThresholdEnabled = uncurry3(isBookEnabled)
    //                                              (sourceBooksPairToTuple(rule_books_enabled))
    //                                              ("US25003")
    if (staticEntry === undefined) {
      return undefined
    } else {
      const base = divideAttributeSumByRound([con], 2)
      const modifier = modifierByIsActive(incrementor, decrementor)
      const value = base + modifier

      return {
        id: DCId.WoundThreshold,
        base,
        value,
        modifier,
        static: staticEntry,
      }
    }
  },
)

/**
 * Returns the static and dynamic values for fate points.
 */
export const selectFatePoints = createSelector(
  createPropertySelector(selectDynamicAdvantages, AdvantageIdentifier.Luck),
  createPropertySelector(selectDynamicDisadvantages, DisadvantageIdentifier.BadLuck),
  createPropertySelector(selectStaticDerivedCharacteristics, DCId.FatePoints),
  (
    incrementor,
    decrementor,
    staticEntry,
  ): DisplayedDerivedCharacteristic<DCId.FatePoints> | undefined => {
    if (staticEntry === undefined) {
      return undefined
    } else {
      const base = 3
      const modifier = modifierByLevel(incrementor, decrementor)
      const value = base + modifier

      return {
        id: DCId.FatePoints,
        base,
        value,
        modifier,
        static: staticEntry,
      }
    }
  },
)

/**
 * Returns static and dynamic values for all derived characteristics.
 */
export const selectDerivedCharacteristics = createSelector(
  selectLifePoints,
  selectArcaneEnergy,
  selectKarmaPoints,
  selectSpirit,
  selectToughness,
  selectDodge,
  selectInitiative,
  selectMovement,
  selectWoundThreshold,
  selectFatePoints,
  (
    lifePoints,
    arcaneEnergy,
    karmaPoints,
    spirit,
    toughness,
    dodge,
    initiative,
    movement,
    woundThreshold,
    fatePoints,
  ): DisplayedDerivedCharacteristic[] =>
    filterNonNullable([
      lifePoints,
      arcaneEnergy,
      karmaPoints,
      spirit,
      toughness,
      dodge,
      initiative,
      movement,
      woundThreshold,
      fatePoints,
    ]),
)
