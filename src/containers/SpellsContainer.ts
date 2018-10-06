import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as ConfigActions from '../actions/ConfigActions';
import * as SpellsActions from '../actions/SpellsActions';
import { AppState } from '../reducers/appReducer';
import { getAttributesForSheet } from '../selectors/attributeSelectors';
import { getDerivedCharacteristicsMap } from '../selectors/derivedCharacteristicsSelectors';
import { getIsRemovingEnabled } from '../selectors/phaseSelectors';
import { getFilteredActiveSpellsAndCantrips, getFilteredInactiveSpellsAndCantrips, getMagicalTraditionsFromWikiState, isActivationDisabled } from '../selectors/spellsSelectors';
import { getInactiveSpellsFilterText, getSpellsFilterText } from '../selectors/stateSelectors';
import { getEnableActiveItemHints, getSpellsSortOrder } from '../selectors/uisettingsSelectors';
import { Maybe } from '../utils/dataUtils';
import { Spells, SpellsDispatchProps, SpellsOwnProps, SpellsStateProps } from '../views/spells/Spells';

const mapStateToProps = (state: AppState, ownProps: SpellsOwnProps): SpellsStateProps => ({
  activeList: getFilteredActiveSpellsAndCantrips (state, ownProps),
  inactiveList: getFilteredInactiveSpellsAndCantrips (state, ownProps),
  attributes: getAttributesForSheet (state),
  derivedCharacteristics: getDerivedCharacteristicsMap (state, ownProps),
  addSpellsDisabled: isActivationDisabled (state),
  enableActiveItemHints: getEnableActiveItemHints (state),
  isRemovingEnabled: getIsRemovingEnabled (state),
  traditions: getMagicalTraditionsFromWikiState (state),
  sortOrder: getSpellsSortOrder (state),
  filterText: getSpellsFilterText (state),
  inactiveFilterText: getInactiveSpellsFilterText (state),
});

const mapDispatchToProps = (
  dispatch: Dispatch<Action, AppState>,
  { locale }: SpellsOwnProps
): SpellsDispatchProps => ({
  addPoint (id: string) {
    dispatch (SpellsActions.addSpellPoint (locale) (id));
  },
  addToList (id: string) {
    dispatch (SpellsActions.addSpell (locale) (id));
  },
  addCantripToList (id: string) {
    dispatch (SpellsActions.addCantrip (locale) (id));
  },
  removePoint (id: string) {
    dispatch (SpellsActions.removeSpellPoint (id));
  },
  removeFromList (id: string) {
    dispatch (SpellsActions.removeSpell (id));
  },
  removeCantripFromList (id: string) {
    dispatch (SpellsActions.removeCantrip (id));
  },
  setSortOrder (sortOrder: Maybe<string>) {
    if (Maybe.isJust (sortOrder)) {
      dispatch (SpellsActions.setSpellsSortOrder (Maybe.fromJust (sortOrder)));
    }
  },
  switchActiveItemHints () {
    dispatch (ConfigActions.switchEnableActiveItemHints ());
  },
  setFilterText (filterText: string) {
    dispatch (SpellsActions.setActiveSpellsFilterText (filterText));
  },
  setInactiveFilterText (filterText: string) {
    dispatch (SpellsActions.setInactiveSpellsFilterText (filterText));
  },
});

export const connectSpells =
  connect<SpellsStateProps, SpellsDispatchProps, SpellsOwnProps, AppState> (
    mapStateToProps,
    mapDispatchToProps
  );

export const SpellsContainer = connectSpells (Spells);
