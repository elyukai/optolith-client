import { FC } from "react"
import { Main } from "../../../../../shared/components/main/Main.tsx"
import { Page } from "../../../../../shared/components/page/Page.tsx"
import { Scroll } from "../../../../../shared/components/scroll/Scroll.tsx"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useAppSelector } from "../../../../hooks/redux.ts"
import { selectTotalPoints } from "../../../../selectors/attributeSelectors.ts"
import { selectCanRemove, selectIsInCharacterCreation } from "../../../../selectors/characterSelectors.ts"
import { selectMaximumTotalAttributePoints } from "../../../../selectors/experienceLevelSelectors.ts"
import { AttributesAdjustment } from "./AttributeAdjustment.tsx"
import "./Attributes.scss"
import { AttributeList } from "./AttributesList.tsx"
import { DerivedCharacteristicsList } from "./DerivedCharacteristicsList.tsx"

export const Attributes: FC = () => {
  const translate = useTranslate()
  const totalPoints = useAppSelector(selectTotalPoints)
  const maxTotalPoints = useAppSelector(selectMaximumTotalAttributePoints)
  const isInCharacterCreation = useAppSelector(selectIsInCharacterCreation)
  const isRemovingEnabled = useAppSelector(selectCanRemove)

  return (
    <Page id="attributes">
      <Main>
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
            {isInCharacterCreation ? <AttributesAdjustment /> : null}
            <DerivedCharacteristicsList
              isInCharacterCreation={isInCharacterCreation}
              isRemovingEnabled={isRemovingEnabled}
              />
          </div>
        </Scroll>
      </Main>
    </Page>
  )
}
