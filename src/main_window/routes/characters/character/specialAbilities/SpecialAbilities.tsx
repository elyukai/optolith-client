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
import { filterAndSortDisplayed } from "../../../../../shared/domain/activatable/specialAbilities.ts"
import { SpecialAbilitiesSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { useLocaleCompare } from "../../../../../shared/hooks/localeCompare.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { useModalState } from "../../../../hooks/modalState.ts"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts"
import { InlineLibrary } from "../../../../inlineLibrary/InlineLibrary.tsx"
import { selectCanRemove } from "../../../../selectors/characterSelectors.ts"
import {
  selectVisibleActiveSpecialAbilities,
  selectVisibleInactiveSpecialAbilities,
} from "../../../../selectors/specialAbilitySelectors.ts"
import {
  changeSpecialAbilitiesSortOrder,
  selectSpecialAbilitiesSortOrder,
} from "../../../../slices/settingsSlice.ts"
import { ActiveSpecialAbilitiesListItem } from "./ActiveSpecialAbilitiesListItem.tsx"
import { InactiveSpecialAbilitiesListItem } from "./InactiveSpecialAbilitiesListItem.tsx"

/**
 * Returns a page for managing special abilities.
 */
export const SpecialAbilities: FC = () => {
  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const dispatch = useAppDispatch()
  const localeCompare = useLocaleCompare()

  const canRemove = useAppSelector(selectCanRemove)

  const sortOrder = useAppSelector(selectSpecialAbilitiesSortOrder)
  const handleChangeSortOrder = useCallback(
    (id: SpecialAbilitiesSortOrder) => dispatch(changeSpecialAbilitiesSortOrder(id)),
    [dispatch],
  )

  const [activeFilterText, setActiveFilterText] = useState("")
  const [inactiveFilterText, setInactiveFilterText] = useState("")

  const visibleInactiveSpecialAbilities = useAppSelector(selectVisibleInactiveSpecialAbilities)
  const visibleActiveSpecialAbilities = useAppSelector(selectVisibleActiveSpecialAbilities)

  const inactiveList = useMemo(
    () =>
      filterAndSortDisplayed(
        visibleInactiveSpecialAbilities,
        inactiveFilterText,
        sortOrder,
        translate,
        translateMap,
        localeCompare,
      ),
    [
      visibleInactiveSpecialAbilities,
      inactiveFilterText,
      sortOrder,
      translate,
      translateMap,
      localeCompare,
    ],
  )

  const activeList = useMemo(
    () =>
      filterAndSortDisplayed(
        visibleActiveSpecialAbilities,
        activeFilterText,
        sortOrder,
        translate,
        translateMap,
        localeCompare,
      ),
    [
      visibleActiveSpecialAbilities,
      activeFilterText,
      sortOrder,
      translate,
      translateMap,
      localeCompare,
    ],
  )

  const { isOpen: isSlideinVisible, open: openSlidein, close: closeSlidein } = useModalState()

  return (
    <Page id="specialAbilities">
      <Slidein isOpen={isSlideinVisible} close={closeSlidein} className="adding-advantages">
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
                value: SpecialAbilitiesSortOrder.Name,
              },
              {
                name: translate("Group"),
                value: SpecialAbilitiesSortOrder.Group,
              },
            ]}
            onClick={handleChangeSortOrder}
          />
        </Options>
        <Main classOnly>
          <ListHeader>
            <ListHeaderTag className="name">{translate("Name")}</ListHeaderTag>
            <ListHeaderTag className="group">{translate("Group")}</ListHeaderTag>
            <ListHeaderTag className="cost" hint={translate("Adventure Points")}>
              {translate("AP")}
            </ListHeaderTag>
            <ListHeaderTag className="btn-placeholder" />
            <ListHeaderTag className="btn-placeholder" />
          </ListHeader>
          <Scroll>
            {inactiveList.length > 0 ? (
              <List>
                {inactiveList.map(x => (
                  <InactiveSpecialAbilitiesListItem
                    key={`${x.kind}-${x.static.id}`}
                    specialAbility={x}
                  />
                ))}
              </List>
            ) : (
              <ListPlaceholder type="inactiveAdvantages" message={translate("No Results")} />
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
              value: SpecialAbilitiesSortOrder.Name,
            },
            {
              name: translate("Group"),
              value: SpecialAbilitiesSortOrder.Group,
            },
          ]}
          onClick={handleChangeSortOrder}
        />
        <Button onClick={openSlidein}>{translate("Add")}</Button>
      </Options>
      <Main>
        <ListHeader>
          <ListHeaderTag className="name">{translate("Name")}</ListHeaderTag>
          <ListHeaderTag className="group">{translate("Group")}</ListHeaderTag>
          <ListHeaderTag className="cost" hint={translate("Adventure Points")}>
            {translate("AP")}
          </ListHeaderTag>
          {canRemove ? <ListHeaderTag className="btn-placeholder" /> : null}
          <ListHeaderTag className="btn-placeholder" />
        </ListHeader>
        <Scroll stable>
          {activeList.length > 0 ? (
            <List>
              {activeList.map(x => (
                <ActiveSpecialAbilitiesListItem
                  key={`${x.kind}-${x.static.id}`}
                  specialAbility={x}
                />
              ))}
            </List>
          ) : (
            <ListPlaceholder type="specialAbilities" message={translate("No Results")} />
          )}
        </Scroll>
      </Main>
      <InlineLibrary />
    </Page>
  )
}
