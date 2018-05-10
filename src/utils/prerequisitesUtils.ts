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

  const adds: Reusable.AllRequirementTypes[] = [];

  switch (wikiEntry.id) {
    case 'SA_3': {
      findSelectOption(wikiEntry, sid)
        .fmap(item => item.req)
        .fmap(req => {
          adds.push(...req);
        });
      break;
    }
    case 'SA_9': {
      interface SkillSelectionObject extends Wiki.SelectionObject {
        applications?: Wiki.Application[];
        applicationsInput?: string;
      }

      const sameSkill = instance.active.filter(e => e.sid === sid).length;

      adds.push({
        id: sid as string,
        value: (sameSkill + (add ? 1 : 0)) * 6,
      });

      findSelectOption<SkillSelectionObject>(wikiEntry, sid)
        .fmap(skill => skill.applications)
        .fmap(R.find(e => e.id === sid2))
        .fmap(app => app.prerequisites)
        .fmap(prerequisites => {
          adds.push(...prerequisites);
        });

      break;
    }
    case 'SA_81':
      adds.push({
        id: 'SA_72',
        active: true,
        sid,
      });
      break;
    case 'SA_414':
    case 'SA_663': {
      interface ExtensionSelectionObject extends Wiki.SelectionObject {
        req: Reusable.AllRequirementTypes[];
        target: string;
        tier: number;
      }

      findSelectOption<ExtensionSelectionObject>(wikiEntry, sid)
        .fmap(item => {
          adds.push({
            id: item.target,
            value: item.tier * 4 + 4,
          });
        });

      break;
    }
    case 'SA_639': {
      findSelectOption(wikiEntry, sid)
        .fmap(item => item.prerequisites)
        .fmap(prerequisites => {
          adds.push(...prerequisites);
        });
      break;
    }
    case 'SA_699': {
      adds.push({
        id: 'SA_29',
        active: true,
        sid,
        tier: 3,
      });
      break;
    }
  }
  return adds;
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
