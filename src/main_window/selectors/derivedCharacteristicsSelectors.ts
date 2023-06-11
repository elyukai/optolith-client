import { createSelector } from "@reduxjs/toolkit"
import { DerivedCharacteristic } from "optolith-database-schema/types/DerivedCharacteristic"
import { firstLevel } from "../../shared/domain/activatableEntry.ts"
import { modifierByIsActive, modifierByIsActives, modifierByLevel } from "../../shared/domain/activatableModifiers.ts"
import { AdvantageIdentifier, AttributeIdentifier, CombatSpecialAbilityIdentifier, DerivedCharacteristicIdentifier as DCId, DisadvantageIdentifier, OptionalRuleIdentifier } from "../../shared/domain/identifier.ts"
import { Rated } from "../../shared/domain/ratedEntry.ts"
import { filterNonNullable } from "../../shared/utils/array.ts"
import { createPropertySelector } from "../../shared/utils/redux.ts"
import { attributeValue } from "../slices/attributesSlice.ts"
import { selectActiveOptionalRules, selectAdvantages, selectAttributes, selectCombatSpecialAbilities, selectDisadvantages, selectLifePointsPermanentlyLost, selectPurchasedLifePoints } from "../slices/characterSlice.ts"
import { selectDerivedCharacteristics as selectStaticDerivedCharacteristics } from "../slices/databaseSlice.ts"
import { selectCurrentRace } from "./raceSelectors.ts"

// const SDA = StaticData.A
// const ACA = AttributeCombined.A
// const ADA = AttributeDependent.A
// const DCA = DerivedCharacteristic.A
// const MTA = MagicalTradition.A

// const divideByXAndRound = (x: number) => (a: number) => Math.round(a / x)
// const divideBy2AndRound = divideByXAndRound(2)
// const divideBy6AndRound = divideByXAndRound(6)

// const getFirstLevel =
//   pipe(
//     bindF(pipe(ActivatableDependent.A.active, listToMaybe)),
//     bindF(ActiveObject.A.tier)
//   )

export type DisplayedDerivedCharacteristic<T extends DCId = DCId> = {
  id: T
  base: number
  value: number
  modifier: number
  purchaseMaximum?: number
  purchased?: number
  permanentlyLost?: number
  permanentlyLostBoughtBack?: number
  static: DerivedCharacteristic
}

export const isDisplayedEnergy = (
  dc: DisplayedDerivedCharacteristic
): dc is DisplayedDerivedCharacteristic<DCId.LifePoints | DCId.ArcaneEnergy | DCId.KarmaPoints> =>
  dc.id === DCId.LifePoints || dc.id === DCId.ArcaneEnergy || dc.id === DCId.KarmaPoints

export const selectLifePoints = createSelector(
  selectCurrentRace,
  createPropertySelector(selectAttributes, AttributeIdentifier.Constitution),
  createPropertySelector(selectAdvantages, AdvantageIdentifier.IncreasedLifePoints),
  createPropertySelector(selectDisadvantages, DisadvantageIdentifier.DecreasedLifePoints),
  selectLifePointsPermanentlyLost,
  selectPurchasedLifePoints,
  createPropertySelector(selectStaticDerivedCharacteristics, DCId.LifePoints),
  (
    race,
    constitution,
    incrementor,
    decrementor,
    permanentlyLost,
    purchased,
    staticEntry,
  ): DisplayedDerivedCharacteristic<typeof DCId.LifePoints> | undefined => {
    if (race === undefined || staticEntry === undefined) {
      return undefined
    }
    else {
      const base = race.base_values.life_points + attributeValue(constitution) * 2
      const modifier = modifierByLevel(incrementor, decrementor)
      const value = base + modifier + purchased - permanentlyLost

      return {
        id: DCId.LifePoints,
        base,
        value,
        modifier,
        purchaseMaximum: attributeValue(constitution),
        purchased,
        permanentlyLost,
        static: staticEntry,
      }
    }
  }
)

// export const getAE = createMaybeSelector(
//   getMagicalTraditionStaticEntries,
//   getHighestPrimaryMagicalAttributeValue,
//   getPermanentArcaneEnergyPoints,
//   mapGetToMaybeSlice(getAdvantages)(AdvantageId.IncreasedAstralPower),
//   mapGetToMaybeSlice(getDisadvantages)(DisadvantageId.DecreasedArcanePower),
//   getAddedArcaneEnergyPoints,
//   mapGetToSlice(getSpecialAbilities)(SpecialAbilityId.GrosseMeditation),
//   getWiki,
//   (trads, mprimary_value, paep, minc, mdec, added, mgreat_meditation, staticData) =>
//     pipe_(
//       staticData,
//       SDA.derivedCharacteristics,
//       lookup("AE"),
//       fmap((dc: Record<DerivedCharacteristic>) => {
//         const mlast_trad = listToMaybe(trads)

