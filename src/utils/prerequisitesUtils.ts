import * as Data from '../types/data.d';
import * as Wiki from '../types/wiki.d';
import { Just, List, Maybe } from './dataUtils';
import { findSelectOption } from './selectionUtils';

/**
 * Some advantages, disadvantages and special abilities need more prerequisites
 * than given in their respective main array.
 * @param wikiEntry The entry for which you want to add the dependencies.
 * @param active The actual active object.
 * @param add States if the prerequisites should be added or removed (some
 * prerequisites must be calculated based on that).
 */
export function getGeneratedPrerequisites(
  wikiEntry: Wiki.WikiActivatable,
  instance: Record<Data.ActivatableDependent>,
  active: Record<Data.ActiveObject>,
  add: boolean,
): Maybe<List<Wiki.AllRequirementObjects>> {
  const { sid, sid2 } = active;

  switch (wikiEntry.id) {
    case 'SA_3': {
      return findSelectOption(wikiEntry, sid)
        .bind(item => item.req);
    }
    case 'SA_9': {
      interface SkillSelectionObject extends Wiki.SelectionObject {
        applications: Just<List<Wiki.Application>>;
        applicationsInput: Just<string>;
      }

      const sameSkill = instance.active.filter(e => e.sid === sid).length();

      const sameSkillDependency = sid.map(sid => ({
        id: sid as string,
        value: (sameSkill + (add ? 1 : 0)) * 6
      }));

      return findSelectOption<SkillSelectionObject>(wikiEntry, sid)
        .bind(skill => skill.applications)
        .bind(list => list.find(e => sid2.equals(Maybe.Just(e.id))))
        .bind(app => app.prerequisites)
        .bind(prerequisites =>
          sameSkillDependency.map(obj => prerequisites.prepend(obj))
        )
        .alt(sameSkillDependency.map(obj => List.of(obj)));
    }
    case 'SA_81':
      return Maybe.Just(List.of<Wiki.RequiresActivatableObject>({
        id: 'SA_72',
        active: true,
        sid,
        sid2: Maybe.Nothing(),
        tier: Maybe.Nothing()
      }));
    case 'SA_414':
    case 'SA_663': {
      interface ExtensionSelectionObject extends Wiki.SelectionObject {
        req: Wiki.AllRequirementObjects[];
        target: string;
        tier: number;
      }

      return findSelectOption<ExtensionSelectionObject>(wikiEntry, sid)
        .map(item => [{
          id: item.target,
          value: item.tier * 4 + 4,
        }])
        .valueOr([]);
    }
    case 'SA_639': {
      return findSelectOption(wikiEntry, sid)
        .map(item => item.prerequisites)
        .valueOr([]);
    }
    case 'SA_699': {
      return [{
        id: 'SA_29',
        active: true,
        sid,
        tier: 3,
      }];
    }
  }

  return Maybe.Nothing();
}

export const addDynamicPrerequisites = (
  wikiEntry: Wiki.WikiActivatable,
  instance: Data.ActivatableDependent,
  active: Data.ActiveObject,
  add: boolean,
) => (
  prerequisites: List<Wiki.AllRequirements>,
): List<Wiki.AllRequirements> =>
  Maybe.fromMaybe(
    prerequisites,
    getGeneratedPrerequisites(wikiEntry, instance, active, add)
      .map(e => prerequisites.concat(e))
  );
