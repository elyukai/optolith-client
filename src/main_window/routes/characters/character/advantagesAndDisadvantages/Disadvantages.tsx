import { FC, useCallback, useState } from "react"
import { Button } from "../../../../../shared/components/button/Button.tsx"
import { Checkbox } from "../../../../../shared/components/checkbox/Checkbox.tsx"
import { Grid } from "../../../../../shared/components/grid/Grid.tsx"
import { ListHeader } from "../../../../../shared/components/list/ListHeader.tsx"
import { ListHeaderTag } from "../../../../../shared/components/list/ListHeaderTag.tsx"
import { ListPlaceholder } from "../../../../../shared/components/list/ListPlaceholder.tsx"
import { Main } from "../../../../../shared/components/main/Main.tsx"
import { Options } from "../../../../../shared/components/options/Options.tsx"
import { Page } from "../../../../../shared/components/page/Page.tsx"
import { RecommendedReference } from "../../../../../shared/components/recommendedReference/RecommendedReference.tsx"
import { Scroll } from "../../../../../shared/components/scroll/Scroll.tsx"
import { TextField } from "../../../../../shared/components/textField/TextField.tsx"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts"
import { InlineLibrary } from "../../../../inlineLibrary/InlineLibrary.tsx"
import {
  selectCanRemove,
  selectIsInCharacterCreation,
} from "../../../../selectors/characterSelectors.ts"
import {
  selectAdvantagesDisadvantagesCultureRatingVisibility,
  switchAdvantagesDisadvantagesCultureRatingVisibility,
} from "../../../../slices/settingsSlice.ts"
import { AdventurePointsSpent } from "./AdventurePointsSpent.tsx"

/**
 * Returns a page for managing disadvantages.
 */
export const Disadvantages: FC = () => {
  const translate = useTranslate()
  const dispatch = useAppDispatch()

  const cultureRatingVisibility = useAppSelector(
    selectAdvantagesDisadvantagesCultureRatingVisibility,
  )
  const handlSwitchCultureRatingVisibility = useCallback(
    () => dispatch(switchAdvantagesDisadvantagesCultureRatingVisibility()),
    [dispatch],
  )

  const canRemove = useAppSelector(selectCanRemove)
  const isInCharacterCreation = useAppSelector(selectIsInCharacterCreation)

  const [filterText, setFilterText] = useState("")

  return (
    <Page id="disadvantages">
      <Options>
        <TextField value={filterText} onChange={setFilterText} hint={translate("Search")} />
        <Button>{translate("Add")}</Button>
        <Grid size="medium">
          <Checkbox checked={cultureRatingVisibility} onClick={handlSwitchCultureRatingVisibility}>
            {translate("disadvantages.filters.commondisadvantages")}
          </Checkbox>
          {cultureRatingVisibility ? <RecommendedReference strongly /> : null}
        </Grid>
        {isInCharacterCreation && <AdventurePointsSpent />}
      </Options>
      <Main>
        <ListHeader>
          <ListHeaderTag className="name">
            {translate("advantagesdisadvantages.header.name")}
          </ListHeaderTag>
          <ListHeaderTag
            className="cost"
            hint={translate("advantagesdisadvantages.header.adventurepoints.tooltip")}
          >
            {translate("advantagesdisadvantages.header.adventurepoints")}
          </ListHeaderTag>
          {canRemove && <ListHeaderTag className="btn-placeholder" />}
          <ListHeaderTag className="btn-placeholder" />
        </ListHeader>
        <Scroll stable>
          <ListPlaceholder type="disadvantages" message={translate("No Results")} />
        </Scroll>
      </Main>
      <InlineLibrary />
    </Page>
  )
}
