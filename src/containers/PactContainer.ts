import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as PactActions from '../actions/PactActions';
import { AppState } from '../reducers/app';
import { isPactEditable, isPactValid } from '../selectors/pactSelectors';
import { getPact } from '../selectors/stateSelectors';
import { PactSettings, PactSettingsDispatchProps, PactSettingsOwnProps, PactSettingsStateProps } from '../views/pact/Pact';

function mapStateToProps(state: AppState) {
	return {
		pact: getPact(state),
		isPactValid: isPactValid(state),
		isPactEditable: isPactEditable(state),
	};
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
	return {
		setPactCategory(category: number | undefined) {
			dispatch(PactActions.setPactCategory(category));
		},
		setPactLevel(level: number) {
			dispatch(PactActions.setPactLevel(level));
		},
		setTargetType(type: number) {
			dispatch(PactActions.setTargetType(type));
		},
		setTargetDomain(domain: number | string) {
			dispatch(PactActions.setTargetDomain(domain));
		},
		setTargetName(name: string) {
			dispatch(PactActions.setTargetName(name));
		},
	};
}

export const PactContainer = connect<PactSettingsStateProps, PactSettingsDispatchProps, PactSettingsOwnProps>(mapStateToProps, mapDispatchToProps)(PactSettings);
