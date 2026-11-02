import { observer } from "mobx-react-lite"
import { useCallback, useState, type FC } from "react"
import { ListHeader } from "../../../../../shared/components/list/ListHeader.tsx"
import { ListHeaderTag } from "../../../../../shared/components/list/ListHeaderTag.tsx"
import { Main } from "../../../../../shared/components/main/Main.tsx"
import { Options } from "../../../../../shared/components/options/Options.tsx"
import { Page } from "../../../../../shared/components/page/Page.tsx"
import { RadioButtonGroup } from "../../../../../shared/components/radioButton/RadioButtonGroup.tsx"
import { Scroll } from "../../../../../shared/components/scroll/Scroll.tsx"
import { TextField } from "../../../../../shared/components/textField/TextField.tsx"
import { RacesSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts"
import { InlineLibrary } from "../../../../inlineLibrary/InlineLibrary.tsx"
import { changeRacesSortOrder, selectRacesSortOrder } from "../../../../slices/settingsSlice.ts"
import { RacesList } from "./RacesList.tsx"
import { RaceVariants } from "./RaceVariants.tsx"

export const Races: FC = observer(() => {
  const translate = useTranslate()
  const dispatch = useAppDispatch()

  const [filterText, setFilterText] = useState("")
  const sortOrder = useAppSelector(selectRacesSortOrder)
  const handleChangeSortOrder = useCallback(
    (id: RacesSortOrder) => dispatch(changeRacesSortOrder(id)),
    [dispatch],
  )

  return (
    <Page id="races">
      <Options>
        <TextField value={filterText} onChange={setFilterText} hint={translate("Search")} />
        <RadioButtonGroup
          active={sortOrder}
          label={translate("Sort By")}
          options={[
            {
              name: translate("Name"),
              value: RacesSortOrder.Name,
            },
            {
              name: translate("AP Value"),
              value: RacesSortOrder.Cost,
            },
          ]}
          onClick={handleChangeSortOrder}
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
          <RacesList filterText={filterText} sortOrder={sortOrder} />
        </Scroll>
      </Main>
      <InlineLibrary>
        <RaceVariants />
      </InlineLibrary>
    </Page>
  )
})
