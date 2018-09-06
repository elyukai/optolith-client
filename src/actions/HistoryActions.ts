import { ActionTypes } from '../constants/ActionTypes';
import { getWikiBooks } from '../selectors/stateSelectors';
import { AsyncAction } from '../types/actions';
import { WikiAll } from '../types/wiki';

export interface UndoAction {
  type: ActionTypes.UNDO;
  payload: {
    books: WikiAll['books'];
  };
}

export const undo = (): AsyncAction => (dispatch, getState) => {
  dispatch ({
    type: ActionTypes.UNDO,
    payload: {
      books: getWikiBooks (getState ())
    }
  });
};

export interface RedoAction {
  type: ActionTypes.REDO;
}

export const redo = (): RedoAction => ({
  type: ActionTypes.REDO
});