//         const mredeemed = fmap(PermanentEnergyLossAndBoughtBack.A.redeemed)(paep)

//         const mlost = fmap(PermanentEnergyLossAndBoughtBack.A.lost)(paep)

//         const great_meditation_level = getFirstLevel(mgreat_meditation)

//         const great_meditation_mod = maybe(0)(multiply(6))(great_meditation_level)

//         const mod = great_meditation_mod
//           + modifyByLevelM(liftM2(subtract)(mredeemed)(mlost))
//                            (minc)
//                            (mdec)

//         /**
//          * `Maybe (base, maxAdd)`
//          */
//         const mbaseAndAdd =
//           fmapF(mlast_trad)
//                 (last_trad => fromMaybe(Tuple(20, 0, 0))
//                                         (fmapF(mprimary_value)
//                                                (primary_value => {
//                                                 const ae_mod = pipe_(
//                                                                  last_trad,
//                                                                  sel1,
//                                                                  MTA.aeMod,
//                                                                  Maybe.product
//                                                                )

//                                                 const maxAdd = Math.round(primary_value * ae_mod)

//                                                 return Tuple(maxAdd + 20, maxAdd, ae_mod)
//                                               })))

//         const value = fmapF(mbaseAndAdd)
//                             (pipe(sel1, base => base + mod + Maybe.sum(added)))

//         const calc = pipe_(
//                        mbaseAndAdd,
//                        bindF(pipe(
//                          sel3,
//                          ae_mod =>
//                           ae_mod === 1
//                           ? Nothing
//                           : ae_mod === 0.5
//                           ? DCA.calcHalfPrimary(dc)
//                           : DCA.calcNoPrimary(dc)
//                        ))
//                      )

//         return DerivedCharacteristicValues<DCId.AE>({
//           add: Just(Maybe.sum(added)),
//           base: fmapF(mbaseAndAdd)(sel1),
//           calc,
//           currentAdd: Just(Maybe.sum(added)),
//           id: DCId.AE,
//           maxAdd: Just(Maybe.maybe(0)(sel2)(mbaseAndAdd)),
//           mod: Just(mod),
//           permanentLost: Just(Maybe.sum(mlost)),
//           permanentRedeemed: Just(Maybe.sum(mredeemed)),
//           value,
//         })
//       })
//     )
// )

// export const getKP = createMaybeSelector(
//   getPrimaryBlessedAttribute,
//   getPermanentKarmaPoints,
//   mapGetToMaybeSlice(getAdvantages)(AdvantageId.IncreasedKarmaPoints),
//   mapGetToMaybeSlice(getDisadvantages)(DisadvantageId.DecreasedKarmaPoints),
//   getAddedKarmaPoints,
//   mapGetToSlice(getSpecialAbilities)(SpecialAbilityId.HoheWeihe),
//   (mprimary, pkp, minc, mdec, added, mhigh_consecration) => {
//     const mredeemed = fmap(PermanentEnergyLossAndBoughtBack.A.redeemed)(pkp)

//     const mlost = fmap(PermanentEnergyLossAndBoughtBack.A.lost)(pkp)

//     const highConsecrationLevel = getFirstLevel(mhigh_consecration)

//     const highConsecrationMod = maybe(0)(multiply(6))(highConsecrationLevel)

//     const mod = highConsecrationMod
//       + modifyByLevelM(liftM2(subtract)(mredeemed)(mlost))
//                        (minc)
//                        (mdec)

//     const mbase = fmapF(mprimary)(pipe(ACA.stateEntry, ADA.value, add(20)))

//     const value = fmapF(mbase)(base => base + mod + Maybe.sum(added))

//     return DerivedCharacteristicValues<DCId.KP>({
//       add: Just(Maybe.sum(added)),
//       base: mbase,
//       currentAdd: Just(Maybe.sum(added)),
//       id: DCId.KP,
//       maxAdd: Just(Maybe.sum(fmapF(mprimary)(pipe(ACA.stateEntry, ADA.value)))),
//       mod: Just(mod),
//       permanentLost: Just(Maybe.sum(mlost)),
//       permanentRedeemed: Just(Maybe.sum(mredeemed)),
//       value,
//     })
//   }
// )

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
  ): DisplayedDerivedCharacteristic<typeof DCId.Spirit> | undefined => {
    if (race === undefined || staticEntry === undefined) {
      return undefined
    }
    else {
      const base = race.base_values.spirit + divideAttributeSumByRound([ cou, sgc, int ], 6)
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
  }
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
  ): DisplayedDerivedCharacteristic<typeof DCId.Toughness> | undefined => {
    if (race === undefined || staticEntry === undefined) {
      return undefined
    }
    else {
      const base = race.base_values.toughness + divideAttributeSumByRound([ con, con, str ], 6)
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
  }
)

