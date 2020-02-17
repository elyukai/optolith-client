import * as React from "react"
import { fromJust, isJust, Maybe } from "../../../Data/Maybe"
import { EnergyId } from "../../Constants/Ids"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { isFunction } from "../../Utilities/typeCheckUtils"
import { Dialog } from "../Universal/Dialog"
import { IconButton } from "../Universal/IconButton"

export interface PermanentPointsProps {
  id: string
  eid: EnergyId
  staticData: StaticDataRecord
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
    staticData,
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
          ? translate (staticData) ("attributes.lostpermanently.arcaneenergy")
          : eid === EnergyId.KP
          ? translate (staticData) ("attributes.lostpermanently.karmapoints")
          : translate (staticData) ("attributes.lostpermanently.lifepoints")
      }
      buttons={[
        {
          autoWidth: true,
          label: translate (staticData) ("general.dialogs.donebtn"),
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
                  {translate (staticData) ("attributes.pointslostpermanentlyeditor.boughtback")}
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
            {translate (staticData) ("attributes.pointslostpermanentlyeditor.spent")}
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
