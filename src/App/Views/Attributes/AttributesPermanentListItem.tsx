import * as React from "react";
import { Maybe } from "../../../Data/Maybe";
import { EnergyId } from "../../Constants/Ids";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translate } from "../../Utilities/I18n";
import { isFunction } from "../../Utilities/typeCheckUtils";
import { IconButton } from "../Universal/IconButton";
import { AttributeBorder } from "./AttributeBorder";
import { AttributesRemovePermanent } from "./AttributesRemovePermanent";
import { PermanentPoints } from "./PermanentPoints";

export interface AttributesPermanentListItemProps {
  l10n: L10nRecord
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

export function AttributesPermanentListItem (props: AttributesPermanentListItemProps) {
  const {
    id,
    label,
    l10n,
    name,
    isRemovingEnabled,
    addBoughtBackPoint,
    addLostPoints,
    boughtBack,
    lost,
    getEditPermanentEnergy,
    getAddPermanentEnergy,
    openEditPermanentEnergy,
    openAddPermanentEnergyLoss,
    closeAddPermanentEnergyLoss,
    closeEditPermanentEnergy,
  } = props

  const available = typeof boughtBack === "number" ? lost - boughtBack : lost

  return (
    <AttributeBorder
      label={label}
      value={available}
      tooltip={<div className="calc-attr-overlay">
        <h4><span>{name}</span><span>{available}</span></h4>
        {
          typeof boughtBack === "number"
          ? (
              <p>
                {translate (l10n) ("losttotal")}: {lost}<br/>
                {translate (l10n) ("boughtback")}: {boughtBack}
              </p>
            )
          : (
              <p>
                {translate (l10n) ("losttotal")}: {lost}
              </p>
            )
        }
      </div>}
      tooltipMargin={7}
      >
      {isRemovingEnabled
        ? (
          <IconButton
            className="edit"
            icon="&#xE90c;"
            onClick={openEditPermanentEnergy .bind (null, id)}
            />
        )
      : null}
      <PermanentPoints
        {...props}
        id={String (id)}
        eid={id}
        isOpen={Maybe.elem (id) (getEditPermanentEnergy)}
        close={closeEditPermanentEnergy}
        permanentBoughtBack={Maybe (boughtBack)}
        permanentSpent={lost}
        />
      {isRemovingEnabled
        ? null
        : (
          <IconButton
            className="add"
            icon="&#xE908;"
            onClick={openAddPermanentEnergyLoss .bind (null, id)}
            />
        )}
      <AttributesRemovePermanent
        remove={addLostPoints}
        l10n={l10n}
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
