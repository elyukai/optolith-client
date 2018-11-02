import { ipcRenderer, remote } from 'electron';
import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as IOActions from '../actions/IOActions';
import { AppState } from '../reducers/appReducer';
import { getCurrentTab, getLocaleMessages } from '../selectors/stateSelectors';
import { areAnimationsEnabled, getTheme } from '../selectors/uisettingsSelectors';
import { Nothing } from '../utils/dataUtils';
import { App, AppDispatchProps, AppOwnProps, AppStateProps } from '../views/App';

const mapStateToProps = (state: AppState) => ({
  currentTab: getCurrentTab (state),
  locale: getLocaleMessages (state),
  theme: getTheme (state),
  areAnimationsEnabled: areAnimationsEnabled (state),
  platform: remote.process.platform,
});

const mapDispatchToProps = (dispatch: Dispatch<Action, AppState>) => ({
  minimize () {
    remote.getCurrentWindow ().minimize ();
  },
  maximize () {
    remote.getCurrentWindow ().maximize ();
  },
  restore () {
    remote.getCurrentWindow ().unmaximize ();
  },
  close () {
    dispatch (IOActions.requestClose (Nothing ()));
  },
  enterFullscreen () {
    remote.getCurrentWindow ().setFullScreen (true);
  },
  leaveFullscreen () {
    remote.getCurrentWindow ().setFullScreen (false);
  },
  checkForUpdates () {
    ipcRenderer.send ('check-for-updates');
  },
});

const connectApp = connect<AppStateProps, AppDispatchProps, AppOwnProps, AppState> (
  mapStateToProps,
  mapDispatchToProps
);

export const AppContainer = connectApp (App);
