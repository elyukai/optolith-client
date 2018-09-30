import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as ConfigActions from '../actions/ConfigActions';
import * as SpecialAbilitiesActions from '../actions/SpecialAbilitiesActions';
import { AppState } from '../reducers/appReducer';
import { getFilteredActiveSpecialAbilities } from '../selectors/activatableSelectors';
import { getFilteredInactiveSpecialAbilities } from '../selectors/combinedActivatablesSelectors';
import { getIsRemovingEnabled } from '../selectors/phaseSelectors';
import { getInactiveSpecialAbilitiesFilterText, getSpecialAbilities, getSpecialAbilitiesFilterText, getWikiSpecialAbilities } from '../selectors/stateSelectors';
import { getEnableActiveItemHints, getSpecialAbilitiesSortOrder } from '../selectors/uisettingsSelectors';
import { ActivateArgs, DeactivateArgs } from '../types/data';
import { Maybe } from '../utils/dataUtils';
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
  setSortOrder (sortOrder: Maybe<string>) {
    if (Maybe.isJust (sortOrder)) {
      dispatch (
        SpecialAbilitiesActions.setSpecialAbilitiesSortOrder (Maybe.fromJust (sortOrder))
      );
    }
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
