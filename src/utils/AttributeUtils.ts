import R from 'ramda';
import { WikiState } from '../reducers/wikiReducer';
import * as Data from '../types/data.d';
import { AbilityRequirementObject } from '../types/wiki';
import { getExperienceLevelIdByAp } from '../utils/ELUtils';
import { convertMapToValues } from './collectionUtils';
import { flattenPrerequisites } from './flattenPrerequisites';
import { getHeroStateListItem } from './heroStateUtils';
import { Maybe } from './maybe';

export const getSum = (list: Data.AttributeDependent[]): number => {
  return list.reduce((n, e) => n + e.value, 0);
};

export const isIncreasable = (
  wiki: WikiState,
  state: Data.HeroDependent,
  obj: Data.AttributeDependent,
): boolean => {
  if (state.phase < 3) {
    const attributes = convertMapToValues(state.attributes);
    return R.defaultTo(
      false,
      Maybe(wiki.experienceLevels.get(state.experienceLevel))
        .fmap(startEl => {
          const total = getSum(attributes);
          const reachedMaxTotal = total >= startEl.maxTotalAttributeValues;
          const max = reachedMaxTotal ? 0 : startEl.maxAttributeValue + obj.mod;
          return obj.value < max;
        })
        .value
    );
  }
  else if (state.rules.attributeValueLimit === true) {
    const currentExperienceLevellId = getExperienceLevelIdByAp(
      wiki.experienceLevels,
      state.adventurePoints.total,
    );

    return R.defaultTo(
      false,
      Maybe(wiki.experienceLevels.get(currentExperienceLevellId))
        .fmap(currentEl => {
          return obj.value < currentEl.maxAttributeValue + 2;
        })
        .value
    );
  }

  return true;
};

export const isDecreasable = (
  wiki: WikiState,
  state: Data.HeroDependent,
  obj: Data.AttributeDependent,
): boolean => {
  const dependencies = obj.dependencies.map(e => {
    if (typeof e !== 'number') {
      return R.defaultTo(
        0,
        Maybe(wiki.specialAbilities.get(e.origin))
          .fmap(target => {
            return flattenPrerequisites(target.prerequisites).find(
              (r): r is AbilityRequirementObject => {
                return r !== 'RCP' && isObject(r.id) && r.id.includes(e.origin);
              }
            );
          })
          .fmap(originPrerequisite => {
            return (originPrerequisite.id as string[]).reduce((acc, id) => {
              return R.defaultTo(
                false,
                getHeroStateListItem<Data.AttributeDependent>(id)(state)
                  .fmap(entry => entry.value >= e.value)
                  .value
              ) ? acc + 1 : acc;
            }, 0) > 1 ? 0 : e.value;
          })
          .value
      );
    }
    return e;
  });

  return obj.value > Math.max(8, ...dependencies);
};

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
