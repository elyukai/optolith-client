import { notEquals } from "../../Data/Eq"
import { fmap, fmapF } from "../../Data/Functor"
import { elem, foldr, List } from "../../Data/List"
import {
  bindF,
  catMaybes,
  ensure,
  fromMaybe,
  isJust, isNothing,
  Just,
  liftM2,
  listToMaybe,
  maybe,
  Maybe,
  Nothing,
} from "../../Data/Maybe"
import { add, multiply, negate, subtract } from "../../Data/Num"
import { lookup, mapMaybe } from "../../Data/OrderedMap"
import { Record } from "../../Data/Record"
import { Pair, Tuple } from "../../Data/Tuple"
import { uncurry3 } from "../../Data/Tuple/Curry"
import { sel1, sel2, sel3 } from "../../Data/Tuple/Select"
import { AdvantageId, AttrId, DCId, DisadvantageId, SpecialAbilityId } from "../Constants/Ids"
import { ActivatableDependent } from "../Models/ActiveEntries/ActivatableDependent"
import { ActiveObject } from "../Models/ActiveEntries/ActiveObject"
import { AttributeDependent } from "../Models/ActiveEntries/AttributeDependent"
import { PermanentEnergyLoss } from "../Models/Hero/PermanentEnergyLoss"
import { PermanentEnergyLossAndBoughtBack } from "../Models/Hero/PermanentEnergyLossAndBoughtBack"
import { Rules } from "../Models/Hero/Rules"
import { ActiveActivatable } from "../Models/View/ActiveActivatable"
import { AttributeCombined } from "../Models/View/AttributeCombined"
import { DerivedCharacteristicValues } from "../Models/View/DerivedCharacteristicCombined"
import { Advantage } from "../Models/Wiki/Advantage"
import { DerivedCharacteristic } from "../Models/Wiki/DerivedCharacteristic"
import { Disadvantage } from "../Models/Wiki/Disadvantage"
import { MagicalTradition } from "../Models/Wiki/MagicalTradition"
import { Race } from "../Models/Wiki/Race"
import { SpecialAbility } from "../Models/Wiki/SpecialAbility"
import { StaticData } from "../Models/Wiki/WikiModel"
import { getModifierByIsActive, getModifierByIsActives, modifyByLevelM } from "../Utilities/Activatable/activatableModifierUtils"
import { isCustomActivatableId } from "../Utilities/Activatable/checkActivatableUtils"
import { getActiveSelections } from "../Utilities/Activatable/selectionUtils"
import { createMaybeSelector } from "../Utilities/createMaybeSelector"
import { getAttributeValueWithDefault } from "../Utilities/Increasable/attributeUtils"
import { pipe, pipe_ } from "../Utilities/pipe"
import { isBookEnabled, sourceBooksPairToTuple } from "../Utilities/RulesUtils"
import { mapGetToMaybeSlice, mapGetToSlice, mapGetToSliceWithProps } from "../Utilities/SelectorsUtils"
import { getHighestPrimaryMagicalAttributeValue, getPrimaryBlessedAttribute } from "./attributeSelectors"
import { getMagicalTraditionStaticEntries } from "./magicalTraditionSelectors"
import { getRace } from "./raceSelectors"
import { getRuleBooksEnabled } from "./rulesSelectors"
import { getAddedArcaneEnergyPoints, getAddedKarmaPoints, getAddedLifePoints, getAdvantages, getAttributes, getDisadvantages, getPermanentArcaneEnergyPoints, getPermanentKarmaPoints, getPermanentLifePoints, getRules, getSpecialAbilities, getWiki } from "./stateSelectors"

const SDA = StaticData.A
const ACA = AttributeCombined.A
const ADA = AttributeDependent.A
const DCA = DerivedCharacteristic.A
const MTA = MagicalTradition.A

const divideByXAndRound = (x: number) => (a: number) => Math.round (a / x)
const divideBy2AndRound = divideByXAndRound (2)
const divideBy6AndRound = divideByXAndRound (6)

