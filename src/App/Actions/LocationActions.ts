import { AsyncAction } from '../../types/actions';
import { ActionTypes } from '../Constants/ActionTypes';
import { isDialogOpen } from '../Selectors/subwindowsSelectors';
import { TabId } from '../Utils/LocationUtils';

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
