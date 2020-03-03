import { REDO, UNDO } from "../Constants/ActionTypes"
import { StaticData } from "../Models/Wiki/WikiModel"
import { getWikiBooks } from "../Selectors/stateSelectors"
import { ReduxAction } from "./Actions"

export interface UndoAction {
  type: UNDO
  payload: {
    books: StaticData["books"]
  }
}

export const undo = (): ReduxAction => (dispatch, getState) => {
  dispatch ({
    type: UNDO,
    payload: {
      books: getWikiBooks (getState ()),
    },
  })
}

export interface RedoAction {
  type: REDO
}

export const redo = (): RedoAction => ({
  type: REDO,
})