const getFirstLevel =
  pipe (
    bindF (pipe (ActivatableDependent.A.active, listToMaybe)),
    bindF (ActiveObject.A.tier)
  )

export const getLP = createMaybeSelector (
  getRace,
  mapGetToSliceWithProps (getAttributes) (AttrId.Constitution),
  getPermanentLifePoints,
  mapGetToMaybeSlice (getAdvantages) (AdvantageId.IncreasedLifePoints),
  mapGetToMaybeSlice (getDisadvantages) (DisadvantageId.DecreasedLifePoints),
  getAddedLifePoints,
  (mrace, mcon, plp, minc, mdec, added) => {
    const base = maybe (0)
                       (pipe (Race.A.lp, add (getAttributeValueWithDefault (mcon) * 2)))
                       (mrace)

    const lost = fmap (PermanentEnergyLoss.A.lost) (plp)
    const mod = modifyByLevelM (fmap (negate) (lost)) (minc) (mdec)

    const value = Just (base + mod + Maybe.sum (added))

    return DerivedCharacteristicValues<DCId.LP> ({
      calc: Nothing,
      add: Just (Maybe.sum (added)),
      base: Just (base),
      currentAdd: Just (Maybe.sum (added)),
      id: DCId.LP,
      maxAdd: Just (Maybe.fromMaybe (8) (fmap (AttributeDependent.A.value) (mcon))),
      mod: Just (mod),
      permanentLost: Just (Maybe.sum (lost)),
      permanentRedeemed: Nothing,
      value,
    })
  }
)

export const getAE = createMaybeSelector (
  getMagicalTraditionStaticEntries,
  getHighestPrimaryMagicalAttributeValue,
  getPermanentArcaneEnergyPoints,
  mapGetToMaybeSlice (getAdvantages) (AdvantageId.IncreasedAstralPower),
  mapGetToMaybeSlice (getDisadvantages) (DisadvantageId.DecreasedArcanePower),
  getAddedArcaneEnergyPoints,
  mapGetToSlice (getSpecialAbilities) (SpecialAbilityId.GrosseMeditation),
  getWiki,
  (trads, mprimary_value, paep, minc, mdec, added, mgreat_meditation, staticData) =>
    pipe_ (
      staticData,
      SDA.derivedCharacteristics,
      lookup ("AE"),
      fmap ((dc: Record<DerivedCharacteristic>) => {
        const mlast_trad = listToMaybe (trads)

        const mredeemed = fmap (PermanentEnergyLossAndBoughtBack.A.redeemed) (paep)

        const mlost = fmap (PermanentEnergyLossAndBoughtBack.A.lost) (paep)

        const great_meditation_level = getFirstLevel (mgreat_meditation)

        const great_meditation_mod = maybe (0) (multiply (6)) (great_meditation_level)

        const mod = great_meditation_mod
          + modifyByLevelM (liftM2 (subtract) (mredeemed) (mlost))
                           (minc)
                           (mdec)

        /**
         * `Maybe (base, maxAdd)`
         */
        const mbaseAndAdd =
          fmapF (mlast_trad)
                (last_trad => fromMaybe (Tuple (20, 0, 0))
                                        (fmapF (mprimary_value)
                                               (primary_value => {
                                                const ae_mod = pipe_ (
                                                                 last_trad,
                                                                 sel1,
                                                                 MTA.aeMod,
                                                                 Maybe.product
                                                               )

                                                const maxAdd = Math.round (primary_value * ae_mod)

                                                return Tuple (maxAdd + 20, maxAdd, ae_mod)
                                              })))

        const value = fmapF (mbaseAndAdd)
                            (pipe (sel1, base => base + mod + Maybe.sum (added)))

        const calc = pipe_ (
                       mbaseAndAdd,
                       bindF (pipe (
                         sel3,
                         ae_mod =>
                          ae_mod === 1
                          ? Nothing
                          : ae_mod === 0.5
                          ? DCA.calcHalfPrimary (dc)
                          : DCA.calcNoPrimary (dc)
                       ))
                     )

        return DerivedCharacteristicValues<DCId.AE> ({
          add: Just (Maybe.sum (added)),
          base: fmapF (mbaseAndAdd) (sel1),
          calc,
          currentAdd: Just (Maybe.sum (added)),
          id: DCId.AE,
          maxAdd: Just (Maybe.maybe (0) (sel2) (mbaseAndAdd)),
          mod: Just (mod),
          permanentLost: Just (Maybe.sum (mlost)),
          permanentRedeemed: Just (Maybe.sum (mredeemed)),
          value,
        })
      })
    )
)

