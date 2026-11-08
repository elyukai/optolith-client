import { isNotEmpty } from "@elyukai/utils/array/nonEmpty"
import { observer } from "mobx-react-lite"
import type { FC } from "react"
import { Dropdown } from "../../../../../shared/components/dropdown/Dropdown.tsx"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useCharacterActions } from "../../../../hooks/characterAction.ts"
import { useCharacterState } from "../../../../hooks/characterState.ts"
import "./AttributeAdjustment.css"

/**
 * Returns a widget for changing the attribute adjustment set for the race.
 */
export const AttributesAdjustment: FC = observer(() => {
  const translate = useTranslate()
  const { availableAdjustments: adjustments, selectedAttributeAdjustment: currentAdjustmentId } =
    useCharacterState()
  const actions = useCharacterActions()

  return adjustments === undefined ? null : (
    <div className="attribute-adjustment">
      <span className="label">{translate("Attribute Adjustment Selection")}</span>
      <Dropdown<string>
        options={adjustments.list}
        value={currentAdjustmentId}
        onChange={id => actions.setAttributeAdjustment(id)}
        disabled={
          isNotEmpty(adjustments.list) &&
          adjustments.list.length === 1 &&
          adjustments.list[0].id === currentAdjustmentId
        }
        getKey={option => option.id}
      />
    </div>
  )
})
