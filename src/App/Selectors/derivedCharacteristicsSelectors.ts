import { fmap, fmapF } from "../../Data/Functor";
import { elem, foldr, List, snoc } from "../../Data/List";
import { bind, bindF, fromMaybe, Just, liftM2, listToMaybe, maybe, Maybe, Nothing, or } from "../../Data/Maybe";
import { elems, fromList } from "../../Data/OrderedMap";
import { fst, Pair, snd } from "../../Data/Pair";
import { Record } from "../../Data/Record";
import { showP } from "../../Data/Show";
import { ActivatableDependent } from "../Models/ActiveEntries/ActivatableDependent";
import { ActiveObject } from "../Models/ActiveEntries/ActiveObject";
import { AttributeDependent } from "../Models/ActiveEntries/AttributeDependent";
import { PermanentEnergyLoss } from "../Models/Hero/PermanentEnergyLoss";
import { PermanentEnergyLossAndBoughtBack } from "../Models/Hero/PermanentEnergyLossAndBoughtBack";
import { AttributeCombined } from "../Models/View/AttributeCombined";
import { DerivedCharacteristic } from "../Models/View/DerivedCharacteristic";
import { Race } from "../Models/Wiki/Race";
import { getModifierByActiveLevel, getModifierByIsActive } from "../Utilities/Activatable/activatableModifierUtils";
import { getActiveSelections } from "../Utilities/Activatable/selectionUtils";
import { createMaybeSelector } from "../Utilities/createMaybeSelector";
import { translate } from "../Utilities/I18n";
import { prefixAdv, prefixAttr, prefixDis, prefixSA } from "../Utilities/IDUtils";
import { getAttributeValueWithDefault } from "../Utilities/Increasable/attributeUtils";
import { add, multiply, negate, subtract } from "../Utilities/mathUtils";
import { pipe, pipe_ } from "../Utilities/pipe";
import { isBookEnabled } from "../Utilities/RulesUtils";
import { mapGetToMaybeSlice, mapGetToSliceWithProps } from "../Utilities/SelectorsUtils";
import { getPrimaryBlessedAttribute, getPrimaryMagicalAttribute } from "./attributeSelectors";
import { getCurrentRace } from "./rcpSelectors";
import { getRuleBooksEnabled } from "./rulesSelectors";
import { getMagicalTraditionsFromHero } from "./spellsSelectors";
import { getAddedArcaneEnergyPoints, getAddedKarmaPoints, getAddedLifePoints, getAdvantages, getAttributes, getDisadvantages, getLocaleAsProp, getPermanentArcaneEnergyPoints, getPermanentKarmaPoints, getPermanentLifePoints, getSpecialAbilities } from "./stateSelectors";

const ACA = AttributeCombined.A
const ADA = AttributeDependent.A

export type DCIds = "LP" | "AE" | "KP" | "SPI" | "TOU" | "DO" | "INI" | "MOV" | "WT"
export type DCIdsWithoutWT = "LP" | "AE" | "KP" | "SPI" | "TOU" | "DO" | "INI" | "MOV"
export type EnergyIds = "LP" | "AE" | "KP"

const divideByXAndRound = (x: number) => (a: number) => Math.round (a / x)
const divideBy2AndRound = divideByXAndRound (2)
const divideBy6AndRound = divideByXAndRound (6)

const getFirstLevel =
  pipe (
    bindF (pipe (ActivatableDependent.A.active, listToMaybe)),
    bindF (ActiveObject.A.tier)
  )

