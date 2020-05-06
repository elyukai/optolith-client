import { ProgressInfo } from "builder-util-runtime"
import { ipcRenderer } from "electron"
import { UpdateInfo } from "electron-updater"
import { List } from "../../Data/List"
import { elem, Just } from "../../Data/Maybe"
import * as ActionTypes from "../Constants/ActionTypes"
import { L10n } from "../Models/Wiki/L10n"
import { StaticData } from "../Models/Wiki/WikiModel"
import { getWiki } from "../Selectors/stateSelectors"
import { translate, translateP } from "../Utilities/I18n"
import { bytify } from "../Utilities/IOUtils"
import { ReduxAction } from "./Actions"
import { addAlert, addPrompt, AlertOptions, CustomPromptOptions, PromptButton } from "./AlertActions"

export interface SetUpdateDownloadProgressAction {
  type: ActionTypes.SET_UPDATE_DOWNLOAD_PROGRESS
  payload?: ProgressInfo
}

export const setUpdateDownloadProgress =
  (info?: ProgressInfo): SetUpdateDownloadProgressAction => ({
    type: ActionTypes.SET_UPDATE_DOWNLOAD_PROGRESS,
    payload: info,
  })

enum UpdateAvailableResponse {
 UpdateAndRestart, Cancel
}

export const updateAvailable =
  (info: UpdateInfo): ReduxAction =>
  async (dispatch, getState) => {
    const startDownloadingUpdate: ReduxAction = futureDispatch => {
      futureDispatch (setUpdateDownloadProgress ({
        total: 0,
        delta: 0,
        transferred: 0,
        percent: 0,
        bytesPerSecond: 0,
      }))
      ipcRenderer.send ("download-update")
    }

    const staticData = getWiki (getState ())

    const size = info.files.reduce ((sum, { size: fileSize = 0 }) => sum + fileSize, 0)

    const opts = CustomPromptOptions<UpdateAvailableResponse> ({
                   title: Just (translate (staticData) ("settings.newversionavailable.title")),
                   message: size > 0
                     ? translateP (staticData)
                                  ("settings.newversionavailable.messagewithsize")
                                  (List (
                                    info.version,
                                    bytify (L10n.A.id (StaticData.A.ui (staticData))) (size)
                                  ))
                     : translateP (staticData)
                                  ("settings.newversionavailable.message")
                                  (List (info.version)),
                   buttons: List (
                     PromptButton ({
                       label: translate (staticData) ("settings.newversionavailable.updatebtn"),
                       response: UpdateAvailableResponse.UpdateAndRestart,
                     }),
                     PromptButton ({
                       label: translate (staticData) ("general.dialogs.cancelbtn"),
                       response: UpdateAvailableResponse.Cancel,
                     })
                   ),
                 })

    const res = await dispatch (addPrompt (opts))

    if (elem (UpdateAvailableResponse.UpdateAndRestart) (res)) {
      dispatch (startDownloadingUpdate)
    }
  }

export const updateNotAvailable = (): ReduxAction => async (dispatch, getState) =>
  dispatch (addAlert (AlertOptions ({
                       title: Just (translate (getWiki (getState ()))
                                              ("settings.nonewversionavailable.title")),
                       message: translate (getWiki (getState ()))
                                          ("settings.nonewversionavailable.message"),
                     })))
