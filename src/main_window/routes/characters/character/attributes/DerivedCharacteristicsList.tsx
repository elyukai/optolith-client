import { FC } from "react"
import { useAppSelector } from "../../../../hooks/redux.ts"
import { selectDerivedCharacteristics } from "../../../../selectors/derivedCharacteristicsSelectors.ts"
import "./DerivedCharacteristicsList.scss"
import { DerivedCharacteristicsListItem } from "./DerivedCharacteristicsListItem.tsx"

type Props = {
  isInCharacterCreation: boolean
  isRemovingEnabled: boolean
}

/**
 * Returns a list of derived characteristic values.
 */
export const DerivedCharacteristicsList: FC<Props> = props => {
  const { isInCharacterCreation, isRemovingEnabled } = props

  const derivedCharacteristics = useAppSelector(selectDerivedCharacteristics)

  return (
    <div className="derived-characteristics">
      {derivedCharacteristics.map(derivedCharacteristic => (
        <DerivedCharacteristicsListItem
          key={derivedCharacteristic.id}
          attribute={derivedCharacteristic}
          isInCharacterCreation={isInCharacterCreation}
          isRemovingEnabled={isRemovingEnabled}
        />
      ))}
    </div>
  )
}
