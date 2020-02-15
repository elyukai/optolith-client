import * as React from "react"
import { Maybe } from "../../../Data/Maybe"
import { EnergyId } from "../../Constants/Ids"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { isFunction } from "../../Utilities/typeCheckUtils"
import { IconButton } from "../Universal/IconButton"
import { AttributeBorder } from "./AttributeBorder"
import { AttributesRemovePermanent } from "./AttributesRemovePermanent"
import { PermanentPoints } from "./PermanentPoints"

export interface AttributesPermanentListItemProps {
  staticData: StaticDataRecord
  id: EnergyId
  label: string
  name: string
  boughtBack?: number
  lost: number
  isRemovingEnabled: boolean
  getEditPermanentEnergy: Maybe<EnergyId>
  getAddPermanentEnergy: Maybe<EnergyId>
  addBoughtBackPoint? (): void
  addLostPoint (): void
  addLostPoints (value: number): void
  removeBoughtBackPoint? (): void
  removeLostPoint (): void
  openAddPermanentEnergyLoss (energy: EnergyId): void
  closeAddPermanentEnergyLoss (): void
  openEditPermanentEnergy (energy: EnergyId): void
  closeEditPermanentEnergy (): void
}

export const AttributesPermanentListItem: React.FC<AttributesPermanentListItemProps> = props => {
  const {
    staticData,
    id,
    label,
    name,
    boughtBack,
    lost,
    isRemovingEnabled,
    getEditPermanentEnergy,
    getAddPermanentEnergy,
    addBoughtBackPoint,
    addLostPoint,
    addLostPoints,
    removeBoughtBackPoint,
    removeLostPoint,
    openAddPermanentEnergyLoss,
    closeAddPermanentEnergyLoss,
    openEditPermanentEnergy,
    closeEditPermanentEnergy,
  } = props

  const available = typeof boughtBack === "number" ? lost - boughtBack : lost

  const handleOpenEditPermanentEnergy = React.useCallback (
    () => openEditPermanentEnergy (id),
    [ openEditPermanentEnergy, id ]
  )

  const handleOpenAddPermanentEnergyLoss = React.useCallback (
    () => openAddPermanentEnergyLoss (id),
    [ openAddPermanentEnergyLoss, id ]
  )

  return (
    <AttributeBorder
      label={label}
      value={available}
      tooltip={
        <div className="calc-attr-overlay">
          <h4>
            <span>{name}</span>
            <span>{available}</span>
          </h4>
          {
            typeof boughtBack === "number"
            ? (
                <p>
                  {translate (staticData) ("attributes.derivedcharacteristics.tooltips.losttotal")}
                  {": "}
                  {lost}
                  <br />
                  {translate (staticData) ("attributes.derivedcharacteristics.tooltips.boughtback")}
                  {": "}
                  {boughtBack}
                </p>
              )
            : (
                <p>
                  {translate (staticData) ("attributes.derivedcharacteristics.tooltips.losttotal")}
                  {": "}
                  {lost}
                </p>
              )
          }
        </div>
      }
      tooltipMargin={7}
      >
      {isRemovingEnabled
        ? (
          <IconButton
            className="edit"
            icon="&#xE90c;"
            onClick={handleOpenEditPermanentEnergy}
            />
        )
      : null}
      <PermanentPoints
        id={String (id)}
        eid={id}
        staticData={staticData}
        permanentBoughtBack={Maybe (boughtBack)}
        permanentSpent={lost}
        isOpen={Maybe.elem (id) (getEditPermanentEnergy)}
        addBoughtBackPoint={addBoughtBackPoint}
        addLostPoint={addLostPoint}
        removeBoughtBackPoint={removeBoughtBackPoint}
        removeLostPoint={removeLostPoint}
        close={closeEditPermanentEnergy}
        />
      {isRemovingEnabled
        ? null
        : (
          <IconButton
            className="add"
            icon="&#xE908;"
            onClick={handleOpenAddPermanentEnergyLoss}
            />
        )}
      <AttributesRemovePermanent
        remove={addLostPoints}
        staticData={staticData}
        isOpen={Maybe.elem (id) (getAddPermanentEnergy)}
        close={closeAddPermanentEnergyLoss}
        />
      {!isRemovingEnabled && isFunction (addBoughtBackPoint)
        ? (
          <IconButton
            className="remove"
            icon="&#xE909;"
            onClick={addBoughtBackPoint}
            disabled={available <= 0}
            />
        )
        : null}
    </AttributeBorder>
  )
}
