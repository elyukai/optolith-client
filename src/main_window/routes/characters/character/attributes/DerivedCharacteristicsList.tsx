import { observer } from "mobx-react"
import type { FC } from "react"
import { useCharacterState } from "../../../../hooks/characterState.ts"
import "./DerivedCharacteristicsList.scss"
import { DerivedCharacteristicsListItem } from "./DerivedCharacteristicsListItem.tsx"

type Props = {
  isInCharacterCreation: boolean
  isRemovingEnabled: boolean
}

/**
 * Returns a list of derived characteristic values.
 */
export const DerivedCharacteristicsList: FC<Props> = observer(props => {
  const { isInCharacterCreation, isRemovingEnabled } = props

  return (
    <div className="derived-characteristics">
      {useCharacterState().derivedCharacteristics.map(derivedCharacteristic => (
        <DerivedCharacteristicsListItem
          key={derivedCharacteristic.id}
          attribute={derivedCharacteristic}
          isInCharacterCreation={isInCharacterCreation}
          isRemovingEnabled={isRemovingEnabled}
        />
      ))}
    </div>
  )
})
