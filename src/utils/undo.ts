import { first, last } from 'lodash';
import { Action } from 'redux';
import * as ActionTypes from '../constants/ActionTypes';

export interface UndoState<S> {
	past: S[];
	present: S;
	future: S[];
}

export function undo<S>(reducer: (state: S | undefined, action: Action) => S, resetActionTypes?: string[]): (state: UndoState<S>, action: Action) => UndoState<S> {
	const initialState: UndoState<S> = {
		past: [],
		present: reducer(undefined, {}),
		future: []
	};

	return function undoHandler(state: UndoState<S> = initialState, action: Action) {
		const { past, future, present } = state;
		switch (action.type) {
			case ActionTypes.UNDO: {
				const previous = last(past);
				const newPast = past.slice(0, past.length - 1);
				if (previous) {
					return {
						past: newPast,
						present: previous,
						future: [present, ...future]
					};
				}
				return state;
			}

			case ActionTypes.REDO: {
				const next = first(future);
				const newFuture = future.slice(1);
				if (next) {
					return {
						future: newFuture,
						present: next,
						past: [...past, present]
					};
				}
				return state;
			}

			default: {
				const newPresent = reducer(present, action);
				if (present === newPresent) {
					return state;
				}
				if (resetActionTypes && resetActionTypes.includes(action.type)) {
					return {
						past: [],
						present: newPresent,
						future: []
					};
				}
				return {
					past: [...past, present],
					present: newPresent,
					future: []
				};
			}
		}
	};
}
