import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as AlertActions from '../actions/AlertActions';
import { AppState } from '../reducers/app';
import { getCurrentAlert } from '../selectors/stateSelectors';
import { Alerts, AlertsDispatchProps, AlertsOwnProps, AlertsStateProps } from '../views/alerts/Alerts';

function mapStateToProps(state: AppState) {
	return {
		options: getCurrentAlert(state)
	};
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
	return {
		close() {
			dispatch(AlertActions.removeAlert());
		},
		dispatch
	};
}

export const AlertsContainer = connect<AlertsStateProps, AlertsDispatchProps, AlertsOwnProps>(mapStateToProps, mapDispatchToProps)(Alerts);
