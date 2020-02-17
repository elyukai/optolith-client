import { ipcRenderer, remote } from "electron"
import { connect } from "react-redux"
import { Action } from "redux"
import { Nothing } from "../../Data/Maybe"
import { ReduxDispatch } from "../Actions/Actions"
import * as IOActions from "../Actions/IOActions"
import { AppState, AppStateRecord } from "../Models/AppState"
import { getCurrentHeroPresent, getCurrentTab, getWiki } from "../Selectors/stateSelectors"
import { areAnimationsEnabled, getTheme } from "../Selectors/uisettingsSelectors"
import { App, AppDispatchProps, AppOwnProps, AppStateProps } from "../Views/App"

const mapStateToProps = (state: AppStateRecord): AppStateProps => ({
  currentTab: getCurrentTab (state),
  mhero: getCurrentHeroPresent (state),
  staticData: getWiki (state),
  theme: getTheme (state),
  isLoading: AppState.A.isLoading (state),
  areAnimationsEnabled: areAnimationsEnabled (state),
  platform: remote.process.platform,
})

const mapDispatchToProps = (dispatch: ReduxDispatch<Action>) => ({
  minimize () {
    remote.getCurrentWindow ().minimize ()
  },
  maximize () {
    remote.getCurrentWindow ().maximize ()
  },
  restore () {
    remote.getCurrentWindow ().unmaximize ()
  },
  close () {
    dispatch (IOActions.requestClose (Nothing))
  },
  closeDuringLoad () {
    remote .getCurrentWindow () .close ()
  },
  enterFullscreen () {
    remote.getCurrentWindow ().setFullScreen (true)
  },
  leaveFullscreen () {
    remote.getCurrentWindow ().setFullScreen (false)
  },
  checkForUpdates () {
    ipcRenderer.send ("check-for-updates")
  },
})

const connectApp = connect<AppStateProps, AppDispatchProps, AppOwnProps, AppStateRecord> (
  mapStateToProps,
  mapDispatchToProps
)

export const AppContainer = connectApp (App)
