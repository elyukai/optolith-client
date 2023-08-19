// import * as React from "react"
// import { List, map, notNull, toArray } from "../../../../../Data/List.ts"
// import { bindF, ensure, Just, Maybe, maybe, Nothing } from "../../../../../Data/Maybe.ts"
// import { Record } from "../../../../../Data/Record.ts"
// import { WikiInfoContainer } from "../../../../../App/Containers/WikiInfoContainer.ts"
// import { CombatTechniquesSortOptions } from "../../../../../App/Models/Config.ts"
// import { HeroModelRecord } from "../../../../../App/Models/Hero/HeroModel.ts"
// import { AttributeCombined } from "../../../../../App/Models/View/AttributeCombined.ts"
// import { CombatTechniqueWithRequirements, CombatTechniqueWithRequirementsA_ } from "../../../../../App/Models/View/CombatTechniqueWithRequirements.ts"
// import { StaticDataRecord } from "../../../../../App/Models/Wiki/WikiModel.ts"
// import { translate } from "../../../../../App/Utilities/I18n.ts"
// import { pipe, pipe_ } from "../../../../../App/Utilities/pipe.ts"
// import { ListView } from "../Universal/List"
// import { ListHeader } from "../Universal/ListHeader"
// import { ListHeaderTag } from "../Universal/ListHeaderTag"
// import { ListPlaceholder } from "../Universal/ListPlaceholder"
// import { MainContent } from "../Universal/MainContent"
// import { Options } from "../Universal/Options"
// import { Page } from "../Universal/Page"
// import { Scroll } from "../Universal/Scroll"
// import { SearchField } from "../../../../../App/Views/Universal/SearchField.tsx"
// import { SortNames, SortOptions } from "../../../../../App/Views/Universal/SortOptions.tsx"
// import { CombatTechniqueListItem } from "./CombatTechniquesListItem"

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
import { useLocaleCompare } from "../../../../../shared/hooks/localeCompare.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { compareAt, numAsc, reduceCompare } from "../../../../../shared/utils/compare.ts"
import { assertExhaustive } from "../../../../../shared/utils/typeSafety.ts"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts"
import { InlineLibrary } from "../../../../inlineLibrary/InlineLibrary.tsx"
import { selectCanRemove } from "../../../../selectors/characterSelectors.ts"
import {
  DisplayedCombatTechnique,
  selectVisibleCombatTechniques,
} from "../../../../selectors/combatTechniquesSelectors.ts"
import {
  decrementCloseCombatTechnique,
  incrementCloseCombatTechnique,
} from "../../../../slices/closeCombatTechniqueSlice.ts"
import {
  decrementRangedCombatTechnique,
  incrementRangedCombatTechnique,
} from "../../../../slices/rangedCombatTechniqueSlice.ts"
import {
  CombatTechniquesSortOrder,
  changeCombatTechniquesSortOrder,
  selectCombatTechniquesSortOrder,
} from "../../../../slices/settingsSlice.ts"
import { CloseCombatTechniquesListItem } from "./CloseCombatTechniquesListItem.tsx"
import { RangedCombatTechniquesListItem } from "./RangedCombatTechniquesListItem.tsx"

const isTopMarginNeeded = (
  sortOrder: CombatTechniquesSortOrder,
  curr: DisplayedCombatTechnique,
  mprev: DisplayedCombatTechnique | undefined,
) => sortOrder === "group" && mprev !== undefined && curr.kind !== mprev.kind

