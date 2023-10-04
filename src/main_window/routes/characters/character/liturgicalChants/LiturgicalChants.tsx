import { FC, useCallback, useMemo, useState } from "react"
import { Button } from "../../../../../shared/components/button/Button.tsx"
import { List } from "../../../../../shared/components/list/List.tsx"
import { ListHeader } from "../../../../../shared/components/list/ListHeader.tsx"
import { ListHeaderTag } from "../../../../../shared/components/list/ListHeaderTag.tsx"
import { ListPlaceholder } from "../../../../../shared/components/list/ListPlaceholder.tsx"
import { Main } from "../../../../../shared/components/main/Main.tsx"
import { Options } from "../../../../../shared/components/options/Options.tsx"
import { Page } from "../../../../../shared/components/page/Page.tsx"
import { RadioButtonGroup } from "../../../../../shared/components/radioButton/RadioButtonGroup.tsx"
import { Scroll } from "../../../../../shared/components/scroll/Scroll.tsx"
import { Slidein } from "../../../../../shared/components/slidein/Slidein.tsx"
import { TextField } from "../../../../../shared/components/textField/TextField.tsx"
import { filterAndSortDisplayed } from "../../../../../shared/domain/liturgicalChant.ts"
import { DisplayedActiveLiturgy } from "../../../../../shared/domain/liturgicalChantActive.ts"
import { DisplayedInactiveLiturgy } from "../../../../../shared/domain/liturgicalChantInactive.ts"
import { useLocaleCompare } from "../../../../../shared/hooks/localeCompare.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { assertExhaustive } from "../../../../../shared/utils/typeSafety.ts"
import { useModalState } from "../../../../hooks/modalState.ts"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts"
import { InlineLibrary } from "../../../../inlineLibrary/InlineLibrary.tsx"
import { selectCanRemove } from "../../../../selectors/characterSelectors.ts"
import {
  selectVisibleActiveLiturgies,
  selectVisibleInactiveLiturgies,
} from "../../../../selectors/liturgicalChantSelectors.ts"
import { addBlessing, removeBlessing } from "../../../../slices/blessingsSlice.ts"
import {
  addCeremony,
  decrementCeremony,
  incrementCeremony,
  removeCeremony,
} from "../../../../slices/ceremoniesSlice.ts"
import {
  addLiturgicalChant,
  decrementLiturgicalChant,
  incrementLiturgicalChant,
  removeLiturgicalChant,
} from "../../../../slices/liturgicalChantsSlice.ts"
import {
  LiturgiesSortOrder,
  changeLiturgiesSortOrder,
  selectLiturgiesSortOrder,
} from "../../../../slices/settingsSlice.ts"
import { ActiveBlessingsListItem } from "./ActiveBlessingsListItem.tsx"
import { ActiveCeremoniesListItem } from "./ActiveCeremoniesListItem.tsx"
import { ActiveLiturgicalChantsListItem } from "./ActiveLiturgicalChantsListItem.tsx"
import { InactiveBlessingsListItem } from "./InactiveBlessingsListItem.tsx"
import { InactiveCeremoniesListItem } from "./InactiveCeremoniesListItem.tsx"
import { InactiveLiturgicalChantsListItem } from "./InactiveLiturgicalChantsListItem.tsx"

const isTopMarginNeeded = (
  sortOrder: LiturgiesSortOrder,
  curr: DisplayedInactiveLiturgy | DisplayedActiveLiturgy,
  mprev: DisplayedInactiveLiturgy | DisplayedActiveLiturgy | undefined,
) => sortOrder === "group" && mprev !== undefined && curr.kind !== mprev.kind

/**
 * Returns a page for managing liturgical chants.
 */
