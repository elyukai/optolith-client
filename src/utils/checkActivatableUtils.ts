import * as Data from '../types/data.d';
import { Activatable, AllRequirements } from '../types/wiki.d';
import { isRequiringActivatable } from './checkPrerequisiteUtils';
import { getFirstTierPrerequisites } from './flattenPrerequisites';

const getMagicalOrBlessedFilter = (advantageId: 'ADV_12' | 'ADV_50') => {
  return (e: AllRequirements) => {
    return e !== 'RCP'
      && e.id === advantageId
      && isRequiringActivatable(e)
      && !!e.active;
  };
};

export const isMagicalOrBlessed = (obj: Activatable) => {
  const firstTier = getFirstTierPrerequisites(obj.prerequisites);

  const isBlessed = firstTier.some(getMagicalOrBlessedFilter('ADV_12'));
  const isMagical = firstTier.some(getMagicalOrBlessedFilter('ADV_50'));

  return {
    isBlessed,
    isMagical
  };
};

export const isActiveViewObject = (
  obj: Data.ActiveViewObject | Data.DeactiveViewObject,
): obj is Data.ActiveViewObject => {
  return obj.hasOwnProperty('index');
};
