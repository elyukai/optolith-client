import { ident } from "../../Data/Function"
import { over } from "../../Data/Lens"
import { add } from "../../Data/Num"
import { AddAdventurePointsAction } from "../Actions/ProfileActions"
import * as ActionTypes from "../Constants/ActionTypes"
import { HeroModelL, HeroModelRecord } from "../Models/Hero/HeroModel"

type Action = AddAdventurePointsAction

const { adventurePointsTotal } = HeroModelL

export const adventurePointsReducer =
  (action: Action): ident<HeroModelRecord> => {
    switch (action.type) {
      case ActionTypes.ADD_ADVENTURE_POINTS:
        return over (adventurePointsTotal) (add (action.payload.amount))

      default:
        return ident
    }
  }
