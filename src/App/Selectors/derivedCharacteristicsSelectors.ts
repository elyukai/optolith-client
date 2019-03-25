import { fmap, fmapF } from "../../Data/Functor";
import { elem, List } from "../../Data/List";
import { bind, fromMaybe, Just, liftM2, listToMaybe, maybe, Maybe, Nothing } from "../../Data/Maybe";
import { ActivatableDependent } from "../Models/ActiveEntries/ActivatableDependent";
import { AttributeDependent } from "../Models/ActiveEntries/AttributeDependent";
import { PermanentEnergyLoss } from "../Models/Hero/PermanentEnergyLoss";
import { PermanentEnergyLossAndBoughtBack } from "../Models/Hero/PermanentEnergyLossAndBoughtBack";
import { DerivedCharacteristic } from "../Models/View/DerivedCharacteristic";
import { Race } from "../Models/Wiki/Race";
import { getModifierByActiveLevel, getModifierByIsActive } from "../Utilities/Activatable/activatableModifierUtils";
import { getActiveSelections } from "../Utilities/Activatable/selectionUtils";
import { createMaybeSelector } from "../Utilities/createMaybeSelector";
import { translate } from "../Utilities/I18n";
import { getAttributeValueWithDefault } from "../Utilities/Increasable/attributeUtils";
import { add, negate, subtract } from "../Utilities/mathUtils";
import { pipe } from "../Utilities/pipe";
import { isBookEnabled } from "../Utilities/RulesUtils";
import { mapGetToMaybeSlice } from "../Utilities/SelectorsUtils";
import { getPrimaryBlessedAttribute, getPrimaryMagicalAttribute } from "./attributeSelectors";
import { getCurrentRace } from "./rcpSelectors";
import { getRuleBooksEnabled } from "./rulesSelectors";
import { getMagicalTraditionsFromState } from "./spellsSelectors";
import { getAddedArcaneEnergyPoints, getAddedKarmaPoints, getAddedLifePoints, getAdvantages, getAttributes, getDisadvantages, getLocaleAsProp, getPermanentArcaneEnergyPoints, getPermanentKarmaPoints, getPermanentLifePoints, getSpecialAbilities, getWikiBooks } from "./stateSelectors";

export type DCIds = "LP" | "AE" | "KP" | "SPI" | "TOU" | "DO" | "INI" | "MOV" | "WT"
export type DCIdsWithoutWT = "LP" | "AE" | "KP" | "SPI" | "TOU" | "DO" | "INI" | "MOV"

const divideByXAndRound = (x: number) => (a: number) => Math.round (a / x)
const divideBy2AndRound = divideByXAndRound (2)
const divideBy6AndRound = divideByXAndRound (6)

