import * as ActionTypes from '../constants/ActionTypes';

export interface UndoAction {
	type: ActionTypes.UNDO;
}

export function undo(): UndoAction {
	return {
		type: ActionTypes.UNDO
	};
}

export interface RedoAction {
	type: ActionTypes.REDO;
}

export function redo(): RedoAction {
	return {
		type: ActionTypes.REDO
	};
}
