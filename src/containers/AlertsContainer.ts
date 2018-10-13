import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as AlertActions from '../actions/AlertActions';
import { AppState } from '../reducers/appReducer';
import { getCurrentAlert } from '../selectors/stateSelectors';
import { Alerts, AlertsDispatchProps, AlertsOwnProps, AlertsStateProps } from '../views/alerts/Alerts';

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
