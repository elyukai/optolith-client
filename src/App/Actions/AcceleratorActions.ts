import { remote } from "electron";
import { Just, Nothing } from "../../Data/Maybe";
import { L10nRecord } from "../Models/Wiki/L10n";
import { getIsHeroSection } from "../Selectors/uilocationSelectors";
import { isDialogOpen } from "../Utils/SubwindowsUtils";
import { AsyncAction } from "./Actions";
import { saveHero } from "./HerolistActions";
import { redo, undo } from "./HistoryActions";
import { requestClose } from "./IOActions";
import { setTab } from "./LocationActions";
import { openSettings } from "./SubwindowsActions";

export const undoAccelerator = (): AsyncAction => (dispatch, getState) => {
  if (!isDialogOpen () && getIsHeroSection (getState ())) {
    dispatch (undo ())
  }
}

export const redoAccelerator = (): AsyncAction => (dispatch, getState) => {
  if (!isDialogOpen () && getIsHeroSection (getState ())) {
    dispatch (redo ())
  }
}

export const saveHeroAccelerator = (l10n: L10nRecord): AsyncAction =>
  (dispatch, getState) => {
    if (!isDialogOpen () && getIsHeroSection (getState ())) {
      dispatch (saveHero (l10n) (Nothing))
    }
  }

export const backAccelerator = (): AsyncAction => (dispatch, getState) => {
  if (!isDialogOpen () && getIsHeroSection (getState ())) {
    dispatch (setTab ("herolist"))
  }
}

export const openSettingsAccelerator = (): AsyncAction => dispatch => {
  if (!isDialogOpen ()) {
    dispatch (openSettings ())
  }
}

export const quitAccelerator: AsyncAction = dispatch => {
  dispatch (requestClose (Just (remote.app.quit)))
}
