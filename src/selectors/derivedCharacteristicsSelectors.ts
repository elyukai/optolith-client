import R from 'ramda';
import { AttributeDependent, Energy, EnergyWithLoss, SecondaryAttribute } from '../types/data';
import { Race } from '../types/wiki';
import { getModifierByActiveLevel, getModifierByIsActive } from '../utils/activatableModifierUtils';
import { createMaybeSelector } from '../utils/createMaybeSelector';
import { Just, List, Maybe, OrderedMap, OrderedSet, Record, Tuple } from '../utils/dataUtils';
import { translate } from '../utils/I18n';
import { isBookEnabled } from '../utils/RulesUtils';
import { getActiveSelections } from '../utils/selectionUtils';
import { mapGetToSlice } from '../utils/SelectorsUtils';
import { getPrimaryBlessedAttribute, getPrimaryMagicalAttribute } from './attributeSelectors';
import { getCurrentRace } from './rcpSelectors';
import { getRuleBooksEnabled } from './rulesSelectors';
import { getMagicalTraditionsFromState } from './spellsSelectors';
import { getAddedArcaneEnergyPoints, getAddedKarmaPoints, getAddedLifePoints, getAdvantages, getAttributes, getDisadvantages, getLocaleAsProp, getPermanentArcaneEnergyPoints, getPermanentKarmaPoints, getPermanentLifePoints, getSpecialAbilities, getWikiBooks } from './stateSelectors';

export type DCIds = 'LP' | 'AE' | 'KP' | 'SPI' | 'TOU' | 'DO' | 'INI' | 'MOV' | 'WT';
export type DCIdsWithoutWT = 'LP' | 'AE' | 'KP' | 'SPI' | 'TOU' | 'DO' | 'INI' | 'MOV';

