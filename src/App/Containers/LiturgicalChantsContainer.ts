import { connect } from "react-redux";
import { ReduxDispatch } from "../Actions/Actions";
import * as ConfigActions from "../Actions/ConfigActions";
import * as LiturgicalChantActions from "../Actions/LiturgicalChantActions";
import { AppStateRecord } from "../Reducers/appReducer";
import { getAttributesForSheet } from "../Selectors/attributeSelectors";
import { getDerivedCharacteristicsMap } from "../Selectors/derivedCharacteristicsSelectors";
import { getBlessedTraditionNumericId, getFilteredActiveLiturgicalChantsAndBlessings, getFilteredInactiveLiturgicalChantsAndBlessings, isActivationDisabled } from "../Selectors/liturgicalChantsSelectors";
import { getIsRemovingEnabled } from "../Selectors/phaseSelectors";
import { getInactiveLiturgicalChantsFilterText, getLiturgicalChantsFilterText } from "../Selectors/stateSelectors";
import { getEnableActiveItemHints, getLiturgiesSortOrder } from "../Selectors/uisettingsSelectors";
import { LiturgicalChants, LiturgicalChantsDispatchProps, LiturgicalChantsOwnProps, LiturgicalChantsStateProps } from "../Views/LiturgicalChants/LiturgicalChants";

const mapStateToProps = (
  state: AppStateRecord,
  ownProps: LiturgicalChantsOwnProps
): LiturgicalChantsStateProps => ({
  attributes: getAttributesForSheet (state, ownProps),
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
})

const mapDispatchToProps =
  (dispatch: ReduxDispatch, { l10n }: LiturgicalChantsOwnProps): LiturgicalChantsDispatchProps => ({
    addPoint (id: string) {
      dispatch (LiturgicalChantActions.addLiturgicalChantPoint (l10n) (id))
    },
    addToList (id: string) {
      dispatch (LiturgicalChantActions.addLiturgicalChant (l10n) (id))
    },
    addBlessingToList (id: string) {
      dispatch (LiturgicalChantActions.addBlessing (l10n) (id))
    },
    removePoint (id: string) {
      dispatch (LiturgicalChantActions.removeLiturgicalChantPoint (id))
    },
    removeFromList (id: string) {
      dispatch (LiturgicalChantActions.removeLiturgicalChant (id))
    },
    removeBlessingFromList (id: string) {
      dispatch (LiturgicalChantActions.removeBlessing (id))
    },
    setSortOrder (sortOrder: string) {
      dispatch (LiturgicalChantActions.setLiturgicalChantsSortOrder (sortOrder))
    },
    switchActiveItemHints () {
      dispatch (ConfigActions.switchEnableActiveItemHints ())
    },
    setFilterText (filterText: string) {
      dispatch (LiturgicalChantActions.setActiveLiturgicalChantsFilterText (filterText))
    },
    setInactiveFilterText (filterText: string) {
      dispatch (LiturgicalChantActions.setInactiveLiturgicalChantsFilterText (filterText))
    },
  })

export const connectLiturgicalChants =
  connect<
    LiturgicalChantsStateProps,
    LiturgicalChantsDispatchProps,
    LiturgicalChantsOwnProps,
    AppStateRecord
  > (
    mapStateToProps,
    mapDispatchToProps
  )

export const LiturgicalChantsContainer = connectLiturgicalChants (LiturgicalChants)
