import { AsyncAction } from '../../types/actions';
import { ActionTypes } from '../Constants/ActionTypes';
import { WikiAll } from '../Models/Wiki/wikiTypeHelpers';
import { getWikiBooks } from '../Selectors/stateSelectors';

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
      books: getWikiBooks (getState ()),
    },
  });
};

export interface RedoAction {
  type: ActionTypes.REDO;
}

export const redo = (): RedoAction => ({
  type: ActionTypes.REDO,
});
