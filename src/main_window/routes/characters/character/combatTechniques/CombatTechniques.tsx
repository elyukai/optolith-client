import { observer } from "mobx-react"
import { FC, useCallback, useMemo, useState } from "react"
import { List } from "../../../../../shared/components/list/List.tsx"
import { ListHeader } from "../../../../../shared/components/list/ListHeader.tsx"
import { ListHeaderTag } from "../../../../../shared/components/list/ListHeaderTag.tsx"
import { ListPlaceholder } from "../../../../../shared/components/list/ListPlaceholder.tsx"
import { Main } from "../../../../../shared/components/main/Main.tsx"
import { Options } from "../../../../../shared/components/options/Options.tsx"
import { Page } from "../../../../../shared/components/page/Page.tsx"
import { RadioButtonGroup } from "../../../../../shared/components/radioButton/RadioButtonGroup.tsx"
import { Scroll } from "../../../../../shared/components/scroll/Scroll.tsx"
import { TextField } from "../../../../../shared/components/textField/TextField.tsx"
import {
  compareImprovementCost,
  fromRaw,
} from "../../../../../shared/domain/adventurePoints/improvementCost.ts"
import type { DisplayedCombatTechnique } from "../../../../../shared/domain/rated/combatTechnique.ts"
import { CombatTechniquesSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { useLocaleCompare } from "../../../../../shared/hooks/localeCompare.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { compareAt, numAsc, reduceCompare } from "../../../../../shared/utils/compare.ts"
import { assertExhaustive } from "../../../../../shared/utils/typeSafety.ts"
import { SharedState } from "../../../../external.ts"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts"
import { InlineLibrary } from "../../../../inlineLibrary/InlineLibrary.tsx"
import {
  changeCombatTechniquesSortOrder,
  selectCombatTechniquesSortOrder,
} from "../../../../slices/settingsSlice.ts"
import { CloseCombatTechniquesListItem } from "./CloseCombatTechniquesListItem.tsx"
import { RangedCombatTechniquesListItem } from "./RangedCombatTechniquesListItem.tsx"

const isTopMarginNeeded = (
  sortOrder: CombatTechniquesSortOrder,
  curr: DisplayedCombatTechnique,
  mprev: DisplayedCombatTechnique | undefined,
) => sortOrder === "group" && mprev !== undefined && curr.type !== mprev.type

/**
 * Returns a page for managing combat techniques.
 */
export const CombatTechniques: FC = observer(() => {
  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const dispatch = useAppDispatch()
  const localeCompare = useLocaleCompare()

  const { canRemove, closeCombatTechniques, rangedCombatTechniques } = SharedState

  const [filterText, setFilterText] = useState("")
  const sortOrder = useAppSelector(selectCombatTechniquesSortOrder)
  const handleChangeSortOrder = useCallback(
    (id: CombatTechniquesSortOrder) => dispatch(changeCombatTechniquesSortOrder(id)),
    [dispatch],
  )
  const visibleCombatTechniques = (closeCombatTechniques as DisplayedCombatTechnique[]).concat(
    rangedCombatTechniques,
  )
  const list = useMemo(
    () =>
      visibleCombatTechniques
        .filter(
          c =>
            translateMap(c.dbEntry.translations)
              ?.name.toLowerCase()
              .includes(filterText.toLowerCase()) ?? false,
        )
        .sort(
          (() => {
            switch (sortOrder) {
              case CombatTechniquesSortOrder.Name:
                return compareAt(
                  c => translateMap(c.dbEntry.translations)?.name ?? "",
                  localeCompare,
                )
              case CombatTechniquesSortOrder.Group:
                return reduceCompare(
                  compareAt(c => (c.type === "CloseCombatTechnique" ? 1 : 2), numAsc),
                  compareAt(c => translateMap(c.dbEntry.translations)?.name ?? "", localeCompare),
                )
              case CombatTechniquesSortOrder.ImprovementCost:
                return reduceCompare(
                  compareAt(c => fromRaw(c.dbEntry.improvement_cost), compareImprovementCost),
                  compareAt(c => translateMap(c.dbEntry.translations)?.name ?? "", localeCompare),
                )
              default:
                return assertExhaustive(sortOrder)
            }
          })(),
        ),
    [filterText, localeCompare, sortOrder, translateMap, visibleCombatTechniques],
  )

  return (
    <Page id="combat-techniques">
      <Options>
        <TextField value={filterText} onChange={setFilterText} hint={translate("Search")} />
        <RadioButtonGroup
          active={sortOrder}
          label={translate("Sort By")}
          array={[
            {
              name: translate("Name"),
              value: CombatTechniquesSortOrder.Name,
            },
            {
              name: translate("Group"),
              value: CombatTechniquesSortOrder.Group,
            },
            {
              name: translate("Improvement Cost"),
              value: CombatTechniquesSortOrder.ImprovementCost,
            },
          ]}
          onClick={handleChangeSortOrder}
        />
      </Options>
      <Main>
        <ListHeader>
          <ListHeaderTag className="name">{translate("Name")}</ListHeaderTag>
          <ListHeaderTag className="group">{translate("Group")}</ListHeaderTag>
          <ListHeaderTag className="value" hint={translate("Combat Technique Rating")}>
            {translate("CTR")}
          </ListHeaderTag>
          <ListHeaderTag className="ic" hint={translate("Improvement Cost")}>
            {translate("IC")}
          </ListHeaderTag>
          <ListHeaderTag className="primary" hint={translate("Primary Attribute(s)")}>
            {translate("P")}
          </ListHeaderTag>
          <ListHeaderTag className="at" hint={translate("Attack")}>
            {translate("AT")}
          </ListHeaderTag>
          <ListHeaderTag className="pa" hint={translate("Parry")}>
            {translate("PA")}
          </ListHeaderTag>
          {canRemove ? <ListHeaderTag className="btn-placeholder" /> : null}
          <ListHeaderTag className="btn-placeholder" />
          <ListHeaderTag className="btn-placeholder" />
        </ListHeader>
        <Scroll stable>
          {list.length > 0 ? (
            <List>
              {list.map((x, i) => {
                switch (x.type) {
                  case "CloseCombatTechnique":
                    return (
                      <CloseCombatTechniquesListItem
                        key={`close--${x.id}`}
                        insertTopMargin={isTopMarginNeeded(sortOrder, x, list[i - 1])}
                        closeCombatTechnique={x}
                        canRemove={canRemove}
                      />
                    )
                  case "RangedCombatTechnique":
                    return (
                      <RangedCombatTechniquesListItem
                        key={`ranged--${x.id}`}
                        insertTopMargin={isTopMarginNeeded(sortOrder, x, list[i - 1])}
                        rangedCombatTechnique={x}
                        canRemove={canRemove}
                      />
                    )
                  default:
                    return assertExhaustive(x)
                }
              })}
            </List>
          ) : (
            <ListPlaceholder type="combatTechniques" message={translate("No Results")} />
          )}
        </Scroll>
      </Main>
      <InlineLibrary />
    </Page>
  )
})