export const getKP = createMaybeSelector (
  getPrimaryBlessedAttribute,
  getPermanentKarmaPoints,
  mapGetToMaybeSlice (getAdvantages) (AdvantageId.IncreasedKarmaPoints),
  mapGetToMaybeSlice (getDisadvantages) (DisadvantageId.DecreasedKarmaPoints),
  getAddedKarmaPoints,
  mapGetToSlice (getSpecialAbilities) (SpecialAbilityId.HoheWeihe),
  (mprimary, pkp, minc, mdec, added, mhigh_consecration) => {
    const mredeemed = fmap (PermanentEnergyLossAndBoughtBack.A.redeemed) (pkp)

    const mlost = fmap (PermanentEnergyLossAndBoughtBack.A.lost) (pkp)

    const highConsecrationLevel = getFirstLevel (mhigh_consecration)

    const highConsecrationMod = maybe (0) (multiply (6)) (highConsecrationLevel)

    const mod = highConsecrationMod
      + modifyByLevelM (liftM2 (subtract) (mredeemed) (mlost))
                       (minc)
                       (mdec)

    const mbase = fmapF (mprimary) (pipe (ACA.stateEntry, ADA.value, add (20)))

    const value = fmapF (mbase) (base => base + mod + Maybe.sum (added))

    return DerivedCharacteristicValues<DCId.KP> ({
      add: Just (Maybe.sum (added)),
      base: mbase,
      currentAdd: Just (Maybe.sum (added)),
      id: DCId.KP,
      maxAdd: Just (Maybe.sum (fmapF (mprimary) (pipe (ACA.stateEntry, ADA.value)))),
      mod: Just (mod),
      permanentLost: Just (Maybe.sum (mlost)),
      permanentRedeemed: Just (Maybe.sum (mredeemed)),
      value,
    })
  }
)

export const getSPI = createMaybeSelector (
  getRace,
  mapGetToSliceWithProps (getAttributes) (AttrId.Courage),
  mapGetToSliceWithProps (getAttributes) (AttrId.Sagacity),
  mapGetToSliceWithProps (getAttributes) (AttrId.Intuition),
  mapGetToMaybeSlice (getAdvantages) (AdvantageId.IncreasedSpirit),
  mapGetToMaybeSlice (getDisadvantages) (DisadvantageId.DecreasedSpirit),
  getWiki,
  (mrace, mcou, msgc, mint, minc, mdec) => {
    const mbase = fmapF (mrace)
                        (pipe (
                          Race.A.spi,
                          add (divideBy6AndRound (foldr (pipe (
                                                          getAttributeValueWithDefault,
                                                          add
                                                        ))
                                                        (0)
                                                        (List (mcou, msgc, mint))))
                        ))

    const mod = getModifierByIsActive (Just (0)) (minc) (mdec)

    const value = fmapF (mbase) (add (mod))

    return DerivedCharacteristicValues<DCId.SPI> ({
      base: Just (Maybe.sum (mbase)),
      id: DCId.SPI,
      mod: Just (mod),
      value,
    })
  }
)

