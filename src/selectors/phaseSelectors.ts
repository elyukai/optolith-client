import { createSelector } from 'reselect';
import { Just } from '../utils/dataUtils';
import { getPhase } from './stateSelectors';
import { getIsEditingHeroAfterCreationPhaseEnabled } from './uisettingsSelectors';

export const getIsInCharacterCreation = createSelector(
  getPhase,
  phase => phase.equals(Just(2))
);

export const isRemovingEnabled = createSelector(
  getIsInCharacterCreation,
  getIsEditingHeroAfterCreationPhaseEnabled,
  (isInCharacterCreation, isEditingHeroAfterCreationPhaseEnabled) =>
    isInCharacterCreation || isEditingHeroAfterCreationPhaseEnabled
);
