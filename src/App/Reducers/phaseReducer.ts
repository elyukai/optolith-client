import { ident } from "../../Data/Function"
import { set } from "../../Data/Lens"
import { SetSelectionsAction } from "../Actions/ProfessionActions"
import { EndHeroCreationAction } from "../Actions/ProfileActions"
import * as ActionTypes from "../Constants/ActionTypes"
import { HeroModelL, HeroModelRecord } from "../Models/Hero/HeroModel"

type Action =
  SetSelectionsAction |
  EndHeroCreationAction

export const phaseReducer =
  (action: Action): ident<HeroModelRecord> => {
    switch (action.type) {
      case ActionTypes.ASSIGN_RCP_OPTIONS:
        return set (HeroModelL.phase) (2)

      case ActionTypes.END_HERO_CREATION:
        return set (HeroModelL.phase) (3)

      default:
        return ident
    }
  }
