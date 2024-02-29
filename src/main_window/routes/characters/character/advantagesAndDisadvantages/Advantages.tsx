import { FC, useCallback, useMemo, useState } from "react"
import { Button } from "../../../../../shared/components/button/Button.tsx"
import { Checkbox } from "../../../../../shared/components/checkbox/Checkbox.tsx"
import { Grid } from "../../../../../shared/components/grid/Grid.tsx"
import { List } from "../../../../../shared/components/list/List.tsx"
import { ListHeader } from "../../../../../shared/components/list/ListHeader.tsx"
import { ListHeaderTag } from "../../../../../shared/components/list/ListHeaderTag.tsx"
import { ListPlaceholder } from "../../../../../shared/components/list/ListPlaceholder.tsx"
import { Main } from "../../../../../shared/components/main/Main.tsx"
import { Options } from "../../../../../shared/components/options/Options.tsx"
import { Page } from "../../../../../shared/components/page/Page.tsx"
import { RecommendedReference } from "../../../../../shared/components/recommendedReference/RecommendedReference.tsx"
import { Scroll } from "../../../../../shared/components/scroll/Scroll.tsx"
import { Slidein } from "../../../../../shared/components/slidein/Slidein.tsx"
import { TextField } from "../../../../../shared/components/textField/TextField.tsx"
import { filterAndSortDisplayed } from "../../../../../shared/domain/activatable/advantagesDisadvantages.ts"
import { useLocaleCompare } from "../../../../../shared/hooks/localeCompare.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { useModalState } from "../../../../hooks/modalState.ts"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts"
import { InlineLibrary } from "../../../../inlineLibrary/InlineLibrary.tsx"
import {
  selectVisibleActiveAdvantages,
  selectVisibleInactiveAdvantages,
} from "../../../../selectors/advantageDisadvantageSelectors.ts"
import {
  selectCanRemove,
  selectIsInCharacterCreation,
} from "../../../../selectors/characterSelectors.ts"
import {
  selectAdvantagesDisadvantagesCultureRatingVisibility,
  switchAdvantagesDisadvantagesCultureRatingVisibility,
} from "../../../../slices/settingsSlice.ts"
import { ActiveAdvantagesListItem } from "./ActiveAdvantagesListItem.tsx"
import { AdventurePointsSpent } from "./AdventurePointsSpent.tsx"
import { InactiveAdvantagesListItem } from "./InactiveAdvantagesListItem.tsx"

/**
 * Returns a page for managing advantages.
 */
export const Advantages: FC = () => {
  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const dispatch = useAppDispatch()
  const localeCompare = useLocaleCompare()

  const cultureRatingVisibility = useAppSelector(
    selectAdvantagesDisadvantagesCultureRatingVisibility,
  )
  const handleSwitchCultureRatingVisibility = useCallback(
    () => dispatch(switchAdvantagesDisadvantagesCultureRatingVisibility()),
    [dispatch],
  )

  const canRemove = useAppSelector(selectCanRemove)
  const isInCharacterCreation = useAppSelector(selectIsInCharacterCreation)

  const [activeFilterText, setActiveFilterText] = useState("")
  const [inactiveFilterText, setInactiveFilterText] = useState("")

  const visibleInactiveAdvantages = useAppSelector(selectVisibleInactiveAdvantages)
  const visibleActiveAdvantages = useAppSelector(selectVisibleActiveAdvantages)

  const inactiveList = useMemo(
    () =>
      filterAndSortDisplayed(
        visibleInactiveAdvantages,
        inactiveFilterText,
        translateMap,
        localeCompare,
      ),
    [visibleInactiveAdvantages, inactiveFilterText, translateMap, localeCompare],
  )

  const activeList = useMemo(
    () =>
      filterAndSortDisplayed(
        visibleActiveAdvantages,
        activeFilterText,
        translateMap,
        localeCompare,
      ),
    [visibleActiveAdvantages, activeFilterText, translateMap, localeCompare],
  )

  const { isOpen: isSlideinVisible, open: openSlidein, close: closeSlidein } = useModalState()

  return (
    <Page id="advantages">
      <Slidein isOpen={isSlideinVisible} close={closeSlidein} className="adding-advantages">
        <Options>
          <TextField
            value={inactiveFilterText}
            onChange={setInactiveFilterText}
            hint={translate("Search")}
          />
          <Grid size="medium">
            <Checkbox
              checked={cultureRatingVisibility}
              onClick={handleSwitchCultureRatingVisibility}
            >
              {translate("Common Advantages")}
            </Checkbox>
            {cultureRatingVisibility ? <RecommendedReference strongly /> : null}
          </Grid>
          {isInCharacterCreation && <AdventurePointsSpent />}
          {/* <Checkbox checked={enableActiveItemHints} onClick={switchActiveItemHints}>
            {translate(staticData)("general.filters.showactivatedentries")}
          </Checkbox> */}
        </Options>
        <Main classOnly>
          <ListHeader>
            <ListHeaderTag className="name">{translate("Name")}</ListHeaderTag>
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
                  <InactiveAdvantagesListItem key={`advantage-${x.static.id}`} advantage={x} />
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
        <Button onClick={openSlidein}>{translate("Add")}</Button>
        <Grid size="medium">
          <Checkbox checked={cultureRatingVisibility} onClick={handleSwitchCultureRatingVisibility}>
            {translate("Common Advantages")}
          </Checkbox>
          {cultureRatingVisibility ? <RecommendedReference strongly /> : null}
        </Grid>
        {isInCharacterCreation && <AdventurePointsSpent />}
      </Options>
      <Main>
        <ListHeader>
          <ListHeaderTag className="name">{translate("Name")}</ListHeaderTag>
          <ListHeaderTag className="cost" hint={translate("Adventure Points")}>
            {translate("AP")}
          </ListHeaderTag>
          {canRemove && <ListHeaderTag className="btn-placeholder" />}
          <ListHeaderTag className="btn-placeholder" />
        </ListHeader>
        <Scroll stable>
          {activeList.length > 0 ? (
            <List>
              {activeList.map(x => (
                <ActiveAdvantagesListItem key={`advantage-${x.static.id}`} advantage={x} />
              ))}
            </List>
          ) : (
            <ListPlaceholder type="advantages" message={translate("No Results")} />
          )}
        </Scroll>
      </Main>
      <InlineLibrary />
    </Page>
  )
}
