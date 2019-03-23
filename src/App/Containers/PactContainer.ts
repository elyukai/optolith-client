import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as PactActions from '../App/Actions/PactActions';
import { AppState } from '../reducers/appReducer';
import { getIsPactValid, isPactEditable } from '../Selectors/pactSelectors';
import { getPact } from '../Selectors/stateSelectors';
import { Maybe } from '../Utilities/dataUtils';
import { PactSettings, PactSettingsDispatchProps, PactSettingsOwnProps, PactSettingsStateProps } from '../Views/Pact/Pact';

const mapStateToProps = (state: AppState): PactSettingsStateProps => ({
  pact: getPact (state),
  isPactValid: getIsPactValid (state),
  isPactEditable: isPactEditable (state),
});

const mapDispatchToProps = (dispatch: Dispatch<Action>): PactSettingsDispatchProps => ({
  setPactCategory (category: Maybe<number>) {
    dispatch (PactActions.setPactCategory (category));
  },
  setPactLevel (level: Maybe<number>) {
    if (Maybe.isJust (level)) {
      dispatch (PactActions.setPactLevel (Maybe.fromJust (level)));
    }
  },
  setTargetType (type: Maybe<number>) {
    if (Maybe.isJust (type)) {
      dispatch (PactActions.setPactTargetType (Maybe.fromJust (type)));
    }
  },
  setTargetDomain (domain: Maybe<number | string>) {
    if (Maybe.isJust (domain)) {
      dispatch (PactActions.setPactTargetDomain (Maybe.fromJust (domain)));
    }
  },
  setTargetName (name: string) {
    dispatch (PactActions.setPactTargetName (name));
  },
});

const connectPact =
  connect<PactSettingsStateProps, PactSettingsDispatchProps, PactSettingsOwnProps, AppState> (
    mapStateToProps,
    mapDispatchToProps
  );

export const PactContainer = connectPact (PactSettings);
