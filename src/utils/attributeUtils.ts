import * as Data from '../types/data';
import * as Wiki from '../types/wiki';
import { getExperienceLevelIdByAp } from '../utils/ELUtils';
import { Maybe, OrderedMap, Record } from './dataUtils';
import { flattenDependencies } from './flattenDependencies';

export const getSum =
  (list: OrderedMap<string, Record<Data.AttributeDependent>>): number =>
    list.foldl(n => e => n + e.get('value'), 0);

export const isIncreasable = (
  wiki: Record<Wiki.WikiAll>,
  state: Record<Data.HeroDependent>,
  instance: Record<Data.AttributeDependent>,
): boolean => {
  if (state.get('phase') < 3) {
    const total = getSum(state.get('attributes'));

    return Maybe.fromMaybe(
      false,
      wiki.get('experienceLevels').lookup(state.get('experienceLevel'))
        .fmap(startEl => {
          const reachedMaxTotal = total >= startEl.get('maxTotalAttributeValues');

          if (reachedMaxTotal) {
            return false;
          }

          return instance.get('value')
            < startEl.get('maxAttributeValue') + instance.get('mod');
        })
    );
  }
  else if (state.get('rules').get('attributeValueLimit')) {
    const currentExperienceLevellId = getExperienceLevelIdByAp(
      wiki.get('experienceLevels'),
      state.get('adventurePoints').get('total'),
    );

    return Maybe.fromMaybe(
      false,
      wiki.get('experienceLevels').lookup(currentExperienceLevellId)
        .fmap(
          currentEl =>
            instance.get('value') < currentEl.get('maxAttributeValue') + 2
        )
    );
  }

  return true;
};

export const isDecreasable = (
  wiki: Record<Wiki.WikiAll>,
  state: Record<Data.HeroDependent>,
  instance: Record<Data.AttributeDependent>,
): boolean => {
  const dependencies = flattenDependencies(
    wiki,
    state,
    instance.get('dependencies'),
  );

  return instance.get('value') > Math.max(8, ...dependencies);
};

export const getSkillCheckValues =
  (attributes: OrderedMap<string, Record<Data.AttributeDependent>>) => Maybe.mapMaybe(
    (id: string) => attributes.lookup(id).fmap(e => e.get('value'))
  );

export function convertId<T extends string | undefined>(id: T): T {
  switch (id) {
    case 'COU':
      return 'ATTR_1' as T;
    case 'SGC':
      return 'ATTR_2' as T;
    case 'INT':
      return 'ATTR_3' as T;
    case 'CHA':
      return 'ATTR_4' as T;
    case 'DEX':
      return 'ATTR_5' as T;
    case 'AGI':
      return 'ATTR_6' as T;
    case 'CON':
      return 'ATTR_7' as T;
    case 'STR':
      return 'ATTR_8' as T;

    default:
      return id;
  }
}
