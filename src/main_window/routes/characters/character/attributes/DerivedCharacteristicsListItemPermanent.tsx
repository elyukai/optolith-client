import { FC, useCallback } from "react"
import { IconButton } from "../../../../../shared/components/iconButton/IconButton.tsx"
import { DerivedCharacteristicIdentifier as DCId } from "../../../../../shared/domain/identifier.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { assertExhaustive } from "../../../../../shared/utils/typeSafety.ts"
import { useModalState } from "../../../../hooks/modalState.ts"
import { useAppDispatch } from "../../../../hooks/redux.ts"
import { DisplayedDerivedCharacteristic } from "../../../../selectors/derivedCharacteristicsSelectors.ts"
import { addArcaneEnergyPermanentlyLost, addKarmaPointsPermanentlyLost, addLifePointsPermanentlyLost, decrementArcaneEnergyBoughtBack, decrementArcaneEnergyPermanentlyLost, decrementKarmaPointsBoughtBack, decrementKarmaPointsPermanentlyLost, decrementLifePointsPermanentlyLost, incrementArcaneEnergyBoughtBack, incrementArcaneEnergyPermanentlyLost, incrementKarmaPointsBoughtBack, incrementKarmaPointsPermanentlyLost, incrementLifePointsPermanentlyLost } from "../../../../slices/derivedCharacteristicsSlice.ts"
import { AttributeBorder } from "./AttributeBorder.tsx"
import { PermanentLossSheet } from "./PermanentLossSheet.tsx"
import { PermanentPointsSheet } from "./PermanentPointsSheet.tsx"

type Props = {
  attribute: DisplayedDerivedCharacteristic<DCId.LifePoints | DCId.ArcaneEnergy | DCId.KarmaPoints>
  isRemovingEnabled: boolean
}

export const DerivedCharacteristicsListItemPermanent: FC<Props> = props => {
  const {
    attribute,
    isRemovingEnabled,
  } = props

  const { id, permanentlyLost = 0, permanentlyLostBoughtBack } = attribute
  const dispatch = useAppDispatch()
  const translate = useTranslate()

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

  const handleAddPermanentlyLostPoint = useCallback(
    () => {
      switch (id) {
        case DCId.LifePoints: dispatch(incrementLifePointsPermanentlyLost()); break
        case DCId.ArcaneEnergy: dispatch(incrementArcaneEnergyPermanentlyLost()); break
        case DCId.KarmaPoints: dispatch(incrementKarmaPointsPermanentlyLost()); break
        default: assertExhaustive(id)
      }
    },
    [ dispatch, id ]
  )

  const handleAddPermanentlyLostPoints = useCallback(
    (value: number) => {
      switch (id) {
        case DCId.LifePoints: dispatch(addLifePointsPermanentlyLost(value)); break
        case DCId.ArcaneEnergy: dispatch(addArcaneEnergyPermanentlyLost(value)); break
        case DCId.KarmaPoints: dispatch(addKarmaPointsPermanentlyLost(value)); break
        default: assertExhaustive(id)
      }
    },
    [ dispatch, id ]
  )

  const handleRemovePermanentlyLostPoint = useCallback(
    () => {
      switch (id) {
        case DCId.LifePoints: dispatch(decrementLifePointsPermanentlyLost()); break
        case DCId.ArcaneEnergy: dispatch(decrementArcaneEnergyPermanentlyLost()); break
        case DCId.KarmaPoints: dispatch(decrementKarmaPointsPermanentlyLost()); break
        default: assertExhaustive(id)
      }
    },
    [ dispatch, id ]
  )

  const handleAddBoughtBackPoint = useCallback(
    () => {
      switch (id) {
        case DCId.LifePoints: break
        case DCId.ArcaneEnergy: dispatch(incrementArcaneEnergyBoughtBack()); break
        case DCId.KarmaPoints: dispatch(incrementKarmaPointsBoughtBack()); break
        default: assertExhaustive(id)
      }
    },
    [ dispatch, id ]
  )

  const handleRemoveBoughtBackPoint = useCallback(
    () => {
      switch (id) {
        case DCId.LifePoints: break
        case DCId.ArcaneEnergy: dispatch(decrementArcaneEnergyBoughtBack); break
        case DCId.KarmaPoints: dispatch(decrementKarmaPointsBoughtBack); break
        default: assertExhaustive(id)
      }
    },
    [ dispatch, id ]
  )

  const available = typeof permanentlyLostBoughtBack === "number"
    ? permanentlyLost - permanentlyLostBoughtBack
    : permanentlyLost

  const [ label, name ] =
    id === DCId.LifePoints
    ? [
      translate("pLP"),
      translate("Permanently Lost Life Points"),
    ]
    : id === DCId.ArcaneEnergy
    ? [
      translate("pAE"),
      translate("Permanently Lost Arcane Energy"),
    ]
    : [
      translate("pKP"),
      translate("Permanently Lost Karma Points"),
    ]

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
          {
            typeof permanentlyLostBoughtBack === "number"
            ? (
                <p>
                  {translate("Lost Total")}
                  {": "}
                  {permanentlyLost}
                  <br />
                  {translate("Bought Back")}
                  {": "}
                  {permanentlyLostBoughtBack}
                </p>
              )
            : (
                <p>
                  {translate("Lost Total")}
                  {": "}
                  {permanentlyLost}
                </p>
              )
          }
        </div>
      }
      tooltipMargin={7}
      >
      {isRemovingEnabled
        ? (
          <>
            <IconButton
              className="edit"
              icon="&#xE90c;"
              label={translate("Lost Total")}
              onClick={openPermanentPointsSheet}
              />
            <PermanentPointsSheet
              id={id}
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
        )
      : (
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
      {!isRemovingEnabled && id !== DCId.LifePoints
        ? (
          <IconButton
            className="remove"
            icon="&#xE909;"
            label={translate("Buy Back Permanently Lost Point")}
            onClick={handleAddBoughtBackPoint}
            disabled={available <= 0}
            />
        )
        : null}
    </AttributeBorder>
  )
}
