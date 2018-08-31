import * as Data from '../types/data';
import { Activatable, AllRequirements } from '../types/wiki';
import { isRequiringActivatable } from './checkPrerequisiteUtils';
import { Record } from './dataUtils';
import { getFirstTierPrerequisites } from './flattenPrerequisites';

const getMagicalOrBlessedFilter =
  (advantageId: 'ADV_12' | 'ADV_50') =>
    (e: AllRequirements) =>
      e !== 'RCP'
        && isRequiringActivatable (e)
        && e.get ('id') === advantageId
        && e.get ('active');

export const isMagicalOrBlessed = (obj: Activatable) => {
  const firstTier = getFirstTierPrerequisites (obj.get ('prerequisites'));

  const isBlessed = firstTier.any (getMagicalOrBlessedFilter ('ADV_12'));
  const isMagical = firstTier.any (getMagicalOrBlessedFilter ('ADV_50'));

  return {
    isBlessed,
    isMagical
  };
};

export const isActiveViewObject = (
  obj: Record<Data.ActiveViewObject> | Record<Data.DeactiveViewObject>,
): obj is Record<Data.ActiveViewObject> => {
  return obj.member ('index');
};
