import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as ConfigActions from '../actions/ConfigActions';
import * as DisAdvActions from '../actions/DisAdvActions';
import { AppState } from '../reducers/appReducer';
import { getAdvantagesRating, getFilteredActiveAdvantages } from '../selectors/activatableSelectors';
import { getAdventurePointsObject } from '../selectors/adventurePointsSelectors';
import { getFilteredInactiveAdvantages } from '../selectors/combinedActivatablesSelectors';
import { getIsRemovingEnabled } from '../selectors/phaseSelectors';
import { getAdvantages, getAdvantagesFilterText, getInactiveAdvantagesFilterText } from '../selectors/stateSelectors';
import { getAdvantagesDisadvantagesCultureRatingVisibility, getEnableActiveItemHints } from '../selectors/uisettingsSelectors';
import { ActivateArgs, DeactivateArgs } from '../types/data';
import { Advantages, AdvantagesDispatchProps, AdvantagesOwnProps, AdvantagesStateProps } from '../views/disadv/Advantages';

const mapStateToProps = (state: AppState, ownProps: AdvantagesOwnProps): AdvantagesStateProps => ({
  activeList: getFilteredActiveAdvantages(state, ownProps),
  ap: getAdventurePointsObject(state, ownProps),
  deactiveList: getFilteredInactiveAdvantages(state, ownProps),
  enableActiveItemHints: getEnableActiveItemHints(state),
  get(id: string) {
    return get(getDependent(state), id);
  },
  isRemovingEnabled: getIsRemovingEnabled(state),
  list: [...getAdvantages(state).values()],
  magicalMax: getCurrentDisAdvantagesSubtypeMax(state),
  rating: getAdvantagesRating(state),
  showRating: getAdvantagesDisadvantagesCultureRatingVisibility(state),
  filterText: getAdvantagesFilterText(state),
  inactiveFilterText: getInactiveAdvantagesFilterText(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Action, State>): AdvantagesDispatchProps => ({
  switchRatingVisibility() {
    dispatch(DisAdvActions._switchRatingVisibility());
  },
  switchActiveItemHints() {
    dispatch(ConfigActions._switchEnableActiveItemHints());
  },
  addToList(args: ActivateArgs) {
    dispatch(DisAdvActions._addToList(args));
  },
  removeFromList(args: DeactivateArgs) {
    dispatch(DisAdvActions._removeFromList(args));
  },
  setTier(id: string, index: number, tier: number) {
    dispatch(DisAdvActions._setTier(id, index, tier));
  },
  setFilterText(filterText: string) {
    dispatch(DisAdvActions.setActiveAdvantagesFilterText(filterText));
  },
  setInactiveFilterText(filterText: string) {
    dispatch(DisAdvActions.setInactiveAdvantagesFilterText(filterText));
  },
});

export const connectAdvantages =
  connect<AdvantagesStateProps, AdvantagesDispatchProps, AdvantagesOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
  );

export const AdvantagesContainer = connectAdvantages (Advantages);
