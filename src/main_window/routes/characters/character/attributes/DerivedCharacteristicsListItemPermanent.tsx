import type { DerivedCharacteristicTranslation } from "@optolith/database-schema/gen"
import { observer } from "mobx-react-lite"
import { type FC, useCallback } from "react"
import { IconButton } from "../../../../../shared/components/iconButton/IconButton.tsx"
import type { DisplayedDerivedCharacteristic } from "../../../../../shared/domain/energy.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useCharacterActions } from "../../../../hooks/characterAction.ts"
import { useCharacterState } from "../../../../hooks/characterState.ts"
import { useModalState } from "../../../../hooks/modalState.ts"
import { AttributeBorder } from "./AttributeBorder.tsx"
import { PermanentLossSheet } from "./PermanentLossSheet.tsx"
import { PermanentPointsSheet } from "./PermanentPointsSheet.tsx"

type Props = {
  attribute: DisplayedDerivedCharacteristic
  translation: DerivedCharacteristicTranslation | undefined
}

/**
 * Returns a value item and buttons to adjust the value for a supplementary
 * derived characteristic value.
 */
export const DerivedCharacteristicsListItemPermanent: FC<Props> = observer(props => {
  const { attribute, translation } = props

  const { id, permanentlyLost = 0, permanentlyLostBoughtBack } = attribute
  const translate = useTranslate()
  const { canRemove } = useCharacterState()
  const actions = useCharacterActions()

  const {
    isOpen: isPermanentPointsSheetOpen,
    open: openPermanentPointsSheet,
    close: closePermanentPointsSheet,
  } = useModalState()

  const {
    isOpen: isPermanentLossSheetOpen,
    open: openPermanentLossSheet,
    close: closePermanentLossSheet,
  } = useModalState()

  const handleAddPermanentlyLostPoint = useCallback(() => {
    actions.incrementDerivedCharacteristicPermanentlyLost(id)
  }, [id])

  const handleAddPermanentlyLostPoints = useCallback(
    (value: number) => {
      actions.addDerivedCharacteristicPermanentlyLost(id, value)
    },
    [id],
  )

  const handleRemovePermanentlyLostPoint = useCallback(() => {
    actions.decrementDerivedCharacteristicPermanentlyLost(id)
  }, [id])

  const handleAddBoughtBackPoint = useCallback(() => {
    actions.incrementDerivedCharacteristicBoughtBack(id)
  }, [id])

  const handleRemoveBoughtBackPoint = useCallback(() => {
    actions.decrementDerivedCharacteristicBoughtBack(id)
  }, [id])

  const available =
    typeof permanentlyLostBoughtBack === "number"
      ? permanentlyLost - permanentlyLostBoughtBack
      : permanentlyLost

  const label = translate("p{$energy}", {
    energy: translation?.unitAbbreviation ?? translation?.abbreviation ?? "",
  })

  const name = translate("Permanently Lost {$energy}", {
    energy: translation?.name ?? "",
  })

  return (
    <AttributeBorder
      className="permanent"
      label={label}
      value={available}
      tooltip={
        <div className="calc-attr-overlay">
          <h4>
            <span>{name}</span>
            <span>{available}</span>
          </h4>
          {typeof permanentlyLostBoughtBack === "number" ? (
            <p>
              {translate("Lost Total")}
              {": "}
              {permanentlyLost}
              <br />
              {translate("Bought Back")}
              {": "}
              {permanentlyLostBoughtBack}
            </p>
          ) : (
            <p>
              {translate("Lost Total")}
              {": "}
              {permanentlyLost}
            </p>
          )}
        </div>
      }
      tooltipMargin={7}
    >
      {canRemove ? (
        <>
          <IconButton
            className="edit"
            icon="&#xE90c;"
            label={translate("Lost Total")}
            onClick={openPermanentPointsSheet}
          />
          <PermanentPointsSheet
            id={id}
            name={name}
            isOpen={isPermanentPointsSheetOpen}
            permanentlyLost={permanentlyLost}
            permanentlyLostBoughtBack={permanentlyLostBoughtBack}
            addBoughtBackPoint={handleAddBoughtBackPoint}
            addLostPoint={handleAddPermanentlyLostPoint}
            removeBoughtBackPoint={handleRemoveBoughtBackPoint}
            removeLostPoint={handleRemovePermanentlyLostPoint}
            close={closePermanentPointsSheet}
          />
        </>
      ) : (
        <>
          <IconButton
            className="add"
            icon="&#xE908;"
            label={translate("Lost Total")}
            onClick={openPermanentLossSheet}
          />
          <PermanentLossSheet
            remove={handleAddPermanentlyLostPoints}
            isOpen={isPermanentLossSheetOpen}
            close={closePermanentLossSheet}
          />
        </>
      )}
      {!canRemove && typeof permanentlyLostBoughtBack === "number" ? (
        <IconButton
          className="remove"
          icon="&#xE909;"
          label={translate("Buy Back Permanently Lost Point")}
          onClick={handleAddBoughtBackPoint}
          disabled={available <= 0}
        />
      ) : null}
    </AttributeBorder>
  )
})
