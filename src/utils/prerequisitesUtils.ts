import * as Data from '../types/data.d';
import * as Wiki from '../types/wiki.d';
import { Just, List, Maybe, Nothing, Record } from './dataUtils';
import { findSelectOption } from './selectionUtils';

/**
 * Some advantages, disadvantages and special abilities need more prerequisites
 * than given in their respective main array.
 * @param wikiEntry The entry for which you want to add the dependencies.
 * @param instance The state entry *before* adding or removing the active
 * object.
 * @param active The actual active object.
 * @param add States if the prerequisites should be added or removed (some
 * prerequisites must be calculated based on that).
 */
export function getGeneratedPrerequisites(
  wikiEntry: Wiki.WikiActivatable,
  instance: Maybe<Record<Data.ActivatableDependent>>,
  active: Record<Data.ActiveObject>,
  add: boolean,
): Maybe<List<Wiki.AllRequirementObjects>> {
  const sid = active.lookup('sid');
  const sid2 = active.lookup('sid2');

  switch (wikiEntry.get('id')) {
    case 'SA_3': {
      return findSelectOption(wikiEntry, sid)
        .bind(item => item.lookup('req'));
    }
    case 'SA_9': {
      interface SkillSelectionObject extends Wiki.SelectionObject {
        applications: List<Record<Wiki.Application>>;
        applicationsInput: string;
      }

      const sameSkill = Maybe.fromMaybe(
        0,
        instance.map(
          justInstance => justInstance.get('active')
            .filter(e => e.lookup('sid').equals(sid))
            .length()
        )
      );

      const sameSkillDependency = sid.map(justSid => ({
        id: justSid as string,
        value: (sameSkill + (add ? 1 : 0)) * 6
      }));

      return findSelectOption<SkillSelectionObject>(wikiEntry, sid)
        .bind(
          skill => skill.get('applications')
            .find(e => sid2.equals(e.lookup('id')))
        )
        .bind(app => app.lookup('prerequisites'))
        .bind(prerequisites =>
          sameSkillDependency.map(
            obj => prerequisites.prepend(Record.of<Wiki.RequiresIncreasableObject>(obj))
          )
        )
        .alt(sameSkillDependency.map(
          obj => List.of(Record.of<Wiki.RequiresIncreasableObject>(obj)))
        );
    }
    case 'SA_81':
      return Just(List.of(
        Record.ofMaybe({
          id: 'SA_72',
          active: true,
          sid
        }) as Record<Wiki.RequiresActivatableObject>
      ));
    case 'SA_414':
    case 'SA_663': {
      interface ExtensionSelectionObject extends Wiki.SelectionObject {
        req: List<Wiki.AllRequirementObjects>;
        target: string;
        tier: number;
      }

      return findSelectOption<ExtensionSelectionObject>(wikiEntry, sid)
        .map(
          item => List.of(Record.of<Wiki.RequiresIncreasableObject>({
            id: item.get('target'),
            value: item.get('tier') * 4 + 4,
          }))
        );
    }
    case 'SA_639': {
      return findSelectOption(wikiEntry, sid)
        .bind(item => item.lookup('prerequisites'));
    }
    case 'SA_699': {
      return Just(List.of(
        Record.ofMaybe({
          id: 'SA_29',
          active: true,
          sid,
          tier: 3,
        }) as Record<Wiki.RequiresActivatableObject>
      ));
    }
  }

  return Nothing();
}

export const addDynamicPrerequisites = (
  wikiEntry: Wiki.Activatable,
  instance: Maybe<Record<Data.ActivatableDependent>>,
  active: Record<Data.ActiveObject>,
  add: boolean,
) => (
  prerequisites: List<Wiki.AllRequirements>,
): List<Wiki.AllRequirements> =>
  Maybe.fromMaybe(
    prerequisites,
    getGeneratedPrerequisites(wikiEntry, instance, active, add)
      .map(e => prerequisites.concat(e))
  );
