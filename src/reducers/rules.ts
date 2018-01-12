import { CreateHeroAction, LoadHeroAction } from '../actions/HerolistActions';
import { ReceiveInitialDataAction } from '../actions/IOActions';
import { SetHigherParadeValuesAction, SwitchAttributeValueLimitAction, SwitchEnableAllRuleBooksAction, SwitchEnableLanguageSpecializationsAction, SwitchEnableRuleBookAction } from '../actions/RulesActions';
import * as ActionTypes from '../constants/ActionTypes';

type Action = ReceiveInitialDataAction | LoadHeroAction | CreateHeroAction | SetHigherParadeValuesAction | SwitchAttributeValueLimitAction | SwitchEnableAllRuleBooksAction | SwitchEnableRuleBookAction | SwitchEnableLanguageSpecializationsAction;

export interface RulesState {
	higherParadeValues: number;
	attributeValueLimit: boolean;
	enableAllRuleBooks: boolean;
	enabledRuleBooks: Set<string>;
	enableLanguageSpecializations: boolean;
}

const initialState: RulesState = {
	higherParadeValues: 0,
	attributeValueLimit: false,
	enableAllRuleBooks: false,
	enabledRuleBooks: new Set(),
	enableLanguageSpecializations: false,
};

export function rules(state: RulesState = initialState, action: Action): RulesState {
	switch (action.type) {
		case ActionTypes.CREATE_HERO: {
			const { enableAllRuleBooks, enabledRuleBooks } = action.payload;
			return {
				...initialState,
				enableAllRuleBooks,
				enabledRuleBooks,
			};
		}

		case ActionTypes.LOAD_HERO:
			return {
				...initialState,
				...action.payload.data.rules,
				enabledRuleBooks: new Set(action.payload.data.rules.enabledRuleBooks)
			};

		case ActionTypes.SET_HIGHER_PARADE_VALUES:
			return { ...state, higherParadeValues: action.payload.value };

		case ActionTypes.SWITCH_ATTRIBUTE_VALUE_LIMIT:
			return { ...state, attributeValueLimit: !state.attributeValueLimit };

		case ActionTypes.SWITCH_ENABLE_ALL_RULE_BOOKS:
			return { ...state, enableAllRuleBooks: !state.enableAllRuleBooks };

		case ActionTypes.SWITCH_ENABLE_RULE_BOOK: {
			const { id } = action.payload;
			if (state.enabledRuleBooks.has(id)) {
				const set = new Set([...state.enabledRuleBooks]);
				set.delete(id);
				return { ...state, enabledRuleBooks: set };
			}
			return { ...state, enabledRuleBooks: new Set([...state.enabledRuleBooks, id]) };
		}

		case ActionTypes.SWITCH_ENABLE_LANGUAGE_SPECIALIZATIONS:
			return { ...state, enableLanguageSpecializations: !state.enableLanguageSpecializations };

		default:
			return state;
	}
}