export const getTOU = createMaybeSelector (
  getRace,
  mapGetToSliceWithProps (getAttributes) (AttrId.Constitution),
  mapGetToSliceWithProps (getAttributes) (AttrId.Strength),
  mapGetToMaybeSlice (getAdvantages) (AdvantageId.IncreasedToughness),
  mapGetToMaybeSlice (getDisadvantages) (DisadvantageId.DecreasedToughness),
  (mrace, mcon, mstr, minc, mdec) => {
    const mbase = fmapF (mrace)
                        (pipe (
                          Race.A.tou,
                          add (divideBy6AndRound (getAttributeValueWithDefault (mcon) * 2
                                                  + getAttributeValueWithDefault (mstr)))
                        ))

    const mod = getModifierByIsActive (Just (0)) (minc) (mdec)

    const value = fmapF (mbase) (add (mod))

    return DerivedCharacteristicValues<DCId.TOU> ({
      base: Just (Maybe.sum (mbase)),
      id: DCId.TOU,
      mod: Just (mod),
      value,
    })
  }
)

export const getDO = createMaybeSelector (
  mapGetToSliceWithProps (getAttributes) (AttrId.Agility),
  getRules,
  (magi, rules) => {
    const base = divideBy2AndRound (getAttributeValueWithDefault (magi))

    const higher_parade_values = Rules.A.higherParadeValues (rules) / 2

    const mod = ensure (notEquals (0)) (higher_parade_values)

    const value = base + Maybe.sum (mod)

    return DerivedCharacteristicValues<DCId.DO> ({
      id: DCId.DO,
      base: Just (base),
      mod,
      value: Just (value),
    })
  }
)

export const getINI = createMaybeSelector (
  mapGetToSliceWithProps (getAttributes) (AttrId.Courage),
  mapGetToSliceWithProps (getAttributes) (AttrId.Agility),
  mapGetToSlice (getSpecialAbilities) (SpecialAbilityId.CombatReflexes),
  (mcou, magi, mcombat_reflexes) => {
    const base = divideBy2AndRound (
      getAttributeValueWithDefault (mcou) + getAttributeValueWithDefault (magi)
    )

    const mod = getFirstLevel (mcombat_reflexes)

    const value = base + Maybe.sum (mod)

    return DerivedCharacteristicValues<DCId.INI> ({
      id: DCId.INI,
      base: Just (base),
      mod,
      value: Just (value),
    })
  }
)

export const getMOV = createMaybeSelector (
  getRace,
  mapGetToMaybeSlice (getAdvantages) (AdvantageId.Nimble),
  mapGetToMaybeSlice (getDisadvantages) (DisadvantageId.Maimed),
  mapGetToMaybeSlice (getDisadvantages) (DisadvantageId.Slow),
  mapGetToMaybeSlice (getAdvantages) (AdvantageId.LeichterGang),
  getWiki,
  (mrace, mnimble, mmaimed, mslow, mleichter_gang) => {
    const mbase = fmapF (mrace)
                        (pipe (
                          Race.A.mov,
                          base => Maybe.elem (true)
                                             (fmapF (mmaimed)
                                                    (pipe (
                                                      getActiveSelections,
                                                      elem<string | number> (3)
                                                    )))
                            ? divideBy2AndRound (base)
                            : base
                        ))

    const mod = getModifierByIsActives (Just (0))
                                       (List (mnimble, mleichter_gang))
                                       (List (mslow))

    const value = fmapF (mbase) (add (mod))

    return DerivedCharacteristicValues<DCId.MOV> ({
      id: DCId.MOV,
      base: Just (Maybe.sum (mbase)),
      mod: Just (mod),
      value,
    })
  }
)

export const getWT = createMaybeSelector (
  mapGetToSliceWithProps (getAttributes) (AttrId.Constitution),
  mapGetToMaybeSlice (getAdvantages) (AdvantageId.Unyielding),
  mapGetToMaybeSlice (getDisadvantages) (DisadvantageId.BrittleBones),
  (mcon, minc, mdec) => {
    const base = divideBy2AndRound (getAttributeValueWithDefault (mcon))

    const mod = getModifierByIsActive (Just (0)) (minc) (mdec)

    const value = base + mod

    return DerivedCharacteristicValues<DCId.WT> ({
      id: DCId.WT,
      base: Just (base),
      mod: Just (mod),
      value: Just (value),
    })
  }
)

export type DCPair = Pair<Record<DerivedCharacteristic>, Record<DerivedCharacteristicValues>>

