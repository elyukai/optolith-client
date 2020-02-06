import { cnst, ident } from "../../Data/Function"
import { SwitchEnableEditingHeroAfterCreationPhaseAction } from "../Actions/ConfigActions"
import { CreateHeroAction, LoadHeroAction } from "../Actions/HerolistActions"
import { SetTabAction } from "../Actions/LocationActions"
import { SetSelectionsAction } from "../Actions/ProfessionActions"
import * as ActionTypes from "../Constants/ActionTypes"
import { TabId } from "../Utilities/LocationUtils"

type Action = SetTabAction
            | CreateHeroAction
            | LoadHeroAction
            | SetSelectionsAction
            | SwitchEnableEditingHeroAfterCreationPhaseAction

export const routeReducer =
  (action: Action): ident<TabId> => {
    switch (action.type) {
      case ActionTypes.SET_TAB:
        return cnst (action.payload.tab)

      case ActionTypes.CREATE_HERO:
        return cnst (TabId.Races)

      case ActionTypes.LOAD_HERO:
        return cnst (TabId.Profile)

      case ActionTypes.ASSIGN_RCP_OPTIONS:
        return cnst (TabId.Attributes)

      case ActionTypes.SWITCH_ENABLE_EDIT_AFTER_CREATION:
        return x => x === TabId.Advantages || x === TabId.Disadvantages ? TabId.Profile : x

      default:
        return ident
    }
  }
