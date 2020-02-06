import { ProgressInfo } from "builder-util-runtime"
import { ipcRenderer } from "electron"
import { UpdateInfo } from "electron-updater"
import * as React from "react"
import { render } from "react-dom"
import { Provider } from "react-redux"
import { Action, applyMiddleware, createStore, Store } from "redux"
import thunk from "redux-thunk"
import { ReduxDispatch } from "./App/Actions/Actions"
import { addErrorAlert, AlertOptions } from "./App/Actions/AlertActions"
import { setUpdateDownloadProgress, updateAvailable, updateNotAvailable } from "./App/Actions/IOActions"
import { AppContainer } from "./App/Containers/AppContainer"
import { AppState, AppStateRecord } from "./App/Models/AppState"
import { appReducer } from "./App/Reducers/appReducer"
import { getLocaleMessages } from "./App/Selectors/stateSelectors"
import { pipe } from "./App/Utilities/pipe"
import { parseStaticData } from "./App/Utilities/YAML"
import { flip } from "./Data/Function"
import { fromJust, isJust, Just } from "./Data/Maybe"
import { uncurryN } from "./Data/Tuple/Curry"

const nativeAppReducer =
  uncurryN (pipe ((x: AppStateRecord | undefined) => x === undefined ? AppState.default : x,
                  flip (appReducer)))

const store: Store<AppStateRecord, Action> & { dispatch: ReduxDispatch<Action> } =
  createStore (nativeAppReducer, applyMiddleware (thunk))

const test = async () => {
  await parseStaticData ("de-DE")
}

test () .catch (() => undefined)

// store
//   .dispatch (requestInitialData)
//   .then (() => {
//     const { getState, dispatch } = store

//     const maybeLocale = getLocaleMessages (getState ())

//     if (isJust (maybeLocale)) {
//       const locale = fromJust (maybeLocale)

//       if (remote.process.platform === "darwin") {
//         const menuTemplate: Electron.MenuItemConstructorOptions[] = [
//           {
//             label: remote.app.getName (),
//             submenu: [
//               {
//                 label: translateP (locale) ("aboutapp") (List (remote.app.getName ())),
//                 click: () => dispatch (showAbout),
//               },
//               { type: "separator" },
//               { role: "hide" },
//               { role: "hideOthers" },
//               { role: "unhide" },
//               { type: "separator" },
//               {
//                 label: translate (locale) ("quit"),
//                 click: () => dispatch (requestClose (Just (remote.app.quit))),
//               },
//             ],
//           },
//           {
//             label: translate (locale) ("edit"),
//             submenu: [
//               { role: "cut" },
//               { role: "copy" },
//               { role: "paste" },
//               { role: "delete" },
//               { role: "selectAll" },
//             ],
//           },
//           {
//             label: translate (locale) ("view"),
//             submenu: [
//               { role: "togglefullscreen" },
//             ],
//           },
//           {
//             role: "window",
//             submenu: [
//               { role: "minimize" },
//               { type: "separator" },
//               { role: "front" },
//             ],
//           },
//         ]

//         const menu = remote.Menu.buildFromTemplate (menuTemplate)
//         remote.Menu.setApplicationMenu (menu)

//         store.subscribe (() => {
//           const areSubwindowsOpen = isDialogOpen ()
//           type MenuItems = Electron.MenuItemConstructorOptions[]
//           const appMenu = menuTemplate[0].submenu as MenuItems
//           appMenu[0].enabled = !areSubwindowsOpen
//           const currentMenu = remote.Menu.buildFromTemplate (menuTemplate)
//           remote.Menu.setApplicationMenu (currentMenu)
//         })

//         addKeybinding ("command+q", () => {
//           dispatch (quitAccelerator)
//         })
//       }

//       addKeybinding ("mod+s", async () => {
//         await dispatch (saveHeroAccelerator (locale))
//       })
//     }

//     addKeybinding ("mod+z", () => {
//       dispatch (undoAccelerator ())
//     })

//     addKeybinding ([ "mod+y", "mod+shift+z" ], () => {
//       dispatch (redoAccelerator ())
//     })

//     addKeybinding ("mod+shift+z", () => {
//       dispatch (redoAccelerator ())
//     })

//     addKeybinding ("mod+w", () => {
//       dispatch (backAccelerator ())
//     })

//     addKeybinding ("mod+o", () => {
//       dispatch (openSettingsAccelerator ())
//     })

//     ipcRenderer.send ("loading-done")

//     return Unit
//   })
//   .catch (() => undefined)

render (
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.querySelector ("#bodywrapper")
)

ipcRenderer.addListener ("update-available", (_event: Event, info: UpdateInfo) => {
  const dispatch = store.dispatch as ReduxDispatch
  const maybeLocale = getLocaleMessages (store.getState ())

  if (isJust (maybeLocale)) {
    dispatch (updateAvailable (fromJust (maybeLocale)) (info))
  }
})

ipcRenderer.addListener ("update-not-available", () => {
  const dispatch = store.dispatch as ReduxDispatch
  const maybeLocale = getLocaleMessages (store.getState ())

  if (isJust (maybeLocale)) {
    dispatch (updateNotAvailable (fromJust (maybeLocale)))
  }
})

ipcRenderer.addListener ("download-progress", (_event: Event, progressObj: ProgressInfo) => {
  store.dispatch (setUpdateDownloadProgress (progressObj))
})

ipcRenderer.addListener ("auto-updater-error", (_event: Event, err: Error) => {
  const dispatch = store.dispatch as ReduxDispatch
  const maybeLocale = getLocaleMessages (store.getState ())

  if (isJust (maybeLocale)) {
    dispatch (setUpdateDownloadProgress ())
    dispatch (addErrorAlert (fromJust (maybeLocale))
                            (AlertOptions ({
                              title: Just ("Auto Update Error"),
                              message: `An error occured during auto-update.`
                                + ` (${JSON.stringify (err)})`,
                            })))
      .catch (() => undefined)
  }
})
