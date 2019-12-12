import { connect } from "react-redux";
import { ReduxDispatch } from "../Actions/Actions";
import * as ConfigActions from "../Actions/ConfigActions";
import * as SpellsActions from "../Actions/SpellsActions";
import { AppStateRecord } from "../Reducers/appReducer";
import { getAttributesForSheet } from "../Selectors/attributeSelectors";
import { getIsRemovingEnabled } from "../Selectors/phaseSelectors";
import { getFilteredActiveSpellsAndCantrips, getFilteredInactiveSpellsAndCantrips, isNoSpellActivatable } from "../Selectors/spellsSelectors";
import { getInactiveSpellsFilterText, getSpellsFilterText } from "../Selectors/stateSelectors";
import { getEnableActiveItemHints, getSpellsSortOrder } from "../Selectors/uisettingsSelectors";
import { SpellsSortOptions } from "../Utilities/Raw/JSON/Config";
import { Spells, SpellsDispatchProps, SpellsOwnProps, SpellsStateProps } from "../Views/Spells/Spells";

const mapStateToProps = (state: AppStateRecord, ownProps: SpellsOwnProps): SpellsStateProps => ({
  activeList: getFilteredActiveSpellsAndCantrips (state, ownProps),
  inactiveList: getFilteredInactiveSpellsAndCantrips (state, ownProps),
  attributes: getAttributesForSheet (state, ownProps),
  addSpellsDisabled: isNoSpellActivatable (state, ownProps),
  enableActiveItemHints: getEnableActiveItemHints (state),
  isRemovingEnabled: getIsRemovingEnabled (state),
  sortOrder: getSpellsSortOrder (state),
  filterText: getSpellsFilterText (state),
  inactiveFilterText: getInactiveSpellsFilterText (state),
})

const mapDispatchToProps =
  (dispatch: ReduxDispatch, { l10n }: SpellsOwnProps): SpellsDispatchProps => ({
    async addPoint (id: string) {
      await dispatch (SpellsActions.addSpellPoint (l10n) (id))
    },
    async addToList (id: string) {
      await dispatch (SpellsActions.addSpell (l10n) (id))
    },
    async addCantripToList (id: string) {
      await dispatch (SpellsActions.addCantrip (l10n) (id))
    },
    removePoint (id: string) {
      dispatch (SpellsActions.removeSpellPoint (id))
    },
    removeFromList (id: string) {
      dispatch (SpellsActions.removeSpell (id))
    },
    removeCantripFromList (id: string) {
      dispatch (SpellsActions.removeCantrip (id))
    },
    setSortOrder (sortOrder: SpellsSortOptions) {
      dispatch (SpellsActions.setSpellsSortOrder (sortOrder))
    },
    switchActiveItemHints () {
      dispatch (ConfigActions.switchEnableActiveItemHints ())
    },
    setFilterText (filterText: string) {
      dispatch (SpellsActions.setActiveSpellsFilterText (filterText))
    },
    setInactiveFilterText (filterText: string) {
      dispatch (SpellsActions.setInactiveSpellsFilterText (filterText))
    },
  })

export const connectSpells =
  connect<SpellsStateProps, SpellsDispatchProps, SpellsOwnProps, AppStateRecord> (
    mapStateToProps,
    mapDispatchToProps
  )

export const SpellsContainer = connectSpells (Spells)
