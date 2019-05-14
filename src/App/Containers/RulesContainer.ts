import { connect } from "react-redux";
import { Maybe } from "../../Data/Maybe";
import { ReduxDispatch } from "../Actions/Actions";
import * as RulesActions from "../Actions/RulesActions";
import { AppStateRecord } from "../Reducers/appReducer";
import { getSortedBooks } from "../Selectors/bookSelectors";
import { isEnableLanguageSpecializationsDeactivatable } from "../Selectors/rulesSelectors";
import { RulesDispatchProps, RulesOwnProps, RulesStateProps, RulesView } from "../Views/Rules/Rules";

const mapStateToProps =
  (state: AppStateRecord, ownProps: RulesOwnProps): RulesStateProps => ({
    sortedBooks: getSortedBooks (state, ownProps),
    isEnableLanguageSpecializationsDeactivatable:
      isEnableLanguageSpecializationsDeactivatable (state),
  })

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
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
  connect<RulesStateProps, RulesDispatchProps, RulesOwnProps, AppStateRecord> (
    mapStateToProps,
    mapDispatchToProps
  )

export const RulesContainer = connectRules (RulesView)
