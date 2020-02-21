import { connect } from "react-redux"
import { ReduxDispatch } from "../Actions/Actions"
import * as CombatTechniquesActions from "../Actions/CombatTechniquesActions"
import { AppStateRecord } from "../Models/AppState"
import { CombatTechniquesSortOptions } from "../Models/Config"
import { getAttributesForSheet } from "../Selectors/attributeSelectors"
import { getFilteredCombatTechniques } from "../Selectors/combatTechniquesSelectors"
import { getIsRemovingEnabled } from "../Selectors/phaseSelectors"
import { getCombatTechniquesFilterText } from "../Selectors/stateSelectors"
import { getCombatTechniquesSortOrder } from "../Selectors/uisettingsSelectors"
import { CombatTechniques, CombatTechniquesDispatchProps, CombatTechniquesOwnProps, CombatTechniquesStateProps } from "../Views/CombatTechniques/CombatTechniques"

const mapStateToProps = (
  state: AppStateRecord,
  ownProps: CombatTechniquesOwnProps
): CombatTechniquesStateProps => ({
  attributes: getAttributesForSheet (state, ownProps),
  isRemovingEnabled: getIsRemovingEnabled (state),
  list: getFilteredCombatTechniques (state, ownProps),
  sortOrder: getCombatTechniquesSortOrder (state),
  filterText: getCombatTechniquesFilterText (state),
})

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
  async addPoint (id: string) {
    await dispatch (CombatTechniquesActions.addCombatTechniquePoint (id))
  },
  removePoint (id: string) {
    dispatch (CombatTechniquesActions.removeCombatTechniquePoint (id))
  },
  setSortOrder (sortOrder: CombatTechniquesSortOptions) {
    dispatch (CombatTechniquesActions.setCombatTechniquesSortOrder (sortOrder))
  },
  setFilterText (filterText: string) {
    dispatch (CombatTechniquesActions.setCombatTechniquesFilterText (filterText))
  },
})

const connectCombatTechniques =
  connect<
    CombatTechniquesStateProps,
    CombatTechniquesDispatchProps,
    CombatTechniquesOwnProps,
    AppStateRecord
  > (
    mapStateToProps,
    mapDispatchToProps
  )

export const CombatTechniquesContainer = connectCombatTechniques (CombatTechniques)
