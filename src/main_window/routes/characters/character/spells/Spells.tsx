import { FC, useCallback, useState } from "react"
import { Button } from "../../../../../shared/components/button/Button.tsx"
import { ListHeader } from "../../../../../shared/components/list/ListHeader.tsx"
import { ListHeaderTag } from "../../../../../shared/components/list/ListHeaderTag.tsx"
import { ListPlaceholder } from "../../../../../shared/components/list/ListPlaceholder.tsx"
import { Main } from "../../../../../shared/components/main/Main.tsx"
import { Options } from "../../../../../shared/components/options/Options.tsx"
import { Page } from "../../../../../shared/components/page/Page.tsx"
import { RadioButtonGroup } from "../../../../../shared/components/radioButton/RadioButtonGroup.tsx"
import { RecommendedReference } from "../../../../../shared/components/recommendedReference/RecommendedReference.tsx"
import { Scroll } from "../../../../../shared/components/scroll/Scroll.tsx"
import { TextField } from "../../../../../shared/components/textField/TextField.tsx"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts"
import { InlineLibrary } from "../../../../inlineLibrary/InlineLibrary.tsx"
import { selectCanRemove } from "../../../../selectors/characterSelectors.ts"
import {
  SpellsSortOrder,
  changeSpellsSortOrder,
  selectSpellsSortOrder,
} from "../../../../slices/settingsSlice.ts"

export const Spells: FC = () => {
  const translate = useTranslate()
  const dispatch = useAppDispatch()

  const canRemove = useAppSelector(selectCanRemove)

  const [filterText, setFilterText] = useState("")
  const sortOrder = useAppSelector(selectSpellsSortOrder)
  const handleChangeSortOrder = useCallback(
    (id: SpellsSortOrder) => dispatch(changeSpellsSortOrder(id)),
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
              value: SpellsSortOrder.Name,
            },
            {
              name: translate("Group"),
              value: SpellsSortOrder.Group,
            },
            {
              name: translate("Property"),
              value: SpellsSortOrder.Property,
            },
            {
              name: translate("Improvement Cost"),
              value: SpellsSortOrder.ImprovementCost,
            },
          ]}
          onClick={handleChangeSortOrder}
        />
        <Button>{translate("Add")}</Button>
        <RecommendedReference unfamiliarSpells />
      </Options>
      <Main>
        <ListHeader>
          <ListHeaderTag className="name">{translate("spells.header.name")}</ListHeaderTag>
          <ListHeaderTag className="group">
            {translate("spells.header.property")}
            {sortOrder === SpellsSortOrder.Group ? ` / ${translate("spells.header.group")}` : null}
          </ListHeaderTag>
          <ListHeaderTag className="value" hint={translate("spells.header.skillrating.tooltip")}>
            {translate("spells.header.skillrating")}
          </ListHeaderTag>
          <ListHeaderTag className="check">{translate("spells.header.check")}</ListHeaderTag>
          <ListHeaderTag className="mod" hint={translate("spells.header.checkmodifier.tooltip")}>
            {translate("spells.header.checkmodifier")}
          </ListHeaderTag>
          <ListHeaderTag className="ic" hint={translate("spells.header.improvementcost.tooltip")}>
            {translate("spells.header.improvementcost")}
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