export const getDerivedCharacteristicsMap = createMaybeSelector (
  getLP,
  getAE,
  getKP,
  getSPI,
  getTOU,
  getDO,
  getINI,
  getMOV,
  getWT,
  getRuleBooksEnabled,
  getWiki,
  (LP, AE, KP, SPI, TOU, DO, INI, MOV, WT, rule_books_enabled, staticData) => {
    const isWoundThresholdEnabled = uncurry3 (isBookEnabled)
                                             (sourceBooksPairToTuple (rule_books_enabled))
                                             ("US25003")

    return pipe_ (
      staticData,
      SDA.derivedCharacteristics,
      mapMaybe ((x): Maybe<DCPair> => {
                  switch (DCA.id (x)) {
                    case "LP":
                      return Just (Pair (x, LP))
                    case "AE":
                      return fmapF (AE) (Pair (x))
                    case "KP":
                      return Just (Pair (x, KP))
                    case "SPI":
                      return Just (Pair (x, SPI))
                    case "TOU":
                      return Just (Pair (x, TOU))
                    case "DO":
                      return Just (Pair (x, DO))
                    case "INI":
                      return Just (Pair (x, INI))
                    case "MOV":
                      return Just (Pair (x, MOV))
                    case "WT":
                      return isWoundThresholdEnabled ? Just (Pair (x, WT)) : Nothing
                    default:
                      return Nothing
                  }
                })
    )
  }
)

export const getDerivedCharacteristics = createMaybeSelector (
  getDerivedCharacteristicsMap,
  mp => catMaybes (List (
    lookup ("LP") (mp),
    lookup ("AE") (mp),
    lookup ("KP") (mp),
    lookup ("SPI") (mp),
    lookup ("TOU") (mp),
    lookup ("DO") (mp),
    lookup ("INI") (mp),
    lookup ("MOV") (mp),
    lookup ("WT") (mp),
  ))
)

export interface RuleDictionary {
  [key: string]: string
}

export interface RuleContainer {
  total: number
  advantages: RuleDictionary
  disadvantages: RuleDictionary
  specialAbilities: RuleDictionary
}

export const getCustomRules = (
  advantagesActive: Maybe<List<Record<ActiveActivatable<Advantage>>>>,
  disadvantagesActive: Maybe<List<Record<ActiveActivatable<Disadvantage>>>>,
  generalsaActive: Maybe<List<Record<ActiveActivatable<SpecialAbility>>>>,
  combatSpecialAbilities: Maybe<List<Record<ActiveActivatable<SpecialAbility>>>>
): RuleContainer => {
  const customRules: RuleContainer = {
    total: 0,
    advantages: {},
    disadvantages: { },
    specialAbilities: { },
  }
  const addToCustomRules = (
    list: List<Record<ActiveActivatable<Advantage>>>
      | List<Record<ActiveActivatable<Disadvantage>>>
      | List<Record<ActiveActivatable<SpecialAbility>>>,
    target: RuleDictionary
  ) => {
    for (const activatable of list) {
      const { heroEntry } = activatable.values

      if (!isCustomActivatableId (heroEntry.values.id)) {
        continue
      }

      for (const activeObject of heroEntry.values.active) {
        if (!activeObject.values.sid2) {
          continue
        }

        if (
          isNothing (activeObject.values.sid)
          || isNothing (activeObject.values.sid2)
        ) {
          continue
        }

        if (activeObject.values.sid.value in target) {
          continue
        }

        target[activeObject.values.sid.value.toString ()] = activeObject.values.sid2.value.toString ()
        customRules.total++
      }
    }
  }

  if (isJust(advantagesActive)) {
    addToCustomRules (advantagesActive.value, customRules.advantages)
  }
  if (isJust(disadvantagesActive)) {
    addToCustomRules (disadvantagesActive.value, customRules.disadvantages)
  }
  if (isJust(generalsaActive)) {
    addToCustomRules (generalsaActive.value, customRules.specialAbilities)
  }
  if (isJust(combatSpecialAbilities)) {
    addToCustomRules (combatSpecialAbilities.value, customRules.specialAbilities)
  }

  return customRules
}
