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
      return getWikiEntry<Wiki.Activatable>(wiki, e.origin)
        .map(target => {
          return flattenPrerequisites(target.prerequisites).find(
            (r): r is Wiki.AbilityRequirementObject => {
              return r !== 'RCP' && isObject(r.id) && r.id.includes(e.origin);
            }
          );
        })
        .map(originPrerequisite => {
          return (originPrerequisite.id as string[]).reduce((acc, id) => {
            return getHeroStateListItem<Data.ValueBasedDependent>(id)(state)
              .map(entry => entry.value >= e.value)
              .valueOr(false) ? acc + 1 : acc;
          }, 0) > 1 ? 0 : e.value;
        })
        .valueOr(0) as T;
    }

    return e;
  });
};
