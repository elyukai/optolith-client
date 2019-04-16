import { connect } from "react-redux";
import { ReduxDispatch } from "../Actions/Actions";
import * as CombatTechniquesActions from "../Actions/CombatTechniquesActions";
import { AppStateRecord } from "../Reducers/appReducer";
import { getAttributesForSheet } from "../Selectors/attributeSelectors";
import { getFilteredCombatTechniques } from "../Selectors/combatTechniquesSelectors";
import { getDerivedCharacteristicsMap } from "../Selectors/derivedCharacteristicsSelectors";
import { getIsRemovingEnabled } from "../Selectors/phaseSelectors";
import { getCombatTechniquesFilterText } from "../Selectors/stateSelectors";
import { getCombatTechniquesSortOrder } from "../Selectors/uisettingsSelectors";
import { CombatTechniques, CombatTechniquesDispatchProps, CombatTechniquesOwnProps, CombatTechniquesStateProps } from "../Views/CombatTechniques/CombatTechniques";

const mapStateToProps = (
  state: AppStateRecord,
  ownProps: CombatTechniquesOwnProps
): CombatTechniquesStateProps => ({
  attributes: getAttributesForSheet (state),
  derivedCharacteristics: getDerivedCharacteristicsMap (state, ownProps),
  isRemovingEnabled: getIsRemovingEnabled (state),
  list: getFilteredCombatTechniques (state, ownProps),
  sortOrder: getCombatTechniquesSortOrder (state),
  filterText: getCombatTechniquesFilterText (state),
})

const mapDispatchToProps = (
  dispatch: ReduxDispatch,
  { l10n }: CombatTechniquesOwnProps
) => ({
  addPoint (id: string) {
    dispatch (CombatTechniquesActions.addCombatTechniquePoint (l10n) (id))
  },
  removePoint (id: string) {
    dispatch (CombatTechniquesActions.removeCombatTechniquePoint (id))
  },
  setSortOrder (sortOrder: string) {
    dispatch (CombatTechniquesActions.setCombatTechniquesSortOrder (sortOrder))
  },
  setFilterText (filterText: string) {
    dispatch (CombatTechniquesActions.setCombatTechniquesFilterText (filterText))
  },
})

export const connectCombatTechniques =
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
