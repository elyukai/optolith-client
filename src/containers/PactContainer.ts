import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as PactActions from '../actions/PactActions';
import { AppState } from '../reducers/appReducer';
import { getIsPactValid, isPactEditable } from '../selectors/pactSelectors';
import { getPact } from '../selectors/stateSelectors';
import { PactSettings, PactSettingsDispatchProps, PactSettingsOwnProps, PactSettingsStateProps } from '../views/pact/Pact';

const mapStateToProps= (state: AppState) => ({
  pact: getPact(state),
  isPactValid: getIsPactValid(state),
  isPactEditable: isPactEditable(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  setPactCategory(category: number | undefined) {
    dispatch(PactActions.setPactCategory(category));
  },
  setPactLevel(level: number) {
    dispatch(PactActions.setPactLevel(level));
  },
  setTargetType(type: number) {
    dispatch(PactActions.setPactTargetType(type));
  },
  setTargetDomain(domain: number | string) {
    dispatch(PactActions.setPactTargetDomain(domain));
  },
  setTargetName(name: string) {
    dispatch(PactActions.setPactTargetName(name));
  },
});

const connectPact =
  connect<PactSettingsStateProps, PactSettingsDispatchProps, PactSettingsOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
  );

export const PactContainer = connectPact (PactSettings);
