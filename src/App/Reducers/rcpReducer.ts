import { ident } from "../../Data/Function"
import { set } from "../../Data/Lens"
import { Just, Nothing } from "../../Data/Maybe"
import { SelectCultureAction } from "../Actions/CultureActions"
import { SelectProfessionAction } from "../Actions/ProfessionActions"
import { SelectProfessionVariantAction } from "../Actions/ProfessionVariantActions"
import { SelectRaceAction, SetRaceVariantAction } from "../Actions/RaceActions"
import * as ActionTypes from "../Constants/ActionTypes"
import { HeroModelL, HeroModelRecord } from "../Models/Hero/Hero"
import { pipe } from "../Utilities/pipe"

type Action = SelectRaceAction
            | SetRaceVariantAction
            | SelectCultureAction
            | SelectProfessionAction
            | SelectProfessionVariantAction

export const rcpReducer =
  (action: Action): ident<HeroModelRecord> => {
    switch (action.type) {
      case ActionTypes.SELECT_RACE:
        return pipe (
          set (HeroModelL.race) (Just (action.payload.id)),
          set (HeroModelL.raceVariant) (action.payload.variantId),
          set (HeroModelL.culture) (Nothing),
          set (HeroModelL.profession) (Nothing),
          set (HeroModelL.professionVariant) (Nothing)
        )

      case ActionTypes.SET_RACE_VARIANT:
        return pipe (
          set (HeroModelL.raceVariant) (Just (action.payload.id)),
          set (HeroModelL.culture) (Nothing),
          set (HeroModelL.profession) (Nothing),
          set (HeroModelL.professionVariant) (Nothing)
        )

      case ActionTypes.SELECT_CULTURE:
        return pipe (
          set (HeroModelL.culture) (Just (action.payload.id)),
          set (HeroModelL.profession) (Nothing),
          set (HeroModelL.professionVariant) (Nothing)
        )

      case ActionTypes.SELECT_PROFESSION:
        return pipe (
          set (HeroModelL.profession) (Just (action.payload.id)),
          set (HeroModelL.professionVariant) (action.payload.var_id)
        )

      case ActionTypes.SELECT_PROFESSION_VARIANT:
        return set (HeroModelL.professionVariant) (action.payload.id)

      default:
        return ident
    }
  }