export const getLP = createMaybeSelector (
  getCurrentRace,
  mapGetToMaybeSlice (getAttributes) ("ATTR_7"),
  getPermanentLifePoints,
  mapGetToMaybeSlice (getAdvantages) ("ADV_25"),
  mapGetToMaybeSlice (getDisadvantages) ("DISADV_28"),
  getAddedLifePoints,
  getLocaleAsProp,
  (mrace, mcon, plp, minc, mdec, added, l10n) => {
    const base = maybe (0)
                       (pipe (Race.A_.lp, add (getAttributeValueWithDefault (mcon) * 2)))
                       (mrace)

    const lost = fmap (PermanentEnergyLoss.A_.lost) (plp)
    const mod = getModifierByActiveLevel (fmap (negate) (lost)) (minc) (mdec)

    const value = Just (base + mod + Maybe.sum (added))

    return DerivedCharacteristic<"LP"> ({
      add: Just (Maybe.sum (added)),
      base: Just (base),
      calc: translate (l10n) ("lifepointscalc"),
      currentAdd: Just (Maybe.sum (added)),
      id: "LP",
      maxAdd: Just (Maybe.sum (fmap (AttributeDependent.A_.value) (mcon))),
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
  getMagicalTraditionsFromState,
  getPrimaryMagicalAttribute,
  getPermanentArcaneEnergyPoints,
  mapGetToMaybeSlice (getAdvantages) ("ADV_23"),
  mapGetToMaybeSlice (getDisadvantages) ("DISADV_26"),
  getAddedArcaneEnergyPoints,
  getLocaleAsProp,
  (mtrads, mprimary, paep, minc, mdec, added, l10n) => {
    const mlast_trad = bind (mtrads) (listToMaybe)

    const mredeemed = fmap (PermanentEnergyLossAndBoughtBack.A_.redeemed) (paep)

    const mlost = fmap (PermanentEnergyLossAndBoughtBack.A_.lost) (paep)

    const mod = getModifierByActiveLevel (liftM2 (subtract) (mredeemed) (mlost))
                                         (minc)
                                         (mdec)

    const baseAndAdd =
      fmapF (mlast_trad)
            (last_trad => fromMaybe ({ base: 20, maxAdd: 0 })
                                    (fmapF (mprimary)
                                           (primary => {
                                            const hasTraditionHalfAE =
                                              elem (ActivatableDependent.A_.id (last_trad))
                                                   (List ("SA_677", "SA_678"))

                                            const maxAdd = hasTraditionHalfAE
                                              ? Math.round (primary.get ("value") / 2)
                                              : primary.get ("value")

                                            return { base: maxAdd + 20, maxAdd }
                                          })))
          .fmap (
      lastTradition => Maybe.fromMaybe ({ base: 20, maxAdd: 0 }) (
        mprimary.fmap (
          primary => {
            const hasTraditionHalfAE = ["SA_677", "SA_678"].includes (lastTradition.get ("id"))

            const maxAdd = hasTraditionHalfAE
              ? Math.round (primary.get ("value") / 2)
              : primary.get ("value")

            return { base: maxAdd + 20, maxAdd }
          }
        )
      )
    )

    const value = baseAndAdd.fmap (({ base }) => base + mod + Maybe.fromMaybe (0) (added))

    return Record.ofMaybe<EnergyWithLoss<"AE">> ({
      add: Maybe.fromMaybe (0) (added),
      base: baseAndAdd.fmap (({ base }) => base),
      calc: translate (l10n) ("secondaryattributes.ae.calc"),
      currentAdd: Maybe.fromMaybe (0) (added),
      id: "AE",
      maxAdd: Maybe.fromMaybe (0) (baseAndAdd.fmap (({ maxAdd }) => maxAdd)),
      mod,
      name: translate (l10n) ("secondaryattributes.ae.name"),
      permanentLost: Maybe.fromMaybe (0) (mlost),
      permanentRedeemed: Maybe.fromMaybe (0) (mredeemed),
      short: translate (l10n) ("secondaryattributes.ae.short"),
      value,
    })
  }
)

export const getKP = createMaybeSelector (
  getPrimaryBlessedAttribute,
  getPermanentKarmaPoints,
  mapGetToMaybeSlice (getAdvantages) ("ADV_24"),
  mapGetToMaybeSlice (getDisadvantages) ("DISADV_27"),
  getAddedKarmaPoints,
  getLocaleAsProp,
  mapGetToMaybeSlice (getSpecialAbilities) ("SA_563"),
  (
    maybePrimary,
    permanentKarmaPoints,
    maybeIncrease,
    maybeDecrease,
    add,
    locale,
    maybeHighConsecration
  ) => {
    const maybeRedeemed = permanentKarmaPoints.fmap (permanent => permanent.get ("redeemed"))
    const maybeLost = permanentKarmaPoints.fmap (permanent => permanent.get ("lost"))

    const highConsecrationLevel = maybeHighConsecration
      .fmap (highConsecration => highConsecration.get ("active"))
      .bind (Maybe.listToMaybe)
      .bind (active => active.lookup ("tier"))

    const highConsecrationMod = Maybe.fromMaybe (0)
                                                (highConsecrationLevel.fmap (R.multiply (6)))

    const mod = highConsecrationMod
      + getModifierByActiveLevel (maybeIncrease)
                                 (maybeDecrease)
                                 (Maybe.liftM2 (R.subtract) (maybeRedeemed) (maybeLost))

    const maybeBase = maybePrimary.fmap (primary => primary.get ("value") + 20)

    const value = maybeBase.fmap (base => base + mod + Maybe.fromMaybe (0) (add))

    return Record.ofMaybe<EnergyWithLoss<"KP">> ({
      add: Maybe.fromMaybe (0) (add),
      base: maybePrimary.fmap (primary => primary.get ("value") + 20),
      calc: translate (locale) ("secondaryattributes.kp.calc"),
      currentAdd: Maybe.fromMaybe (0) (add),
      id: "KP",
      maxAdd: Maybe.fromMaybe (0) (maybePrimary.fmap (primary => primary.get ("value"))),
      mod,
      name: translate (locale) ("secondaryattributes.kp.name"),
      permanentLost: Maybe.fromMaybe (0) (maybeLost),
      permanentRedeemed: Maybe.fromMaybe (0) (maybeRedeemed),
      short: translate (locale) ("secondaryattributes.kp.short"),
      value,
    })
  }
)

export const getSPI = createMaybeSelector (
  getCurrentRace,
  mapGetToMaybeSlice (getAttributes) ("ATTR_1"),
  mapGetToMaybeSlice (getAttributes) ("ATTR_2"),
  mapGetToMaybeSlice (getAttributes) ("ATTR_3"),
  mapGetToMaybeSlice (getAdvantages) ("ADV_26"),
  mapGetToMaybeSlice (getDisadvantages) ("DISADV_29"),
  getLocaleAsProp,
  (maybeCurrentRace, maybeCou, maybeSgc, maybeInt, maybeIncrease, maybeDecrease, locale) => {
    const maybeBase = maybeCurrentRace.fmap (
      race =>
        race.get ("spi") + divideBy6AndRound (
          List.of (maybeCou, maybeSgc, maybeInt)
            .foldl<number> (acc => e => acc + getAttributeValueWithDefault (e)) (0)
        )
    )

    const mod = getModifierByIsActive (maybeIncrease) (maybeDecrease) (Just (0))

    const value = maybeBase .fmap (R.add (mod))

    return Record.ofMaybe<DerivedCharacteristic<"SPI">> ({
      base: Maybe.fromMaybe (0) (maybeBase),
      calc: translate (locale) ("secondaryattributes.spi.calc"),
      id: "SPI",
      mod: Just (mod),
      name: translate (locale) ("secondaryattributes.spi.name"),
      short: translate (locale) ("secondaryattributes.spi.short"),
      value,
    })
  }
)

export const getTOU = createMaybeSelector (
  getCurrentRace,
  mapGetToMaybeSlice (getAttributes, "ATTR_7"),
  mapGetToMaybeSlice (getAttributes, "ATTR_8"),
  mapGetToMaybeSlice (getAdvantages, "ADV_27"),
  mapGetToMaybeSlice (getDisadvantages, "DISADV_30"),
  getLocaleAsProp,
  (maybeCurrentRace, maybeCon, maybeStr, maybeIncrease, maybeDecrease, locale) => {
    const maybeBase = maybeCurrentRace
      .fmap (
        race => race .get ("tou") + divideBy6AndRound (
          getAttributeValueWithDefault (maybeCon) * 2 + getAttributeValueWithDefault (maybeStr)
        )
      )

    const mod = getModifierByIsActive (maybeIncrease)
                                      (maybeDecrease)
                                      (Just (0))

    const value = maybeBase .fmap (R.add (mod))

    return Record.ofMaybe<DerivedCharacteristic<"TOU">> ({
      base: Maybe.fromMaybe (0) (maybeBase),
      calc: translate (locale, "secondaryattributes.tou.calc"),
      id: "TOU",
      mod: Just (mod),
      name: translate (locale) ("secondaryattributes.tou.name"),
      short: translate (locale) ("secondaryattributes.tou.short"),
      value,
    })
  }
)

export const getDO = createMaybeSelector (
  mapGetToMaybeSlice (getAttributes) ("ATTR_6"),
  mapGetToMaybeSlice (getSpecialAbilities) ("SA_64"),
  getLocaleAsProp,
  (maybeAgi, maybeImprovedDodge, locale) => {
    const base = divideBy2AndRound (getAttributeValueWithDefault (maybeAgi))

    const mod =
      maybeImprovedDodge
        .fmap (improvedDodge => improvedDodge.get ("active"))
        .bind (Maybe.listToMaybe)
        .bind (obj => obj.lookup ("tier"))

    const value = base + Maybe.fromMaybe (0) (mod)

    return Record.ofMaybe<DerivedCharacteristic<"DO">> ({
      calc: translate (locale) ("secondaryattributes.do.calc"),
      id: "DO",
      name: translate (locale) ("secondaryattributes.do.name"),
      short: translate (locale) ("secondaryattributes.do.short"),
      base,
      mod,
      value,
    })
  }
)

export const getINI = createMaybeSelector (
  mapGetToMaybeSlice (getAttributes) ("ATTR_1"),
  mapGetToMaybeSlice (getAttributes) ("ATTR_6"),
  mapGetToMaybeSlice (getSpecialAbilities) ("SA_51"),
  getLocaleAsProp,
  (maybeCou, maybeAgi, maybeCombatReflexes, locale) => {
    const base = divideBy2AndRound (
      getAttributeValueWithDefault (maybeCou) + getAttributeValueWithDefault (maybeAgi)
    )

    const mod =
      maybeCombatReflexes
        .fmap (combatReflexes => combatReflexes.get ("active"))
        .bind (Maybe.listToMaybe)
        .bind (obj => obj.lookup ("tier"))

    const value = base + Maybe.fromMaybe (0) (mod)

    return Record.ofMaybe<DerivedCharacteristic<"INI">> ({
      calc: translate (locale) ("secondaryattributes.ini.calc"),
      id: "INI",
      name: translate (locale) ("secondaryattributes.ini.name"),
      short: translate (locale) ("secondaryattributes.ini.short"),
      base,
      mod,
      value,
    })
  }
)

const justTrue = Just (true)

export const getMOV = createMaybeSelector (
  getCurrentRace,
  mapGetToMaybeSlice (getAdvantages) ("ADV_9"),
  mapGetToMaybeSlice (getDisadvantages) ("DISADV_51"),
  mapGetToMaybeSlice (getDisadvantages) ("DISADV_4"),
  getLocaleAsProp,
  (maybeCurrentRace, nimble, maimed, slow, locale) => {
    const maybeBase = maybeCurrentRace.fmap (race => race.get ("mov"))
      .fmap (
        base => getActiveSelections (maimed).fmap (list => list.elem (3)).equals (justTrue)
          ? Math.round (base / 2)
          : base
      )

    const mod = getModifierByIsActive (nimble) (slow) (Just (0))

    const value = maybeBase.fmap (R.add (mod))

    return Record.ofMaybe<DerivedCharacteristic<"MOV">> ({
      calc: translate (locale) ("secondaryattributes.mov.calc"),
      id: "MOV",
      name: translate (locale) ("secondaryattributes.mov.name"),
      short: translate (locale) ("secondaryattributes.mov.short"),
      base: Maybe.fromMaybe (0) (maybeBase),
      mod: Just (mod),
      value,
    })
  }
)

export const getWT = createMaybeSelector (
  mapGetToMaybeSlice (getAttributes) ("ATTR_7"),
  mapGetToMaybeSlice (getAdvantages) ("ADV_54"),
  mapGetToMaybeSlice (getDisadvantages) ("DISADV_56"),
  getLocaleAsProp,
  (maybeCon, maybeIncrease, maybeDecrease, locale) => {
    const base = divideBy2AndRound (getAttributeValueWithDefault (maybeCon))

    const mod = getModifierByIsActive (maybeIncrease) (maybeDecrease) (Just (0))

    const value = base + mod

    return Record.ofMaybe<DerivedCharacteristic<"WT">> ({
      calc: translate (locale) ("secondaryattributes.ws.calc"),
      id: "WT",
      name: translate (locale) ("secondaryattributes.ws.name"),
      short: translate (locale) ("secondaryattributes.ws.short"),
      base,
      mod: Just (mod),
      value,
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
  getWikiBooks,
  getRuleBooksEnabled,
  (LP, AE, KP, SPI, TOU, DO, INI, MOV, WT, books, maybeRuleBooksEnabled) => {
    type BaseDerived = Record<DerivedCharacteristic<DCIds>>

    const list = List.of<(Tuple<DCIds, BaseDerived>)> (
      Tuple.of<DCIds, BaseDerived> (LP.get ("id")) (LP as BaseDerived),
      Tuple.of<DCIds, BaseDerived> (AE.get ("id")) (AE as BaseDerived),
      Tuple.of<DCIds, BaseDerived> (KP.get ("id")) (KP as BaseDerived),
      Tuple.of<DCIds, BaseDerived> (SPI.get ("id")) (SPI as BaseDerived),
      Tuple.of<DCIds, BaseDerived> (TOU.get ("id")) (TOU as BaseDerived),
      Tuple.of<DCIds, BaseDerived> (DO.get ("id")) (DO as BaseDerived),
      Tuple.of<DCIds, BaseDerived> (INI.get ("id")) (INI as BaseDerived),
      Tuple.of<DCIds, BaseDerived> (MOV.get ("id")) (MOV as BaseDerived)
    )

    const isWoundThresholdEnabled = Maybe.fromMaybe (false) (
      maybeRuleBooksEnabled
        .bind (Maybe.ensure ((x): x is true | OrderedSet<string> => x !== false))
        .fmap (ruleBooksEnabled => isBookEnabled (books) (ruleBooksEnabled) ("US25003"))
    )

    if (isWoundThresholdEnabled) {
      return OrderedMap.fromList (
        list.append (
          Tuple.of<DCIds, Record<DerivedCharacteristic<DCIds>>> (
            WT.get ("id")) (
            WT as Record<DerivedCharacteristic<DCIds>>
          )
        )
      )
    }

    return OrderedMap.fromList (list)
  }
)

export const getDerivedCharacteristics = createMaybeSelector (
  getDerivedCharacteristicsMap,
  OrderedMap.elems
)
