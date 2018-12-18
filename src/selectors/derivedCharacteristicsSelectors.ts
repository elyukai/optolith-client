import * as R from 'ramda';
import { Energy, EnergyWithLoss, SecondaryAttribute } from '../types/data';
import { getModifierByActiveLevel, getModifierByIsActive } from '../utils/activatable/activatableModifierUtils';
import { getAttributeValueWithDefault } from '../utils/AttributeUtils';
import { createMaybeSelector } from '../utils/createMaybeSelector';
import { Just, List, Maybe, OrderedMap, OrderedSet, Record, Tuple } from '../utils/dataUtils';
import { translate } from '../utils/I18n';
import { isBookEnabled } from '../utils/RulesUtils';
import { getActiveSelections } from '../utils/selectionUtils';
import { mapGetToMaybeSlice } from '../utils/SelectorsUtils';
import { getPrimaryBlessedAttribute, getPrimaryMagicalAttribute } from './attributeSelectors';
import { getCurrentRace } from './rcpSelectors';
import { getRuleBooksEnabled } from './rulesSelectors';
import { getMagicalTraditionsFromState } from './spellsSelectors';
import { getAddedArcaneEnergyPoints, getAddedKarmaPoints, getAddedLifePoints, getAdvantages, getAttributes, getDisadvantages, getLocaleAsProp, getPermanentArcaneEnergyPoints, getPermanentKarmaPoints, getPermanentLifePoints, getSpecialAbilities, getWikiBooks } from './stateSelectors';

export type DCIds = 'LP' | 'AE' | 'KP' | 'SPI' | 'TOU' | 'DO' | 'INI' | 'MOV' | 'WT';
export type DCIdsWithoutWT = 'LP' | 'AE' | 'KP' | 'SPI' | 'TOU' | 'DO' | 'INI' | 'MOV';

const divideByXAndRound = (x: number) => (a: number) => Math.round (a / x);
const divideBy2AndRound = divideByXAndRound (2);
const divideBy6AndRound = divideByXAndRound (6);

export const getLP = createMaybeSelector (
  getCurrentRace,
  mapGetToMaybeSlice (getAttributes, 'ATTR_7'),
  getPermanentLifePoints,
  mapGetToMaybeSlice (getAdvantages, 'ADV_25'),
  mapGetToMaybeSlice (getDisadvantages, 'DISADV_28'),
  getAddedLifePoints,
  getLocaleAsProp,
  (currentRace, maybeCon, permanentLifePoints, maybeIncrease, maybeDecrease, add, locale) => {
    const base = Maybe.fromMaybe (0) (
      currentRace.fmap (
        race => race.get ('lp') + getAttributeValueWithDefault (maybeCon) * 2
      )
    );

    const lost = permanentLifePoints.fmap (permanent => permanent.get ('lost'));
    const mod = getModifierByActiveLevel (maybeIncrease) (maybeDecrease) (lost .fmap (R.negate));

    const value = Just (base + mod + Maybe.fromMaybe (0) (add));

    return Record.ofMaybe<Energy<'LP'>> ({
      add: Maybe.fromMaybe (0) (add),
      base,
      calc: translate (locale, 'secondaryattributes.lp.calc'),
      currentAdd: Maybe.fromMaybe (0) (add),
      id: 'LP',
      maxAdd: Maybe.fromMaybe (0) (maybeCon.fmap (con => con.get ('value'))),
      mod,
      name: translate (locale, 'secondaryattributes.lp.name'),
      permanentLost: Maybe.fromMaybe (0) (lost),
      short: translate (locale, 'secondaryattributes.lp.short'),
      value,
    });
  }
);

