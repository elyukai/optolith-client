import { cnst, ident } from "../../Data/Function";
import { SwitchEnableEditingHeroAfterCreationPhaseAction } from "../Actions/ConfigActions";
import { CreateHeroAction, LoadHeroAction } from "../Actions/HerolistActions";
import { SetTabAction } from "../Actions/LocationActions";
import { SetSelectionsAction } from "../Actions/ProfessionActions";
import { ActionTypes } from "../Constants/ActionTypes";
import { TabId } from "../Utilities/LocationUtils";

type Action = SetTabAction
            | CreateHeroAction
            | LoadHeroAction
            | SetSelectionsAction
            | SwitchEnableEditingHeroAfterCreationPhaseAction

export const initialTab: TabId = "herolist"

export const routeReducer =
(action: Action): ident<TabId> => {
  switch (action.type) {
    case ActionTypes.SET_TAB:
      return cnst (action.payload.tab)

    case ActionTypes.CREATE_HERO:
      return cnst ("races")

    case ActionTypes.LOAD_HERO:
      return cnst ("profile")

    case ActionTypes.ASSIGN_RCP_OPTIONS:
      return cnst ("attributes")

    case ActionTypes.SWITCH_ENABLE_EDITING_HERO_AFTER_CREATION_PHASE:
      return x => x === "advantages" || x === "disadvantages" ? "profile" : x

    default:
      return ident
  }
}
