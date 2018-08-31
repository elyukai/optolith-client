import { ActionTypes } from '../constants/ActionTypes';
import { WikiAll } from '../types/wiki';

export interface UndoAction {
  type: ActionTypes.UNDO;
  payload: {
    books: WikiAll['books'];
  };
}

export function undo (): UndoAction {
  return {
    type: ActionTypes.UNDO
  };
}

export interface RedoAction {
  type: ActionTypes.REDO;
}

export function redo (): RedoAction {
  return {
    type: ActionTypes.REDO
  };
}
