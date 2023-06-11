import { FC } from "react"
import { Page } from "../../../../../shared/components/page/Page.tsx"
import { Scroll } from "../../../../../shared/components/scroll/Scroll.tsx"
import { useAppSelector } from "../../../../hooks/redux.ts"
import { useTranslate } from "../../../../hooks/translate.ts"
import { selectTotalPoints } from "../../../../selectors/attributeSelectors.ts"
import { selectIsInCharacterCreation } from "../../../../selectors/characterSelectors.ts"
import { selectMaximumTotalAttributePoints } from "../../../../selectors/experienceLevelSelectors.ts"
import { selectAttributes } from "../../../../slices/characterSlice.ts"
import "./Attributes.scss"
import { AttributeList } from "./AttributesList.tsx"
import { DerivedCharacteristicsList } from "./DerivedCharacteristicsList.tsx"

export const Attributes: FC = () => {
  // TODO: Replace with actual selectors
  const isRemovingEnabled = true

  const translate = useTranslate()
  const totalPoints = useAppSelector(selectTotalPoints)
  const maxTotalPoints = useAppSelector(selectMaximumTotalAttributePoints)
  const isInCharacterCreation = useAppSelector(selectIsInCharacterCreation)

  console.log(useAppSelector(selectAttributes))

  return (
    <Page id="attributes">
      <Scroll>
        <div className="counter">
          {translate("Total Points")}
          {": "}
          {isInCharacterCreation ? `${totalPoints} / ${maxTotalPoints}` : totalPoints}
        </div>
        <AttributeList
          isInCharacterCreation={isInCharacterCreation}
          isRemovingEnabled={isRemovingEnabled}
          />
        <div className="secondary">
          {/* {isInCharacterCreation
            ? (
              <AttributesAdjustment
                adjustmentValue={adjustmentValue}
                attributes={attributes}
                availableAttributeIds={availableAttributeIds}
                currentAttributeId={currentAttributeId}
                staticData={staticData}
                setAdjustmentId={setAdjustmentId}
                />
            )
            : null} */}
          <DerivedCharacteristicsList
            isInCharacterCreation={isInCharacterCreation}
            isRemovingEnabled={isRemovingEnabled}
            />
        </div>
      </Scroll>
    </Page>
  )
}
