import { connect } from "react-redux";
import { join } from "../../Data/Maybe";
import { Record } from "../../Data/Record";
import { ReduxDispatch } from "../Actions/Actions";
import * as ConfigActions from "../Actions/ConfigActions";
import * as DisAdvActions from "../Actions/DisAdvActions";
import { ActivatableActivationOptions } from "../Models/Actions/ActivatableActivationOptions";
import { ActivatableDeactivationOptions } from "../Models/Actions/ActivatableDeactivationOptions";
import { HeroModel } from "../Models/Hero/HeroModel";
import { AppStateRecord } from "../Reducers/appReducer";
import { getAdvantagesRating, getFilteredActiveAdvantages } from "../Selectors/activatableSelectors";
import { getAPObjectMap, getMagicalAdvantagesDisadvantagesAdventurePointsMaximum } from "../Selectors/adventurePointsSelectors";
import { getFilteredInactiveAdvantages } from "../Selectors/combinedActivatablesSelectors";
import { getIsRemovingEnabled } from "../Selectors/phaseSelectors";
import { getAdvantages, getAdvantagesFilterText, getInactiveAdvantagesFilterText, getWikiAdvantages } from "../Selectors/stateSelectors";
import { getAdvantagesDisadvantagesCultureRatingVisibility, getEnableActiveItemHints } from "../Selectors/uisettingsSelectors";
import { Advantages, AdvantagesDispatchProps, AdvantagesOwnProps, AdvantagesStateProps } from "../Views/DisAdvantages/Advantages";

const mapStateToProps =
  (state: AppStateRecord, ownProps: AdvantagesOwnProps): AdvantagesStateProps => ({
    activeList: getFilteredActiveAdvantages (state, ownProps),
    ap: join (getAPObjectMap (HeroModel.A.id (ownProps.hero)) (state, ownProps)),
    deactiveList: getFilteredInactiveAdvantages (state, ownProps),
    enableActiveItemHints: getEnableActiveItemHints (state),
    isRemovingEnabled: getIsRemovingEnabled (state),
    stateEntries: getAdvantages (state),
    wikiEntries: getWikiAdvantages (state),
    magicalMax: getMagicalAdvantagesDisadvantagesAdventurePointsMaximum (state),
    rating: getAdvantagesRating (state),
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
  addToList (args: Record<ActivatableActivationOptions>) {
    dispatch (DisAdvActions.addDisAdvantage (locale) (args))
  },
  removeFromList (args: Record<ActivatableDeactivationOptions>) {
    dispatch (DisAdvActions.removeDisAdvantage (locale) (args))
  },
  setLevel (id: string, index: number, level: number) {
    dispatch (DisAdvActions.setDisAdvantageLevel (locale) (id) (index) (level))
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
