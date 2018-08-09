import { ActivatableDependent, Energy, EnergyWithLoss, SecondaryAttribute } from '../types/data.d';
import { createMaybeSelector } from '../utils/createMaybeSelector';
import { Just, List, Maybe, OrderedMap, OrderedSet, Record, Tuple } from '../utils/dataUtils';
import { translate } from '../utils/I18n';
import { isActive } from '../utils/isActive';
import { isBookEnabled } from '../utils/RulesUtils';
import { getActiveSelections } from '../utils/selectionUtils';
import { mapGetToSlice } from '../utils/SelectorsUtils';
import { getPrimaryBlessedAttribute, getPrimaryMagicalAttribute } from './attributeSelectors';
import { getCurrentRace } from './rcpSelectors';
import { getRuleBooksEnabled } from './rulesSelectors';
import { getMagicalTraditionsSelector } from './spellsSelectors';
import { getAddedArcaneEnergyPoints, getAddedKarmaPoints, getAddedLifePoints, getAdvantages, getAttributes, getDisadvantages, getLocaleAsProp, getPermanentArcaneEnergyPoints, getPermanentKarmaPoints, getPermanentLifePoints, getSpecialAbilities, getWikiBooks } from './stateSelectors';

export type DCIds = 'LP' | 'AE' | 'KP' | 'SPI' | 'TOU' | 'DO' | 'INI' | 'MOV' | 'WT';
export type DCIdsWithoutWT = 'LP' | 'AE' | 'KP' | 'SPI' | 'TOU' | 'DO' | 'INI' | 'MOV';

const getModifierByActiveLevel = (
  maybeBaseMod: Maybe<number>,
  maybeIncrease: Maybe<Record<ActivatableDependent>>,
  maybeDecrease: Maybe<Record<ActivatableDependent>>
) => {
  const increaseObject = maybeIncrease.bind(increase => increase.get('active').head());
  const decreaseObject = maybeDecrease.bind(decrease => decrease.get('active').head());

  return Maybe.fromMaybe(
    0,
    maybeBaseMod.map(
      baseMod => {
        const increaseTier = increaseObject.bind(obj => obj.lookup('tier'));

        if (Maybe.isJust(increaseTier)) {
          return baseMod + Maybe.fromJust(increaseTier);
        }

        const decreaseTier = decreaseObject.bind(obj => obj.lookup('tier'));

        if (Maybe.isJust(decreaseTier)) {
          return baseMod - Maybe.fromJust(decreaseTier);
        }

        return baseMod;
      }
    )
  );
};

const getModifierByIsActive = (
  maybeBaseMod: Maybe<number>,
  maybeIncrease: Maybe<Record<ActivatableDependent>>,
  maybeDecrease: Maybe<Record<ActivatableDependent>>
) => {
  const hasIncrease = isActive(maybeIncrease);
  const hasDecrease = isActive(maybeDecrease);

  return Maybe.fromMaybe(
    0,
    maybeBaseMod.map(
      baseMod => hasIncrease ? baseMod + 1 : hasDecrease ? baseMod - 1 : baseMod
    )
  );
};

export const getLP = createMaybeSelector(
  getCurrentRace,
  mapGetToSlice(getAttributes, 'ATTR_7'),
  getPermanentLifePoints,
  mapGetToSlice(getAdvantages, 'ADV_25'),
  mapGetToSlice(getDisadvantages, 'DISADV_28'),
  getAddedLifePoints,
  getLocaleAsProp,
  (currentRace, maybeCon, permanentLifePoints, maybeIncrease, maybeDecrease, add, locale) => {
    const base = Maybe.fromMaybe(
      0,
      currentRace.bind(
        race => maybeCon.map(
          con => race.get('lp') + con.get('value') * 2
        )
      )
    );

    const lost = permanentLifePoints.map(permanent => -permanent.get('lost'));
    const mod = getModifierByActiveLevel(lost, maybeIncrease, maybeDecrease);

    const value = Just(base + mod + Maybe.fromMaybe(0, add));

    return Record.ofMaybe<Energy<'LP'>>({
      add: Maybe.fromMaybe(0, add),
      base,
      calc: translate(locale, 'secondaryattributes.lp.calc'),
      currentAdd: Maybe.fromMaybe(0, add),
      id: 'LP',
      maxAdd: Maybe.fromMaybe(0, maybeCon.map(con => con.get('value'))),
      mod,
      name: translate(locale, 'secondaryattributes.lp.name'),
      permanentLost: Maybe.fromMaybe(0, lost),
      short: translate(locale, 'secondaryattributes.lp.short'),
      value,
    });
  }
);

