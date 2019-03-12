import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as ConfigActions from '../App/Actions/ConfigActions';
import * as SpecialAbilitiesActions from '../App/Actions/SpecialAbilitiesActions';
import { ActivateArgs, DeactivateArgs } from '../App/Models/Hero/heroTypeHelpers';
import { AppState } from '../reducers/appReducer';
import { getFilteredActiveSpecialAbilities } from '../selectors/activatableSelectors';
import { getFilteredInactiveSpecialAbilities } from '../selectors/combinedActivatablesSelectors';
import { getIsRemovingEnabled } from '../selectors/phaseSelectors';
import { getInactiveSpecialAbilitiesFilterText, getSpecialAbilities, getSpecialAbilitiesFilterText, getWikiSpecialAbilities } from '../selectors/stateSelectors';
import { getEnableActiveItemHints, getSpecialAbilitiesSortOrder } from '../selectors/uisettingsSelectors';
import { SpecialAbilities, SpecialAbilitiesDispatchProps, SpecialAbilitiesOwnProps, SpecialAbilitiesStateProps } from '../views/specialAbilities/SpecialAbilities';

const mapStateToProps = (
  state: AppState,
  ownProps: SpecialAbilitiesOwnProps
): SpecialAbilitiesStateProps => ({
  activeList: getFilteredActiveSpecialAbilities (state, ownProps),
  deactiveList: getFilteredInactiveSpecialAbilities (state, ownProps),
  enableActiveItemHints: getEnableActiveItemHints (state),
  isRemovingEnabled: getIsRemovingEnabled (state),
  stateEntries: getSpecialAbilities (state),
  wikiEntries: getWikiSpecialAbilities (state),
  sortOrder: getSpecialAbilitiesSortOrder (state),
  filterText: getSpecialAbilitiesFilterText (state),
  inactiveFilterText: getInactiveSpecialAbilitiesFilterText (state),
});

const mapDispatchToProps = (
  dispatch: Dispatch<Action, AppState>,
  { locale }: SpecialAbilitiesOwnProps
): SpecialAbilitiesDispatchProps => ({
  setSortOrder (sortOrder: string) {
    dispatch (SpecialAbilitiesActions.setSpecialAbilitiesSortOrder (sortOrder));
  },
  switchActiveItemHints () {
    dispatch (ConfigActions.switchEnableActiveItemHints ());
  },
  addToList (args: ActivateArgs) {
    dispatch (SpecialAbilitiesActions.addSpecialAbility (locale) (args));
  },
  removeFromList (args: DeactivateArgs) {
    dispatch (SpecialAbilitiesActions.removeSpecialAbility (args));
  },
  setLevel (id: string, index: number, level: number) {
    dispatch (SpecialAbilitiesActions.setSpecialAbilityLevel (locale) (id) (index) (level));
  },
  setFilterText (filterText: string) {
    dispatch (SpecialAbilitiesActions.setActiveSpecialAbilitiesFilterText (filterText));
  },
  setInactiveFilterText (filterText: string) {
    dispatch (SpecialAbilitiesActions.setActiveSpecialAbilitiesFilterText (filterText));
  },
});

export const connectSpecialAbilities =
  connect<
    SpecialAbilitiesStateProps,
    SpecialAbilitiesDispatchProps,
    SpecialAbilitiesOwnProps,
    AppState
  > (
    mapStateToProps,
    mapDispatchToProps
  );

export const SpecialAbilitiesContainer = connectSpecialAbilities (SpecialAbilities);
