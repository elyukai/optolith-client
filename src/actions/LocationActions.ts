import { TabId } from '../App/Utils/LocationUtils';
import { ActionTypes } from '../constants/ActionTypes';
import { isDialogOpen } from '../selectors/subwindowsSelectors';
import { AsyncAction } from '../types/actions';

export interface SetTabAction {
  type: ActionTypes.SET_TAB;
  payload: {
    tab: TabId;
  };
}

export const setTab = (tab: TabId): SetTabAction => ({
  type: ActionTypes.SET_TAB,
  payload: {
    tab,
  },
});

export const showAbout: AsyncAction = (dispatch, getState) => {
  const alert = isDialogOpen (getState ());
  if (!alert) {
    dispatch (setTab ('imprint'));
  }
};
