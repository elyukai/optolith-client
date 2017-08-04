import { connect, Dispatch } from 'react-redux';
import { Action } from 'redux';
import * as RulesActions from '../actions/RulesActions';
import { AppState } from '../reducers/app';
import { getRules } from '../selectors/rulesSelectors';
import { OptionalRules, OptionalRulesDispatchProps, OptionalRulesOwnProps, OptionalRulesStateProps } from '../views/profile/OptionalRules';

function mapStateToProps(state: AppState) {
	return {
		rules: getRules(state)
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
