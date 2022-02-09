import * as remote from "@electron/remote"
import { Just } from "../../Data/Maybe"
import { getCurrentHeroId } from "../Selectors/stateSelectors"
import { getIsHeroSection } from "../Selectors/uilocationSelectors"
import { TabId } from "../Utilities/LocationUtils"
import { isDialogOpen } from "../Utilities/SubwindowsUtils"
import { ReduxAction } from "./Actions"
import { saveHero } from "./HerolistActions"
import { redo, undo } from "./HistoryActions"
import { requestClose } from "./IOActions"
import { setTab } from "./LocationActions"
import { openSettings } from "./SubwindowsActions"

export const undoAccelerator = (): ReduxAction => (dispatch, getState) => {
  if (!isDialogOpen () && getIsHeroSection (getState ())) {
    dispatch (undo ())
  }
}

export const redoAccelerator = (): ReduxAction => (dispatch, getState) => {
  if (!isDialogOpen () && getIsHeroSection (getState ())) {
    dispatch (redo ())
  }
}

export const saveHeroAccelerator: ReduxAction<Promise<void>> =
  async (dispatch, getState) => {
    const heroId = getCurrentHeroId (getState ())

    if (!isDialogOpen () && getIsHeroSection (getState ()) && heroId.isJust) {
      await dispatch (saveHero (heroId.value))
    }
  }

export const backAccelerator = (): ReduxAction => (dispatch, getState) => {
  if (!isDialogOpen () && getIsHeroSection (getState ())) {
    dispatch (setTab (TabId.Herolist))
  }
}

export const openSettingsAccelerator = (): ReduxAction => dispatch => {
  if (!isDialogOpen ()) {
    dispatch (openSettings ())
  }
}

export const quitAccelerator: ReduxAction = dispatch => {
  dispatch (requestClose (Just (remote.app.quit)))
}