export const getAE = createMaybeSelector (
  getMagicalTraditionsFromState,
  getPrimaryMagicalAttribute,
  getPermanentArcaneEnergyPoints,
  mapGetToMaybeSlice (getAdvantages, 'ADV_23'),
  mapGetToMaybeSlice (getDisadvantages, 'DISADV_26'),
  getAddedArcaneEnergyPoints,
  getLocaleAsProp,
  (
    maybeTraditions,
    maybePrimary,
    permanentArcaneEnergyPoints,
    maybeIncrease,
    maybeDecrease,
    add,
    locale
  ) => {
    const maybeLastTradition = maybeTraditions.bind (Maybe.listToMaybe);

    const maybeRedeemed = permanentArcaneEnergyPoints.fmap (
      permanent => permanent.get ('redeemed')
    );

    const maybeLost = permanentArcaneEnergyPoints.fmap (
      permanent => permanent.get ('lost')
    );

    const mod = getModifierByActiveLevel (maybeIncrease)
                                         (maybeDecrease)
                                         (maybeRedeemed.bind (
                                            redeemed => maybeLost.fmap (R.subtract (redeemed))
                                         ));

    const baseAndAdd = maybeLastTradition.fmap (
      lastTradition => Maybe.fromMaybe ({ base: 20, maxAdd: 0 }) (
        maybePrimary.fmap (
          primary => {
            const hasTraditionHalfAE = ['SA_677', 'SA_678'].includes (lastTradition.get ('id'));

            const maxAdd = hasTraditionHalfAE
              ? Math.round (primary.get ('value') / 2)
              : primary.get ('value');

            return { base: maxAdd + 20, maxAdd };
          }
        )
      )
    );

    const value = baseAndAdd.fmap (({ base }) => base + mod + Maybe.fromMaybe (0) (add));

    return Record.ofMaybe<EnergyWithLoss<'AE'>> ({
      add: Maybe.fromMaybe (0) (add),
      base: baseAndAdd.fmap (({ base }) => base),
      calc: translate (locale, 'secondaryattributes.ae.calc'),
      currentAdd: Maybe.fromMaybe (0) (add),
      id: 'AE',
      maxAdd: Maybe.fromMaybe (0) (baseAndAdd.fmap (({ maxAdd }) => maxAdd)),
      mod,
      name: translate (locale, 'secondaryattributes.ae.name'),
      permanentLost: Maybe.fromMaybe (0) (maybeLost),
      permanentRedeemed: Maybe.fromMaybe (0) (maybeRedeemed),
      short: translate (locale, 'secondaryattributes.ae.short'),
      value,
    });
  }
);

export const getKP = createMaybeSelector (
  getPrimaryBlessedAttribute,
  getPermanentKarmaPoints,
  mapGetToMaybeSlice (getAdvantages, 'ADV_24'),
  mapGetToMaybeSlice (getDisadvantages, 'DISADV_27'),
  getAddedKarmaPoints,
  getLocaleAsProp,
  mapGetToMaybeSlice (getSpecialAbilities, 'SA_563'),
  (
    maybePrimary,
    permanentKarmaPoints,
    maybeIncrease,
    maybeDecrease,
    add,
    locale,
    maybeHighConsecration
  ) => {
    const maybeRedeemed = permanentKarmaPoints.fmap (permanent => permanent.get ('redeemed'));
    const maybeLost = permanentKarmaPoints.fmap (permanent => permanent.get ('lost'));

    const highConsecrationLevel = maybeHighConsecration
      .fmap (highConsecration => highConsecration.get ('active'))
      .bind (Maybe.listToMaybe)
      .bind (active => active.lookup ('tier'));

    const highConsecrationMod = Maybe.fromMaybe (0)
                                                (highConsecrationLevel.fmap (R.multiply (6)));

    const mod = highConsecrationMod
      + getModifierByActiveLevel (maybeIncrease)
                                 (maybeDecrease)
                                 (Maybe.liftM2 (R.subtract) (maybeRedeemed) (maybeLost));

    const maybeBase = maybePrimary.fmap (primary => primary.get ('value') + 20);

    const value = maybeBase.fmap (base => base + mod + Maybe.fromMaybe (0) (add));

    return Record.ofMaybe<EnergyWithLoss<'KP'>> ({
      add: Maybe.fromMaybe (0) (add),
      base: maybePrimary.fmap (primary => primary.get ('value') + 20),
      calc: translate (locale, 'secondaryattributes.kp.calc'),
      currentAdd: Maybe.fromMaybe (0) (add),
      id: 'KP',
      maxAdd: Maybe.fromMaybe (0) (maybePrimary.fmap (primary => primary.get ('value'))),
      mod,
      name: translate (locale, 'secondaryattributes.kp.name'),
      permanentLost: Maybe.fromMaybe (0) (maybeLost),
      permanentRedeemed: Maybe.fromMaybe (0) (maybeRedeemed),
      short: translate (locale, 'secondaryattributes.kp.short'),
      value,
    });
  }
);

