import { createSelector } from 'reselect';
import { Energy, EnergyWithLoss, SecondaryAttribute } from '../types/data.d';
import { getSids, isActive } from '../utils/ActivatableUtils';
import { _translate } from '../utils/I18n';
import { mapGetToSlice } from '../utils/SelectorsUtils';
import { getPrimaryBlessedAttribute, getPrimaryMagicalAttribute } from './attributeSelectors';
import { getRuleBooksEnabled } from './rulesSelectors';
import { getMagicalTraditions } from './spellsSelectors';
import { getAddedArcaneEnergyPoints, getAddedKarmaPoints, getAddedLifePoints, getAdvantages, getAttributes, getBooks, getCurrentRaceId, getDisadvantages, getLocaleMessages, getPermanentArcaneEnergyPoints, getPermanentKarmaPoints, getPermanentLifePoints, getRaces, getSpecialAbilities } from './stateSelectors';
import { isBookEnabled } from '../utils/RulesUtils';

export type DCIds = 'LP' | 'AE' | 'KP' | 'SPI' | 'TOU' | 'DO' | 'INI' | 'MOV' | 'WT';
export type DCIdsWithoutWT = 'LP' | 'AE' | 'KP' | 'SPI' | 'TOU' | 'DO' | 'INI' | 'MOV';

export const getLP = createSelector(
  getRaces,
  getCurrentRaceId,
  mapGetToSlice(getAttributes, 'ATTR_7'),
  getPermanentLifePoints,
  mapGetToSlice(getAdvantages, 'ADV_25'),
  mapGetToSlice(getDisadvantages, 'DISADV_28'),
  getAddedLifePoints,
  getLocaleMessages,
  (races, currentRaceId, CON, { lost }, increase, decrease, add, locale) => {
    const currentRace = currentRaceId && races.get(currentRaceId);
    const increaseObject = increase && increase.active[0];
    const decreaseObject = decrease && decrease.active[0];
    const base = currentRace && CON && currentRace.lp + CON.value * 2 || 0;
    let mod = -lost;

    if (increaseObject && increaseObject.tier) {
      mod += increaseObject.tier;
    }
    else if (decreaseObject && decreaseObject.tier) {
      mod -= decreaseObject.tier;
    }

    const value = base + mod + add;

    return {
      add,
      base,
      calc: _translate(locale, 'secondaryattributes.lp.calc'),
      currentAdd: add,
      id: 'LP',
      maxAdd: CON ? CON.value : 0,
      mod,
      name: _translate(locale, 'secondaryattributes.lp.name'),
      permanentLost: lost,
      short: _translate(locale, 'secondaryattributes.lp.short'),
      value,
    } as Energy<'LP'>;
  }
);

export const getAE = createSelector(
  getMagicalTraditions,
  getPrimaryMagicalAttribute,
  getPermanentArcaneEnergyPoints,
  mapGetToSlice(getAdvantages, 'ADV_23'),
  mapGetToSlice(getDisadvantages, 'DISADV_26'),
  getAddedArcaneEnergyPoints,
  getLocaleMessages,
  (tradition, primary, { lost, redeemed }, increase, decrease, add, locale) => {
    const lastTradition = tradition[0];
    const increaseObject = increase && increase.active[0];
    const decreaseObject = decrease && decrease.active[0];
    let base = 0;
    let mod = redeemed - lost;
    let maxAdd = 0;

    if (lastTradition !== undefined) {
      base = 20;

      if (primary !== undefined) {
        const hasTraditionHalfAE = ['SA_677', 'SA_678'].includes(lastTradition.id);

        if (hasTraditionHalfAE) {
          maxAdd = Math.round(primary.value / 2);
        }
        else {
          maxAdd = primary.value;
        }

        base += maxAdd;
      }
    }

    if (increaseObject && increaseObject.tier) {
      mod += increaseObject.tier;
    }
    else if (decreaseObject && decreaseObject.tier) {
      mod -= decreaseObject.tier;
    }

    const value = base > 0 ? base + mod + add : undefined;

    return {
      add,
      base,
      calc: _translate(locale, 'secondaryattributes.ae.calc'),
      currentAdd: add,
      id: 'AE',
      maxAdd,
      mod,
      name: _translate(locale, 'secondaryattributes.ae.name'),
      permanentLost: lost,
      permanentRedeemed: redeemed,
      short: _translate(locale, 'secondaryattributes.ae.short'),
      value,
    } as EnergyWithLoss<'AE'>;
  }
);

