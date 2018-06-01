import R from 'ramda';
import * as Data from '../types/data.d';
import * as Wiki from '../types/wiki.d';
import { getWikiEntry } from './WikiUtils';
import { flattenPrerequisites } from './flattenPrerequisites';
import { getHeroStateListItem } from './heroStateUtils';

export const flattenDependencies = <T extends number | boolean>(
  wiki: Wiki.WikiAll,
  state: Data.HeroDependent,
  dependencies: ReadonlyArray<T | Data.SkillOptionalDependency>,
): T[] => {
  return dependencies.map(e => {
    if (isObject(e)) {
      return R.defaultTo(
        0,
        getWikiEntry<Wiki.Activatable>(wiki, e.origin)
          .map(target => {
            return flattenPrerequisites(target.prerequisites).find(
              (r): r is Wiki.AbilityRequirementObject => {
                return r !== 'RCP' && isObject(r.id) && r.id.includes(e.origin);
              }
            );
          })
          .map(originPrerequisite => {
            return (originPrerequisite.id as string[]).reduce((acc, id) => {
              return R.defaultTo(
                false,
                getHeroStateListItem<Data.ValueBasedDependent>(id)(state)
                  .map(entry => {
                    entry.value >= e.value;
                  })
                  .value
              ) ? acc + 1 : acc;
            }, 0) > 1 ? 0 : e.value;
          })
          .value
      ) as T;
    }

    return e;
  });
};
