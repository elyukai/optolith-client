import { observer } from "mobx-react-lite"
import type { FC } from "react"
import { useCharacterState } from "../../../../hooks/characterState.ts"
import "./DerivedCharacteristicsList.css"
import { DerivedCharacteristicsListItem } from "./DerivedCharacteristicsListItem.tsx"

/**
 * Returns a list of derived characteristic values.
 */
export const DerivedCharacteristicsList: FC = observer(() => (
  <div className="derived-characteristics">
    {useCharacterState().derivedCharacteristics.map(derivedCharacteristic => (
      <DerivedCharacteristicsListItem
        key={derivedCharacteristic.id}
        attribute={derivedCharacteristic}
      />
    ))}
  </div>
))