export const getSPI = createMaybeSelector (
  getCurrentRace,
  mapGetToMaybeSlice (getAttributes, 'ATTR_1'),
  mapGetToMaybeSlice (getAttributes, 'ATTR_2'),
  mapGetToMaybeSlice (getAttributes, 'ATTR_3'),
  mapGetToMaybeSlice (getAdvantages, 'ADV_26'),
  mapGetToMaybeSlice (getDisadvantages, 'DISADV_29'),
  getLocaleAsProp,
  (maybeCurrentRace, maybeCou, maybeSgc, maybeInt, maybeIncrease, maybeDecrease, locale) => {
    const maybeBase = maybeCurrentRace.fmap (
      race =>
        race.get ('spi') + divideBy6AndRound (
          List.of (maybeCou, maybeSgc, maybeInt)
            .foldl<number> (acc => e => acc + getAttributeValueWithDefault (e)) (0)
        )
    );

    const mod = getModifierByIsActive (maybeIncrease) (maybeDecrease) (Just (0));

    const value = maybeBase .fmap (R.add (mod));

    return Record.ofMaybe<SecondaryAttribute<'SPI'>> ({
      base: Maybe.fromMaybe (0) (maybeBase),
      calc: translate (locale, 'secondaryattributes.spi.calc'),
      id: 'SPI',
      mod: Just (mod),
      name: translate (locale, 'secondaryattributes.spi.name'),
      short: translate (locale, 'secondaryattributes.spi.short'),
      value,
    });
  }
);

export const getTOU = createMaybeSelector (
  getCurrentRace,
  mapGetToMaybeSlice (getAttributes, 'ATTR_7'),
  mapGetToMaybeSlice (getAttributes, 'ATTR_8'),
  mapGetToMaybeSlice (getAdvantages, 'ADV_27'),
  mapGetToMaybeSlice (getDisadvantages, 'DISADV_30'),
  getLocaleAsProp,
  (maybeCurrentRace, maybeCon, maybeStr, maybeIncrease, maybeDecrease, locale) => {
    const maybeBase = maybeCurrentRace
      .fmap (
        race => race .get ('tou') + divideBy6AndRound (
          getAttributeValueWithDefault (maybeCon) * 2 + getAttributeValueWithDefault (maybeStr)
        )
      );

    const mod = getModifierByIsActive (maybeIncrease)
                                      (maybeDecrease)
                                      (Just (0));

    const value = maybeBase .fmap (R.add (mod));

    return Record.ofMaybe<SecondaryAttribute<'TOU'>> ({
      base: Maybe.fromMaybe (0) (maybeBase),
      calc: translate (locale, 'secondaryattributes.tou.calc'),
      id: 'TOU',
      mod: Just (mod),
      name: translate (locale, 'secondaryattributes.tou.name'),
      short: translate (locale, 'secondaryattributes.tou.short'),
      value,
    });
  }
);

export const getDO = createMaybeSelector (
  mapGetToMaybeSlice (getAttributes, 'ATTR_6'),
  mapGetToMaybeSlice (getSpecialAbilities, 'SA_64'),
  getLocaleAsProp,
  (maybeAgi, maybeImprovedDodge, locale) => {
    const base = divideBy2AndRound (getAttributeValueWithDefault (maybeAgi));

    const mod =
      maybeImprovedDodge
        .fmap (improvedDodge => improvedDodge.get ('active'))
        .bind (Maybe.listToMaybe)
        .bind (obj => obj.lookup ('tier'));

    const value = base + Maybe.fromMaybe (0) (mod);

    return Record.ofMaybe<SecondaryAttribute<'DO'>> ({
      calc: translate (locale, 'secondaryattributes.do.calc'),
      id: 'DO',
      name: translate (locale, 'secondaryattributes.do.name'),
      short: translate (locale, 'secondaryattributes.do.short'),
      base,
      mod,
      value,
    });
  }
);

export const getINI = createMaybeSelector (
  mapGetToMaybeSlice (getAttributes, 'ATTR_1'),
  mapGetToMaybeSlice (getAttributes, 'ATTR_6'),
  mapGetToMaybeSlice (getSpecialAbilities, 'SA_51'),
  getLocaleAsProp,
  (maybeCou, maybeAgi, maybeCombatReflexes, locale) => {
    const base = divideBy2AndRound (
      getAttributeValueWithDefault (maybeCou) + getAttributeValueWithDefault (maybeAgi)
    );

    const mod =
      maybeCombatReflexes
        .fmap (combatReflexes => combatReflexes.get ('active'))
        .bind (Maybe.listToMaybe)
        .bind (obj => obj.lookup ('tier'));

    const value = base + Maybe.fromMaybe (0) (mod);

    return Record.ofMaybe<SecondaryAttribute<'INI'>> ({
      calc: translate (locale, 'secondaryattributes.ini.calc'),
      id: 'INI',
      name: translate (locale, 'secondaryattributes.ini.name'),
      short: translate (locale, 'secondaryattributes.ini.short'),
      base,
      mod,
      value,
    });
  }
);

