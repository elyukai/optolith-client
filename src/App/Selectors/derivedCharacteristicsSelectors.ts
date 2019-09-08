import { notEquals } from "../../Data/Eq";
import { fmap, fmapF } from "../../Data/Functor";
import { elem, foldr, List, snoc } from "../../Data/List";
import { bindF, ensure, fromMaybe, Just, liftM2, listToMaybe, maybe, Maybe, Nothing } from "../../Data/Maybe";
import { add, multiply, negate, subtract } from "../../Data/Num";
import { elems, fromList } from "../../Data/OrderedMap";
import { Record } from "../../Data/Record";
import { Pair, Tuple } from "../../Data/Tuple";
import { uncurry3 } from "../../Data/Tuple/Curry";
import { sel1, sel2, sel3 } from "../../Data/Tuple/Select";
import { AdvantageId, AttrId, DCId, DisadvantageId, SpecialAbilityId } from "../Constants/Ids";
import { ActivatableDependent } from "../Models/ActiveEntries/ActivatableDependent";
import { ActiveObject } from "../Models/ActiveEntries/ActiveObject";
import { AttributeDependent } from "../Models/ActiveEntries/AttributeDependent";
import { PermanentEnergyLoss } from "../Models/Hero/PermanentEnergyLoss";
import { PermanentEnergyLossAndBoughtBack } from "../Models/Hero/PermanentEnergyLossAndBoughtBack";
import { Rules } from "../Models/Hero/Rules";
import { AttributeCombined } from "../Models/View/AttributeCombined";
import { DerivedCharacteristic } from "../Models/View/DerivedCharacteristic";
import { Race } from "../Models/Wiki/Race";
import { getModifierByActiveLevel, getModifierByIsActive, getModifierByIsActives } from "../Utilities/Activatable/activatableModifierUtils";
import { getActiveSelections } from "../Utilities/Activatable/selectionUtils";
import { createMaybeSelector } from "../Utilities/createMaybeSelector";
import { translate } from "../Utilities/I18n";
import { getAttributeValueWithDefault } from "../Utilities/Increasable/attributeUtils";
import { pipe } from "../Utilities/pipe";
import { isBookEnabled, sourceBooksPairToTuple } from "../Utilities/RulesUtils";
import { mapGetToMaybeSlice, mapGetToSlice, mapGetToSliceWithProps } from "../Utilities/SelectorsUtils";
import { getHighestPrimaryMagicalAttributeValue, getPrimaryBlessedAttribute } from "./attributeSelectors";
import { getRace } from "./rcpSelectors";
import { getRuleBooksEnabled } from "./rulesSelectors";
import { getMagicalTraditionsFromHero } from "./spellsSelectors";
import { getAddedArcaneEnergyPoints, getAddedKarmaPoints, getAddedLifePoints, getAdvantages, getAttributes, getDisadvantages, getLocaleAsProp, getPermanentArcaneEnergyPoints, getPermanentKarmaPoints, getPermanentLifePoints, getRules, getSpecialAbilities } from "./stateSelectors";

const ACA = AttributeCombined.A
const ADA = AttributeDependent.A

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
  getLocaleAsProp,
  (mrace, mcon, plp, minc, mdec, added, l10n) => {
    const base = maybe (0)
                       (pipe (Race.A.lp, add (getAttributeValueWithDefault (mcon) * 2)))
                       (mrace)

    const lost = fmap (PermanentEnergyLoss.A.lost) (plp)
    const mod = getModifierByActiveLevel (fmap (negate) (lost)) (minc) (mdec)

    const value = Just (base + mod + Maybe.sum (added))

    return DerivedCharacteristic<DCId.LP> ({
      add: Just (Maybe.sum (added)),
      base: Just (base),
      calc: translate (l10n) ("lifepointscalc"),
      currentAdd: Just (Maybe.sum (added)),
      id: DCId.LP,
      maxAdd: Just (Maybe.sum (fmap (AttributeDependent.A.value) (mcon))),
      mod: Just (mod),
      name: translate (l10n) ("lifepoints"),
      permanentLost: Just (Maybe.sum (lost)),
      permanentRedeemed: Nothing,
      short: translate (l10n) ("lifepoints.short"),
      value,
    })
  }
)

