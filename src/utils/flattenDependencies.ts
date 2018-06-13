import * as Data from '../types/data.d';
import * as Wiki from '../types/wiki.d';
import { List, Maybe, Record } from './dataUtils';
import { flattenPrerequisites } from './flattenPrerequisites';
import { getHeroStateListItem } from './heroStateUtils';
import { getWikiEntry } from './WikiUtils';

export const flattenDependencies = <T extends number | boolean>(
  wiki: Record<Wiki.WikiAll>,
  state: Record<Data.HeroDependent>,
  dependencies: List<T | Record<Data.SkillOptionalDependency>>,
): List<T> => {
  return dependencies.map(e => {
    if (isObject(e)) {
      return Maybe.fromMaybe(0, getWikiEntry<Wiki.Activatable>(
        wiki, e.get('origin')
      )
        .bind(target => flattenPrerequisites(target.get('prerequisites'))
          .find(
            (r): r is Wiki.AbilityRequirement =>
              r !== 'RCP'
              && isObject(r.get('id'))
              && (r.get('id') as List<string>).elem(e.get('origin'))
          )
        )
        .map(originPrerequisite =>
          (originPrerequisite.get('id') as List<string>).foldl(acc => id =>
            Maybe.fromMaybe(
              false,
              getHeroStateListItem<Data.ValueBasedDependent>(id)(state)
                .map(entry => entry.get('value') >= e.get('value'))
            ) ? acc + 1 : acc
          , 0) > 1 ? 0 : e.get('value')
        )
      ) as T;
    }

    return e;
  });
};
