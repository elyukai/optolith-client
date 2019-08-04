import { ActionTypes } from "../Constants/ActionTypes";
import { WikiModel } from "../Models/Wiki/WikiModel";
import { getWikiBooks } from "../Selectors/stateSelectors";
import { ReduxAction } from "./Actions";

export interface UndoAction {
  type: ActionTypes.UNDO
  payload: {
    books: WikiModel["books"];
  }
}

export const undo = (): ReduxAction => (dispatch, getState) => {
  dispatch ({
    type: ActionTypes.UNDO,
    payload: {
      books: getWikiBooks (getState ()),
    },
  })
}

export interface RedoAction {
  type: ActionTypes.REDO
}

export const redo = (): RedoAction => ({
  type: ActionTypes.REDO,
})