export const getAE = createMaybeSelector (
  getMagicalTraditionsFromHero,
  getHighestPrimaryMagicalAttributeValue,
  getPermanentArcaneEnergyPoints,
  mapGetToMaybeSlice (getAdvantages) (AdvantageId.IncreasedAstralPower),
  mapGetToMaybeSlice (getDisadvantages) (DisadvantageId.DecreasedArcanePower),
  getAddedArcaneEnergyPoints,
  getLocaleAsProp,
  (trads, mprimary_value, paep, minc, mdec, added, l10n) => {
    const mlast_trad = listToMaybe (trads)

    const mredeemed = fmap (PermanentEnergyLossAndBoughtBack.A.redeemed) (paep)

    const mlost = fmap (PermanentEnergyLossAndBoughtBack.A.lost) (paep)

    const mod = getModifierByActiveLevel (liftM2 (subtract) (mredeemed) (mlost))
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
                                            const ae_mod = getPrimaryAEMod (last_trad)

                                            const maxAdd = Math.round (primary_value * ae_mod)

                                            return Tuple (maxAdd + 20, maxAdd, ae_mod)
                                          })))

    const value = fmapF (mbaseAndAdd)
                        (pipe (sel1, base => base + mod + Maybe.sum (added)))

    const calc = maybe (translate (l10n) ("arcaneenergycalc"))
                       <Tuple<[number, number, number]>> (pipe (
                         sel3,
                         ae_mod =>
                          ae_mod === 1
                          ? translate (l10n) ("arcaneenergycalc")
                          : ae_mod === 0.5
                          ? translate (l10n) ("arcaneenergycalc.halfprimary")
                          : translate (l10n) ("arcaneenergycalc.noprimary")
                       ))
                       (mbaseAndAdd)

    return DerivedCharacteristic<DCId.AE> ({
      add: Just (Maybe.sum (added)),
      base: fmapF (mbaseAndAdd) (sel1),
      calc,
      currentAdd: Just (Maybe.sum (added)),
      id: DCId.AE,
      maxAdd: Just (Maybe.sum (fmapF (mbaseAndAdd) (sel2))),
      mod: Just (mod),
      name: translate (l10n) ("arcaneenergy"),
      permanentLost: Just (Maybe.sum (mlost)),
      permanentRedeemed: Just (Maybe.sum (mredeemed)),
      short: translate (l10n) ("arcaneenergy.short"),
      value,
    })
  }
)

const getPrimaryAEMod =
  (last_trad: Record<ActivatableDependent>): number =>
    elem (ActivatableDependent.A.id (last_trad))
        (List (
          SpecialAbilityId.TraditionZauberbarden,
          SpecialAbilityId.TraditionZaubertaenzer,
          SpecialAbilityId.TraditionZauberalchimisten,
          SpecialAbilityId.TraditionAnimisten
        ))
    ? 0.5
    : elem (ActivatableDependent.A.id (last_trad))
           (List (
             SpecialAbilityId.TraditionIntuitiveZauberer,
             SpecialAbilityId.TraditionMeistertalentierte
           ))
    ? 0
    : 1

