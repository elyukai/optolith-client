import { connect } from "react-redux";
import { Action, Dispatch } from "redux";
import * as RulesActions from "../Actions/RulesActions";
import { AppState } from "../Reducers/appReducer";
import { getSortedBooks } from "../Selectors/bookSelectors";
import { getRuleBooksEnabled, isEnableLanguageSpecializationsDeactivatable } from "../Selectors/rulesSelectors";
import { getRules } from "../Selectors/stateSelectors";
import { Rules, RulesDispatchProps, RulesOwnProps, RulesStateProps } from "../Views/Rules/Rules";

const mapStateToProps =
  (state: AppState, ownProps: RulesOwnProps): RulesStateProps => ({
    rules: getRules (state),
    sortedBooks: getSortedBooks (state, ownProps),
    ruleBooksEnabled: getRuleBooksEnabled (state),
    isEnableLanguageSpecializationsDeactivatable:
      isEnableLanguageSpecializationsDeactivatable (state),
  })

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  changeHigherParadeValues (id: Maybe<number>) {
    if (Maybe.isJust (id)) {
      dispatch (RulesActions.setHigherParadeValues (Maybe.fromJust (id)))
    }
  },
  changeAttributeValueLimit () {
    dispatch (RulesActions.switchAttributeValueLimit ())
  },
  switchEnableAllRuleBooks () {
    dispatch (RulesActions.switchEnableAllRuleBooks ())
  },
  switchEnableRuleBook (id: string) {
    dispatch (RulesActions.switchEnableRuleBook (id))
  },
  switchEnableLanguageSpecializations () {
    dispatch (RulesActions.switchEnableLanguageSpecializations ())
  },
})

export const connectRules =
  connect<RulesStateProps, RulesDispatchProps, RulesOwnProps, AppState> (
    mapStateToProps,
    mapDispatchToProps
  )

export const RulesContainer = connectRules (Rules)
