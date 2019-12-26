import { SET_TAB } from "../Constants/ActionTypes";
import { isDialogOpen } from "../Selectors/subwindowsSelectors";
import { TabId } from "../Utilities/LocationUtils";
import { ReduxAction } from "./Actions";

export interface SetTabAction {
  type: SET_TAB
  payload: {
    tab: TabId;
  }
}

export const setTab = (tab: TabId): SetTabAction => ({
  type: SET_TAB,
  payload: {
    tab,
  },
})

export const showAbout: ReduxAction = (dispatch, getState) => {
  const alert = isDialogOpen (getState ())
  if (!alert) {
    dispatch (setTab (TabId.Imprint))
  }
}