export const getKP = createSelector(
  getPrimaryBlessedAttribute,
  getPermanentKarmaPoints,
  mapGetToSlice(getAdvantages, 'ADV_24'),
  mapGetToSlice(getDisadvantages, 'DISADV_27'),
  getAddedKarmaPoints,
  getLocaleMessages,
  mapGetToSlice(getSpecialAbilities, 'SA_563'),
  (primary, { lost, redeemed }, increase, decrease, add, locale, highConsecration) => {
    const increaseObject = increase && increase.active[0];
    const decreaseObject = decrease && decrease.active[0];
    let base = 0;
    let mod = redeemed - lost;

    if (primary) {
      base = 20 + primary.value;
    }

    if (increaseObject && increaseObject.tier) {
      mod += increaseObject.tier;
    }
    else if (decreaseObject && decreaseObject.tier) {
      mod -= decreaseObject.tier;
    }

    if (highConsecration && isActive(highConsecration)) {
      mod += highConsecration.active[0].tier! * 6;
    }

    const value = base > 0 ? base + mod + add : undefined;

    return {
      add,
      base,
      calc: _translate(locale, 'secondaryattributes.kp.calc'),
      currentAdd: add,
      id: 'KP',
      maxAdd: primary ? primary.value : 0,
      mod,
      name: _translate(locale, 'secondaryattributes.kp.name'),
      permanentLost: lost,
      permanentRedeemed: redeemed,
      short: _translate(locale, 'secondaryattributes.kp.short'),
      value,
    } as EnergyWithLoss<'KP'>;
  }
);

export const getSPI = createSelector(
  getRaces,
  getCurrentRaceId,
  mapGetToSlice(getAttributes, 'ATTR_1'),
  mapGetToSlice(getAttributes, 'ATTR_2'),
  mapGetToSlice(getAttributes, 'ATTR_3'),
  mapGetToSlice(getAdvantages, 'ADV_26'),
  mapGetToSlice(getDisadvantages, 'DISADV_29'),
  getLocaleMessages,
  (races, currentRaceId, COU, SGC, INT, increase, decrease, locale) => {
    const currentRace = currentRaceId && races.get(currentRaceId);
    const increaseObject = isActive(increase);
    const decreaseObject = isActive(decrease);
    let base = 0;
    let mod = 0;

    if (currentRace && COU && SGC && INT) {
      const { spi } = currentRace;
      base = spi + Math.round((COU.value + SGC.value + INT.value) / 6);
    }

    if (increaseObject) {
      mod++;
    }
    else if (decreaseObject) {
      mod--;
    }

    const value = base + mod;

    return {
      base,
      calc: _translate(locale, 'secondaryattributes.spi.calc'),
      id: 'SPI',
      mod,
      name: _translate(locale, 'secondaryattributes.spi.name'),
      short: _translate(locale, 'secondaryattributes.spi.short'),
      value,
    } as SecondaryAttribute<'SPI'>;
  }
);

export const getTOU = createSelector(
  getRaces,
  getCurrentRaceId,
  mapGetToSlice(getAttributes, 'ATTR_7'),
  mapGetToSlice(getAttributes, 'ATTR_8'),
  mapGetToSlice(getAdvantages, 'ADV_27'),
  mapGetToSlice(getDisadvantages, 'DISADV_30'),
  getLocaleMessages,
  (races, currentRaceId, CON, STR, increase, decrease, locale) => {
    const currentRace = currentRaceId && races.get(currentRaceId);
    const increaseObject = isActive(increase);
    const decreaseObject = isActive(decrease);
    let base = 0;
    let mod = 0;

    if (currentRace && CON && STR) {
      const { tou } = currentRace;
      base = tou + Math.round((CON.value * 2 + STR.value) / 6);
    }

    if (increaseObject) {
      mod++;
    }
    else if (decreaseObject) {
      mod--;
    }

    const value = base + mod;

    return {
      base,
      calc: _translate(locale, 'secondaryattributes.tou.calc'),
      id: 'TOU',
      mod,
      name: _translate(locale, 'secondaryattributes.tou.name'),
      short: _translate(locale, 'secondaryattributes.tou.short'),
      value,
    } as SecondaryAttribute<'TOU'>;
  }
);

