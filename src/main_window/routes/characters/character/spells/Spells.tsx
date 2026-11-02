import { assertExhaustive } from "@elyukai/utils/typeSafety"
import { observer } from "mobx-react-lite"
import { useCallback, useMemo, useState, type FC } from "react"
import { Button } from "../../../../../shared/components/button/Button.tsx"
import { List } from "../../../../../shared/components/list/List.tsx"
import { ListHeader } from "../../../../../shared/components/list/ListHeader.tsx"
import { ListHeaderTag } from "../../../../../shared/components/list/ListHeaderTag.tsx"
import { ListPlaceholder } from "../../../../../shared/components/list/ListPlaceholder.tsx"
import { Main } from "../../../../../shared/components/main/Main.tsx"
import { Options } from "../../../../../shared/components/options/Options.tsx"
import { Page } from "../../../../../shared/components/page/Page.tsx"
import { RadioButtonGroup } from "../../../../../shared/components/radioButton/RadioButtonGroup.tsx"
import { RecommendedReference } from "../../../../../shared/components/recommendedReference/RecommendedReference.tsx"
import { Scroll } from "../../../../../shared/components/scroll/Scroll.tsx"
import { Slidein } from "../../../../../shared/components/slidein/Slidein.tsx"
import { TextField } from "../../../../../shared/components/textField/TextField.tsx"
import {
  filterAndSortDisplayed,
  type DisplayedActiveSpellwork,
  type DisplayedCantrip,
  type DisplayedInactiveSpellwork,
  type DisplayedSpellwork,
} from "../../../../../shared/domain/rated/spell.ts"
import { SpellsSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { useLocaleCompare } from "../../../../../shared/hooks/localeCompare.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useCharacterActions } from "../../../../hooks/characterAction.ts"
import { useCharacterState } from "../../../../hooks/characterState.ts"
import { useModalState } from "../../../../hooks/modalState.ts"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts"
import { InlineLibrary, InlineLibraryManager } from "../../../../inlineLibrary/InlineLibrary.tsx"
import { changeSpellsSortOrder, selectSpellsSortOrder } from "../../../../slices/settingsSlice.ts"
import { ActiveActivatableRatedListItem } from "../liturgicalChants/ActiveActivatableRatedListItem.tsx"
import { InactiveActivatableRatedListItem } from "../liturgicalChants/InactiveActivatableRatedListItem.tsx"
import { ActiveCantripsListItem } from "./ActiveCantripsListItem.tsx"
import { InactiveCantripsListItem } from "./InactiveCantripsListItem.tsx"

const isTopMarginNeeded = (
  sortOrder: SpellsSortOrder,
  curr: DisplayedSpellwork | DisplayedCantrip,
  mprev: DisplayedSpellwork | DisplayedCantrip | undefined,
) => sortOrder === "group" && mprev !== undefined && curr.type !== mprev.type

/**
 * Returns a page for managing spells and magical actions.
 */
export const Spells: FC = observer(() => {
  const translate = useTranslate()
  const dispatch = useAppDispatch()
  const localeCompare = useLocaleCompare()

  const {
    canRemove,
    inactiveCantrips,
    inactiveSpells,
    inactiveRituals,
    activeCantrips,
    activeSpells,
    activeRituals,
    attributes,
  } = useCharacterState()
  const actions = useCharacterActions()

  const [activeFilterText, setActiveFilterText] = useState("")
  const [inactiveFilterText, setInactiveFilterText] = useState("")
  const sortOrder = useAppSelector(selectSpellsSortOrder)
  const handleChangeSortOrder = useCallback(
    (id: SpellsSortOrder) => dispatch(changeSpellsSortOrder(id)),
    [dispatch],
  )

  const visibleInactiveSpellworks = (
    inactiveSpells as (DisplayedInactiveSpellwork | DisplayedCantrip)[]
  )
    .concat(inactiveRituals)
    .concat(inactiveCantrips)
  const visibleActiveSpellworks = (activeSpells as (DisplayedActiveSpellwork | DisplayedCantrip)[])
    .concat(activeRituals)
    .concat(activeCantrips)

  const inactiveList = useMemo(
    () =>
      filterAndSortDisplayed(
        visibleInactiveSpellworks,
        inactiveFilterText,
        sortOrder,
        localeCompare,
      ),
    [inactiveFilterText, localeCompare, sortOrder, visibleInactiveSpellworks],
  )

  const activeList = useMemo(
    () =>
      filterAndSortDisplayed(visibleActiveSpellworks, inactiveFilterText, sortOrder, localeCompare),
    [visibleActiveSpellworks, inactiveFilterText, sortOrder, localeCompare],
  )

  // TODO: Check available AP
  const handleAddCantrip = useCallback(
    (id: string) => actions.addTinyActivatable("Cantrip", id),
    [],
  )
  const handleRemoveCantrip = useCallback(
    (id: string) => actions.addTinyActivatable("Cantrip", id),
    [],
  )

  const { isOpen: isSlideinVisible, open: openSlidein, close: closeSlidein } = useModalState()

  return (
    <Page id="spells">
      <Slidein isOpen={isSlideinVisible} close={closeSlidein} className="adding-spells">
        <Options>
          <TextField
            value={inactiveFilterText}
            onChange={setInactiveFilterText}
            hint={translate("Search")}
          />
          <RadioButtonGroup
            active={sortOrder}
            label={translate("Sort By")}
            options={[
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
          {/* <Checkbox checked={enableActiveItemHints} onClick={switchActiveItemHints}>
            {translate(staticData)("general.filters.showactivatedentries")}
          </Checkbox> */}
        </Options>
        <Main classOnly>
          <Scroll>
            <ListHeader>
              <ListHeaderTag className="name">{translate("Name")}</ListHeaderTag>
              <ListHeaderTag className="group">
                {translate("Property")}
                {sortOrder === "group" ? ` / ${translate("Group")}` : null}
              </ListHeaderTag>
              <ListHeaderTag className="check">{translate("Check")}</ListHeaderTag>
              <ListHeaderTag className="mod" hint={translate("Check Modifier")}>
                {translate("Mod")}
              </ListHeaderTag>
              <ListHeaderTag className="ic" hint={translate("Improvement Cost")}>
                {translate("IC")}
              </ListHeaderTag>
              <ListHeaderTag className="btn-placeholder" />
              <ListHeaderTag className="btn-placeholder" />
            </ListHeader>
            {inactiveList.length > 0 ? (
              <List>
                {inactiveList.map((x, i) => {
                  switch (x.type) {
                    case "Cantrip":
                      return (
                        <InactiveCantripsListItem
                          key={`cantrip-${x.id}`}
                          insertTopMargin={isTopMarginNeeded(sortOrder, x, inactiveList[i - 1])}
                          cantrip={x}
                          displayGroup={sortOrder === SpellsSortOrder.Group}
                          add={handleAddCantrip}
                          selectedInlineLibraryEntryId={InlineLibraryManager.instance.current}
                        />
                      )

                    case "Spell":
                    case "Ritual":
                      return (
                        <InactiveActivatableRatedListItem
                          key={`${x.type}-${x.id}`}
                          insertTopMargin={isTopMarginNeeded(sortOrder, x, inactiveList[i - 1])}
                          entry={x}
                          displayGroup={sortOrder === SpellsSortOrder.Group}
                          attributes={attributes}
                          selectedInlineLibraryEntryId={InlineLibraryManager.instance.current}
                        />
                      )

                    // case "curse":
                    //   return (
                    //     <InactiveCursesListItem
                    //       key={`curse-${x.static.id}`}
                    //       insertTopMargin={isTopMarginNeeded(sortOrder, x, inactiveList[i - 1])}
                    //       curse={x}
                    //       sortOrder={sortOrder}
                    //     />
                    //   )

                    // case "elvenMagicalSong":
                    //   return (
                    //     <InactiveElvenMagicalSongsListItem
                    //       key={`elven-magical-song-${x.static.id}`}
                    //       insertTopMargin={isTopMarginNeeded(sortOrder, x, inactiveList[i - 1])}
                    //       elvenMagicalSong={x}
                    //       sortOrder={sortOrder}
                    //     />
                    //   )

                    // case "dominationRitual":
                    //   return (
                    //     <InactiveDominationRitualsListItem
                    //       key={`domination-ritual-${x.static.id}`}
                    //       insertTopMargin={isTopMarginNeeded(sortOrder, x, inactiveList[i - 1])}
                    //       dominationRitual={x}
                    //       sortOrder={sortOrder}
                    //     />
                    //   )

                    // case "magicalDance":
                    //   return (
                    //     <InactiveMagicalDancesListItem
                    //       key={`magical-dance-${x.static.id}`}
                    //       insertTopMargin={isTopMarginNeeded(sortOrder, x, inactiveList[i - 1])}
                    //       magicalDance={x}
                    //       sortOrder={sortOrder}
                    //     />
                    //   )

                    // case "magicalMelody":
                    //   return (
                    //     <InactiveMagicalMelodiesListItem
                    //       key={`magical-melody-${x.static.id}`}
                    //       insertTopMargin={isTopMarginNeeded(sortOrder, x, inactiveList[i - 1])}
                    //       magicalMelody={x}
                    //       sortOrder={sortOrder}
                    //     />
                    //   )

                    // case "jesterTrick":
                    //   return (
                    //     <InactiveJesterTricksListItem
                    //       key={`jester-trick-${x.static.id}`}
                    //       insertTopMargin={isTopMarginNeeded(sortOrder, x, inactiveList[i - 1])}
                    //       jesterTrick={x}
                    //       sortOrder={sortOrder}
                    //     />
                    //   )

                    // case "animistPower":
                    //   return (
                    //     <InactiveAnimistPowersListItem
                    //       key={`animist-power-${x.static.id}`}
                    //       insertTopMargin={isTopMarginNeeded(sortOrder, x, inactiveList[i - 1])}
                    //       animistPower={x}
                    //       sortOrder={sortOrder}
                    //     />
                    //   )

                    // case "geodeRitual":
                    //   return (
                    //     <InactiveGeodeRitualsListItem
                    //       key={`geode-ritual-${x.static.id}`}
                    //       insertTopMargin={isTopMarginNeeded(sortOrder, x, inactiveList[i - 1])}
                    //       geodeRitual={x}
                    //       sortOrder={sortOrder}
                    //     />
                    //   )

                    // case "zibiljaRitual":
                    //   return (
                    //     <InactiveZibiljaRitualsListItem
                    //       key={`zibilja-ritual-${x.static.id}`}
                    //       insertTopMargin={isTopMarginNeeded(sortOrder, x, inactiveList[i - 1])}
                    //       zibiljaRitual={x}
                    //       sortOrder={sortOrder}
                    //     />
                    //   )

                    default:
                      return assertExhaustive(x)
                  }
                })}
              </List>
            ) : (
              <ListPlaceholder type="spells" message={translate("No Results")} />
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
          options={[
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
        <Button onClick={openSlidein}>{translate("Add")}</Button>
        <RecommendedReference unfamiliarSpells />
      </Options>
      <Main>
        <Scroll>
          <ListHeader>
            <ListHeaderTag className="name">{translate("Name")}</ListHeaderTag>
            <ListHeaderTag className="group">
              {translate("Property")}
              {sortOrder === "group" ? ` / ${translate("Group")}` : null}
            </ListHeaderTag>
            <ListHeaderTag className="value" hint={translate("Skill Rating")}>
              {translate("SR")}
            </ListHeaderTag>
            <ListHeaderTag className="check">{translate("Check")}</ListHeaderTag>
            <ListHeaderTag className="mod" hint={translate("Check Modifier")}>
              {translate("Mod")}
            </ListHeaderTag>
            <ListHeaderTag className="ic" hint={translate("Improvement Cost")}>
              {translate("IC")}
            </ListHeaderTag>
            {canRemove ? <ListHeaderTag className="btn-placeholder" /> : null}
            <ListHeaderTag className="btn-placeholder" />
            <ListHeaderTag className="btn-placeholder" />
          </ListHeader>
          {activeList.length > 0 ? (
            <List>
              {activeList.map((x, i) => {
                switch (x.type) {
                  case "Cantrip":
                    return (
                      <ActiveCantripsListItem
                        key={`cantrip-${x.id}`}
                        insertTopMargin={isTopMarginNeeded(sortOrder, x, activeList[i - 1])}
                        cantrip={x}
                        canRemove={canRemove}
                        displayGroup={sortOrder === SpellsSortOrder.Group}
                        remove={handleRemoveCantrip}
                        selectedInlineLibraryEntryId={InlineLibraryManager.instance.current}
                      />
                    )

                  case "Spell":
                  case "Ritual":
                    return (
                      <ActiveActivatableRatedListItem
                        key={`${x.type}-${x.id}`}
                        insertTopMargin={isTopMarginNeeded(sortOrder, x, inactiveList[i - 1])}
                        entry={x}
                        canRemove={canRemove}
                        displayGroup={sortOrder === SpellsSortOrder.Group}
                        attributes={attributes}
                        selectedInlineLibraryEntryId={InlineLibraryManager.instance.current}
                      />
                    )

                  // case "curse":
                  //   return (
                  //     <ActiveCursesListItem
                  //       key={`curse-${x.static.id}`}
                  //       insertTopMargin={isTopMarginNeeded(sortOrder, x, activeList[i - 1])}
                  //       curse={x}
                  //       sortOrder={sortOrder}
                  //     />
                  //   )

                  // case "elvenMagicalSong":
                  //   return (
                  //     <ActiveElvenMagicalSongsListItem
                  //       key={`elven-magical-song-${x.static.id}`}
                  //       insertTopMargin={isTopMarginNeeded(sortOrder, x, activeList[i - 1])}
                  //       elvenMagicalSong={x}
                  //       sortOrder={sortOrder}
                  //     />
                  //   )

                  // case "dominationRitual":
                  //   return (
                  //     <ActiveDominationRitualsListItem
                  //       key={`domination-ritual-${x.static.id}`}
                  //       insertTopMargin={isTopMarginNeeded(sortOrder, x, activeList[i - 1])}
                  //       dominationRitual={x}
                  //       sortOrder={sortOrder}
                  //     />
                  //   )

                  // case "magicalDance":
                  //   return (
                  //     <ActiveMagicalDancesListItem
                  //       key={`magical-dance-${x.static.id}`}
                  //       insertTopMargin={isTopMarginNeeded(sortOrder, x, activeList[i - 1])}
                  //       magicalDance={x}
                  //       sortOrder={sortOrder}
                  //     />
                  //   )

                  // case "magicalMelody":
                  //   return (
                  //     <ActiveMagicalMelodiesListItem
                  //       key={`magical-melody-${x.static.id}`}
                  //       insertTopMargin={isTopMarginNeeded(sortOrder, x, activeList[i - 1])}
                  //       magicalMelody={x}
                  //       sortOrder={sortOrder}
                  //     />
                  //   )

                  // case "jesterTrick":
                  //   return (
                  //     <ActiveJesterTricksListItem
                  //       key={`jester-trick-${x.static.id}`}
                  //       insertTopMargin={isTopMarginNeeded(sortOrder, x, activeList[i - 1])}
                  //       jesterTrick={x}
                  //       sortOrder={sortOrder}
                  //     />
                  //   )

                  // case "animistPower":
                  //   return (
                  //     <ActiveAnimistPowersListItem
                  //       key={`animist-power-${x.static.id}`}
                  //       insertTopMargin={isTopMarginNeeded(sortOrder, x, activeList[i - 1])}
                  //       animistPower={x}
                  //       sortOrder={sortOrder}
                  //     />
                  //   )

                  // case "geodeRitual":
                  //   return (
                  //     <ActiveGeodeRitualsListItem
                  //       key={`geode-ritual-${x.static.id}`}
                  //       insertTopMargin={isTopMarginNeeded(sortOrder, x, activeList[i - 1])}
                  //       geodeRitual={x}
                  //       sortOrder={sortOrder}
                  //     />
                  //   )

                  // case "zibiljaRitual":
                  //   return (
                  //     <ActiveZibiljaRitualsListItem
                  //       key={`zibilja-ritual-${x.static.id}`}
                  //       insertTopMargin={isTopMarginNeeded(sortOrder, x, activeList[i - 1])}
                  //       zibiljaRitual={x}
                  //       sortOrder={sortOrder}
                  //     />
                  //   )

                  default:
                    return assertExhaustive(x)
                }
              })}
            </List>
          ) : (
            <ListPlaceholder type="spells" message={translate("No Results")} />
          )}
        </Scroll>
      </Main>
      <InlineLibrary />
    </Page>
  )
})