export const getAE = createMaybeSelector(
  getMagicalTraditionsSelector,
  getPrimaryMagicalAttribute,
  getPermanentArcaneEnergyPoints,
  mapGetToSlice(getAdvantages, 'ADV_23'),
  mapGetToSlice(getDisadvantages, 'DISADV_26'),
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
    const maybeLastTradition = maybeTraditions.bind(traditions => traditions.head());

    const maybeRedeemed = permanentArcaneEnergyPoints.map(permanent => permanent.get('redeemed'));
    const maybeLost = permanentArcaneEnergyPoints.map(permanent => permanent.get('lost'));

    const mod = getModifierByActiveLevel(
      maybeRedeemed.bind(redeemed => maybeLost.map(lost => redeemed - lost)),
      maybeIncrease,
      maybeDecrease
    );

    const baseAndAdd = maybeLastTradition.map(
      lastTradition => Maybe.fromMaybe(
        { base: 20, maxAdd: 0 },
        maybePrimary.map(
          primary => {
            const hasTraditionHalfAE = ['SA_677', 'SA_678'].includes(lastTradition.get('id'));

            const maxAdd = hasTraditionHalfAE
              ? Math.round(primary.get('value') / 2)
              : primary.get('value');

            return { base: maxAdd + 20, maxAdd };
          }
        )
      )
    );

    const value = baseAndAdd.map(({ base }) => base + mod + Maybe.fromMaybe(0, add));

    return Record.ofMaybe<EnergyWithLoss<'AE'>>({
      add: Maybe.fromMaybe(0, add),
      base: Maybe.fromMaybe(0, baseAndAdd.map(({ base }) => base)),
      calc: translate(locale, 'secondaryattributes.ae.calc'),
      currentAdd: Maybe.fromMaybe(0, add),
      id: 'AE',
      maxAdd: Maybe.fromMaybe(0, baseAndAdd.map(({ maxAdd }) => maxAdd)),
      mod,
      name: translate(locale, 'secondaryattributes.ae.name'),
      permanentLost: Maybe.fromMaybe(0, maybeLost),
      permanentRedeemed: Maybe.fromMaybe(0, maybeRedeemed),
      short: translate(locale, 'secondaryattributes.ae.short'),
      value,
    });
  }
);

export const getKP = createMaybeSelector(
  getPrimaryBlessedAttribute,
  getPermanentKarmaPoints,
  mapGetToSlice(getAdvantages, 'ADV_24'),
  mapGetToSlice(getDisadvantages, 'DISADV_27'),
  getAddedKarmaPoints,
  getLocaleAsProp,
  mapGetToSlice(getSpecialAbilities, 'SA_563'),
  (
    maybePrimary,
    permanentKarmaPoints,
    maybeIncrease,
    maybeDecrease,
    add,
    locale,
    maybeHighConsecration
  ) => {
    const maybeRedeemed = permanentKarmaPoints.map(permanent => permanent.get('redeemed'));
    const maybeLost = permanentKarmaPoints.map(permanent => permanent.get('lost'));

    const highConsecrationLevel = maybeHighConsecration
      .bind(highConsecration => highConsecration.get('active').head())
      .bind(active => active.lookup('tier'));

    const highConsecrationMod = Maybe.fromMaybe(0, highConsecrationLevel.map(level => level * 6));

    const mod = highConsecrationMod
      + getModifierByActiveLevel(
        maybeRedeemed.bind(redeemed => maybeLost.map(lost => redeemed - lost)),
        maybeIncrease,
        maybeDecrease
      );

    const maybeBase = maybePrimary.map(primary => primary.get('value') + 20);

    const value = maybeBase.map(base => base + mod + Maybe.fromMaybe(0, add));

    return Record.ofMaybe<EnergyWithLoss<'KP'>>({
      add: Maybe.fromMaybe(0, add),
      base: Maybe.fromMaybe(0, maybePrimary.map(primary => primary.get('value') + 20)),
      calc: translate(locale, 'secondaryattributes.kp.calc'),
      currentAdd: Maybe.fromMaybe(0, add),
      id: 'KP',
      maxAdd: Maybe.fromMaybe(0, maybePrimary.map(primary => primary.get('value'))),
      mod,
      name: translate(locale, 'secondaryattributes.kp.name'),
      permanentLost: Maybe.fromMaybe(0, maybeLost),
      permanentRedeemed: Maybe.fromMaybe(0, maybeRedeemed),
      short: translate(locale, 'secondaryattributes.kp.short'),
      value,
    });
  }
);

