import { connect } from "react-redux"
import { fromJust, isJust, Maybe } from "../../Data/Maybe"
import { ReduxDispatch } from "../Actions/Actions"
import * as AttributesActions from "../Actions/AttributesActions"
import * as SubwindowsActions from "../Actions/SubwindowsActions"
import { EnergyId } from "../Constants/Ids"
import { AppStateRecord } from "../Models/AppState"
import { getAdjustmentValue, getAttributesForView, getAttributeSum, getAvailableAdjustmentIds } from "../Selectors/attributeSelectors"
import { getDerivedCharacteristics } from "../Selectors/derivedCharacteristicsSelectors"
import { getMaxTotalAttributeValues } from "../Selectors/elSelectors"
import { getIsInCharacterCreation, getIsRemovingEnabled } from "../Selectors/phaseSelectors"
import { getAddPermanentEnergy, getCurrentAttributeAdjustmentId, getEditPermanentEnergy } from "../Selectors/stateSelectors"
import { Attributes, AttributesDispatchProps, AttributesOwnProps, AttributesStateProps } from "../Views/Attributes/Attributes"

const mapStateToProps =
  (state: AppStateRecord, ownProps: AttributesOwnProps): AttributesStateProps => ({
    adjustmentValue: getAdjustmentValue (state, ownProps),
    attributes: getAttributesForView (state, ownProps),
    availableAttributeIds: getAvailableAdjustmentIds (state, ownProps),
    currentAttributeId: getCurrentAttributeAdjustmentId (state),
    isInCharacterCreation: getIsInCharacterCreation (state),
    isRemovingEnabled: getIsRemovingEnabled (state),
    derived: getDerivedCharacteristics (state, ownProps),
    maxTotalAttributeValues: getMaxTotalAttributeValues (state),
    sum: getAttributeSum (state, ownProps),
    getEditPermanentEnergy: getEditPermanentEnergy (state),
    getAddPermanentEnergy: getAddPermanentEnergy (state),
  })

const mapDispatchToProps = (dispatch: ReduxDispatch): AttributesDispatchProps => ({
  addPoint: async (id: string) => {
    await dispatch (AttributesActions.addAttributePoint (id))
  },
  removePoint: (id: string) => {
    dispatch (AttributesActions.removeAttributePoint (id))
  },
  addLifePoint: async () => {
    await dispatch (AttributesActions.addLifePoint)
  },
  addArcaneEnergyPoint: async () => {
    await dispatch (AttributesActions.addArcaneEnergyPoint)
  },
  addKarmaPoint: async () => {
    await dispatch (AttributesActions.addKarmaPoint)
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
  addBoughtBackAEPoint: async () => {
    await dispatch (AttributesActions.addBoughtBackAEPoint)
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
  addBoughtBackKPPoint: async () => {
    await dispatch (AttributesActions.addBoughtBackKPPoint)
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
  openAddPermanentEnergyLoss: (energy: EnergyId) => {
    console.log (`openAddPermanentEnergyLoss (${energy})`)
    dispatch (SubwindowsActions.openAddPermanentEnergyLoss (energy))
  },
  closeAddPermanentEnergyLoss: () => {
    console.log (`closeAddPermanentEnergyLoss ()`)
    dispatch (SubwindowsActions.closeAddPermanentEnergyLoss ())
  },
  openEditPermanentEnergy: (energy: EnergyId) => {
    console.log (`openEditPermanentEnergy (${energy})`)
    dispatch (SubwindowsActions.openEditPermanentEnergy (energy))
  },
  closeEditPermanentEnergy: () => {
    console.log (`closeEditPermanentEnergy ()`)
    dispatch (SubwindowsActions.closeEditPermanentEnergy ())
  },
  setAdjustmentId: (id: Maybe<string>) => {
    if (isJust (id)) {
      dispatch (AttributesActions.setAdjustmentId (fromJust (id)))
    }
  },
})

const connectAttributes =
  connect<AttributesStateProps, AttributesDispatchProps, AttributesOwnProps, AppStateRecord> (
    mapStateToProps,
    mapDispatchToProps
  )

export const AttributesContainer = connectAttributes (Attributes)
