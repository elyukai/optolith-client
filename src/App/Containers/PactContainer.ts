import { connect } from "react-redux";
import { Maybe } from "../../Data/Maybe";
import { ReduxDispatch } from "../Actions/Actions";
import * as PactActions from "../Actions/PactActions";
import { AppStateRecord } from "../Reducers/appReducer";
import { getIsPactValid, isPactEditable } from "../Selectors/pactSelectors";
import { getPact } from "../Selectors/stateSelectors";
import { PactSettings, PactSettingsDispatchProps, PactSettingsOwnProps, PactSettingsStateProps } from "../Views/Pact/Pact";

const mapStateToProps =
  (state: AppStateRecord, ownProps: PactSettingsOwnProps): PactSettingsStateProps => ({
    pact: getPact (state),
    isPactValid: getIsPactValid (state),
    isPactEditable: isPactEditable (state, ownProps),
  })

const mapDispatchToProps = (dispatch: ReduxDispatch): PactSettingsDispatchProps => ({
  setPactCategory (category: Maybe<number>) {
    dispatch (PactActions.setPactCategory (category))
  },
  setPactLevel (level: Maybe<number>) {
    if (Maybe.isJust (level)) {
      dispatch (PactActions.setPactLevel (Maybe.fromJust (level)))
    }
  },
  setTargetType (type: Maybe<number>) {
    if (Maybe.isJust (type)) {
      dispatch (PactActions.setPactTargetType (Maybe.fromJust (type)))
    }
  },
  setTargetDomain (domain: Maybe<number | string>) {
    if (Maybe.isJust (domain)) {
      dispatch (PactActions.setPactTargetDomain (Maybe.fromJust (domain)))
    }
  },
  setTargetName (name: string) {
    dispatch (PactActions.setPactTargetName (name))
  },
})

const connectPact =
  connect<PactSettingsStateProps, PactSettingsDispatchProps, PactSettingsOwnProps, AppStateRecord> (
    mapStateToProps,
    mapDispatchToProps
  )

export const PactContainer = connectPact (PactSettings)
