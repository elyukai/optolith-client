import { observer } from "mobx-react"
import type { FC } from "react"
import { Main } from "../../../../../shared/components/main/Main.tsx"
import { Page } from "../../../../../shared/components/page/Page.tsx"
import { Scroll } from "../../../../../shared/components/scroll/Scroll.tsx"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { SharedState } from "../../../../external.ts"
import "./Attributes.scss"
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
    canRemove: isRemovingEnabled,
  } = SharedState

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
            {/* TODO: isInCharacterCreation ? <AttributesAdjustment /> : null */}
            <DerivedCharacteristicsList
              isInCharacterCreation={isInCharacterCreation}
              isRemovingEnabled={isRemovingEnabled}
            />
          </div>
        </Scroll>
      </Main>
    </Page>
  )
})