export const getSPI = createMaybeSelector(
  getCurrentRace,
  mapGetToSlice(getAttributes, 'ATTR_1'),
  mapGetToSlice(getAttributes, 'ATTR_2'),
  mapGetToSlice(getAttributes, 'ATTR_3'),
  mapGetToSlice(getAdvantages, 'ADV_26'),
  mapGetToSlice(getDisadvantages, 'DISADV_29'),
  getLocaleAsProp,
  (maybeCurrentRace, maybeCou, maybeSgc, maybeInt, maybeIncrease, maybeDecrease, locale) => {
    const maybeBase = maybeCurrentRace.bind(
      race => maybeCou.bind(
        cou => maybeSgc.bind(
          sgr => maybeInt.map(
            int => race.get('spi')
              + Math.round((cou.get('value') + sgr.get('value') + int.get('value')) / 6)
          )
        )
      )
    );

    const mod = getModifierByIsActive(Just(0), maybeIncrease, maybeDecrease);

    const value = maybeBase.map(base => base + mod);

    return Record.ofMaybe<SecondaryAttribute<'SPI'>>({
      base: Maybe.fromMaybe(0, maybeBase),
      calc: translate(locale, 'secondaryattributes.spi.calc'),
      id: 'SPI',
      mod,
      name: translate(locale, 'secondaryattributes.spi.name'),
      short: translate(locale, 'secondaryattributes.spi.short'),
      value,
    });
  }
);

export const getTOU = createMaybeSelector(
  getCurrentRace,
  mapGetToSlice(getAttributes, 'ATTR_7'),
  mapGetToSlice(getAttributes, 'ATTR_8'),
  mapGetToSlice(getAdvantages, 'ADV_27'),
  mapGetToSlice(getDisadvantages, 'DISADV_30'),
  getLocaleAsProp,
  (maybeCurrentRace, maybeCon, maybeStr, maybeIncrease, maybeDecrease, locale) => {
    const maybeBase = maybeCurrentRace.bind(
      race => maybeCon.bind(
        con => maybeStr.map(
          str => race.get('tou')
              + Math.round((con.get('value') * 2 + str.get('value')) / 6)
        )
      )
    );

    const mod = getModifierByIsActive(Just(0), maybeIncrease, maybeDecrease);

    const value = maybeBase.map(base => base + mod);

    return Record.ofMaybe<SecondaryAttribute<'TOU'>>({
      base: Maybe.fromMaybe(0, maybeBase),
      calc: translate(locale, 'secondaryattributes.tou.calc'),
      id: 'TOU',
      mod,
      name: translate(locale, 'secondaryattributes.tou.name'),
      short: translate(locale, 'secondaryattributes.tou.short'),
      value,
    });
  }
);

export const getDO = createMaybeSelector(
  mapGetToSlice(getAttributes, 'ATTR_6'),
  mapGetToSlice(getSpecialAbilities, 'SA_64'),
  getLocaleAsProp,
  (maybeAgi, maybeImprovedDodge, locale) => {
    const maybeBase = maybeAgi.map(agi => Math.round(agi.get('value') / 2));

    const mod = Maybe.fromMaybe(
      0,
      maybeImprovedDodge
        .bind(improvedDodge => improvedDodge.get('active').head())
        .bind(obj => obj.lookup('tier'))
    );

    const value = maybeBase.map(base => base + mod);

    return Record.ofMaybe<SecondaryAttribute<'DO'>>({
      calc: translate(locale, 'secondaryattributes.do.calc'),
      id: 'DO',
      name: translate(locale, 'secondaryattributes.do.name'),
      short: translate(locale, 'secondaryattributes.do.short'),
      base: Maybe.fromMaybe(0, maybeBase),
      mod,
      value
    });
  }
);

export const getINI = createMaybeSelector(
  mapGetToSlice(getAttributes, 'ATTR_1'),
  mapGetToSlice(getAttributes, 'ATTR_6'),
  mapGetToSlice(getSpecialAbilities, 'SA_51'),
  getLocaleAsProp,
  (maybeCou, maybeAgi, maybeCombatReflexes, locale) => {
    const maybeBase = maybeCou.bind(
      cou => maybeAgi.map(
        agi => Math.round((cou.get('value') + agi.get('value')) / 2)
      )
    );

    const mod = Maybe.fromMaybe(
      0,
      maybeCombatReflexes
        .bind(combatReflexes => combatReflexes.get('active').head())
        .bind(obj => obj.lookup('tier'))
    );

    const value = maybeBase.map(base => base + mod);

    return Record.ofMaybe<SecondaryAttribute<'INI'>>({
      calc: translate(locale, 'secondaryattributes.ini.calc'),
      id: 'INI',
      name: translate(locale, 'secondaryattributes.ini.name'),
      short: translate(locale, 'secondaryattributes.ini.short'),
      base: Maybe.fromMaybe(0, maybeBase),
      mod,
      value
    });
  }
);

