import * as React from "react";
import { fromJust, isJust, Maybe } from "../../../Data/Maybe";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { EnergyIds } from "../../Selectors/derivedCharacteristicsSelectors";
import { translate } from "../../Utilities/I18n";
import { isFunction } from "../../Utilities/typeCheckUtils";
import { Dialog, DialogProps } from "../Universal/DialogNew";
import { IconButton } from "../Universal/IconButton";

export interface PermanentPointsProps extends DialogProps {
  id: EnergyIds
  l10n: L10nRecord
  permanentBoughtBack: Maybe<number>
  permanentSpent: number
  addBoughtBackPoint? (): void
  addLostPoint (): void
  removeBoughtBackPoint? (): void
  removeLostPoint (): void
}

export function PermanentPoints (props: PermanentPointsProps) {
  const {
    id,
    l10n,
    addBoughtBackPoint,
    addLostPoint,
    permanentBoughtBack,
    permanentSpent,
    removeBoughtBackPoint,
    removeLostPoint,
  } = props

  return (
    <Dialog
      {...props}
      className="permanent-points-editor"
      title={
        id === "AE"
          ? translate (l10n) ("arcaneenergylostpermanently")
          : id === "KP"
          ? translate (l10n) ("karmapointslostpermanently")
          : translate (l10n) ("lifepointslostpermanently")
      }
      buttons={[
        {
          autoWidth: true,
          label: translate (l10n) ("done"),
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
                  {translate (l10n) ("boughtback")}
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
            : null}
        <div className="column lost">
          <div className="value">{permanentSpent}</div>
          <div className="description smallcaps">{translate (l10n) ("spent")}</div>
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
