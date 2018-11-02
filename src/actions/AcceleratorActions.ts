import { remote } from 'electron';
import { getIsHeroSection } from '../selectors/uilocationSelectors';
import { AsyncAction } from '../types/actions';
import { UIMessagesObject } from '../types/ui';
import { Just, Nothing } from '../utils/dataUtils';
import { isDialogOpen } from '../utils/SubwindowsUtils';
import { saveHero } from './HerolistActions';
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

export const saveHeroAccelerator = (locale: UIMessagesObject): AsyncAction =>
  (dispatch, getState) => {
    if (!isDialogOpen () && getIsHeroSection (getState ())) {
      dispatch (saveHero (locale) (Nothing ()));
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

export const quitAccelerator: AsyncAction = dispatch => {
  dispatch (requestClose (Just (remote.app.quit)));
};
