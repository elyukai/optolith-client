import { connect } from "react-redux"
import { join } from "../../Data/Maybe"
import { Record } from "../../Data/Record"
import { ReduxDispatch } from "../Actions/Actions"
import * as ConfigActions from "../Actions/ConfigActions"
import * as DisAdvActions from "../Actions/DisAdvActions"
import { ActivatableActivationOptions } from "../Models/Actions/ActivatableActivationOptions"
import { ActivatableDeactivationOptions } from "../Models/Actions/ActivatableDeactivationOptions"
import { AppStateRecord } from "../Models/AppState"
import { HeroModel } from "../Models/Hero/HeroModel"
import { getAdvantagesRating, getFilteredActiveAdvantages } from "../Selectors/activatableSelectors"
import { getAPObjectMap, getMagicalAdvantagesDisadvantagesAdventurePointsMaximum } from "../Selectors/adventurePointsSelectors"
import { getFilteredInactiveAdvantages } from "../Selectors/combinedActivatablesSelectors"
import { getIsRemovingEnabled } from "../Selectors/phaseSelectors"
import { getAdvantagesFilterText, getInactiveAdvantagesFilterText } from "../Selectors/stateSelectors"
import { getAdvantagesDisadvantagesCultureRatingVisibility, getEnableActiveItemHints } from "../Selectors/uisettingsSelectors"
import { Advantages, AdvantagesDispatchProps, AdvantagesOwnProps, AdvantagesStateProps } from "../Views/DisAdvantages/Advantages"

const mapStateToProps =
  (state: AppStateRecord, ownProps: AdvantagesOwnProps): AdvantagesStateProps => ({
    activeList: getFilteredActiveAdvantages (state, ownProps),
    ap: join (getAPObjectMap (HeroModel.A.id (ownProps.hero)) (state, ownProps)),
    deactiveList:
      join (getFilteredInactiveAdvantages (HeroModel.A.id (ownProps.hero)) (state, ownProps)),
    enableActiveItemHints: getEnableActiveItemHints (state),
    isRemovingEnabled: getIsRemovingEnabled (state),
    magicalMax: getMagicalAdvantagesDisadvantagesAdventurePointsMaximum (state),
    rating: getAdvantagesRating (state, ownProps),
    showRating: getAdvantagesDisadvantagesCultureRatingVisibility (state),
    filterText: getAdvantagesFilterText (state),
    inactiveFilterText: getInactiveAdvantagesFilterText (state),
  })

const mapDispatchToProps = (
  dispatch: ReduxDispatch,
  { l10n: locale }: AdvantagesOwnProps
): AdvantagesDispatchProps => ({
  switchRatingVisibility () {
    dispatch (DisAdvActions.switchRatingVisibility ())
  },
  switchActiveItemHints () {
    dispatch (ConfigActions.switchEnableActiveItemHints ())
  },
  async addToList (args: Record<ActivatableActivationOptions>) {
    await dispatch (DisAdvActions.addDisAdvantage (locale) (args))
  },
  async removeFromList (args: Record<ActivatableDeactivationOptions>) {
    await dispatch (DisAdvActions.removeDisAdvantage (locale) (args))
  },
  async setLevel (id: string, index: number, level: number) {
    await dispatch (DisAdvActions.setDisAdvantageLevel (locale) (id) (index) (level))
  },
  setFilterText (filterText: string) {
    dispatch (DisAdvActions.setActiveAdvantagesFilterText (filterText))
  },
  setInactiveFilterText (filterText: string) {
    dispatch (DisAdvActions.setInactiveAdvantagesFilterText (filterText))
  },
})

const connectAdvantages =
  connect<AdvantagesStateProps, AdvantagesDispatchProps, AdvantagesOwnProps, AppStateRecord> (
    mapStateToProps,
    mapDispatchToProps
  )

export const AdvantagesContainer = connectAdvantages (Advantages)
