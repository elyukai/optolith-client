import { observer } from "mobx-react-lite"
import { type FC, useCallback, useMemo, useState } from "react"
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
import { useCharacterState } from "../../../../hooks/characterState.ts"
import { useModalState } from "../../../../hooks/modalState.ts"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts"
import { InlineLibrary } from "../../../../inlineLibrary/InlineLibrary.tsx"
import {
  selectAdvantagesDisadvantagesCultureRatingVisibility,
  selectShowEntriesWithoutMetPrerequisites,
  switchAdvantagesDisadvantagesCultureRatingVisibility,
  switchShowEntriesWithoutMetPrerequisites,
} from "../../../../slices/settingsSlice.ts"
import { ActiveActivatableListItem } from "../activatable/ActiveActivatableListItem.tsx"
import { InactiveActivatablesListItem } from "../activatable/InactiveActivatableListItem.tsx"
import { AdventurePointsSpent } from "./AdventurePointsSpent.tsx"

/**
 * Returns a page for managing disadvantages.
 */
export const Disadvantages: FC = observer(() => {
  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const dispatch = useAppDispatch()
  const localeCompare = useLocaleCompare()

  const { canRemove, isInCharacterCreation, inactiveDisadvantages, activeDisadvantages } =
    useCharacterState()

  const cultureRatingVisibility = useAppSelector(
    selectAdvantagesDisadvantagesCultureRatingVisibility,
  )
  const handleSwitchCultureRatingVisibility = useCallback(
    () => dispatch(switchAdvantagesDisadvantagesCultureRatingVisibility()),
    [dispatch],
  )

  const [activeFilterText, setActiveFilterText] = useState("")
  const [inactiveFilterText, setInactiveFilterText] = useState("")

  const showEntriesWithoutMetPrerequisites = useAppSelector(
    selectShowEntriesWithoutMetPrerequisites,
  )

  const handleSwitchShowEntriesWithoutMetPrerequisites = useCallback(
    () => dispatch(switchShowEntriesWithoutMetPrerequisites()),
    [dispatch],
  )

  const inactiveList = useMemo(
    () =>
      filterAndSortDisplayed(
        inactiveDisadvantages,
        inactiveFilterText,
        showEntriesWithoutMetPrerequisites,
        translateMap,
        localeCompare,
      ),
    [
      inactiveDisadvantages,
      inactiveFilterText,
      showEntriesWithoutMetPrerequisites,
      translateMap,
      localeCompare,
    ],
  )

  const activeList = useMemo(
    () =>
      filterAndSortDisplayed(
        activeDisadvantages,
        activeFilterText,
        true, // no effect for active entries
        translateMap,
        localeCompare,
      ),
    [activeDisadvantages, activeFilterText, translateMap, localeCompare],
  )

  const { isOpen: isSlideinVisible, open: openSlidein, close: closeSlidein } = useModalState()

  return (
    <Page id="disadvantages">
      <Slidein isOpen={isSlideinVisible} close={closeSlidein} className="adding-disadvantages">
        <Options>
          <TextField
            value={inactiveFilterText}
            onChange={setInactiveFilterText}
            hint={translate("Search")}
          />
          <Checkbox
            checked={showEntriesWithoutMetPrerequisites}
            onClick={handleSwitchShowEntriesWithoutMetPrerequisites}
          >
            {translate("Show entries with unmet prerequisites")}
          </Checkbox>
          <Grid size="medium">
            <Checkbox
              checked={cultureRatingVisibility}
              onClick={handleSwitchCultureRatingVisibility}
            >
              {translate("Common Disadvantages")}
            </Checkbox>
            {cultureRatingVisibility ? <RecommendedReference strongly /> : null}
          </Grid>
          {isInCharacterCreation && <AdventurePointsSpent />}
          {/* <Checkbox checked={enableActiveItemHints} onClick={switchActiveItemHints}>
          {translate(staticData)("general.filters.showactivatedentries")}
        </Checkbox> */}
        </Options>
        <Main classOnly>
          <Scroll>
            <ListHeader>
              <ListHeaderTag className="name">{translate("Name")}</ListHeaderTag>
              <ListHeaderTag className="cost" hint={translate("Adventure Points")}>
                {translate("AP")}
              </ListHeaderTag>
              <ListHeaderTag className="btn-placeholder" />
              <ListHeaderTag className="btn-placeholder" />
            </ListHeader>
            {inactiveList.length > 0 ? (
              <List>
                {inactiveList.map(x => (
                  <InactiveActivatablesListItem key={`disadvantage-${x.id}`} activatable={x} />
                ))}
              </List>
            ) : (
              <ListPlaceholder type="inactiveDisadvantages" message={translate("No Results")} />
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
            {translate("Common Disadvantages")}
          </Checkbox>
          {cultureRatingVisibility ? <RecommendedReference strongly /> : null}
        </Grid>
        {isInCharacterCreation && <AdventurePointsSpent />}
      </Options>
      <Main>
        <Scroll>
          <ListHeader>
            <ListHeaderTag className="name">{translate("Name")}</ListHeaderTag>
            <ListHeaderTag className="cost" hint={translate("Adventure Points")}>
              {translate("AP")}
            </ListHeaderTag>
            {canRemove && <ListHeaderTag className="btn-placeholder" />}
            <ListHeaderTag className="btn-placeholder" />
          </ListHeader>
          {activeList.length > 0 ? (
            <List>
              {activeList.map(x => (
                <ActiveActivatableListItem key={`disadvantage-${x.id}`} activatable={x} />
              ))}
            </List>
          ) : (
            <ListPlaceholder type="disadvantages" message={translate("No Results")} />
          )}
        </Scroll>
      </Main>
      <InlineLibrary />
    </Page>
  )
})