export const CombatTechniques: FC = () => {
  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const dispatch = useAppDispatch()
  const localeCompare = useLocaleCompare()

  const canRemove = useAppSelector(selectCanRemove)

  const [filterText, setFilterText] = useState("")
  const sortOrder = useAppSelector(selectCombatTechniquesSortOrder)
  const handleChangeSortOrder = useCallback(
    (id: CombatTechniquesSortOrder) => dispatch(changeCombatTechniquesSortOrder(id)),
    [dispatch],
  )
  const visibleCombatTechniques = useAppSelector(selectVisibleCombatTechniques)
  const list = useMemo(
    () =>
      visibleCombatTechniques
        .filter(
          c =>
            translateMap(c.static.translations)
              ?.name.toLowerCase()
              .includes(filterText.toLowerCase()) ?? false,
        )
        .sort(
          (() => {
            switch (sortOrder) {
              case CombatTechniquesSortOrder.Name:
                return compareAt(
                  c => translateMap(c.static.translations)?.name ?? "",
                  localeCompare,
                )
              case CombatTechniquesSortOrder.Group:
                return reduceCompare(
                  compareAt(c => (c.kind === "close" ? 1 : 2), numAsc),
                  compareAt(c => translateMap(c.static.translations)?.name ?? "", localeCompare),
                )
              case CombatTechniquesSortOrder.ImprovementCost:
                return reduceCompare(
                  compareAt(c => fromRaw(c.static.improvement_cost), compareImprovementCost),
                  compareAt(c => translateMap(c.static.translations)?.name ?? "", localeCompare),
                )
              default:
                return assertExhaustive(sortOrder)
            }
          })(),
        ),
    [filterText, localeCompare, sortOrder, translateMap, visibleCombatTechniques],
  )

  const handleAddCloseCombatTechniquePoint = useCallback(
    (id: number) => dispatch(incrementCloseCombatTechnique(id)),
    [dispatch],
  )

  const handleRemoveCloseCombatTechniquePoint = useCallback(
    (id: number) => dispatch(decrementCloseCombatTechnique(id)),
    [dispatch],
  )

  const handleAddRangedCombatTechniquePoint = useCallback(
    (id: number) => dispatch(incrementRangedCombatTechnique(id)),
    [dispatch],
  )

  const handleRemoveRangedCombatTechniquePoint = useCallback(
    (id: number) => dispatch(decrementRangedCombatTechnique(id)),
    [dispatch],
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
          <ListHeaderTag className="name">
            {translate("combattechniques.header.name")}
          </ListHeaderTag>
          <ListHeaderTag className="group">
            {translate("combattechniques.header.group")}
          </ListHeaderTag>
          <ListHeaderTag
            className="value"
            hint={translate("combattechniques.header.combattechniquerating.tooltip")}
          >
            {translate("combattechniques.header.combattechniquerating")}
          </ListHeaderTag>
          <ListHeaderTag
            className="ic"
            hint={translate("combattechniques.header.improvementcost.tooltip")}
          >
            {translate("combattechniques.header.improvementcost")}
          </ListHeaderTag>
          <ListHeaderTag
            className="primary"
            hint={translate("combattechniques.header.primaryattribute.tooltip")}
          >
            {translate("combattechniques.header.primaryattribute")}
          </ListHeaderTag>
          <ListHeaderTag className="at" hint={translate("combattechniques.header.attack.tooltip")}>
            {translate("combattechniques.header.attack")}
          </ListHeaderTag>
          <ListHeaderTag className="pa" hint={translate("combattechniques.header.parry.tooltip")}>
            {translate("combattechniques.header.parry")}
          </ListHeaderTag>
          {canRemove ? <ListHeaderTag className="btn-placeholder" /> : null}
          <ListHeaderTag className="btn-placeholder" />
          <ListHeaderTag className="btn-placeholder" />
        </ListHeader>
        <Scroll>
          {list.length > 0 ? (
            <List>
              {list.map((x, i) => {
                const translation = translateMap(x.static.translations)

                if (x.kind === "close") {
                  return (
                    <CloseCombatTechniquesListItem
                      key={`close--${x.static.id}`}
                      insertTopMargin={isTopMarginNeeded(sortOrder, x, list[i - 1])}
                      id={x.static.id}
                      name={translation?.name ?? ""}
                      sr={x.dynamic.value}
                      primary={x.static.primary_attribute}
                      ic={fromRaw(x.static.improvement_cost)}
                      addDisabled={!x.isIncreasable}
                      removeDisabled={!x.isDecreasable}
                      at={x.attackBase}
                      pa={x.parryBase}
                      addPoint={handleAddCloseCombatTechniquePoint}
                      removePoint={handleRemoveCloseCombatTechniquePoint}
                    />
                  )
                }

                return (
                  <RangedCombatTechniquesListItem
                    key={`ranged--${x.static.id}`}
                    insertTopMargin={isTopMarginNeeded(sortOrder, x, list[i - 1])}
                    id={x.static.id}
                    name={translation?.name ?? ""}
                    sr={x.dynamic.value}
                    primary={x.static.primary_attribute}
                    ic={fromRaw(x.static.improvement_cost)}
                    addDisabled={!x.isIncreasable}
                    removeDisabled={!x.isDecreasable}
                    at={x.attackBase}
                    addPoint={handleAddRangedCombatTechniquePoint}
                    removePoint={handleRemoveRangedCombatTechniquePoint}
                  />
                )
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
}
