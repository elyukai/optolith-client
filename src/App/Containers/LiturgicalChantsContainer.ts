import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as ConfigActions from '../App/Actions/ConfigActions';
import * as LiturgicalChantActions from '../App/Actions/LiturgicalChantActions';
import { AppState } from '../reducers/appReducer';
import { getAttributesForSheet } from '../Selectors/attributeSelectors';
import { getDerivedCharacteristicsMap } from '../Selectors/derivedCharacteristicsSelectors';
import { getBlessedTraditionNumericId, getFilteredActiveLiturgicalChantsAndBlessings, getFilteredInactiveLiturgicalChantsAndBlessings, isActivationDisabled } from '../Selectors/liturgicalChantsSelectors';
import { getIsRemovingEnabled } from '../Selectors/phaseSelectors';
import { getInactiveLiturgicalChantsFilterText, getLiturgicalChantsFilterText } from '../Selectors/stateSelectors';
import { getEnableActiveItemHints, getLiturgiesSortOrder } from '../Selectors/uisettingsSelectors';
import { LiturgicalChants, LiturgicalChantsDispatchProps, LiturgicalChantsOwnProps, LiturgicalChantsStateProps } from '../Views/LiturgicalChants/LiturgicalChants';

const mapStateToProps = (
  state: AppState,
  ownProps: LiturgicalChantsOwnProps
): LiturgicalChantsStateProps => ({
  attributes: getAttributesForSheet (state),
  addChantsDisabled: isActivationDisabled (state),
  derivedCharacteristics: getDerivedCharacteristicsMap (state, ownProps),
  enableActiveItemHints: getEnableActiveItemHints (state),
  isRemovingEnabled: getIsRemovingEnabled (state),
  activeList: getFilteredActiveLiturgicalChantsAndBlessings (state, ownProps),
  inactiveList: getFilteredInactiveLiturgicalChantsAndBlessings (state, ownProps),
  sortOrder: getLiturgiesSortOrder (state),
  traditionId: getBlessedTraditionNumericId (state),
  filterText: getLiturgicalChantsFilterText (state),
  inactiveFilterText: getInactiveLiturgicalChantsFilterText (state),
});

const mapDispatchToProps = (
  dispatch: Dispatch<Action, AppState>,
  { locale }: LiturgicalChantsOwnProps
): LiturgicalChantsDispatchProps => ({
  addPoint (id: string) {
    dispatch (LiturgicalChantActions.addLiturgicalChantPoint (locale) (id));
  },
  addToList (id: string) {
    dispatch (LiturgicalChantActions.addLiturgicalChant (locale) (id));
  },
  addBlessingToList (id: string) {
    dispatch (LiturgicalChantActions.addBlessing (locale) (id));
  },
  removePoint (id: string) {
    dispatch (LiturgicalChantActions.removeLiturgicalChantPoint (id));
  },
  removeFromList (id: string) {
    dispatch (LiturgicalChantActions.removeLiturgicalChant (id));
  },
  removeBlessingFromList (id: string) {
    dispatch (LiturgicalChantActions.removeBlessing (id));
  },
  setSortOrder (sortOrder: string) {
    dispatch (LiturgicalChantActions.setLiturgicalChantsSortOrder (sortOrder));
  },
  switchActiveItemHints () {
    dispatch (ConfigActions.switchEnableActiveItemHints ());
  },
  setFilterText (filterText: string) {
    dispatch (LiturgicalChantActions.setActiveLiturgicalChantsFilterText (filterText));
  },
  setInactiveFilterText (filterText: string) {
    dispatch (LiturgicalChantActions.setInactiveLiturgicalChantsFilterText (filterText));
  },
});

export const connectLiturgicalChants =
  connect<
    LiturgicalChantsStateProps,
    LiturgicalChantsDispatchProps,
    LiturgicalChantsOwnProps,
    AppState
  > (
    mapStateToProps,
    mapDispatchToProps
  );

export const LiturgicalChantsContainer = connectLiturgicalChants (LiturgicalChants);
