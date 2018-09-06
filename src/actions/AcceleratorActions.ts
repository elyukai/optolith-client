import { remote } from 'electron';
import { getIsHeroSection } from '../selectors/uilocationSelectors';
import { AsyncAction } from '../types/actions';
import { isDialogOpen } from '../utils/SubwindowsUtils';
import { _saveHero } from './HerolistActions';
import { redo, undo } from './HistoryActions';
import { requestClose } from './IOActions';
import { setTab } from './LocationActions';
import { openSettings } from './SubwindowsActions';

export const undoAccelerator = (): AsyncAction => (dispatch, getState) => {
  if (!isDialogOpen () && getIsHeroSection (getState ())) {
    dispatch (undo ());
  }
};

export const redoAccelerator = (): AsyncAction => (dispatch, getState) => {
  if (!isDialogOpen () && getIsHeroSection (getState ())) {
    dispatch (redo ());
  }
};

export const saveHeroAccelerator = (): AsyncAction => (dispatch, getState) => {
  if (!isDialogOpen () && getIsHeroSection (getState ())) {
    dispatch (_saveHero ());
  }
};

export const backAccelerator = (): AsyncAction => (dispatch, getState) => {
  if (!isDialogOpen () && getIsHeroSection (getState ())) {
    dispatch (setTab ('herolist'));
  }
};

export const openSettingsAccelerator = (): AsyncAction => dispatch => {
  if (!isDialogOpen ()) {
    dispatch (openSettings ());
  }
};

export const quitAccelerator = (): AsyncAction => dispatch => {
  dispatch (requestClose (() => remote.app.quit ()));
};
