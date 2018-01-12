import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as RulesActions from '../actions/RulesActions';
import { AppState } from '../reducers/app';
import { getSortedBooks } from '../selectors/bookSelectors';
import { getRuleBooksEnabled, isEnableLanguageSpecializationsDeactivatable } from '../selectors/rulesSelectors';
import { getRules } from '../selectors/stateSelectors';
import { OptionalRules, OptionalRulesDispatchProps, OptionalRulesOwnProps, OptionalRulesStateProps } from '../views/profile/OptionalRules';

function mapStateToProps(state: AppState, props?: OptionalRulesOwnProps) {
	return {
		rules: getRules(state),
		sortedBooks: getSortedBooks(state, props!),
		ruleBooksEnabled: getRuleBooksEnabled(state),
		isEnableLanguageSpecializationsDeactivatable: isEnableLanguageSpecializationsDeactivatable(state),
	};
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
	return {
		changeHigherParadeValues(id: number) {
			dispatch(RulesActions._setHigherParadeValues(id));
		},
		changeAttributeValueLimit() {
			dispatch(RulesActions._switchAttributeValueLimit());
		},
		switchEnableAllRuleBooks() {
			dispatch(RulesActions.switchEnableAllRuleBooks());
		},
		switchEnableRuleBook(id: string) {
			dispatch(RulesActions.switchEnableRuleBook(id));
		},
		switchEnableLanguageSpecializations() {
			dispatch(RulesActions.switchEnableLanguageSpecializations());
		},
	};
}

export const RulesContainer = connect<OptionalRulesStateProps, OptionalRulesDispatchProps, OptionalRulesOwnProps>(mapStateToProps, mapDispatchToProps)(OptionalRules);
