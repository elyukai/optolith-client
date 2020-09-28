import { ProgressInfo } from "builder-util-runtime"
import { ipcRenderer, remote, webFrame } from "electron"
import { UpdateInfo } from "electron-updater"
import * as React from "react"
import { render } from "react-dom"
import { Provider } from "react-redux"
import { Action, applyMiddleware, createStore, Store } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import thunk from "redux-thunk"
import { backAccelerator, openSettingsAccelerator, quitAccelerator, redoAccelerator, saveHeroAccelerator, undoAccelerator } from "./App/Actions/AcceleratorActions"
import { ReduxDispatch } from "./App/Actions/Actions"
import { addAlert, addErrorAlert, AlertOptions } from "./App/Actions/AlertActions"
import { requestInitialData } from "./App/Actions/InitializationActions"
import { requestClose } from "./App/Actions/IOActions"
import { showAbout } from "./App/Actions/LocationActions"
import { setUpdateDownloadProgress, updateAvailable, updateNotAvailable } from "./App/Actions/UpdateActions"
import { AppContainer } from "./App/Containers/AppContainer"
import { AppState, AppStateRecord } from "./App/Models/AppState"
import { appReducer } from "./App/Reducers/appReducer"
import { getWiki } from "./App/Selectors/stateSelectors"
import { translate, translateP } from "./App/Utilities/I18n"
import { addKeybinding } from "./App/Utilities/Keybindings"
import { hasOwnProperty } from "./App/Utilities/Object"
import { pipe } from "./App/Utilities/pipe"
import { isDialogOpen } from "./App/Utilities/SubwindowsUtils"
import { flip } from "./Data/Function"
import { List } from "./Data/List"
import { Just } from "./Data/Maybe"
import { uncurryN } from "./Data/Tuple/Curry"
import { Unit } from "./Data/Unit"

webFrame.setZoomFactor (1)
webFrame.setVisualZoomLevelLimits (1, 1)

const nativeAppReducer =
  uncurryN (pipe ((x: AppStateRecord | undefined) => x === undefined ? AppState.default : x,
                  flip (appReducer)))

const store: Store<AppStateRecord, Action> & { dispatch: ReduxDispatch<Action> } =
  createStore (nativeAppReducer, composeWithDevTools (applyMiddleware (thunk)))

store
  .dispatch (requestInitialData)
  .then (() => {
    const { getState, dispatch } = store

    const staticData = getWiki (getState ())

    if (remote.process.platform === "darwin") {
      const menuTemplate: Electron.MenuItemConstructorOptions[] = [
        {
          label: remote.app.getName (),
          submenu: [
            {
              label: translateP (staticData)
                                ("macosmenubar.aboutapp")
                                (List (remote.app.getName ())),
              click: () => dispatch (showAbout),
            },
            { type: "separator" },
            { role: "hide" },
            { role: "hideOthers" },
            { role: "unhide" },
            { type: "separator" },
            {
              label: translate (staticData) ("macosmenubar.quit"),
              click: () => dispatch (requestClose (Just (remote.app.quit))),
            },
          ],
        },
        {
          label: translate (staticData) ("macosmenubar.edit"),
          submenu: [
            { role: "cut" },
            { role: "copy" },
            { role: "paste" },
            { role: "delete" },
            { role: "selectAll" },
          ],
        },
        {
          label: translate (staticData) ("macosmenubar.view"),
          submenu: [
            { role: "togglefullscreen" },
          ],
        },
        {
          role: "window",
          submenu: [
            { role: "minimize" },
            { type: "separator" },
            { role: "front" },
          ],
        },
      ]

      const menu = remote.Menu.buildFromTemplate (menuTemplate)
      remote.Menu.setApplicationMenu (menu)

      store.subscribe (() => {
        const areSubwindowsOpen = isDialogOpen ()
        type MenuItems = Electron.MenuItemConstructorOptions[]
        const appMenu = menuTemplate[0].submenu as MenuItems
        appMenu[0].enabled = !areSubwindowsOpen
        const currentMenu = remote.Menu.buildFromTemplate (menuTemplate)
        remote.Menu.setApplicationMenu (currentMenu)
      })

      addKeybinding ("command+q", () => {
        dispatch (quitAccelerator)
      })
    }

    addKeybinding ("mod+s", async () => {
      await dispatch (saveHeroAccelerator)
    })

    addKeybinding ("mod+z", () => {
      dispatch (undoAccelerator ())
    })

    addKeybinding ([ "mod+y", "mod+shift+z" ], () => {
      dispatch (redoAccelerator ())
    })

    addKeybinding ("mod+shift+z", () => {
      dispatch (redoAccelerator ())
    })

    addKeybinding ("mod+w", () => {
      dispatch (backAccelerator ())
    })

    addKeybinding ("mod+o", () => {
      dispatch (openSettingsAccelerator ())
    })

    ipcRenderer.send ("loading-done")

    return Unit
  })
  .catch (console.error)

render (
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.querySelector ("#bodywrapper")
)

ipcRenderer.addListener ("update-available", (_event: Event, info: UpdateInfo) => {
  const dispatch = store.dispatch as ReduxDispatch

  dispatch (updateAvailable (info))
})

ipcRenderer.addListener ("update-not-available", () => {
  const dispatch = store.dispatch as ReduxDispatch

  dispatch (updateNotAvailable ())
})

ipcRenderer.addListener ("download-progress", (_event: Event, progressObj: ProgressInfo) => {
  store.dispatch (setUpdateDownloadProgress (progressObj))
})

const isError = (err: Error | {}): err is Error => hasOwnProperty ("name") (err)
                                                   && hasOwnProperty ("message") (err)

ipcRenderer.addListener ("auto-updater-error", (_event: Event, err: Error | {}) => {
  const dispatch = store.dispatch as ReduxDispatch

  dispatch (setUpdateDownloadProgress ())

  console.error (err)

  if (isError (err)) {
    dispatch (addErrorAlert (AlertOptions ({
                              title: Just (`${err.name} during update`),
                              message: `An error occured during auto-update:\n${err.message}`,
                            })))
      .catch (console.error)
  }
  else {
    dispatch (addAlert (AlertOptions ({
                         title: Just ("Server Error"),
                         message: `The server does not respond.`,
                       })))
      .catch (console.error)
  }
})
