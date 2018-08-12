import { ItemEditorInstance, ItemEditorSpecific, ItemInstance } from '../types/data';
import { Just, List, Maybe, Nothing, Record } from './dataUtils';

const ifNumberOrEmpty = (e: Maybe<number>): string =>
  Maybe.maybe('', x => x.toString(), e);

const convertDamageBonusToEdit =
  (maybeDamageBonus: Maybe<NonNullable<ItemInstance['damageBonus']>>):
    ItemEditorInstance['damageBonus'] => {
      if (Maybe.isJust(maybeDamageBonus)) {
        const damageBonus = Maybe.fromJust(maybeDamageBonus);

        const threshold = damageBonus.get('threshold');

        return damageBonus
          .merge(Record.of({
            threshold: threshold instanceof List
              ? threshold.map(e => e.toString())
              : threshold.toString(),
          })) as any as ItemEditorInstance['damageBonus'];
      }
      else {
        return Record.of({
          threshold: ''
        }) as ItemEditorInstance['damageBonus'];
      }
    };

export const convertToEdit = (item: Record<ItemInstance>): Record<ItemEditorInstance> => {
  const otherProperties = item
    .delete('note')
    .delete('rules')
    .delete('advantage')
    .delete('disadvantage')
    .delete('src');

  return otherProperties.merge(Record.of<ItemEditorSpecific>({
    amount: ifNumberOrEmpty(item.lookup('amount')),
    at: ifNumberOrEmpty(item.lookup('at')),
    damageBonus: convertDamageBonusToEdit(item.lookup('damageBonus')),
    damageDiceNumber: ifNumberOrEmpty(item.lookup('damageDiceNumber')),
    damageFlat: ifNumberOrEmpty(item.lookup('damageFlat')),
    enc: ifNumberOrEmpty(item.lookup('enc')),
    length: ifNumberOrEmpty(item.lookup('length')),
    pa: ifNumberOrEmpty(item.lookup('pa')),
    price: ifNumberOrEmpty(item.lookup('price')),
    pro: ifNumberOrEmpty(item.lookup('pro')),
    range: Maybe.maybe(
      List.of('', '', ''),
      range => range.map(e => e.toString()),
      item.lookup('range')
    ),
    reloadTime: ifNumberOrEmpty(item.lookup('reloadTime')),
    stp: ifNumberOrEmpty(item.lookup('stp')),
    weight: ifNumberOrEmpty(item.lookup('weight')),
    movMod: ifNumberOrEmpty(item.lookup('movMod')),
    iniMod: ifNumberOrEmpty(item.lookup('iniMod')),
    stabilityMod: ifNumberOrEmpty(item.lookup('stabilityMod')),
  })) as any as Record<ItemEditorInstance>;
};

const toInteger = (e: string, alt = 0) => {
  return e.length > 0 ? Number.parseInt(e.replace(/\,/, '.')) : alt;
};

const toFloat = (e: string, alt = 0) => {
  return e.length > 0 ? Number.parseFloat(e.replace(/\,/, '.')) : alt;
};

const convertDamageBonusToSave =
  (damageBonus: ItemEditorInstance['damageBonus']):
    Maybe<NonNullable<ItemInstance['damageBonus']>> => {
      const threshold = damageBonus.get('threshold');

      if (
        threshold instanceof List
          ? threshold.all(e => e.length > 0)
          : threshold.length > 0
      ) {
        return Just(damageBonus.merge(Record.of({
          threshold: threshold instanceof List
            ? threshold.map(Number.parseInt)
            : Number.parseInt(threshold)
        })) as any as NonNullable<ItemInstance['damageBonus']>);
      }

      return Nothing();
    };

export const convertToSave = (item: Record<ItemEditorInstance>): Record<ItemInstance> => {
  interface Additional {
    movMod?: number;
    iniMod?: number;
    stabilityMod?: number;
    improvisedWeaponGroup?: number;
  }

  const add = Record.of<Additional>({})
    .update(
      () => item.lookup('movMod')
        .fmap(toInteger)
        .bind(Maybe.ensure(e => e > 0)),
      'movMod'
    )
    .update(
      () => item.lookup('iniMod')
        .fmap(toInteger)
        .bind(Maybe.ensure(e => e > 0)),
      'iniMod'
    )
    .update(
      () => item.lookup('stabilityMod')
        .fmap(toInteger)
        .bind(Maybe.ensure(e => !Number.isNaN(e))),
      'stabilityMod'
    )
    .update(
      () => item.lookup('improvisedWeaponGroup'),
      'improvisedWeaponGroup'
    );

  return item.mergeMaybe(Record.of({
    amount: toInteger(item.get('amount'), 1),
    at: toInteger(item.get('at')),
    damageBonus: convertDamageBonusToSave(item.get('damageBonus')),
    damageDiceNumber: toInteger(item.get('damageDiceNumber')),
    damageFlat: toInteger(item.get('damageFlat')),
    enc: toInteger(item.get('enc')),
    length: toFloat(item.get('length')),
    pa: toInteger(item.get('pa')),
    price: toFloat(item.get('price')),
    pro: toInteger(item.get('pro')),
    range: item.get('range').map(toInteger),
    reloadTime: toInteger(item.get('reloadTime')),
    stp: toInteger(item.get('stp')),
    weight: toFloat(item.get('weight')),
    ...add
  })) as any as Record<ItemInstance>;
};

export const containsNaN = (item: Record<ItemInstance>): List<string> | false => {
  const filtered = item.keys().filter(e => {
    const element = item.lookup(e);

    if (Maybe.isJust(element)) {
      const justElement = Maybe.fromJust(element);

      if (Array.isArray(justElement) ) {
        return justElement.every(i => Number.isNaN(i));
      }
      else if (typeof element === 'number') {
        return Number.isNaN(element);
      }
    }

    return false;
  });

  if (filtered.length() === 0) {
    return false;
  }

  return filtered;
};

export const convertPrimaryAttributeToArray = (id: string): List<string> => {
  const [attr, ...ids] = id.split(/_/);

  return List.fromArray(ids.map(e => `${attr}_${e}`));
};
