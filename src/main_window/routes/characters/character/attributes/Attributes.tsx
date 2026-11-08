import { observer } from "mobx-react-lite"
import type { FC } from "react"
import { Main } from "../../../../../shared/components/main/Main.tsx"
import { Page } from "../../../../../shared/components/page/Page.tsx"
import { Scroll } from "../../../../../shared/components/scroll/Scroll.tsx"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useCharacterState } from "../../../../hooks/characterState.ts"
import { AttributesAdjustment } from "./AttributeAdjustment.tsx"
import "./Attributes.css"
import { AttributeList } from "./AttributesList.tsx"
import { DerivedCharacteristicsList } from "./DerivedCharacteristicsList.tsx"

/**
 * Returns a page for managing attributes.
 */
export const Attributes: FC = observer(() => {
  const translate = useTranslate()
  const {
    attributesTotal: totalPoints,
    attributesTotalMaximum: maxTotalPoints,
    isInCharacterCreation,
  } = useCharacterState()

  return (
    <Page id="attributes">
      <Main>
        <Scroll>
          <div className="counter">
            {translate("Total Points")}
            {": "}
            {isInCharacterCreation ? `${totalPoints} / ${maxTotalPoints}` : totalPoints}
          </div>
          <AttributeList />
          <div className="secondary">
            {isInCharacterCreation ? <AttributesAdjustment /> : null}
            <DerivedCharacteristicsList />
          </div>
        </Scroll>
      </Main>
    </Page>
  )
})