const justTrue = Just(true);

export const getMOV = createMaybeSelector(
  getCurrentRace,
  mapGetToSlice(getAdvantages, 'ADV_9'),
  mapGetToSlice(getDisadvantages, 'DISADV_51'),
  mapGetToSlice(getDisadvantages, 'DISADV_4'),
  getLocaleAsProp,
  (maybeCurrentRace, nimble, maimed, slow, locale) => {
    const maybeBase = maybeCurrentRace.map(race => race.get('mov'))
      .map(
        base => getActiveSelections(maimed).map(list => list.elem(3)).equals(justTrue)
          ? Math.round(base / 2)
          : base
      );

    const mod = getModifierByIsActive(Just(0), nimble, slow);

    const value = maybeBase.map(base => base + mod);

    return Record.ofMaybe<SecondaryAttribute<'MOV'>>({
      calc: translate(locale, 'secondaryattributes.mov.calc'),
      id: 'MOV',
      name: translate(locale, 'secondaryattributes.mov.name'),
      short: translate(locale, 'secondaryattributes.mov.short'),
      base: Maybe.fromMaybe(0, maybeBase),
      mod,
      value
    });
  }
);

export const getWT = createMaybeSelector(
  mapGetToSlice(getAttributes, 'ATTR_7'),
  mapGetToSlice(getAdvantages, 'ADV_54'),
  mapGetToSlice(getDisadvantages, 'DISADV_56'),
  getLocaleAsProp,
  (maybeCon, maybeIncrease, maybeDecrease, locale) => {
    const maybeBase = maybeCon.map(con => Math.round(con.get('value') / 2));

    const mod = getModifierByIsActive(Just(0), maybeIncrease, maybeDecrease);

    const value = maybeBase.map(base => base + mod);

    return Record.ofMaybe<SecondaryAttribute<'WT'>>({
      calc: translate(locale, 'secondaryattributes.ws.calc'),
      id: 'WT',
      name: translate(locale, 'secondaryattributes.ws.name'),
      short: translate(locale, 'secondaryattributes.ws.short'),
      base: Maybe.fromMaybe(0, maybeBase),
      mod,
      value
    });
  }
);

export const getDerivedCharacteristicsMap = createMaybeSelector(
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
    const list = List.of<(Tuple<DCIds, Record<SecondaryAttribute<DCIds>>>)>(
      Tuple.of(LP.get('id'), LP as Record<SecondaryAttribute<DCIds>>),
      Tuple.of(AE.get('id'), AE as Record<SecondaryAttribute<DCIds>>),
      Tuple.of(KP.get('id'), KP as Record<SecondaryAttribute<DCIds>>),
      Tuple.of(SPI.get('id'), SPI as Record<SecondaryAttribute<DCIds>>),
      Tuple.of(TOU.get('id'), TOU as Record<SecondaryAttribute<DCIds>>),
      Tuple.of(DO.get('id'), DO as Record<SecondaryAttribute<DCIds>>),
      Tuple.of(INI.get('id'), INI as Record<SecondaryAttribute<DCIds>>),
      Tuple.of(MOV.get('id'), MOV as Record<SecondaryAttribute<DCIds>>)
    );

    const isWoundThresholdEnabled = Maybe.fromMaybe(
      false,
      maybeRuleBooksEnabled
        .bind(Maybe.ensure((x): x is true | OrderedSet<string> => x !== false))
        .map(ruleBooksEnabled => isBookEnabled(books, ruleBooksEnabled, 'US25003'))
    );

    if (isWoundThresholdEnabled) {
      return OrderedMap.fromList(
        list.append(
          Tuple.of(
            WT.get('id'),
            WT as Record<SecondaryAttribute<DCIds>>
          )
        )
      );
    }

    return OrderedMap.fromList(list);
  }
);

export const getDerivedCharacteristics = createMaybeSelector(
  getDerivedCharacteristicsMap,
  state => state.elems()
);