const justTrue = Just (true);

export const getMOV = createMaybeSelector (
  getCurrentRace,
  mapGetToMaybeSlice (getAdvantages, 'ADV_9'),
  mapGetToMaybeSlice (getDisadvantages, 'DISADV_51'),
  mapGetToMaybeSlice (getDisadvantages, 'DISADV_4'),
  getLocaleAsProp,
  (maybeCurrentRace, nimble, maimed, slow, locale) => {
    const maybeBase = maybeCurrentRace.fmap (race => race.get ('mov'))
      .fmap (
        base => getActiveSelections (maimed).fmap (list => list.elem (3)).equals (justTrue)
          ? Math.round (base / 2)
          : base
      );

    const mod = getModifierByIsActive (nimble) (slow) (Just (0));

    const value = maybeBase.fmap (R.add (mod));

    return Record.ofMaybe<SecondaryAttribute<'MOV'>> ({
      calc: translate (locale, 'secondaryattributes.mov.calc'),
      id: 'MOV',
      name: translate (locale, 'secondaryattributes.mov.name'),
      short: translate (locale, 'secondaryattributes.mov.short'),
      base: Maybe.fromMaybe (0) (maybeBase),
      mod: Just (mod),
      value,
    });
  }
);

export const getWT = createMaybeSelector (
  mapGetToMaybeSlice (getAttributes, 'ATTR_7'),
  mapGetToMaybeSlice (getAdvantages, 'ADV_54'),
  mapGetToMaybeSlice (getDisadvantages, 'DISADV_56'),
  getLocaleAsProp,
  (maybeCon, maybeIncrease, maybeDecrease, locale) => {
    const base = divideBy2AndRound (getAttributeValueWithDefault (maybeCon));

    const mod = getModifierByIsActive (maybeIncrease) (maybeDecrease) (Just (0));

    const value = base + mod;

    return Record.ofMaybe<SecondaryAttribute<'WT'>> ({
      calc: translate (locale, 'secondaryattributes.ws.calc'),
      id: 'WT',
      name: translate (locale, 'secondaryattributes.ws.name'),
      short: translate (locale, 'secondaryattributes.ws.short'),
      base,
      mod: Just (mod),
      value,
    });
  }
);

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
    type BaseDerived = Record<SecondaryAttribute<DCIds>>;

    const list = List.of<(Tuple<DCIds, BaseDerived>)> (
      Tuple.of<DCIds, BaseDerived> (LP.get ('id')) (LP as BaseDerived),
      Tuple.of<DCIds, BaseDerived> (AE.get ('id')) (AE as BaseDerived),
      Tuple.of<DCIds, BaseDerived> (KP.get ('id')) (KP as BaseDerived),
      Tuple.of<DCIds, BaseDerived> (SPI.get ('id')) (SPI as BaseDerived),
      Tuple.of<DCIds, BaseDerived> (TOU.get ('id')) (TOU as BaseDerived),
      Tuple.of<DCIds, BaseDerived> (DO.get ('id')) (DO as BaseDerived),
      Tuple.of<DCIds, BaseDerived> (INI.get ('id')) (INI as BaseDerived),
      Tuple.of<DCIds, BaseDerived> (MOV.get ('id')) (MOV as BaseDerived)
    );

    const isWoundThresholdEnabled = Maybe.fromMaybe (false) (
      maybeRuleBooksEnabled
        .bind (Maybe.ensure ((x): x is true | OrderedSet<string> => x !== false))
        .fmap (ruleBooksEnabled => isBookEnabled (books) (ruleBooksEnabled) ('US25003'))
    );

    if (isWoundThresholdEnabled) {
      return OrderedMap.fromList (
        list.append (
          Tuple.of<DCIds, Record<SecondaryAttribute<DCIds>>> (
            WT.get ('id')) (
            WT as Record<SecondaryAttribute<DCIds>>
          )
        )
      );
    }

    return OrderedMap.fromList (list);
  }
);

export const getDerivedCharacteristics = createMaybeSelector (
  getDerivedCharacteristicsMap,
  OrderedMap.elems
);
