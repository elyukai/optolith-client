import { observer } from "mobx-react-lite"
import { useCallback, useState, type FC } from "react"
import { Checkbox } from "../../../../../shared/components/checkbox/Checkbox.tsx"
import { ListHeader } from "../../../../../shared/components/list/ListHeader.tsx"
import { ListHeaderTag } from "../../../../../shared/components/list/ListHeaderTag.tsx"
import { Main } from "../../../../../shared/components/main/Main.tsx"
import { Options } from "../../../../../shared/components/options/Options.tsx"
import { Page } from "../../../../../shared/components/page/Page.tsx"
import { RadioButtonGroup } from "../../../../../shared/components/radioButton/RadioButtonGroup.tsx"
import { Scroll } from "../../../../../shared/components/scroll/Scroll.tsx"
import { TextField } from "../../../../../shared/components/textField/TextField.tsx"
import { CulturesSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts"
import { InlineLibrary } from "../../../../inlineLibrary/InlineLibrary.tsx"
import {
  changeCulturesSortOrder,
  selectCulturesSortOrder,
} from "../../../../slices/settingsSlice.ts"
import { CulturesList } from "./CulturesList.tsx"

export const Cultures: FC = observer(() => {
  const translate = useTranslate()
  const dispatch = useAppDispatch()

  const [filterText, setFilterText] = useState("")
  const sortOrder = useAppSelector(selectCulturesSortOrder)
  const handleChangeSortOrder = useCallback(
    (id: CulturesSortOrder) => dispatch(changeCulturesSortOrder(id)),
    [dispatch],
  )

  return (
    <Page id="cultures">
      <Options>
        <TextField value={filterText} onChange={setFilterText} hint={translate("Search")} />
        <RadioButtonGroup
          active={sortOrder}
          label={translate("Sort By")}
          options={[
            {
              name: translate("Name"),
              value: CulturesSortOrder.Name,
            },
            {
              name: translate("AP Value"),
              value: CulturesSortOrder.Cost,
            },
          ]}
          onClick={handleChangeSortOrder}
        />
        <Checkbox
          checked={true /* TODO */}
          label={translate("Show uncommon cultures")}
          onClick={() => undefined /* TODO */}
          disabled={true /* TODO */}
        />
      </Options>
      <Main>
        <Scroll>
          <ListHeader>
            <ListHeaderTag className="name">{translate("Name")}</ListHeaderTag>
            <ListHeaderTag className="cost" hint={translate("Adventure Points")}>
              {translate("AP")}
            </ListHeaderTag>
            <ListHeaderTag className="btn-placeholder has-border" />
            <ListHeaderTag className="btn-placeholder has-border" />
            <ListHeaderTag className="btn-placeholder" />
          </ListHeader>
          <CulturesList filterText={filterText} sortOrder={sortOrder} />
        </Scroll>
      </Main>
      <InlineLibrary />
    </Page>
  )
})