export const getLP = createMaybeSelector (
  getCurrentRace,
  mapGetToSliceWithProps (getAttributes) (prefixAttr (7)),
  getPermanentLifePoints,
  mapGetToMaybeSlice (getAdvantages) (prefixAdv (25)),
  mapGetToMaybeSlice (getDisadvantages) (prefixDis (28)),
  getAddedLifePoints,
  getLocaleAsProp,
  (mrace, mcon, plp, minc, mdec, added, l10n) => {
    const base = maybe (0)
                       (pipe (Race.A.lp, add (getAttributeValueWithDefault (mcon) * 2)))
                       (mrace)

    const lost = fmap (PermanentEnergyLoss.A.lost) (plp)
    const mod = getModifierByActiveLevel (fmap (negate) (lost)) (minc) (mdec)

    const value = Just (base + mod + Maybe.sum (added))

    return DerivedCharacteristic<"LP"> ({
      add: Just (Maybe.sum (added)),
      base: Just (base),
      calc: translate (l10n) ("lifepointscalc"),
      currentAdd: Just (Maybe.sum (added)),
      id: "LP",
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
  getPrimaryMagicalAttribute,
  getPermanentArcaneEnergyPoints,
  mapGetToMaybeSlice (getAdvantages) (prefixAdv (23)),
  mapGetToMaybeSlice (getDisadvantages) (prefixDis (26)),
  getAddedArcaneEnergyPoints,
  getLocaleAsProp,
  (mtrads, mprimary, paep, minc, mdec, added, l10n) => {
    const mlast_trad = bind (mtrads) (listToMaybe)

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
            (last_trad => fromMaybe (Pair (20, 0))
                                    (fmapF (mprimary)
                                           (primary => {
                                            const hasTraditionHalfAE =
                                              elem (ActivatableDependent.A.id (last_trad))
                                                   (List (prefixSA (677), prefixSA (678)))

                                            const maxAdd = hasTraditionHalfAE
                                              ? divideBy2AndRound (pipe_ (primary,
                                                                          ACA.stateEntry,
                                                                          ADA.value))
                                              : pipe_ (primary, ACA.stateEntry, ADA.value)

                                            return Pair (maxAdd + 20, maxAdd)
                                          })))

    const value = fmapF (mbaseAndAdd)
                        (pipe (fst, base => base + mod + Maybe.sum (added)))

    return DerivedCharacteristic<"AE"> ({
      add: Just (Maybe.sum (added)),
      base: fmapF (mbaseAndAdd) (fst),
      calc: translate (l10n) ("arcaneenergycalc"),
      currentAdd: Just (Maybe.sum (added)),
      id: "AE",
      maxAdd: Just (Maybe.sum (fmapF (mbaseAndAdd) (snd))),
      mod: Just (mod),
      name: translate (l10n) ("arcaneenergy"),
      permanentLost: Just (Maybe.sum (mlost)),
      permanentRedeemed: Just (Maybe.sum (mredeemed)),
      short: translate (l10n) ("arcaneenergy.short"),
      value,
    })
  }
)

export const getKP = createMaybeSelector (
  getPrimaryBlessedAttribute,
  getPermanentKarmaPoints,
  mapGetToMaybeSlice (getAdvantages) (prefixAdv (24)),
  mapGetToMaybeSlice (getDisadvantages) (prefixDis (27)),
  getAddedKarmaPoints,
  getLocaleAsProp,
  mapGetToMaybeSlice (getSpecialAbilities) (prefixSA (563)),
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

    console.log (showP (mprimary), showP (mbase), showP (value));

    return DerivedCharacteristic<"KP"> ({
      add: Just (Maybe.sum (added)),
      base: mbase,
      calc: translate (l10n) ("karmapointscalc"),
      currentAdd: Just (Maybe.sum (added)),
      id: "KP",
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
  getCurrentRace,
  mapGetToSliceWithProps (getAttributes) (prefixAttr (1)),
  mapGetToSliceWithProps (getAttributes) (prefixAttr (2)),
  mapGetToSliceWithProps (getAttributes) (prefixAttr (3)),
  mapGetToMaybeSlice (getAdvantages) (prefixAdv (26)),
  mapGetToMaybeSlice (getDisadvantages) (prefixDis (29)),
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

    return DerivedCharacteristic<"SPI"> ({
      base: Just (Maybe.sum (mbase)),
      calc: translate (l10n) ("spiritcalc"),
      id: "SPI",
      mod: Just (mod),
      name: translate (l10n) ("spirit"),
      short: translate (l10n) ("spirit.short"),
      value,
    })
  }
)

export const getTOU = createMaybeSelector (
  getCurrentRace,
  mapGetToSliceWithProps (getAttributes) (prefixAttr (7)),
  mapGetToSliceWithProps (getAttributes) (prefixAttr (8)),
  mapGetToMaybeSlice (getAdvantages) (prefixAdv (27)),
  mapGetToMaybeSlice (getDisadvantages) (prefixDis (30)),
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

    return DerivedCharacteristic<"TOU"> ({
      base: Just (Maybe.sum (mbase)),
      calc: translate (l10n) ("toughnesscalc"),
      id: "TOU",
      mod: Just (mod),
      name: translate (l10n) ("toughness"),
      short: translate (l10n) ("toughness.short"),
      value,
    })
  }
)

export const getDO = createMaybeSelector (
  mapGetToSliceWithProps (getAttributes) (prefixAttr (6)),
  mapGetToMaybeSlice (getSpecialAbilities) (prefixSA (64)),
  getLocaleAsProp,
  (magi, mimproved_dodge, l10n) => {
    const base = divideBy2AndRound (getAttributeValueWithDefault (magi))

    const mod = getFirstLevel (mimproved_dodge)

    const value = base + Maybe.sum (mod)

    return DerivedCharacteristic<"DO"> ({
      calc: translate (l10n) ("dodgecalc"),
      id: "DO",
      name: translate (l10n) ("dodge"),
      short: translate (l10n) ("dodge.short"),
      base: Just (base),
      mod,
      value: Just (value),
    })
  }
)

export const getINI = createMaybeSelector (
  mapGetToSliceWithProps (getAttributes) (prefixAttr (1)),
  mapGetToSliceWithProps (getAttributes) (prefixAttr (6)),
  mapGetToMaybeSlice (getSpecialAbilities) (prefixSA (51)),
  getLocaleAsProp,
  (mcou, magi, mcombat_reflexes, l10n) => {
    const base = divideBy2AndRound (
      getAttributeValueWithDefault (mcou) + getAttributeValueWithDefault (magi)
    )

    const mod = getFirstLevel (mcombat_reflexes)

    const value = base + Maybe.sum (mod)

    return DerivedCharacteristic<"INI"> ({
      calc: translate (l10n) ("initiativecalc"),
      id: "INI",
      name: translate (l10n) ("initiative"),
      short: translate (l10n) ("initiative.short"),
      base: Just (base),
      mod,
      value: Just (value),
    })
  }
)

export const getMOV = createMaybeSelector (
  getCurrentRace,
  mapGetToMaybeSlice (getAdvantages) (prefixAdv (9)),
  mapGetToMaybeSlice (getDisadvantages) (prefixDis (51)),
  mapGetToMaybeSlice (getDisadvantages) (prefixDis (4)),
  getLocaleAsProp,
  (mrace, mnimble, mmaimed, mslow, l10n) => {
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

    const mod = getModifierByIsActive (Just (0)) (mnimble) (mslow)

    const value = fmapF (mbase) (add (mod))

    return DerivedCharacteristic<"MOV"> ({
      calc: translate (l10n) ("movementcalc"),
      id: "MOV",
      name: translate (l10n) ("movement"),
      short: translate (l10n) ("movement.short"),
      base: Just (Maybe.sum (mbase)),
      mod: Just (mod),
      value,
    })
  }
)

export const getWT = createMaybeSelector (
  mapGetToSliceWithProps (getAttributes) (prefixAttr (7)),
  mapGetToMaybeSlice (getAdvantages) (prefixAdv (54)),
  mapGetToMaybeSlice (getDisadvantages) (prefixDis (56)),
  getLocaleAsProp,
  (mcon, minc, mdec, l10n) => {
    const base = divideBy2AndRound (getAttributeValueWithDefault (mcon))

    const mod = getModifierByIsActive (Just (0)) (minc) (mdec)

    const value = base + mod

    return DerivedCharacteristic<"WT"> ({
      calc: translate (l10n) ("woundthresholdcalc"),
      id: "WT",
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
  (LP, AE, KP, SPI, TOU, DO, INI, MOV, WT, mrule_books_enabled) => {
    type BaseDerived = Record<DerivedCharacteristic>

    const xs = List<(Pair<DCIds, BaseDerived>)> (
      Pair<DCIds, BaseDerived> (DerivedCharacteristic.A.id (LP), LP),
      Pair<DCIds, BaseDerived> (DerivedCharacteristic.A.id (AE), AE),
      Pair<DCIds, BaseDerived> (DerivedCharacteristic.A.id (KP), KP),
      Pair<DCIds, BaseDerived> (DerivedCharacteristic.A.id (SPI), SPI),
      Pair<DCIds, BaseDerived> (DerivedCharacteristic.A.id (TOU), TOU),
      Pair<DCIds, BaseDerived> (DerivedCharacteristic.A.id (DO), DO),
      Pair<DCIds, BaseDerived> (DerivedCharacteristic.A.id (INI), INI),
      Pair<DCIds, BaseDerived> (DerivedCharacteristic.A.id (MOV), MOV)
    )

    const isWoundThresholdEnabled =
      or (fmapF (mrule_books_enabled)
                (rule_books_enabled => isBookEnabled (rule_books_enabled) ("US25003")))

    if (isWoundThresholdEnabled) {
      return fromList (snoc (xs) (Pair<DCIds, BaseDerived> (DerivedCharacteristic.A.id (WT), WT)))
    }

    return fromList (xs)
  }
)

export const getDerivedCharacteristics = createMaybeSelector (
  getDerivedCharacteristicsMap,
  elems
)
