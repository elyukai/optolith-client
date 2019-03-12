import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as RulesActions from '../App/Actions/RulesActions';
import { AppState } from '../reducers/appReducer';
import { getSortedBooks } from '../selectors/bookSelectors';
import { getRuleBooksEnabled, isEnableLanguageSpecializationsDeactivatable } from '../selectors/rulesSelectors';
import { getRules } from '../selectors/stateSelectors';
import { Maybe } from '../utils/dataUtils';
import { Rules, RulesDispatchProps, RulesOwnProps, RulesStateProps } from '../views/rules/Rules';

const mapStateToProps =
  (state: AppState, ownProps: RulesOwnProps): RulesStateProps => ({
    rules: getRules (state),
    sortedBooks: getSortedBooks (state, ownProps),
    ruleBooksEnabled: getRuleBooksEnabled (state),
    isEnableLanguageSpecializationsDeactivatable:
      isEnableLanguageSpecializationsDeactivatable (state),
  });

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  changeHigherParadeValues (id: Maybe<number>) {
    if (Maybe.isJust (id)) {
      dispatch (RulesActions.setHigherParadeValues (Maybe.fromJust (id)));
    }
  },
  changeAttributeValueLimit () {
    dispatch (RulesActions.switchAttributeValueLimit ());
  },
  switchEnableAllRuleBooks () {
    dispatch (RulesActions.switchEnableAllRuleBooks ());
  },
  switchEnableRuleBook (id: string) {
    dispatch (RulesActions.switchEnableRuleBook (id));
  },
  switchEnableLanguageSpecializations () {
    dispatch (RulesActions.switchEnableLanguageSpecializations ());
  },
});

export const connectRules =
  connect<RulesStateProps, RulesDispatchProps, RulesOwnProps, AppState> (
    mapStateToProps,
    mapDispatchToProps
  );

export const RulesContainer = connectRules (Rules);
