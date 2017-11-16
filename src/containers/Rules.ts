import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as RulesActions from '../actions/RulesActions';
import { AppState } from '../reducers/app';
import { getSortedBooks } from '../selectors/bookSelectors';
import { getRules } from '../selectors/rulesSelectors';
import { OptionalRules, OptionalRulesDispatchProps, OptionalRulesOwnProps, OptionalRulesStateProps } from '../views/profile/OptionalRules';

function mapStateToProps(state: AppState, props?: OptionalRulesOwnProps) {
	return {
		rules: getRules(state),
		sortedBooks: getSortedBooks(state, props!)
	};
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
	return {
		changeHigherParadeValues(id: number) {
			dispatch(RulesActions._setHigherParadeValues(id));
		},
		changeAttributeValueLimit() {
			dispatch(RulesActions._switchAttributeValueLimit());
		}
	};
}

export const RulesContainer = connect<OptionalRulesStateProps, OptionalRulesDispatchProps, OptionalRulesOwnProps>(mapStateToProps, mapDispatchToProps)(OptionalRules);
