import { FC, useCallback, useMemo } from "react"
import { Dropdown } from "../../../../../shared/components/dropdown/Dropdown.tsx"
import { DropdownOption } from "../../../../../shared/components/dropdown/DropdownItem.tsx"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { sign } from "../../../../../shared/utils/math.ts"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts"
import { selectAvailableAdjustments } from "../../../../selectors/attributeSelectors.ts"
import { selectAttributeAdjustmentId } from "../../../../slices/characterSlice.ts"
import { changeAttributeAdjustmentId } from "../../../../slices/raceSlice.ts"
import "./AttributeAdjustment.scss"

const getKey = (option: DropdownOption<number>) => option.id

/**
 * Returns a widget for changing the attribute adjustment set for the race.
 */
export const AttributesAdjustment: FC = () => {
  const dispatch = useAppDispatch()
  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const adjustments = useAppSelector(selectAvailableAdjustments)
  const currentAdjustmentId = useAppSelector(selectAttributeAdjustmentId)

  const adjustmentOptions = useMemo(() => {
    if (adjustments === undefined) {
      return undefined
    } else {
      return adjustments.list.map<DropdownOption<number>>(attribute => ({
        id: attribute.static.id,
        name: `${translateMap(attribute.static.translations)?.name ?? attribute.static.id} ${sign(
          adjustments.value,
        )}`,
      }))
    }
  }, [adjustments, translateMap])

  const setAdjustmentId = useCallback(
    (id: number) => dispatch(changeAttributeAdjustmentId(id)),
    [dispatch],
  )

  return adjustmentOptions === undefined ? null : (
    <div className="attribute-adjustment">
      <span className="label">{translate("Attribute Adjustment Selection")}</span>
      <Dropdown
        options={adjustmentOptions}
        value={currentAdjustmentId}
        onChange={setAdjustmentId}
        disabled={
          adjustmentOptions.length === 1 && adjustmentOptions[0]!.id === currentAdjustmentId
        }
        getKey={getKey}
      />
    </div>
  )
}
