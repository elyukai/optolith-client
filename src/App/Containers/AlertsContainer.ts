import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as AlertActions from '../App/Actions/AlertActions';
import { AppState } from '../reducers/appReducer';
import { getCurrentAlert } from '../Selectors/stateSelectors';
import { Alerts, AlertsDispatchProps, AlertsOwnProps, AlertsStateProps } from '../Views/Alerts/Alerts';

const mapStateToProps = (state: AppState) => ({
  options: getCurrentAlert (state),
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  close () {
    dispatch (AlertActions.removeAlert ());
  },
  dispatch,
});

const connectAlertsContainer =
  connect<AlertsStateProps, AlertsDispatchProps, AlertsOwnProps, AppState> (
    mapStateToProps, mapDispatchToProps
  );

export const AlertsContainer = connectAlertsContainer (Alerts);
