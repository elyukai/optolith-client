import * as Data from '../types/data';
import * as Wiki from '../types/wiki';
import { List, Maybe, Nothing, Record } from './dataUtils';
import { flattenPrerequisites } from './flattenPrerequisites';
import { getHeroStateListItem } from './heroStateUtils';
import { isObject } from './typeCheckUtils';
import { getWikiEntry } from './WikiUtils';

/**
 * `flattenDependencies` flattens the list of dependencies to usable values.
 * That means, optional dependencies (objects) will be evaluated and will be
 * included in the resulting list, depending on whether it has to follow the
 * optional dependency or not. The result is a plain `List` of all non-optional
 * dependencies.
 * @param wiki The full wiki.
 * @param state The current hero.
 * @param dependencies The list of dependencies to flatten.
 */
export const flattenDependencies = <T extends number | boolean>(
  wiki: Record<Wiki.WikiAll>,
  state: Record<Data.HeroDependent>,
  dependencies: List<T | Record<Data.SkillOptionalDependency>>
): List<T> => {
  return dependencies.map (e => {
    if (isObject (e)) {
      return Maybe.fromMaybe (0) (getWikiEntry<Wiki.Activatable> (wiki) (e.get ('origin'))
        .bind (
          target => flattenPrerequisites (target.get ('prerequisites')) (Nothing ()) (Nothing ())
            .find (
              (r): r is Wiki.AbilityRequirement =>
                r !== 'RCP'
                && isObject (r.get ('id'))
                && (r.get ('id') as List<string>).elem (e.get ('origin'))
            )
        )
        .fmap (
          originPrerequisite => (originPrerequisite.get ('id') as List<string>)
            .foldl<number> (
              acc => id =>
                Maybe.fromMaybe (false) (
                  getHeroStateListItem<Data.ValueBasedDependent> (id) (state)
                    .fmap (entry => entry.get ('value') >= e.get ('value'))
                ) ? acc + 1 : acc
            ) (0) > 1 ? 0 : e.get ('value')
        )
      ) as T;
    }

    return e;
  });
};