export const getLP = createMaybeSelector (
  getCurrentRace,
  mapGetToSlice (getAttributes, 'ATTR_7'),
  getPermanentLifePoints,
  mapGetToSlice (getAdvantages, 'ADV_25'),
  mapGetToSlice (getDisadvantages, 'DISADV_28'),
  getAddedLifePoints,
  getLocaleAsProp,
  (currentRace, maybeCon, permanentLifePoints, maybeIncrease, maybeDecrease, add, locale) => {
    const base = Maybe.fromMaybe (0) (
      currentRace.bind (
        race => maybeCon.fmap (
          con => race.get ('lp') + con.get ('value') * 2
        )
      )
    );

    const lost = permanentLifePoints.fmap (permanent => -permanent.get ('lost'));
    const mod = getModifierByActiveLevel (maybeIncrease) (maybeDecrease) (lost);

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
  mapGetToSlice (getAdvantages, 'ADV_23'),
  mapGetToSlice (getDisadvantages, 'DISADV_26'),
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
      base: Maybe.fromMaybe (0) (baseAndAdd.fmap (({ base }) => base)),
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
  mapGetToSlice (getAdvantages, 'ADV_24'),
  mapGetToSlice (getDisadvantages, 'DISADV_27'),
  getAddedKarmaPoints,
  getLocaleAsProp,
  mapGetToSlice (getSpecialAbilities, 'SA_563'),
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
      base: Maybe.fromMaybe (0) (maybePrimary.fmap (primary => primary.get ('value') + 20)),
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
  mapGetToSlice (getAttributes, 'ATTR_1'),
  mapGetToSlice (getAttributes, 'ATTR_2'),
  mapGetToSlice (getAttributes, 'ATTR_3'),
  mapGetToSlice (getAdvantages, 'ADV_26'),
  mapGetToSlice (getDisadvantages, 'DISADV_29'),
  getLocaleAsProp,
  (maybeCurrentRace, maybeCou, maybeSgc, maybeInt, maybeIncrease, maybeDecrease, locale) => {
    const maybeBase = maybeCurrentRace.bind (
      race => maybeCou.bind (
        cou => maybeSgc.bind (
          sgr => maybeInt.fmap (
            int => race.get ('spi')
              + Math.round ((cou.get ('value') + sgr.get ('value') + int.get ('value')) / 6)
          )
        )
      )
    );

    const mod = getModifierByIsActive (maybeIncrease) (maybeDecrease) (Just (0));

    const value = maybeBase.fmap (R.add (mod));

    return Record.ofMaybe<SecondaryAttribute<'SPI'>> ({
      base: Maybe.fromMaybe (0) (maybeBase),
      calc: translate (locale, 'secondaryattributes.spi.calc'),
      id: 'SPI',
      mod,
      name: translate (locale, 'secondaryattributes.spi.name'),
      short: translate (locale, 'secondaryattributes.spi.short'),
      value,
    });
  }
);

const getTOUBase = (
  (race: Record<Race>) =>
    (con: Record<AttributeDependent>) =>
      (str: Record<AttributeDependent>) =>
        race.get ('tou') + Math.round ((con.get ('value') * 2 + str.get ('value')) / 6)
);

export const getTOU = createMaybeSelector (
  getCurrentRace,
  mapGetToSlice (getAttributes, 'ATTR_7'),
  mapGetToSlice (getAttributes, 'ATTR_8'),
  mapGetToSlice (getAdvantages, 'ADV_27'),
  mapGetToSlice (getDisadvantages, 'DISADV_30'),
  getLocaleAsProp,
  (maybeCurrentRace, maybeCon, maybeStr, maybeIncrease, maybeDecrease, locale) => {
    const maybeBase = Maybe.liftM3 (getTOUBase)
                                   (maybeCurrentRace)
                                   (maybeCon)
                                   (maybeStr);

    const mod = getModifierByIsActive (maybeIncrease)
                                      (maybeDecrease)
                                      (Just (0));

    const value = maybeBase.fmap (R.add (mod));

    return Record.ofMaybe<SecondaryAttribute<'TOU'>> ({
      base: Maybe.fromMaybe (0) (maybeBase),
      calc: translate (locale, 'secondaryattributes.tou.calc'),
      id: 'TOU',
      mod,
      name: translate (locale, 'secondaryattributes.tou.name'),
      short: translate (locale, 'secondaryattributes.tou.short'),
      value,
    });
  }
);

export const getDO = createMaybeSelector (
  mapGetToSlice (getAttributes, 'ATTR_6'),
  mapGetToSlice (getSpecialAbilities, 'SA_64'),
  getLocaleAsProp,
  (maybeAgi, maybeImprovedDodge, locale) => {
    const maybeBase = maybeAgi.fmap (agi => Math.round (agi.get ('value') / 2));

    const mod = Maybe.fromMaybe (0) (
      maybeImprovedDodge
        .fmap (improvedDodge => improvedDodge.get ('active'))
        .bind (Maybe.listToMaybe)
        .bind (obj => obj.lookup ('tier'))
    );

    const value = maybeBase.fmap (base => base + mod);

    return Record.ofMaybe<SecondaryAttribute<'DO'>> ({
      calc: translate (locale, 'secondaryattributes.do.calc'),
      id: 'DO',
      name: translate (locale, 'secondaryattributes.do.name'),
      short: translate (locale, 'secondaryattributes.do.short'),
      base: Maybe.fromMaybe (0) (maybeBase),
      mod,
      value
    });
  }
);

const getINIBase = (
  (cou: Record<AttributeDependent>) =>
    (agi: Record<AttributeDependent>) =>
      Math.round ((cou.get ('value') + agi.get ('value')) / 2)
);

export const getINI = createMaybeSelector (
  mapGetToSlice (getAttributes, 'ATTR_1'),
  mapGetToSlice (getAttributes, 'ATTR_6'),
  mapGetToSlice (getSpecialAbilities, 'SA_51'),
  getLocaleAsProp,
  (maybeCou, maybeAgi, maybeCombatReflexes, locale) => {
    const maybeBase = Maybe.liftM2 (getINIBase)
                                   (maybeCou)
                                   (maybeAgi);

    const mod = Maybe.fromMaybe (0) (
      maybeCombatReflexes
        .fmap (combatReflexes => combatReflexes.get ('active'))
        .bind (Maybe.listToMaybe)
        .bind (obj => obj.lookup ('tier'))
    );

    const value = maybeBase.fmap (R.add (mod));

    return Record.ofMaybe<SecondaryAttribute<'INI'>> ({
      calc: translate (locale, 'secondaryattributes.ini.calc'),
      id: 'INI',
      name: translate (locale, 'secondaryattributes.ini.name'),
      short: translate (locale, 'secondaryattributes.ini.short'),
      base: Maybe.fromMaybe (0) (maybeBase),
      mod,
      value
    });
  }
);

const justTrue = Just (true);

export const getMOV = createMaybeSelector (
  getCurrentRace,
  mapGetToSlice (getAdvantages, 'ADV_9'),
  mapGetToSlice (getDisadvantages, 'DISADV_51'),
  mapGetToSlice (getDisadvantages, 'DISADV_4'),
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
      mod,
      value
    });
  }
);

export const getWT = createMaybeSelector (
  mapGetToSlice (getAttributes, 'ATTR_7'),
  mapGetToSlice (getAdvantages, 'ADV_54'),
  mapGetToSlice (getDisadvantages, 'DISADV_56'),
  getLocaleAsProp,
  (maybeCon, maybeIncrease, maybeDecrease, locale) => {
    const maybeBase = maybeCon.fmap (con => Math.round (con.get ('value') / 2));

    const mod = getModifierByIsActive (maybeIncrease) (maybeDecrease) (Just (0));

    const value = maybeBase.fmap (R.add (mod));

    return Record.ofMaybe<SecondaryAttribute<'WT'>> ({
      calc: translate (locale, 'secondaryattributes.ws.calc'),
      id: 'WT',
      name: translate (locale, 'secondaryattributes.ws.name'),
      short: translate (locale, 'secondaryattributes.ws.short'),
      base: Maybe.fromMaybe (0) (maybeBase),
      mod,
      value
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
