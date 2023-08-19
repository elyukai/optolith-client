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
  SpecialAbilitiesSortOrder,
  changeSpecialAbilitiesSortOrder,
  selectSpecialAbilitiesSortOrder,
} from "../../../../slices/settingsSlice.ts"

export const SpecialAbilities: FC = () => {
  const translate = useTranslate()
  const dispatch = useAppDispatch()

  const canRemove = useAppSelector(selectCanRemove)

  const [filterText, setFilterText] = useState("")
  const sortOrder = useAppSelector(selectSpecialAbilitiesSortOrder)
  const handleChangeSortOrder = useCallback(
    (id: SpecialAbilitiesSortOrder) => dispatch(changeSpecialAbilitiesSortOrder(id)),
    [dispatch],
  )

  return (
    <Page id="advantages">
      <Options>
        <TextField value={filterText} onChange={setFilterText} hint={translate("Search")} />
        <RadioButtonGroup
          active={sortOrder}
          label={translate("Sort By")}
          array={[
            {
              name: translate("Name"),
              value: SpecialAbilitiesSortOrder.Name,
            },
            {
              name: translate("Group"),
              value: SpecialAbilitiesSortOrder.Group,
            },
          ]}
          onClick={handleChangeSortOrder}
        />
        <Button>{translate("Add")}</Button>
      </Options>
      <Main>
        <ListHeader>
          <ListHeaderTag className="name">
            {translate("specialabilities.header.name")}
          </ListHeaderTag>
          <ListHeaderTag className="group">
            {translate("specialabilities.header.group")}
          </ListHeaderTag>
          <ListHeaderTag
            className="cost"
            hint={translate("specialabilities.header.adventurepoints.tooltip")}
          >
            {translate("specialabilities.header.adventurepoints")}
          </ListHeaderTag>
          {canRemove ? <ListHeaderTag className="btn-placeholder" /> : null}
          <ListHeaderTag className="btn-placeholder" />
        </ListHeader>
        <Scroll stable>
          <ListPlaceholder type="specialAbilities" message={translate("No Results")} />
        </Scroll>
      </Main>
      <InlineLibrary />
    </Page>
  )
}
