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
import { getDisadvantagesRating, getFilteredActiveDisadvantages } from "../Selectors/activatableSelectors";
import { getAPObjectMap, getMagicalAdvantagesDisadvantagesAdventurePointsMaximum } from "../Selectors/adventurePointsSelectors";
import { getFilteredInactiveDisadvantages } from "../Selectors/combinedActivatablesSelectors";
import { getIsRemovingEnabled } from "../Selectors/phaseSelectors";
import { getDisadvantages, getDisadvantagesFilterText, getInactiveDisadvantagesFilterText, getWikiDisadvantages } from "../Selectors/stateSelectors";
import { getAdvantagesDisadvantagesCultureRatingVisibility, getEnableActiveItemHints } from "../Selectors/uisettingsSelectors";
import { Disadvantages, DisadvantagesDispatchProps, DisadvantagesOwnProps, DisadvantagesStateProps } from "../Views/DisAdvantages/Disadvantages";

const mapStateToProps =
  (state: AppStateRecord, ownProps: DisadvantagesOwnProps): DisadvantagesStateProps => ({
    activeList: getFilteredActiveDisadvantages (state, ownProps),
    ap: join (getAPObjectMap (HeroModel.A.id (ownProps.hero)) (state, ownProps)),
    deactiveList:
      join (getFilteredInactiveDisadvantages (HeroModel.A.id (ownProps.hero))
                                             (state, ownProps)),
    enableActiveItemHints: getEnableActiveItemHints (state),
    isRemovingEnabled: getIsRemovingEnabled (state),
    stateEntries: getDisadvantages (state),
    wikiEntries: getWikiDisadvantages (state),
    magicalMax: getMagicalAdvantagesDisadvantagesAdventurePointsMaximum (state),
    rating: getDisadvantagesRating (state, ownProps),
    showRating: getAdvantagesDisadvantagesCultureRatingVisibility (state),
    filterText: getDisadvantagesFilterText (state),
    inactiveFilterText: getInactiveDisadvantagesFilterText (state),
  })

const mapDispatchToProps = (
  dispatch: ReduxDispatch,
  { l10n }: DisadvantagesOwnProps
): DisadvantagesDispatchProps => ({
  switchRatingVisibility () {
    dispatch (DisAdvActions.switchRatingVisibility ())
  },
  switchActiveItemHints () {
    dispatch (ConfigActions.switchEnableActiveItemHints ())
  },
  addToList (args: Record<ActivatableActivationOptions>) {
    dispatch (DisAdvActions.addDisAdvantage (l10n) (args))
  },
  removeFromList (args: Record<ActivatableDeactivationOptions>) {
    dispatch (DisAdvActions.removeDisAdvantage (l10n) (args))
  },
  setLevel (id: string, index: number, level: number) {
    dispatch (DisAdvActions.setDisAdvantageLevel (l10n) (id) (index) (level))
  },
  setFilterText (filterText: string) {
    dispatch (DisAdvActions.setActiveDisadvantagesFilterText (filterText))
  },
  setInactiveFilterText (filterText: string) {
    dispatch (DisAdvActions.setInactiveDisadvantagesFilterText (filterText))
  },
})

const connectDisadvantages =
  connect<
    DisadvantagesStateProps,
    DisadvantagesDispatchProps,
    DisadvantagesOwnProps,
    AppStateRecord
  > (
    mapStateToProps,
    mapDispatchToProps
  )

export const DisadvantagesContainer = connectDisadvantages (Disadvantages)
