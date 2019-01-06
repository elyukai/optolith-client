import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as ConfigActions from '../actions/ConfigActions';
import * as DisAdvActions from '../actions/DisAdvActions';
import { ActivateArgs, DeactivateArgs } from '../App/Models/Hero/heroTypeHelpers';
import { AppState } from '../reducers/appReducer';
import { getAdvantagesRating, getCurrentDisAdvantagesSubtypeMax, getFilteredActiveAdvantages } from '../selectors/activatableSelectors';
import { getAdventurePointsObject } from '../selectors/adventurePointsSelectors';
import { getFilteredInactiveAdvantages } from '../selectors/combinedActivatablesSelectors';
import { getIsRemovingEnabled } from '../selectors/phaseSelectors';
import { getAdvantages, getAdvantagesFilterText, getInactiveAdvantagesFilterText, getWikiAdvantages } from '../selectors/stateSelectors';
import { getAdvantagesDisadvantagesCultureRatingVisibility, getEnableActiveItemHints } from '../selectors/uisettingsSelectors';
import { Advantages, AdvantagesDispatchProps, AdvantagesOwnProps, AdvantagesStateProps } from '../views/disadv/Advantages';

const mapStateToProps = (state: AppState, ownProps: AdvantagesOwnProps): AdvantagesStateProps => ({
  activeList: getFilteredActiveAdvantages (state, ownProps),
  ap: getAdventurePointsObject (state, ownProps),
  deactiveList: getFilteredInactiveAdvantages (state, ownProps),
  enableActiveItemHints: getEnableActiveItemHints (state),
  isRemovingEnabled: getIsRemovingEnabled (state),
  stateEntries: getAdvantages (state),
  wikiEntries: getWikiAdvantages (state),
  magicalMax: getCurrentDisAdvantagesSubtypeMax (state),
  rating: getAdvantagesRating (state),
  showRating: getAdvantagesDisadvantagesCultureRatingVisibility (state),
  filterText: getAdvantagesFilterText (state),
  inactiveFilterText: getInactiveAdvantagesFilterText (state),
});

const mapDispatchToProps = (
  dispatch: Dispatch<Action, AppState>,
  { locale }: AdvantagesOwnProps
): AdvantagesDispatchProps => ({
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
    dispatch (DisAdvActions.setActiveAdvantagesFilterText (filterText));
  },
  setInactiveFilterText (filterText: string) {
    dispatch (DisAdvActions.setInactiveAdvantagesFilterText (filterText));
  },
});

export const connectAdvantages =
  connect<AdvantagesStateProps, AdvantagesDispatchProps, AdvantagesOwnProps, AppState> (
    mapStateToProps,
    mapDispatchToProps
  );

export const AdvantagesContainer = connectAdvantages (Advantages);
