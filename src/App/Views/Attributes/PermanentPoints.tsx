import * as React from "react"
import { fromJust, isJust, Maybe } from "../../../Data/Maybe"
import { EnergyId } from "../../Constants/Ids"
import { L10nRecord } from "../../Models/Wiki/L10n"
import { translate } from "../../Utilities/I18n"
import { isFunction } from "../../Utilities/typeCheckUtils"
import { Dialog } from "../Universal/Dialog"
import { IconButton } from "../Universal/IconButton"

export interface PermanentPointsProps {
  id: string
  eid: EnergyId
  l10n: L10nRecord
  permanentBoughtBack: Maybe<number>
  permanentSpent: number
  isOpen: boolean
  addBoughtBackPoint? (): void
  addLostPoint (): void
  removeBoughtBackPoint? (): void
  removeLostPoint (): void
  close (): void
}

export const PermanentPoints: React.FC<PermanentPointsProps> = props => {
  const {
    id,
    eid,
    l10n,
    addBoughtBackPoint,
    addLostPoint,
    permanentBoughtBack,
    permanentSpent,
    removeBoughtBackPoint,
    removeLostPoint,
    close,
    isOpen,
  } = props

  return (
    <Dialog
      id={id}
      isOpen={isOpen}
      close={close}
      className="permanent-points-editor"
      title={
        eid === EnergyId.AE
          ? translate (l10n) ("attributes.lostpermanently.arcaneenergy")
          : eid === EnergyId.KP
          ? translate (l10n) ("attributes.lostpermanently.karmapoints")
          : translate (l10n) ("attributes.lostpermanently.lifepoints")
      }
      buttons={[
        {
          autoWidth: true,
          label: translate (l10n) ("general.dialogs.donebtn"),
        },
      ]}
      >
      <div className="main">
        {
          isFunction (addBoughtBackPoint)
          && isFunction (removeBoughtBackPoint)
          && isJust (permanentBoughtBack)
            ? (
              <div className="column boughtback">
                <div className="value">{fromJust (permanentBoughtBack)}</div>
                <div className="description smallcaps">
                  {translate (l10n) ("attributes.pointslostpermanentlyeditor.boughtback")}
                </div>
                <div className="buttons">
                  <IconButton
                    className="add"
                    icon="&#xE908;"
                    onClick={addBoughtBackPoint}
                    disabled={fromJust (permanentBoughtBack) >= permanentSpent}
                    />
                  <IconButton
                    className="remove"
                    icon="&#xE909;"
                    onClick={removeBoughtBackPoint}
                    disabled={fromJust (permanentBoughtBack) <= 0}
                    />
                </div>
              </div>
            )
            : null
        }
        <div className="column lost">
          <div className="value">{permanentSpent}</div>
          <div className="description smallcaps">
            {translate (l10n) ("attributes.pointslostpermanentlyeditor.spent")}
          </div>
          <div className="buttons">
            <IconButton className="add" icon="&#xE908;" onClick={addLostPoint} />
            <IconButton
              className="remove"
              icon="&#xE909;"
              onClick={removeLostPoint}
              disabled={permanentSpent <= 0}
              />
          </div>
        </div>
      </div>
    </Dialog>
  )
}
