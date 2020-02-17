import { connect } from "react-redux"
import { Maybe } from "../../Data/Maybe"
import { ReduxDispatch } from "../Actions/Actions"
import { setHeroLocale } from "../Actions/ProfileActions"
import * as RulesActions from "../Actions/RulesActions"
import { setGuildMageUnfamiliarSpellId } from "../Actions/SpecialAbilitiesActions"
import { AppStateRecord } from "../Models/AppState"
import { getGuildMageUnfamiliarSpellId } from "../Selectors/activatableSelectors"
import { getSortedBooks } from "../Selectors/bookSelectors"
import { isEnableLanguageSpecializationsDeactivatable } from "../Selectors/rulesSelectors"
import { getAllSpellsForManualGuildMageSelect } from "../Selectors/spellsSelectors"
import { getHeroLocale } from "../Selectors/stateSelectors"
import { Locale } from "../Utilities/Raw/JSON/Config"
import { RulesDispatchProps, RulesOwnProps, RulesStateProps, RulesView } from "../Views/Rules/Rules"

const mapStateToProps =
  (state: AppStateRecord, ownProps: RulesOwnProps): RulesStateProps => ({
    sortedBooks: getSortedBooks (state),
    isEnableLanguageSpecializationsDeactivatable:
      isEnableLanguageSpecializationsDeactivatable (state, ownProps),
    hero_locale: getHeroLocale (state, ownProps),
    mcurrent_guild_mage_spell: getGuildMageUnfamiliarSpellId (state, ownProps),
    all_spells_select_options: getAllSpellsForManualGuildMageSelect (state, ownProps),
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
  setGuildMageSpell (spellId: string) {
    dispatch (setGuildMageUnfamiliarSpellId (spellId))
  },
  setHeroLocale (locale: Locale) {
    dispatch (setHeroLocale (locale))
  },
})

export const connectRules =
  connect<RulesStateProps, RulesDispatchProps, RulesOwnProps, AppStateRecord> (
    mapStateToProps,
    mapDispatchToProps
  )

export const RulesContainer = connectRules (RulesView)