export const getKP = createMaybeSelector (
  getPrimaryBlessedAttribute,
  getPermanentKarmaPoints,
  mapGetToMaybeSlice (getAdvantages) (AdvantageId.IncreasedKarmaPoints),
  mapGetToMaybeSlice (getDisadvantages) (DisadvantageId.DecreasedKarmaPoints),
  getAddedKarmaPoints,
  getLocaleAsProp,
  mapGetToSlice (getSpecialAbilities) (SpecialAbilityId.HoheWeihe),
  (mprimary, pkp, minc, mdec, added, l10n, mhigh_consecration) => {
    const mredeemed = fmap (PermanentEnergyLossAndBoughtBack.A.redeemed) (pkp)

    const mlost = fmap (PermanentEnergyLossAndBoughtBack.A.lost) (pkp)

    const highConsecrationLevel = getFirstLevel (mhigh_consecration)

    const highConsecrationMod = maybe (0) (multiply (6)) (highConsecrationLevel)

    const mod = highConsecrationMod
      + getModifierByActiveLevel (liftM2 (subtract) (mredeemed) (mlost))
                                 (minc)
                                 (mdec)

    const mbase = fmapF (mprimary) (pipe (ACA.stateEntry, ADA.value, add (20)))

    const value = fmapF (mbase) (base => base + mod + Maybe.sum (added))

    return DerivedCharacteristic<DCId.KP> ({
      add: Just (Maybe.sum (added)),
      base: mbase,
      calc: translate (l10n) ("karmapointscalc"),
      currentAdd: Just (Maybe.sum (added)),
      id: DCId.KP,
      maxAdd: Just (Maybe.sum (fmapF (mprimary) (pipe (ACA.stateEntry, ADA.value)))),
      mod: Just (mod),
      name: translate (l10n) ("karmapoints"),
      permanentLost: Just (Maybe.sum (mlost)),
      permanentRedeemed: Just (Maybe.sum (mredeemed)),
      short: translate (l10n) ("karmapoints.short"),
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
  getLocaleAsProp,
  (mrace, mcou, msgc, mint, minc, mdec, l10n) => {
    const mbase = fmapF (mrace)
                        (pipe (
                          Race.A.spi,
                          add (divideBy6AndRound (foldr (pipe (getAttributeValueWithDefault, add))
                                                        (0)
                                                        (List (mcou, msgc, mint))))
                        ))

    const mod = getModifierByIsActive (Just (0)) (minc) (mdec)

    const value = fmapF (mbase) (add (mod))

    return DerivedCharacteristic<DCId.SPI> ({
      base: Just (Maybe.sum (mbase)),
      calc: translate (l10n) ("spiritcalc"),
      id: DCId.SPI,
      mod: Just (mod),
      name: translate (l10n) ("spirit"),
      short: translate (l10n) ("spirit.short"),
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
  getLocaleAsProp,
  (mrace, mcon, mstr, minc, mdec, l10n) => {
    const mbase = fmapF (mrace)
                        (pipe (
                          Race.A.tou,
                          add (divideBy6AndRound (getAttributeValueWithDefault (mcon) * 2
                                                  + getAttributeValueWithDefault (mstr)))
                        ))

    const mod = getModifierByIsActive (Just (0)) (minc) (mdec)

    const value = fmapF (mbase) (add (mod))

    return DerivedCharacteristic<DCId.TOU> ({
      base: Just (Maybe.sum (mbase)),
      calc: translate (l10n) ("toughnesscalc"),
      id: DCId.TOU,
      mod: Just (mod),
      name: translate (l10n) ("toughness"),
      short: translate (l10n) ("toughness.short"),
      value,
    })
  }
)

export const getDO = createMaybeSelector (
  mapGetToSliceWithProps (getAttributes) (AttrId.Agility),
  mapGetToSlice (getSpecialAbilities) (SpecialAbilityId.ImprovedDodge),
  getLocaleAsProp,
  getRules,
  (magi, mimproved_dodge, l10n, rules) => {
    const base = divideBy2AndRound (getAttributeValueWithDefault (magi))

    const higher_parade_values = Rules.A.higherParadeValues (rules) / 2

    const mod = ensure (notEquals (0))
                       (Maybe.sum (getFirstLevel (mimproved_dodge)) + higher_parade_values)

    const value = base + Maybe.sum (mod)

    return DerivedCharacteristic<DCId.DO> ({
      calc: translate (l10n) ("dodgecalc"),
      id: DCId.DO,
      name: translate (l10n) ("dodge"),
      short: translate (l10n) ("dodge.short"),
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
  getLocaleAsProp,
  (mcou, magi, mcombat_reflexes, l10n) => {
    const base = divideBy2AndRound (
      getAttributeValueWithDefault (mcou) + getAttributeValueWithDefault (magi)
    )

    const mod = getFirstLevel (mcombat_reflexes)

    const value = base + Maybe.sum (mod)

    return DerivedCharacteristic<DCId.INI> ({
      calc: translate (l10n) ("initiativecalc"),
      id: DCId.INI,
      name: translate (l10n) ("initiative"),
      short: translate (l10n) ("initiative.short"),
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
  getLocaleAsProp,
  (mrace, mnimble, mmaimed, mslow, mleichter_gang, l10n) => {
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

    const mod = getModifierByIsActives (Just (0)) (List (mnimble)) (List (mslow, mleichter_gang))

    const value = fmapF (mbase) (add (mod))

    return DerivedCharacteristic<DCId.MOV> ({
      calc: translate (l10n) ("movementcalc"),
      id: DCId.MOV,
      name: translate (l10n) ("movement"),
      short: translate (l10n) ("movement.short"),
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
  getLocaleAsProp,
  (mcon, minc, mdec, l10n) => {
    const base = divideBy2AndRound (getAttributeValueWithDefault (mcon))

    const mod = getModifierByIsActive (Just (0)) (minc) (mdec)

    const value = base + mod

    return DerivedCharacteristic<DCId.WT> ({
      calc: translate (l10n) ("woundthresholdcalc"),
      id: DCId.WT,
      name: translate (l10n) ("woundthreshold"),
      short: translate (l10n) ("woundthreshold.short"),
      base: Just (base),
      mod: Just (mod),
      value: Just (value),
    })
  }
)

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
  (LP, AE, KP, SPI, TOU, DO, INI, MOV, WT, rule_books_enabled) => {
    type BaseDerived = Record<DerivedCharacteristic>

    const xs = List<Pair<DCId, BaseDerived>> (
      Pair (DerivedCharacteristic.A.id (LP), LP),
      Pair (DerivedCharacteristic.A.id (AE), AE),
      Pair (DerivedCharacteristic.A.id (KP), KP),
      Pair (DerivedCharacteristic.A.id (SPI), SPI),
      Pair (DerivedCharacteristic.A.id (TOU), TOU),
      Pair (DerivedCharacteristic.A.id (DO), DO),
      Pair (DerivedCharacteristic.A.id (INI), INI),
      Pair (DerivedCharacteristic.A.id (MOV), MOV)
    )

    const isWoundThresholdEnabled = uncurry3 (isBookEnabled)
                                             (sourceBooksPairToTuple (rule_books_enabled))
                                             ("US25003")

    if (isWoundThresholdEnabled) {
      return fromList (snoc (xs) (Pair (DerivedCharacteristic.A.id (WT), WT)))
    }

    return fromList (xs)
  }
)

export const getDerivedCharacteristics = createMaybeSelector (
  getDerivedCharacteristicsMap,
  elems
)
