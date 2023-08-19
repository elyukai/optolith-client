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
  selectAdvantages,
  selectArcaneEnergyPermanentlyLost,
  selectArcaneEnergyPermanentlyLostBoughtBack,
  selectAttributes,
  selectBlessedTraditions,
  selectCombatSpecialAbilities,
  selectDisadvantages,
  selectKarmaPointsPermanentlyLost,
  selectKarmaPointsPermanentlyLostBoughtBack,
  selectKarmaSpecialAbilities,
  selectLifePointsPermanentlyLost,
  selectMagicalSpecialAbilities,
  selectMagicalTraditions,
  selectPurchasedArcaneEnergy,
  selectPurchasedKarmaPoints,
  selectPurchasedLifePoints,
} from "../slices/characterSlice.ts"
import { selectDerivedCharacteristics as selectStaticDerivedCharacteristics } from "../slices/databaseSlice.ts"
import {
  selectBlessedPrimaryAttribute,
  selectHighestMagicalPrimaryAttributes,
} from "./attributeSelectors.ts"
import { selectIsInCharacterCreation } from "./characterSelectors.ts"
import { selectCurrentRace } from "./raceSelectors.ts"

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

export const isDisplayedEnergy = (dc: DisplayedDerivedCharacteristic): dc is DisplayedEnergy =>
  dc.id === DCId.LifePoints || dc.id === DCId.ArcaneEnergy || dc.id === DCId.KarmaPoints

export const selectLifePoints = createSelector(
  selectCurrentRace,
  createPropertySelector(selectAttributes, AttributeIdentifier.Constitution),
  createPropertySelector(selectAdvantages, AdvantageIdentifier.IncreasedLifePoints),
  createPropertySelector(selectDisadvantages, DisadvantageIdentifier.DecreasedLifePoints),
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

export const selectArcaneEnergy = createSelector(
  createPropertySelector(selectAdvantages, AdvantageIdentifier.Spellcaster),
  selectMagicalTraditions,
  selectHighestMagicalPrimaryAttributes,
  createPropertySelector(selectAdvantages, AdvantageIdentifier.IncreasedAstralPower),
  createPropertySelector(selectDisadvantages, DisadvantageIdentifier.DecreasedArcanePower),
  selectArcaneEnergyPermanentlyLost,
  selectArcaneEnergyPermanentlyLostBoughtBack,
  selectPurchasedArcaneEnergy,
  // eslint-disable-next-line max-len
  createPropertySelector(
    selectMagicalSpecialAbilities,
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

export const selectKarmaPoints = createSelector(
  createPropertySelector(selectAdvantages, AdvantageIdentifier.Blessed),
  selectBlessedTraditions,
  selectBlessedPrimaryAttribute,
  createPropertySelector(selectAdvantages, AdvantageIdentifier.IncreasedKarmaPoints),
  createPropertySelector(selectDisadvantages, DisadvantageIdentifier.DecreasedKarmaPoints),
  selectKarmaPointsPermanentlyLost,
  selectKarmaPointsPermanentlyLostBoughtBack,
  selectPurchasedKarmaPoints,
  // eslint-disable-next-line max-len
  createPropertySelector(
    selectKarmaSpecialAbilities,
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

export const selectSpirit = createSelector(
  selectCurrentRace,
  createPropertySelector(selectAttributes, AttributeIdentifier.Courage),
  createPropertySelector(selectAttributes, AttributeIdentifier.Sagacity),
  createPropertySelector(selectAttributes, AttributeIdentifier.Intuition),
  createPropertySelector(selectAdvantages, AdvantageIdentifier.IncreasedSpirit),
  createPropertySelector(selectDisadvantages, DisadvantageIdentifier.DecreasedSpirit),
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

export const selectToughness = createSelector(
  selectCurrentRace,
  createPropertySelector(selectAttributes, AttributeIdentifier.Constitution),
  createPropertySelector(selectAttributes, AttributeIdentifier.Strength),
  createPropertySelector(selectAdvantages, AdvantageIdentifier.IncreasedToughness),
  createPropertySelector(selectDisadvantages, DisadvantageIdentifier.DecreasedToughness),
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

export const selectDodge = createSelector(
  createPropertySelector(selectAttributes, AttributeIdentifier.Agility),
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

export const selectInitiative = createSelector(
  createPropertySelector(selectAttributes, AttributeIdentifier.Courage),
  createPropertySelector(selectAttributes, AttributeIdentifier.Agility),
  // eslint-disable-next-line max-len
  createPropertySelector(
    selectCombatSpecialAbilities,
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

export const selectMovement = createSelector(
  selectCurrentRace,
  createPropertySelector(selectAdvantages, AdvantageIdentifier.Nimble),
  createPropertySelector(selectAdvantages, AdvantageIdentifier.LeichterGang),
  createPropertySelector(selectDisadvantages, DisadvantageIdentifier.Maimed),
  createPropertySelector(selectDisadvantages, DisadvantageIdentifier.Slow),
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

export const selectWoundThreshold = createSelector(
  createPropertySelector(selectAttributes, AttributeIdentifier.Constitution),
  createPropertySelector(selectAdvantages, AdvantageIdentifier.Unyielding),
  createPropertySelector(selectDisadvantages, DisadvantageIdentifier.BrittleBones),
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

export const selectFatePoints = createSelector(
  createPropertySelector(selectAdvantages, AdvantageIdentifier.Luck),
  createPropertySelector(selectDisadvantages, DisadvantageIdentifier.BadLuck),
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
