import { createMaybeSelector } from '../utils/createMaybeSelector';
import { Maybe } from '../utils/dataUtils';
import { getPhase } from './stateSelectors';
import { getIsEditingHeroAfterCreationPhaseEnabled } from './uisettingsSelectors';

export const getIsInCharacterCreation = createMaybeSelector (
  getPhase,
  Maybe.elem (2)
);

export const getIsRemovingEnabled = createMaybeSelector (
  getIsInCharacterCreation,
  getIsEditingHeroAfterCreationPhaseEnabled,
  (isInCharacterCreation, isEditingHeroAfterCreationPhaseEnabled) =>
    isInCharacterCreation || isEditingHeroAfterCreationPhaseEnabled
);
