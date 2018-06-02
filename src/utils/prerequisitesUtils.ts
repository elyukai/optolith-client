import R from 'ramda';
import * as Data from '../types/data.d';
import * as Reusable from '../types/reusable.d';
import * as Wiki from '../types/wiki.d';
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
  instance: Data.ActivatableDependent,
  active: Data.ActiveObject,
  add: boolean,
): Reusable.AllRequirementTypes[] {
  const { sid, sid2 } = active;

  switch (wikiEntry.id) {
    case 'SA_3': {
      return findSelectOption(wikiEntry, sid)
        .map(item => item.req)
        .valueOr([]);
    }
    case 'SA_9': {
      interface SkillSelectionObject extends Wiki.SelectionObject {
        applications?: Wiki.Application[];
        applicationsInput?: string;
      }

      const sameSkill = instance.active.filter(e => e.sid === sid).length;

      const sameSkillDependency = {
        id: sid as string,
        value: (sameSkill + (add ? 1 : 0)) * 6,
      };

      return findSelectOption<SkillSelectionObject>(wikiEntry, sid)
        .map(skill => skill.applications)
        .map(R.find(e => e.id === sid2))
        .map(app => app.prerequisites)
        .map(prerequisites => [sameSkillDependency, ...prerequisites])
        .valueOr([sameSkillDependency]);
    }
    case 'SA_81':
      return [{
        id: 'SA_72',
        active: true,
        sid,
      }];
    case 'SA_414':
    case 'SA_663': {
      interface ExtensionSelectionObject extends Wiki.SelectionObject {
        req: Reusable.AllRequirementTypes[];
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

  return [];
}

export const addDynamicPrerequisites = (
  wikiEntry: Wiki.WikiActivatable,
  instance: Data.ActivatableDependent,
  active: Data.ActiveObject,
  add: boolean,
) => (
  prerequisites: Wiki.AllRequirements[],
): Wiki.AllRequirements[] => {
  return [
    ...prerequisites,
    ...getGeneratedPrerequisites(wikiEntry, instance, active, add),
  ];
};
