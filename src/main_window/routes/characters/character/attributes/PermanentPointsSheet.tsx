import { FC } from "react"
import { Dialog } from "../../../../../shared/components/dialog/Dialog.tsx"
import { IconButton } from "../../../../../shared/components/iconButton/IconButton.tsx"
import {
  DerivedCharacteristicIdentifier as DCId,
  EnergyIdentifier,
} from "../../../../../shared/domain/identifier.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"

type Props = {
  id: EnergyIdentifier
  isOpen: boolean
  permanentlyLost: number
  permanentlyLostBoughtBack: number | undefined
  addBoughtBackPoint?(): void
  addLostPoint(): void
  removeBoughtBackPoint?(): void
  removeLostPoint(): void
  close(): void
}

export const PermanentPointsSheet: FC<Props> = props => {
  const {
    id,
    isOpen,
    permanentlyLost,
    permanentlyLostBoughtBack,
    addBoughtBackPoint,
    addLostPoint,
    removeBoughtBackPoint,
    removeLostPoint,
    close,
  } = props

  const translate = useTranslate()

  return (
    <Dialog
      id={id.toFixed()}
      isOpen={isOpen}
      close={close}
      className="permanent-points-editor"
      title={
        id === DCId.ArcaneEnergy
          ? translate("Permanently Lost Arcane Energy")
          : id === DCId.KarmaPoints
          ? translate("Permanently Lost Karma Points")
          : translate("Permanently Lost Life Points")
      }
      buttons={[
        {
          autoWidth: true,
          label: translate("Done"),
        },
      ]}
    >
      <div className="main">
        {addBoughtBackPoint !== undefined &&
        removeBoughtBackPoint !== undefined &&
        permanentlyLostBoughtBack !== undefined ? (
          <div className="column boughtback">
            <div className="value">{permanentlyLostBoughtBack}</div>
            <div className="description smallcaps">{translate("Bought Back")}</div>
            <div className="buttons">
              <IconButton
                className="add"
                icon="&#xE908;"
                label={translate("Increment")}
                onClick={addBoughtBackPoint}
                disabled={permanentlyLostBoughtBack >= permanentlyLost}
              />
              <IconButton
                className="remove"
                icon="&#xE909;"
                label={translate("Decrement")}
                onClick={removeBoughtBackPoint}
                disabled={permanentlyLostBoughtBack <= 0}
              />
            </div>
          </div>
        ) : null}
        <div className="column lost">
          <div className="value">{permanentlyLost}</div>
          <div className="description smallcaps">{translate("Permanently Spent")}</div>
          <div className="buttons">
            <IconButton
              className="add"
              icon="&#xE908;"
              label={translate("Increment")}
              onClick={addLostPoint}
            />
            <IconButton
              className="remove"
              icon="&#xE909;"
              label={translate("Decrement")}
              onClick={removeLostPoint}
              disabled={permanentlyLost <= 0}
            />
          </div>
        </div>
      </div>
    </Dialog>
  )
}
