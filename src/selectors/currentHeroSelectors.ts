import { createSelector } from 'reselect';
import { AppState } from '../reducers/app';

export const getPast = (state: AppState) => state.currentHero.past;
export const getPresent = (state: AppState) => state.currentHero.present;
export const getFuture = (state: AppState) => state.currentHero.future;

export const getUndoAvailability = createSelector(
	[ getPast ],
	past => past.length > 0
);

export const getRedoAvailability = createSelector(
	[ getFuture ],
	future => future.length > 0
);
