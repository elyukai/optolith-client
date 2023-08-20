import { connect } from "react-redux"
import { fmap } from "../../../Data/Functor"
import { subscriptF } from "../../../Data/List"
import { bind, bindF, ensure, isNothing } from "../../../Data/Maybe"
import { lookup } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { ReduxDispatch } from "../../Actions/Actions"
import { setRule } from "../../Actions/DisAdvActions"
import { ActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent"
import { toActiveObjectWithId } from "../../Models/ActiveEntries/ActiveObjectWithId"
import { AppStateRecord } from "../../Models/AppState"
import { HeroModel } from "../../Models/Hero/HeroModel"
import { Advantage, isAdvantage } from "../../Models/Wiki/Advantage"
import { Disadvantage, isDisadvantage } from "../../Models/Wiki/Disadvantage"
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility"
import { getCurrentHeroPresent, getWiki } from "../../Selectors/stateSelectors"
import { pipe } from "../../Utilities/pipe"
import { getWikiEntry } from "../../Utilities/WikiUtils"
import { WikiInfoSelector } from "./WikiInfo"
import {
  WikiInfoCustomRule, WikiInfoCustomRuleDispatchProps,
  WikiInfoCustomRuleOwnProps,
  WikiInfoCustomRuleStateProps,
} from "./WikiInfoCustomRule"


const mapStateToProps =
  (state: AppStateRecord, ownProps: WikiInfoCustomRuleOwnProps): WikiInfoCustomRuleStateProps => ({
    savedRule: ((): string => {
      if (isNothing (ownProps.selector)) {
        return ""
      }
      const selectorVal = ownProps.selector.value

      const mhero = getCurrentHeroPresent (state)

      if (isNothing (mhero)) {
        return ""
      }

      const hero = mhero.value
      const current_id = selectorVal.currentId
      const current_index = selectorVal.index

      const mwiki_entry =
        bind (getWikiEntry (getWiki (state)) (current_id))
        (ensure ((x): x is Record<Advantage> | Record<Disadvantage> | Record<SpecialAbility> =>
          isAdvantage (x) || isDisadvantage (x) || SpecialAbility.is (x)))

      console.log (mwiki_entry)

      const mhero_entry =
        bind (mwiki_entry)
        (x => lookup (current_id)
        (isAdvantage (x)
          ? HeroModel.AL.advantages (hero)
          : isDisadvantage (x)
            ? HeroModel.AL.disadvantages (hero)
            : HeroModel.AL.specialAbilities (hero)))
      console.log (mhero_entry)

      const mactive_entry =
        pipe (
          bindF (pipe (
            ActivatableDependent.A.active,
            subscriptF (current_index)
          )),
          fmap (toActiveObjectWithId (current_index) (current_id))
        )
        (mhero_entry)

      if (isNothing (mactive_entry)) {
        return ""
      }

      if (isNothing (mactive_entry.value.values.sid2)) {
        return ""
      }

      return mactive_entry.value.values.sid2.value.toString ()
    }) (),
  })

const mapDispatchToProps = (dispatch: ReduxDispatch): WikiInfoCustomRuleDispatchProps => ({
  saveRule (selector: WikiInfoSelector, rule: string) {
    dispatch (setRule (selector, rule))
  },
})

const connectWikiInfo =
  connect<WikiInfoCustomRuleStateProps, WikiInfoCustomRuleDispatchProps, WikiInfoCustomRuleOwnProps, AppStateRecord> (
    mapStateToProps,
    mapDispatchToProps
  )

export const WikiInfoCustomRuleContainer = connectWikiInfo (WikiInfoCustomRule)
