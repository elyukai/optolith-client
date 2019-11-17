import { connect } from "react-redux";
import { Action, Dispatch } from "redux";
import * as AlertActions from "../Actions/AlertActions";
import { AppStateRecord } from "../Reducers/appReducer";
import { getCurrentAlert } from "../Selectors/stateSelectors";
import { getTheme } from "../Selectors/uisettingsSelectors";
import { Alerts, AlertsDispatchProps, AlertsOwnProps, AlertsStateProps } from "../Views/Alerts/Alerts";

const mapStateToProps = (state: AppStateRecord) => ({
  options: getCurrentAlert (state),
  theme: getTheme (state),
})

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  close () {
    dispatch (AlertActions.removeAlert ())
  },
})

const connectAlertsContainer =
  connect<AlertsStateProps, AlertsDispatchProps, AlertsOwnProps, AppStateRecord> (
    mapStateToProps, mapDispatchToProps
  )

export const AlertsContainer = connectAlertsContainer (Alerts)
