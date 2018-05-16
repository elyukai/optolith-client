import R from 'ramda';
import * as Data from '../types/data.d';
import * as Wiki from '../types/wiki.d';
import { flattenPrerequisites } from './flattenPrerequisites';
import { getHeroStateListItem } from './heroStateUtils';
import { Maybe } from './maybe';

export const flattenDependencies = (
  wiki: Wiki.WikiAll,
  state: Data.HeroDependent,
  dependencies: Data.AttributeInstanceDependency[],
) => {
  return dependencies.map(e => {
    if (typeof e !== 'number') {
      return R.defaultTo(
        0,
        Maybe(wiki.specialAbilities.get(e.origin))
          .fmap(target => {
            return flattenPrerequisites(target.prerequisites).find(
              (r): r is Wiki.AbilityRequirementObject => {
                return r !== 'RCP' && isObject(r.id) && r.id.includes(e.origin);
              }
            );
          })
          .fmap(originPrerequisite => {
            return (originPrerequisite.id as string[]).reduce((acc, id) => {
              return R.defaultTo(
                false,
                getHeroStateListItem<Data.ValueBasedDependent>(id)(state)
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
};
