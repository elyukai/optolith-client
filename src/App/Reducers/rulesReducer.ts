import { not } from "../../Data/Bool"
import { ident } from "../../Data/Function"
import { over, set } from "../../Data/Lens"
import { toggle } from "../../Data/OrderedSet"
import * as RulesActions from "../Actions/RulesActions"
import * as ActionTypes from "../Constants/ActionTypes"
import { HeroModelL, HeroModelRecord } from "../Models/Hero/HeroModel"
import { RulesL } from "../Models/Hero/Rules"
import { composeL } from "../Utilities/compose"

type Action = RulesActions.SetHigherParadeValuesAction
            | RulesActions.SwitchAttributeValueLimitAction
            | RulesActions.SwitchEnableAllRuleBooksAction
            | RulesActions.SwitchEnableRuleBookAction
            | RulesActions.SwitchEnableLanguageSpecializationsAction

export const rulesReducer =
  (action: Action): ident<HeroModelRecord> => {
    switch (action.type) {
      case ActionTypes.SET_HIGHER_PARADE_VALUES:
        return set (composeL (HeroModelL.rules, RulesL.higherParadeValues))
                   (action.payload.value)

      case ActionTypes.SWITCH_ATTRIBUTE_VALUE_LIMIT:
        return over (composeL (HeroModelL.rules, RulesL.attributeValueLimit))
                    (not)

      case ActionTypes.SWITCH_ENABLE_ALL_RULE_BOOKS:
        return over (composeL (HeroModelL.rules, RulesL.enableAllRuleBooks))
                    (not)

      case ActionTypes.SWITCH_ENABLE_RULE_BOOK: {
        return over (composeL (HeroModelL.rules, RulesL.enabledRuleBooks))
                    (toggle (action.payload.id))
      }

      case ActionTypes.SWITCH_ENABLE_LANG_SPEC:
        return over (composeL (HeroModelL.rules, RulesL.enableLanguageSpecializations))
                    (not)

      default:
        return ident
    }
  }
