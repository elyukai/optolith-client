import { createSelector } from 'reselect';
import { getPhase } from './stateSelectors';
import { isEditingHeroAfterCreationPhaseEnabled } from './uisettingsSelectors';

export const isInCharacterCreation = createSelector(
	getPhase,
	phase => phase === 2
);

export const isRemovingEnabled = createSelector(
	isInCharacterCreation,
	isEditingHeroAfterCreationPhaseEnabled,
	(isInCharacterCreation, isEditingHeroAfterCreationPhaseEnabled) => isInCharacterCreation || isEditingHeroAfterCreationPhaseEnabled
);
