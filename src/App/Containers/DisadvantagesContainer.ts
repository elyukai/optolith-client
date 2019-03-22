import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as ConfigActions from '../App/Actions/ConfigActions';
import * as DisAdvActions from '../App/Actions/DisAdvActions';
import { ActivateArgs, DeactivateArgs } from '../App/Models/Hero/heroTypeHelpers';
import { AppState } from '../reducers/appReducer';
import { getCurrentDisAdvantagesSubtypeMax, getDisadvantagesRating, getFilteredActiveDisadvantages } from '../Selectors/activatableSelectors';
import { getAdventurePointsObject } from '../selectors/adventurePointsSelectors';
import { getFilteredInactiveDisadvantages } from '../selectors/combinedActivatablesSelectors';
import { getIsRemovingEnabled } from '../selectors/phaseSelectors';
import { getDisadvantages, getDisadvantagesFilterText, getInactiveDisadvantagesFilterText, getWikiDisadvantages } from '../selectors/stateSelectors';
import { getAdvantagesDisadvantagesCultureRatingVisibility, getEnableActiveItemHints } from '../selectors/uisettingsSelectors';
import { Disadvantages, DisadvantagesDispatchProps, DisadvantagesOwnProps, DisadvantagesStateProps } from '../views/disadv/Disadvantages';

const mapStateToProps =
  (state: AppState, ownProps: DisadvantagesOwnProps): DisadvantagesStateProps => ({
    activeList: getFilteredActiveDisadvantages (state, ownProps),
    ap: getAdventurePointsObject (state, ownProps),
    deactiveList: getFilteredInactiveDisadvantages (state, ownProps),
    enableActiveItemHints: getEnableActiveItemHints (state),
    isRemovingEnabled: getIsRemovingEnabled (state),
    stateEntries: getDisadvantages (state),
    wikiEntries: getWikiDisadvantages (state),
    magicalMax: getCurrentDisAdvantagesSubtypeMax (state),
    rating: getDisadvantagesRating (state),
    showRating: getAdvantagesDisadvantagesCultureRatingVisibility (state),
    filterText: getDisadvantagesFilterText (state),
    inactiveFilterText: getInactiveDisadvantagesFilterText (state),
  });

const mapDispatchToProps = (
  dispatch: Dispatch<Action, AppState>,
  { locale }: DisadvantagesOwnProps
): DisadvantagesDispatchProps => ({
  switchRatingVisibility () {
    dispatch (DisAdvActions.switchRatingVisibility ());
  },
  switchActiveItemHints () {
    dispatch (ConfigActions.switchEnableActiveItemHints ());
  },
  addToList (args: ActivateArgs) {
    dispatch (DisAdvActions.addDisAdvantage (locale) (args));
  },
  removeFromList (args: DeactivateArgs) {
    dispatch (DisAdvActions.removeDisAdvantage (locale) (args));
  },
  setLevel (id: string, index: number, level: number) {
    dispatch (DisAdvActions.setDisAdvantageLevel (locale) (id) (index) (level));
  },
  setFilterText (filterText: string) {
    dispatch (DisAdvActions.setActiveDisadvantagesFilterText (filterText));
  },
  setInactiveFilterText (filterText: string) {
    dispatch (DisAdvActions.setInactiveDisadvantagesFilterText (filterText));
  },
});

export const connectDisadvantages =
  connect<DisadvantagesStateProps, DisadvantagesDispatchProps, DisadvantagesOwnProps, AppState> (
    mapStateToProps,
    mapDispatchToProps
  );

export const DisadvantagesContainer = connectDisadvantages (Disadvantages);
