import * as RulesActions from '../actions/RulesActions';
import { ActionTypes } from '../constants/ActionTypes';
import * as Data from '../types/data';
import { Record } from '../utils/dataUtils';

type Action =
  RulesActions.SetHigherParadeValuesAction |
  RulesActions.SwitchAttributeValueLimitAction |
  RulesActions.SwitchEnableAllRuleBooksAction |
  RulesActions.SwitchEnableRuleBookAction |
  RulesActions.SwitchEnableLanguageSpecializationsAction;

export function rulesReducer(
  state: Record<Data.HeroDependent>,
  action: Action
): Record<Data.HeroDependent> {
  switch (action.type) {
    case ActionTypes.SET_HIGHER_PARADE_VALUES:
      return state.modify(
        rules => rules.insert('higherParadeValues', action.payload.value),
        'rules'
      );

    case ActionTypes.SWITCH_ATTRIBUTE_VALUE_LIMIT:
      return state.modify(
        rules => rules.modify(x => !x, 'attributeValueLimit'),
        'rules'
      );

    case ActionTypes.SWITCH_ENABLE_ALL_RULE_BOOKS:
      return state.modify(
        rules => rules.modify(x => !x, 'enableAllRuleBooks'),
        'rules'
      );

    case ActionTypes.SWITCH_ENABLE_RULE_BOOK: {
      const { id } = action.payload;

      return state.modify(
        rules => rules.modify(
          set => set.member(id) ? set.insert(id) : set.delete(id),
          'enabledRuleBooks'
        ),
        'rules'
      );
    }

    case ActionTypes.SWITCH_ENABLE_LANGUAGE_SPECIALIZATIONS:
      return state.modify(
        rules => rules.modify(x => !x, 'enableLanguageSpecializations'),
        'rules'
      );

    default:
      return state;
  }
}
