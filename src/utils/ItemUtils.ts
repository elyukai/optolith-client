import { ItemEditorInstance, ItemInstance, SourceLink } from '../types/data.d';
import { exists } from './exists';

const ifNumberOrEmpty = (e: number | undefined): string => {
  return isNumber(e) ? e.toString() : '';
};

export const convertToEdit = (item: ItemInstance): ItemEditorInstance => {
  const {
    note: _,
    rules: _1,
    advantage: _2,
    disadvantage: _3,
    src: _4,
    ...otherProperties,
  } = item;

  let damageBonus: ItemEditorInstance['damageBonus'];

  if (exists(item.damageBonus)) {
    if (isObject(item.damageBonus.threshold)) {
      damageBonus = {
        ...item.damageBonus,
        threshold: item.damageBonus.threshold.map(e => e.toString()),
      };
    }
    else {
      damageBonus = {
        ...item.damageBonus,
        threshold: item.damageBonus.threshold.toString(),
      };
    }
  }
  else {
    damageBonus = {
      threshold: ''
    };
  }

  return {
    ...otherProperties,
    amount: ifNumberOrEmpty(item.amount),
    at: ifNumberOrEmpty(item.at),
    damageBonus,
    damageDiceNumber: ifNumberOrEmpty(item.damageDiceNumber),
    damageFlat: ifNumberOrEmpty(item.damageFlat),
    enc: ifNumberOrEmpty(item.enc),
    length: ifNumberOrEmpty(item.length),
    pa: ifNumberOrEmpty(item.pa),
    price: ifNumberOrEmpty(item.price),
    pro: ifNumberOrEmpty(item.pro),
    range: (item.range
      ? item.range.map(e => e.toString())
      : ['', '', '']
    ) as [string, string, string],
    reloadTime: ifNumberOrEmpty(item.reloadTime),
    stp: ifNumberOrEmpty(item.stp),
    weight: ifNumberOrEmpty(item.weight),
    movMod: ifNumberOrEmpty(item.movMod),
    iniMod: ifNumberOrEmpty(item.iniMod),
    stabilityMod: ifNumberOrEmpty(item.stabilityMod),
  };
};

const toInteger = (e: string, alt = 0) => {
  return e.length > 0 ? Number.parseInt(e.replace(/\,/, '.')) : alt;
};

const toFloat = (e: string, alt = 0) => {
  return e.length > 0 ? Number.parseFloat(e.replace(/\,/, '.')) : alt;
};

export const convertToSave = (item: ItemEditorInstance): ItemInstance => {
  const {
    movMod,
    iniMod,
    stabilityMod,
    improvisedWeaponGroup,
    ...other
  } = item;

  const add: {
    movMod?: number;
    iniMod?: number;
    stabilityMod?: number;
    improvisedWeaponGroup?: number;
  } = {};

  if (movMod && toInteger(movMod) > 0) {
    add.movMod = toInteger(movMod);
  }

  if (iniMod && toInteger(iniMod) > 0) {
    add.iniMod = toInteger(iniMod);
  }

  if (stabilityMod && !Number.isNaN(toInteger(stabilityMod))) {
    add.stabilityMod = toInteger(stabilityMod);
  }

  if (typeof improvisedWeaponGroup === 'number') {
    add.improvisedWeaponGroup = improvisedWeaponGroup;
  }

  let damageBonus: ItemInstance['damageBonus'];

  if (
    isObject(item.damageBonus.threshold)
    ? item.damageBonus.threshold.every(e => e.length > 0)
    : item.damageBonus.threshold.length > 0
  ) {
    if (isObject(item.damageBonus.threshold)) {
      damageBonus = {
        ...item.damageBonus,
        threshold: item.damageBonus.threshold.map(e => Number.parseInt(e))
      };
    }
    else {
      damageBonus = {
        ...item.damageBonus,
        threshold: Number.parseInt(item.damageBonus.threshold),
      };
    }
  }

  return {
    ...other,
    amount: toInteger(item.amount, 1),
    at: toInteger(item.at),
    damageBonus,
    damageDiceNumber: toInteger(item.damageDiceNumber),
    damageFlat: toInteger(item.damageFlat),
    enc: toInteger(item.enc),
    length: toFloat(item.length),
    pa: toInteger(item.pa),
    price: toFloat(item.price),
    pro: toInteger(item.pro),
    range: item.range.map(toInteger) as [number, number, number],
    reloadTime: toInteger(item.reloadTime),
    stp: toInteger(item.stp),
    weight: toFloat(item.weight),
    ...add
  };
}

const arrayFilter = (
  value: [number, number, number] | SourceLink[]
): value is [number, number, number] => {
  return value.length === 0 || typeof value[0] === 'number';
};

export const containsNaN = (item: ItemInstance): string[] | false => {
  const keys = Object.keys(item) as (keyof ItemInstance)[];

  const filtered = keys.filter(e => {
    const element = item[e];

    if (Array.isArray(element)) {
      return !arrayFilter(element) || element.every(i => Number.isNaN(i));
    }
    else if (typeof element === 'number') {
      return Number.isNaN(element);
    }

    return false;
  });

  if (filtered.length === 0) {
    return false;
  }

  return filtered;
};

export const convertPrimaryAttributeToArray = (id: string): string[] => {
  const [attr, ...ids] = id.split(/_/);
  return ids.map(e => `${attr}_${e}`);
};
