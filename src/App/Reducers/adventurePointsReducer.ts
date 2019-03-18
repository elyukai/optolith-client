import { ident } from "../../Data/Function";
import { over } from "../../Data/Lens";
import { AddAdventurePointsAction } from "../Actions/ProfileActions";
import { ActionTypes } from "../Constants/ActionTypes";
import { HeroModelL, HeroModelRecord } from "../Models/Hero/HeroModel";
import { add } from "../Utilities/mathUtils";

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
