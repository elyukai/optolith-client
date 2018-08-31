import { createSelector } from 'reselect';
import { Maybe } from '../utils/dataUtils';
import { getPhase } from './stateSelectors';
import { getIsEditingHeroAfterCreationPhaseEnabled } from './uisettingsSelectors';

export const getIsInCharacterCreation = createSelector (
  getPhase,
  Maybe.elem (2)
);

export const getIsRemovingEnabled = createSelector (
  getIsInCharacterCreation,
  getIsEditingHeroAfterCreationPhaseEnabled,
  (isInCharacterCreation, isEditingHeroAfterCreationPhaseEnabled) =>
    isInCharacterCreation || isEditingHeroAfterCreationPhaseEnabled
);
