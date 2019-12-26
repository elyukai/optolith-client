import { ident } from "../../Data/Function";
import { fmap } from "../../Data/Functor";
import { over, set } from "../../Data/Lens";
import { fromJust, isJust, Just, Nothing } from "../../Data/Maybe";
import * as PactActions from "../Actions/PactActions";
import * as ActionTypes from "../Constants/ActionTypes";
import { HeroModelL, HeroModelRecord } from "../Models/Hero/HeroModel";
import { Pact, PactL } from "../Models/Hero/Pact";

type Action = PactActions.SetPactCategoryAction
            | PactActions.SetPactLevelAction
            | PactActions.SetTargetDomainAction
            | PactActions.SetTargetNameAction
            | PactActions.SetTargetTypeAction

export const pactReducer =
  (action: Action): ident<HeroModelRecord> => {
    switch (action.type) {
      case ActionTypes.SET_PACT_CATEGORY: {
        const { category } = action.payload

        if (isJust (category)) {
          return set (HeroModelL.pact)
                     (Just (Pact ({
                       category: fromJust (category),
                       level: 1,
                       type: 1,
                       domain: "",
                       name: "",
                     })))
        }

        return set (HeroModelL.pact) (Nothing)
      }

      case ActionTypes.SET_PACT_LEVEL:
        return over (HeroModelL.pact)
                    (fmap (set (PactL.level) (action.payload.level)))

      case ActionTypes.SET_TARGET_TYPE:
        return over (HeroModelL.pact)
                    (fmap (set (PactL.type) (action.payload.type)))

      case ActionTypes.SET_TARGET_DOMAIN:
        return over (HeroModelL.pact)
                    (fmap (set (PactL.domain) (action.payload.domain)))

      case ActionTypes.SET_TARGET_NAME:
        return over (HeroModelL.pact)
                    (fmap (set (PactL.name) (action.payload.name)))

      default:
        return ident
    }
  }
