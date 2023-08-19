import { FC, useCallback, useState } from "react"
import { Button } from "../../../../../shared/components/button/Button.tsx"
import { ListHeader } from "../../../../../shared/components/list/ListHeader.tsx"
import { ListHeaderTag } from "../../../../../shared/components/list/ListHeaderTag.tsx"
import { ListPlaceholder } from "../../../../../shared/components/list/ListPlaceholder.tsx"
import { Main } from "../../../../../shared/components/main/Main.tsx"
import { Options } from "../../../../../shared/components/options/Options.tsx"
import { Page } from "../../../../../shared/components/page/Page.tsx"
import { RadioButtonGroup } from "../../../../../shared/components/radioButton/RadioButtonGroup.tsx"
import { Scroll } from "../../../../../shared/components/scroll/Scroll.tsx"
import { TextField } from "../../../../../shared/components/textField/TextField.tsx"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts"
import { InlineLibrary } from "../../../../inlineLibrary/InlineLibrary.tsx"
import { selectCanRemove } from "../../../../selectors/characterSelectors.ts"
import {
  LiturgiesSortOrder,
  changeLiturgiesSortOrder,
  selectLiturgiesSortOrder,
} from "../../../../slices/settingsSlice.ts"

export const LiturgicalChants: FC = () => {
  const translate = useTranslate()
  const dispatch = useAppDispatch()

  const canRemove = useAppSelector(selectCanRemove)

  const [filterText, setFilterText] = useState("")
  const sortOrder = useAppSelector(selectLiturgiesSortOrder)
  const handleChangeSortOrder = useCallback(
    (id: LiturgiesSortOrder) => dispatch(changeLiturgiesSortOrder(id)),
    [dispatch],
  )

  return (
    <Page id="liturgical-chants">
      <Options>
        <TextField value={filterText} onChange={setFilterText} hint={translate("Search")} />
        <RadioButtonGroup
          active={sortOrder}
          label={translate("Sort By")}
          array={[
            {
              name: translate("Name"),
              value: LiturgiesSortOrder.Name,
            },
            {
              name: translate("Group"),
              value: LiturgiesSortOrder.Group,
            },
            {
              name: translate("Improvement Cost"),
              value: LiturgiesSortOrder.ImprovementCost,
            },
          ]}
          onClick={handleChangeSortOrder}
        />
        <Button>{translate("Add")}</Button>
      </Options>
      <Main>
        <ListHeader>
          <ListHeaderTag className="name">
            {translate("liturgicalchants.header.name")}
          </ListHeaderTag>
          <ListHeaderTag className="group">
            {translate("liturgicalchants.header.traditions")}
            {sortOrder === LiturgiesSortOrder.Group
              ? ` / ${translate("liturgicalchants.header.group")}`
              : null}
          </ListHeaderTag>
          <ListHeaderTag
            className="value"
            hint={translate("liturgicalchants.header.skillrating.tooltip")}
          >
            {translate("liturgicalchants.header.skillrating")}
          </ListHeaderTag>
          <ListHeaderTag className="check">
            {translate("liturgicalchants.header.check")}
          </ListHeaderTag>
          <ListHeaderTag
            className="mod"
            hint={translate("liturgicalchants.header.checkmodifier.tooltip")}
          >
            {translate("liturgicalchants.header.checkmodifier")}
          </ListHeaderTag>
          <ListHeaderTag
            className="ic"
            hint={translate("liturgicalchants.header.improvementcost.tooltip")}
          >
            {translate("liturgicalchants.header.improvementcost")}
          </ListHeaderTag>
          {canRemove ? <ListHeaderTag className="btn-placeholder" /> : null}
          <ListHeaderTag className="btn-placeholder" />
          <ListHeaderTag className="btn-placeholder" />
        </ListHeader>
        <Scroll stable>
          <ListPlaceholder type="liturgicalChants" message={translate("No Results")} />
        </Scroll>
      </Main>
      <InlineLibrary />
    </Page>
  )
}
