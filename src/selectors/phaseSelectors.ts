import { createSelector } from 'reselect';
import { getPhase } from './stateSelectors';

export const isInCharacterCreation = createSelector(
	getPhase,
	phase => phase === 2
);

export const isInEditing = createSelector(
	getPhase,
	phase => phase === 4
);
