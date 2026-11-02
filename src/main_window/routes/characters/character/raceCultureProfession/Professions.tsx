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
import { ProfessionsSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts"
import { InlineLibrary } from "../../../../inlineLibrary/InlineLibrary.tsx"
import {
  changeProfessionsSortOrder,
  selectProfessionsSortOrder,
} from "../../../../slices/settingsSlice.ts"
import { ProfessionsList } from "./ProfessionsList.tsx"
import { ProfessionVariants } from "./ProfessionVariants.tsx"
import { RCPOptionSelections } from "./RCPOptionSelections/RCPOptionSelections.tsx"

export const Professions: FC = observer(() => {
  const translate = useTranslate()
  const dispatch = useAppDispatch()

  const [filterText, setFilterText] = useState("")
  const sortOrder = useAppSelector(selectProfessionsSortOrder)
  const handleChangeSortOrder = useCallback(
    (id: ProfessionsSortOrder) => dispatch(changeProfessionsSortOrder(id)),
    [dispatch],
  )

  const [showAddSlidein, switchAddSlidein] = useState(false)
  const handleCloseSlidein = useCallback(() => switchAddSlidein(false), [switchAddSlidein])
  const handleShowSlidein = useCallback(() => switchAddSlidein(true), [switchAddSlidein])

  return (
    <Page id="professions">
      {showAddSlidein ? <RCPOptionSelections close={handleCloseSlidein} /> : null}
      <Options>
        <TextField value={filterText} onChange={setFilterText} hint={translate("Search")} />
        <RadioButtonGroup
          active={sortOrder}
          label={translate("Sort By")}
          options={[
            {
              name: translate("Name"),
              value: ProfessionsSortOrder.Name,
            },
            {
              name: translate("AP Value"),
              value: ProfessionsSortOrder.Cost,
            },
          ]}
          onClick={handleChangeSortOrder}
        />
        <Checkbox
          checked={true /* TODO */}
          label={translate("Show uncommon professions")}
          onClick={() => undefined /* TODO */}
          disabled={true /* TODO */}
        />
        <RadioButtonGroup<"All" | "Mundane" | "Magic" | "Blessed">
          active={"All" /* TODO */}
          onClick={() => undefined /* TODO */}
          label={translate("Visible professions by group")}
          options={[
            {
              name: translate("All Professions"),
              value: "All",
            },
            {
              name: translate("Only Mundane Professions"),
              value: "Mundane",
            },
            {
              name: translate("Only Magic Professions"),
              value: "Magic",
            },
            {
              name: translate("Only Blessed Professions"),
              value: "Blessed",
            },
          ]}
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
          <ProfessionsList
            filterText={filterText}
            sortOrder={sortOrder}
            showAddSlidein={handleShowSlidein}
          />
        </Scroll>
      </Main>
      <InlineLibrary>
        <ProfessionVariants />
      </InlineLibrary>
    </Page>
  )
})
