import * as Data from '../types/data.d';
import * as Wiki from '../types/wiki.d';
import * as Reusable from '../types/reusable.d';
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
      const selectionItem = findSelectOption(wikiEntry, sid);
      if (selectionItem && selectionItem.req) {
        adds.push(...selectionItem.req);
      }
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

      const selectedSkill = findSelectOption<SkillSelectionObject>(wikiEntry, sid);
      const skillApps = selectedSkill && selectedSkill.applications;
      const selectedApp = skillApps && skillApps.find(e => e.id === sid2);
      const applicationPrerequisites = selectedApp && selectedApp.prerequisites;

      if (applicationPrerequisites) {
        adds.push(...applicationPrerequisites);
      }

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

      const selectionItem = findSelectOption<ExtensionSelectionObject>(wikiEntry, sid);

      if (selectionItem) {
        adds.push({
          id: selectionItem.target,
          value: selectionItem.tier * 4 + 4,
        });
      }
      break;
    }
    case 'SA_639': {
      const selectionItem = findSelectOption(wikiEntry, sid);
      if (selectionItem && selectionItem.prerequisites) {
        adds.push(...selectionItem.prerequisites);
      }
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