export const LiturgicalChants: FC = () => {
  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const dispatch = useAppDispatch()
  const localeCompare = useLocaleCompare()

  const canRemove = useAppSelector(selectCanRemove)

  const [activeFilterText, setActiveFilterText] = useState("")
  const [inactiveFilterText, setInactiveFilterText] = useState("")
  const sortOrder = useAppSelector(selectLiturgiesSortOrder)
  const handleChangeSortOrder = useCallback(
    (id: LiturgiesSortOrder) => dispatch(changeLiturgiesSortOrder(id)),
    [dispatch],
  )

  const visibleInactiveLiturgies = useAppSelector(selectVisibleInactiveLiturgies)
  const visibleActiveLiturgies = useAppSelector(selectVisibleActiveLiturgies)

  const inactiveList = useMemo(
    () =>
      filterAndSortDisplayed(
        visibleInactiveLiturgies,
        activeFilterText,
        sortOrder,
        translateMap,
        localeCompare,
      ),
    [activeFilterText, localeCompare, sortOrder, translateMap, visibleInactiveLiturgies],
  )

  const activeList = useMemo(
    () =>
      filterAndSortDisplayed(
        visibleActiveLiturgies,
        inactiveFilterText,
        sortOrder,
        translateMap,
        localeCompare,
      ),
    [visibleActiveLiturgies, inactiveFilterText, sortOrder, translateMap, localeCompare],
  )

  const handleAddLiturgicalChantPoint = useCallback(
    (id: number) => dispatch(incrementLiturgicalChant(id)),
    [dispatch],
  )

  const handleRemoveLiturgicalChantPoint = useCallback(
    (id: number) => dispatch(decrementLiturgicalChant(id)),
    [dispatch],
  )

  const handleAddCeremonyPoint = useCallback(
    (id: number) => dispatch(incrementCeremony(id)),
    [dispatch],
  )

  const handleRemoveCeremonyPoint = useCallback(
    (id: number) => dispatch(decrementCeremony(id)),
    [dispatch],
  )

  const handleAddBlessing = useCallback((id: number) => dispatch(addBlessing(id)), [dispatch])

  const handleAddLiturgicalChant = useCallback(
    (id: number) => dispatch(addLiturgicalChant(id)),
    [dispatch],
  )

  const handleAddCeremony = useCallback((id: number) => dispatch(addCeremony(id)), [dispatch])

  const handleRemoveBlessing = useCallback((id: number) => dispatch(removeBlessing(id)), [dispatch])

  const handleRemoveLiturgicalChant = useCallback(
    (id: number) => dispatch(removeLiturgicalChant(id)),
    [dispatch],
  )

  const handleRemoveCeremony = useCallback((id: number) => dispatch(removeCeremony(id)), [dispatch])

  const { isOpen: isSlideinVisible, open: openSlidein, close: closeSlidein } = useModalState()

  return (
    <Page id="liturgical-chants">
      <Slidein isOpen={isSlideinVisible} close={closeSlidein} className="adding-liturgical-chants">
        <Options>
          <TextField
            value={inactiveFilterText}
            onChange={setInactiveFilterText}
            hint={translate("Search")}
          />
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
          {/* <Checkbox checked={enableActiveItemHints} onClick={switchActiveItemHints}>
            {translate(staticData)("general.filters.showactivatedentries")}
          </Checkbox> */}
        </Options>
        <Main classOnly>
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
            <ListHeaderTag className="btn-placeholder" />
          </ListHeader>
          <Scroll>
            {inactiveList.length > 0 ? (
              <List>
                {inactiveList.map((x, i) => {
                  switch (x.kind) {
                    case "blessing":
                      return (
                        <InactiveBlessingsListItem
                          key={`blessing-${x.static.id}`}
                          insertTopMargin={isTopMarginNeeded(sortOrder, x, inactiveList[i - 1])}
                          blessing={x}
                          sortOrder={sortOrder}
                          add={handleAddBlessing}
                        />
                      )

                    case "liturgicalChant":
                      return (
                        <InactiveLiturgicalChantsListItem
                          key={`liturgicalchant-${x.static.id}`}
                          insertTopMargin={isTopMarginNeeded(sortOrder, x, inactiveList[i - 1])}
                          liturgicalChant={x}
                          sortOrder={sortOrder}
                          add={handleAddLiturgicalChant}
                        />
                      )

                    case "ceremony":
                      return (
                        <InactiveCeremoniesListItem
                          key={`ceremony-${x.static.id}`}
                          insertTopMargin={isTopMarginNeeded(sortOrder, x, inactiveList[i - 1])}
                          ceremony={x}
                          sortOrder={sortOrder}
                          add={handleAddCeremony}
                        />
                      )

                    default:
                      return assertExhaustive(x)
                  }
                })}
              </List>
            ) : (
              <ListPlaceholder type="liturgicalChants" message={translate("No Results")} />
            )}
          </Scroll>
        </Main>
        <InlineLibrary />
      </Slidein>
      <Options>
        <TextField
          value={activeFilterText}
          onChange={setActiveFilterText}
          hint={translate("Search")}
        />
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
        <Button onClick={openSlidein}>{translate("Add")}</Button>
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
          {activeList.length > 0 ? (
            <List>
              {activeList.map((x, i) => {
                switch (x.kind) {
                  case "blessing":
                    return (
                      <ActiveBlessingsListItem
                        key={`blessing-${x.static.id}`}
                        insertTopMargin={isTopMarginNeeded(sortOrder, x, activeList[i - 1])}
                        blessing={x}
                        sortOrder={sortOrder}
                        remove={handleRemoveBlessing}
                      />
                    )

                  case "liturgicalChant":
                    return (
                      <ActiveLiturgicalChantsListItem
                        key={`liturgicalchant-${x.static.id}`}
                        insertTopMargin={isTopMarginNeeded(sortOrder, x, activeList[i - 1])}
                        liturgicalChant={x}
                        sortOrder={sortOrder}
                        addPoint={handleAddLiturgicalChantPoint}
                        removePoint={handleRemoveLiturgicalChantPoint}
                        remove={handleRemoveLiturgicalChant}
                      />
                    )

                  case "ceremony":
                    return (
                      <ActiveCeremoniesListItem
                        key={`ceremony-${x.static.id}`}
                        insertTopMargin={isTopMarginNeeded(sortOrder, x, activeList[i - 1])}
                        ceremony={x}
                        sortOrder={sortOrder}
                        addPoint={handleAddCeremonyPoint}
                        removePoint={handleRemoveCeremonyPoint}
                        remove={handleRemoveCeremony}
                      />
                    )

                  default:
                    return assertExhaustive(x)
                }
              })}
            </List>
          ) : (
            <ListPlaceholder type="liturgicalChants" message={translate("No Results")} />
          )}
        </Scroll>
      </Main>
      <InlineLibrary />
    </Page>
  )
}