export const selectDodge = createSelector(
  createPropertySelector(selectAttributes, AttributeIdentifier.Agility),
  createPropertySelector(selectActiveOptionalRules, OptionalRuleIdentifier.HigherDefenseStats),
  createPropertySelector(selectStaticDerivedCharacteristics, DCId.Dodge),
  (
    agi,
    higherDefenseStats,
    staticEntry,
  ): DisplayedDerivedCharacteristic<typeof DCId.Dodge> | undefined => {
    if (staticEntry === undefined) {
      return undefined
    }
    else {
      const base = divideAttributeSumByRound([ agi ], 2)
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
  }
)

export const selectInitiative = createSelector(
  createPropertySelector(selectAttributes, AttributeIdentifier.Courage),
  createPropertySelector(selectAttributes, AttributeIdentifier.Agility),
  // eslint-disable-next-line max-len
  createPropertySelector(selectCombatSpecialAbilities, CombatSpecialAbilityIdentifier.CombatReflexes),
  createPropertySelector(selectStaticDerivedCharacteristics, DCId.Initiative),
  (
    cou,
    agi,
    combatReflexes,
    staticEntry,
  ): DisplayedDerivedCharacteristic<typeof DCId.Initiative> | undefined => {
    if (staticEntry === undefined) {
      return undefined
    }
    else {
      const base = divideAttributeSumByRound([ cou, agi ], 2)
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
  }
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
  ): DisplayedDerivedCharacteristic<typeof DCId.Movement> | undefined => {
    if (race === undefined || staticEntry === undefined) {
      return undefined
    }
    else {
      const oneLegged = 3
      const isOneLeggedActive = maimed?.instances.some(
        instance =>
          instance.options?.[0]?.type === "Predefined"
          && instance.options?.[0]?.id.type === "Generic"
          && instance.options?.[0]?.id.value === oneLegged
      ) ?? false

      const base = isOneLeggedActive
        ? Math.round(race.base_values.movement / 2)
        : race.base_values.movement

      const modifier = modifierByIsActives([ mimble, leichterGang ], [ slow ])
      const value = base + modifier

      return {
        id: DCId.Movement,
        base,
        value,
        modifier,
        static: staticEntry,
      }
    }
  }
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
  ): DisplayedDerivedCharacteristic<typeof DCId.WoundThreshold> | undefined => {
    if (staticEntry === undefined) {
      return undefined
    }
    else {
      const base = divideAttributeSumByRound([ con ], 2)
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
  }
)

// export type DCPair = Pair<Record<DerivedCharacteristic>, Record<DerivedCharacteristicValues>>

// export const getDerivedCharacteristicsMap = createMaybeSelector(
//   getLP,
//   getAE,
//   getKP,
//   getSPI,
//   getTOU,
//   getDO,
//   getINI,
//   getMOV,
//   getWT,
//   getRuleBooksEnabled,
//   getWiki,
//   (LP, AE, KP, SPI, TOU, DO, INI, MOV, WT, rule_books_enabled, staticData) => {
//     const isWoundThresholdEnabled = uncurry3(isBookEnabled)
//                                              (sourceBooksPairToTuple(rule_books_enabled))
//                                              ("US25003")

//     return pipe_(
//       staticData,
//       SDA.derivedCharacteristics,
//       mapMaybe((x): Maybe<DCPair> => {
//                   switch (DCA.id(x)) {
//                     case "LP":
//                       return Just(Pair(x, LP))
//                     case "AE":
//                       return fmapF(AE)(Pair(x))
//                     case "KP":
//                       return Just(Pair(x, KP))
//                     case "SPI":
//                       return Just(Pair(x, SPI))
//                     case "TOU":
//                       return Just(Pair(x, TOU))
//                     case "DO":
//                       return Just(Pair(x, DO))
//                     case "INI":
//                       return Just(Pair(x, INI))
//                     case "MOV":
//                       return Just(Pair(x, MOV))
//                     case "WT":
//                       return isWoundThresholdEnabled ? Just(Pair(x, WT)) : Nothing
//                     default:
//                       return Nothing
//                   }
//                 })
//     )
//   }
// )

export const selectDerivedCharacteristics = createSelector(
  selectLifePoints,
  selectSpirit,
  selectToughness,
  selectDodge,
  selectInitiative,
  selectMovement,
  selectWoundThreshold,
  (
    lifePoints,
    spirit,
    toughness,
    dodge,
    initiative,
    movement,
    woundThreshold,
  ): DisplayedDerivedCharacteristic[] => filterNonNullable([
    lifePoints,
    spirit,
    toughness,
    dodge,
    initiative,
    movement,
    woundThreshold,
  ])
)