export const getDO = createSelector(
  mapGetToSlice(getAttributes, 'ATTR_6'),
  mapGetToSlice(getSpecialAbilities, 'SA_64'),
  getLocaleMessages,
  (AGI, improvedDodge, locale) => {
    const base = AGI && Math.round(AGI.value / 2) || 0;
    let mod = 0;

    if (isActive(improvedDodge)) {
      mod += improvedDodge && improvedDodge.active[0].tier || 0;
    }

    const value = base + mod;

    return {
      calc: _translate(locale, 'secondaryattributes.do.calc'),
      id: 'DO',
      name: _translate(locale, 'secondaryattributes.do.name'),
      short: _translate(locale, 'secondaryattributes.do.short'),
      base,
      mod,
      value
    } as SecondaryAttribute<'DO'>;
  }
);

export const getINI = createSelector(
  mapGetToSlice(getAttributes, 'ATTR_1'),
  mapGetToSlice(getAttributes, 'ATTR_6'),
  mapGetToSlice(getSpecialAbilities, 'SA_51'),
  getLocaleMessages,
  (COU, AGI, combatReflexes, locale) => {
    const base = COU && AGI && Math.round((COU.value + AGI.value) / 2) || 0;
    let mod = 0;

    if (isActive(combatReflexes)) {
      mod += combatReflexes && combatReflexes.active[0].tier || 0;
    }

    const value = base + mod;

    return {
      calc: _translate(locale, 'secondaryattributes.ini.calc'),
      id: 'INI',
      name: _translate(locale, 'secondaryattributes.ini.name'),
      short: _translate(locale, 'secondaryattributes.ini.short'),
      base,
      mod,
      value
    } as SecondaryAttribute<'INI'>;
  }
);

export const getMOV = createSelector(
  getRaces,
  getCurrentRaceId,
  mapGetToSlice(getAdvantages, 'ADV_9'),
  mapGetToSlice(getDisadvantages, 'DISADV_51'),
  mapGetToSlice(getDisadvantages, 'DISADV_4'),
  getLocaleMessages,
  (races, currentRaceId, nimble, maimed, slow, locale) => {
    const currentRace = currentRaceId && races.get(currentRaceId);
    let base = currentRace && currentRace.mov || 0;
    let mod = 0;

    if (isActive(nimble)) {
      mod++;
    }
    else if (isActive(slow)) {
      mod--;
    }

    if (maimed && getSids(maimed).includes(3)) {
      base = Math.round(base / 2);
    }

    const value = base + mod;

    return {
      calc: _translate(locale, 'secondaryattributes.mov.calc'),
      id: 'MOV',
      name: _translate(locale, 'secondaryattributes.mov.name'),
      short: _translate(locale, 'secondaryattributes.mov.short'),
      base,
      mod,
      value
    } as SecondaryAttribute<'MOV'>;
  }
);

export const getWT = createSelector(
  mapGetToSlice(getAttributes, 'ATTR_7'),
  mapGetToSlice(getAdvantages, 'ADV_54'),
  mapGetToSlice(getDisadvantages, 'DISADV_56'),
  getLocaleMessages,
  (CON, increase, decrease, locale) => {
    const base = CON && Math.round(CON.value / 2) || 0;
    let mod = 0;

    if (isActive(increase)) {
      mod++;
    }
    else if (isActive(decrease)) {
      mod--;
    }

    const value = base + mod;

    return {
      calc: _translate(locale, 'secondaryattributes.ws.calc'),
      id: 'WT',
      name: _translate(locale, 'secondaryattributes.ws.name'),
      short: _translate(locale, 'secondaryattributes.ws.short'),
      base,
      mod,
      value
    } as SecondaryAttribute<'WT'>;
  }
);

export const getDerivedCharacteristicsMap = createSelector(
  getLP,
  getAE,
  getKP,
  getSPI,
  getTOU,
  getDO,
  getINI,
  getMOV,
  getWT,
  getBooks,
  getRuleBooksEnabled,
  (LP, AE, KP, SPI, TOU, DO, INI, MOV, WT, books, ruleBooksEnabled) => {
    const list: [DCIds, SecondaryAttribute<DCIds>][] = [
      [LP.id, LP],
      [AE.id, AE],
      [KP.id, KP],
      [SPI.id, SPI],
      [TOU.id, TOU],
      [DO.id, DO],
      [INI.id, INI],
      [MOV.id, MOV]
    ];

    if (isBookEnabled(books, ruleBooksEnabled, 'US25003')) {
      list.push([WT.id, WT]);
    }

    return new Map(list);
  }
);

export const getDerivedCharacteristics = createSelector(
  getDerivedCharacteristicsMap,
  state => {
    return [...state.values()];
  }
);
