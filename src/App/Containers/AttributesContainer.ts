import { connect } from "react-redux";
import { fromJust, isJust, Maybe } from "../../Data/Maybe";
import { ReduxDispatch } from "../Actions/Actions";
import * as AttributesActions from "../Actions/AttributesActions";
import * as SubwindowsActions from "../Actions/SubwindowsActions";
import { AppStateRecord } from "../Reducers/appReducer";
import { getAdjustmentValue, getAttributesForView, getAttributeSum, getAvailableAdjustmentIds } from "../Selectors/attributeSelectors";
import { getDerivedCharacteristics } from "../Selectors/derivedCharacteristicsSelectors";
import { getMaxTotalAttributeValues } from "../Selectors/elSelectors";
import { getIsInCharacterCreation, getIsRemovingEnabled } from "../Selectors/phaseSelectors";
import { getAddPermanentEnergy, getCurrentAttributeAdjustmentId, getEditPermanentEnergy } from "../Selectors/stateSelectors";
import { Attributes, AttributesDispatchProps, AttributesOwnProps, AttributesStateProps } from "../Views/Attributes/Attributes";

const mapStateToProps =
  (state: AppStateRecord, ownProps: AttributesOwnProps): AttributesStateProps => ({
    adjustmentValue: getAdjustmentValue (state),
    attributes: getAttributesForView (state),
    availableAttributeIds: getAvailableAdjustmentIds (state),
    currentAttributeId: getCurrentAttributeAdjustmentId (state),
    isInCharacterCreation: getIsInCharacterCreation (state),
    isRemovingEnabled: getIsRemovingEnabled (state),
    derived: getDerivedCharacteristics (state, ownProps),
    maxTotalAttributeValues: getMaxTotalAttributeValues (state),
    sum: getAttributeSum (state),
    getEditPermanentEnergy: getEditPermanentEnergy (state),
    getAddPermanentEnergy: getAddPermanentEnergy (state),
  })

const mapDispatchToProps = (
  dispatch: ReduxDispatch,
  { l10n }: AttributesOwnProps
): AttributesDispatchProps => ({
  addPoint: (id: string) => {
    dispatch (AttributesActions.addAttributePoint (l10n) (id))
  },
  removePoint: (id: string) => {
    dispatch (AttributesActions.removeAttributePoint (id))
  },
  addLifePoint: () => {
    dispatch (AttributesActions.addLifePoint (l10n))
  },
  addArcaneEnergyPoint: () => {
    dispatch (AttributesActions.addArcaneEnergyPoint (l10n))
  },
  addKarmaPoint: () => {
    dispatch (AttributesActions.addKarmaPoint (l10n))
  },
  removeLifePoint: () => {
    dispatch (AttributesActions.removeLifePoint ())
  },
  removeArcaneEnergyPoint: () => {
    dispatch (AttributesActions.removeArcaneEnergyPoint ())
  },
  removeKarmaPoint: () => {
    dispatch (AttributesActions.removeKarmaPoint ())
  },
  addLostLPPoint: () => {
    dispatch (AttributesActions.addLostLPPoint ())
  },
  removeLostLPPoint: () => {
    dispatch (AttributesActions.removeLostLPPoint ())
  },
  addLostLPPoints: (value: number) => {
    dispatch (AttributesActions.addLostLPPoints (value))
  },
  addBoughtBackAEPoint: () => {
    dispatch (AttributesActions.addBoughtBackAEPoint (l10n))
  },
  removeBoughtBackAEPoint: () => {
    dispatch (AttributesActions.removeBoughtBackAEPoint ())
  },
  addLostAEPoint: () => {
    dispatch (AttributesActions.addLostAEPoint ())
  },
  removeLostAEPoint: () => {
    dispatch (AttributesActions.removeLostAEPoint ())
  },
  addLostAEPoints: (value: number) => {
    dispatch (AttributesActions.addLostAEPoints (value))
  },
  addBoughtBackKPPoint: () => {
    dispatch (AttributesActions.addBoughtBackKPPoint (l10n))
  },
  removeBoughtBackKPPoint: () => {
    dispatch (AttributesActions.removeBoughtBackKPPoint ())
  },
  addLostKPPoint: () => {
    dispatch (AttributesActions.addLostKPPoint ())
  },
  removeLostKPPoint: () => {
    dispatch (AttributesActions.removeLostKPPoint ())
  },
  addLostKPPoints: (value: number) => {
    dispatch (AttributesActions.addLostKPPoints (value))
  },
  openAddPermanentEnergyLoss: (energy: "LP" | "AE" | "KP") => {
    dispatch (SubwindowsActions.openAddPermanentEnergyLoss (energy))
  },
  closeAddPermanentEnergyLoss: () => {
    dispatch (SubwindowsActions.closeAddPermanentEnergyLoss ())
  },
  openEditPermanentEnergy: (energy: "LP" | "AE" | "KP") => {
    dispatch (SubwindowsActions.openEditPermanentEnergy (energy))
  },
  closeEditPermanentEnergy: () => {
    dispatch (SubwindowsActions.closeEditPermanentEnergy ())
  },
  setAdjustmentId: (id: Maybe<string>) => {
    if (isJust (id)) {
      dispatch (AttributesActions.setAdjustmentId (fromJust (id)))
    }
  },
})

export const connectAttributes =
  connect<AttributesStateProps, AttributesDispatchProps, AttributesOwnProps, AppStateRecord> (
    mapStateToProps,
    mapDispatchToProps
  )

export const AttributesContainer = connectAttributes (Attributes)
