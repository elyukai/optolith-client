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
import { RecommendedReference } from "../../../../../shared/components/recommendedReference/RecommendedReference.tsx"
import { Scroll } from "../../../../../shared/components/scroll/Scroll.tsx"
import { Slidein } from "../../../../../shared/components/slidein/Slidein.tsx"
import { TextField } from "../../../../../shared/components/textField/TextField.tsx"
import { filterAndSortDisplayed } from "../../../../../shared/domain/rated/spell.ts"
import { DisplayedActiveSpellwork } from "../../../../../shared/domain/rated/spellActive.ts"
import { DisplayedInactiveSpellwork } from "../../../../../shared/domain/rated/spellInactive.ts"
import { SpellsSortOrder } from "../../../../../shared/domain/sortOrders.ts"
import { useLocaleCompare } from "../../../../../shared/hooks/localeCompare.ts"
import { useTranslate } from "../../../../../shared/hooks/translate.ts"
import { useTranslateMap } from "../../../../../shared/hooks/translateMap.ts"
import { assertExhaustive } from "../../../../../shared/utils/typeSafety.ts"
import { useModalState } from "../../../../hooks/modalState.ts"
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts"
import { InlineLibrary } from "../../../../inlineLibrary/InlineLibrary.tsx"
import { SelectGetById } from "../../../../selectors/basicCapabilitySelectors.ts"
import { selectCanRemove } from "../../../../selectors/characterSelectors.ts"
import {
  selectVisibleActiveSpellworks,
  selectVisibleInactiveSpellworks,
} from "../../../../selectors/spellSelectors.ts"
import { addCantrip, removeCantrip } from "../../../../slices/cantripsSlice.ts"
import { changeSpellsSortOrder, selectSpellsSortOrder } from "../../../../slices/settingsSlice.ts"
import { ActiveAnimistPowersListItem } from "./ActiveAnimistPowersListItem.tsx"
import { ActiveCantripsListItem } from "./ActiveCantripsListItem.tsx"
import { ActiveCursesListItem } from "./ActiveCursesListItem.tsx"
import { ActiveDominationRitualsListItem } from "./ActiveDominationRitualsListItem.tsx"
import { ActiveElvenMagicalSongsListItem } from "./ActiveElvenMagicalSongsListItem.tsx"
import { ActiveGeodeRitualsListItem } from "./ActiveGeodeRitualsListItem.tsx"
import { ActiveJesterTricksListItem } from "./ActiveJesterTricksListItem.tsx"
import { ActiveMagicalDancesListItem } from "./ActiveMagicalDancesListItem.tsx"
import { ActiveMagicalMelodiesListItem } from "./ActiveMagicalMelodiesListItem.tsx"
import { ActiveRitualsListItem } from "./ActiveRitualsListItem.tsx"
import { ActiveSpellsListItem } from "./ActiveSpellsListItem.tsx"
import { ActiveZibiljaRitualsListItem } from "./ActiveZibiljaRitualsListItem.tsx"
import { InactiveAnimistPowersListItem } from "./InactiveAnimistPowersListItem.tsx"
import { InactiveCantripsListItem } from "./InactiveCantripsListItem.tsx"
import { InactiveCursesListItem } from "./InactiveCursesListItem.tsx"
import { InactiveDominationRitualsListItem } from "./InactiveDominationRitualsListItem.tsx"
import { InactiveElvenMagicalSongsListItem } from "./InactiveElvenMagicalSongsListItem.tsx"
import { InactiveGeodeRitualsListItem } from "./InactiveGeodeRitualsListItem.tsx"
import { InactiveJesterTricksListItem } from "./InactiveJesterTricksListItem.tsx"
import { InactiveMagicalDancesListItem } from "./InactiveMagicalDancesListItem.tsx"
import { InactiveMagicalMelodiesListItem } from "./InactiveMagicalMelodiesListItem.tsx"
import { InactiveRitualsListItem } from "./InactiveRitualsListItem.tsx"
import { InactiveSpellsListItem } from "./InactiveSpellsListItem.tsx"
import { InactiveZibiljaRitualsListItem } from "./InactiveZibiljaRitualsListItem.tsx"

const isTopMarginNeeded = (
  sortOrder: SpellsSortOrder,
  curr: DisplayedInactiveSpellwork | DisplayedActiveSpellwork,
  mprev: DisplayedInactiveSpellwork | DisplayedActiveSpellwork | undefined,
) => sortOrder === "group" && mprev !== undefined && curr.kind !== mprev.kind

/**
 * Returns a page for managing spells and magical actions.
 */
export const Spells: FC = () => {
  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const dispatch = useAppDispatch()
  const localeCompare = useLocaleCompare()

  const canRemove = useAppSelector(selectCanRemove)
  const getProperty = useAppSelector(SelectGetById.Static.Property)

  const [activeFilterText, setActiveFilterText] = useState("")
  const [inactiveFilterText, setInactiveFilterText] = useState("")
  const sortOrder = useAppSelector(selectSpellsSortOrder)
  const handleChangeSortOrder = useCallback(
    (id: SpellsSortOrder) => dispatch(changeSpellsSortOrder(id)),
    [dispatch],
  )

  const visibleInactiveSpellworks = useAppSelector(selectVisibleInactiveSpellworks)
  const visibleActiveSpellworks = useAppSelector(selectVisibleActiveSpellworks)

  const inactiveList = useMemo(
    () =>
      filterAndSortDisplayed(
        visibleInactiveSpellworks,
        inactiveFilterText,
        sortOrder,
        translateMap,
        localeCompare,
        getProperty,
      ),
    [
      inactiveFilterText,
      getProperty,
      localeCompare,
      sortOrder,
      translateMap,
      visibleInactiveSpellworks,
    ],
  )

  const activeList = useMemo(
    () =>
      filterAndSortDisplayed(
        visibleActiveSpellworks,
        inactiveFilterText,
        sortOrder,
        translateMap,
        localeCompare,
        getProperty,
      ),
    [
      visibleActiveSpellworks,
      inactiveFilterText,
      sortOrder,
      translateMap,
      localeCompare,
      getProperty,
    ],
  )

  // TODO: Check available AP
  const handleAddCantrip = useCallback((id: number) => dispatch(addCantrip({ id })), [dispatch])
  const handleRemoveCantrip = useCallback(
    (id: number) => dispatch(removeCantrip({ id })),
    [dispatch],
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
          {/* <Checkbox checked={enableActiveItemHints} onClick={switchActiveItemHints}>
            {translate(staticData)("general.filters.showactivatedentries")}
          </Checkbox> */}
        </Options>
        <Main classOnly>
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
          <Scroll>
            {inactiveList.length > 0 ? (
              <List>
                {inactiveList.map((x, i) => {
                  switch (x.kind) {
                    case "cantrip":
                      return (
                        <InactiveCantripsListItem
                          key={`cantrip-${x.static.id}`}
                          insertTopMargin={isTopMarginNeeded(sortOrder, x, inactiveList[i - 1])}
                          cantrip={x}
                          sortOrder={sortOrder}
                          add={handleAddCantrip}
                        />
                      )

                    case "spell":
                      return (
                        <InactiveSpellsListItem
                          key={`spell-${x.static.id}`}
                          insertTopMargin={isTopMarginNeeded(sortOrder, x, inactiveList[i - 1])}
                          spell={x}
                          sortOrder={sortOrder}
                        />
                      )

                    case "ritual":
                      return (
                        <InactiveRitualsListItem
                          key={`ritual-${x.static.id}`}
                          insertTopMargin={isTopMarginNeeded(sortOrder, x, inactiveList[i - 1])}
                          ritual={x}
                          sortOrder={sortOrder}
                        />
                      )

                    case "curse":
                      return (
                        <InactiveCursesListItem
                          key={`curse-${x.static.id}`}
                          insertTopMargin={isTopMarginNeeded(sortOrder, x, inactiveList[i - 1])}
                          curse={x}
                          sortOrder={sortOrder}
                        />
                      )

                    case "elvenMagicalSong":
                      return (
                        <InactiveElvenMagicalSongsListItem
                          key={`elven-magical-song-${x.static.id}`}
                          insertTopMargin={isTopMarginNeeded(sortOrder, x, inactiveList[i - 1])}
                          elvenMagicalSong={x}
                          sortOrder={sortOrder}
                        />
                      )

                    case "dominationRitual":
                      return (
                        <InactiveDominationRitualsListItem
                          key={`domination-ritual-${x.static.id}`}
                          insertTopMargin={isTopMarginNeeded(sortOrder, x, inactiveList[i - 1])}
                          dominationRitual={x}
                          sortOrder={sortOrder}
                        />
                      )

                    case "magicalDance":
                      return (
                        <InactiveMagicalDancesListItem
                          key={`magical-dance-${x.static.id}`}
                          insertTopMargin={isTopMarginNeeded(sortOrder, x, inactiveList[i - 1])}
                          magicalDance={x}
                          sortOrder={sortOrder}
                        />
                      )

                    case "magicalMelody":
                      return (
                        <InactiveMagicalMelodiesListItem
                          key={`magical-melody-${x.static.id}`}
                          insertTopMargin={isTopMarginNeeded(sortOrder, x, inactiveList[i - 1])}
                          magicalMelody={x}
                          sortOrder={sortOrder}
                        />
                      )

                    case "jesterTrick":
                      return (
                        <InactiveJesterTricksListItem
                          key={`jester-trick-${x.static.id}`}
                          insertTopMargin={isTopMarginNeeded(sortOrder, x, inactiveList[i - 1])}
                          jesterTrick={x}
                          sortOrder={sortOrder}
                        />
                      )

                    case "animistPower":
                      return (
                        <InactiveAnimistPowersListItem
                          key={`animist-power-${x.static.id}`}
                          insertTopMargin={isTopMarginNeeded(sortOrder, x, inactiveList[i - 1])}
                          animistPower={x}
                          sortOrder={sortOrder}
                        />
                      )

                    case "geodeRitual":
                      return (
                        <InactiveGeodeRitualsListItem
                          key={`geode-ritual-${x.static.id}`}
                          insertTopMargin={isTopMarginNeeded(sortOrder, x, inactiveList[i - 1])}
                          geodeRitual={x}
                          sortOrder={sortOrder}
                        />
                      )

                    case "zibiljaRitual":
                      return (
                        <InactiveZibiljaRitualsListItem
                          key={`zibilja-ritual-${x.static.id}`}
                          insertTopMargin={isTopMarginNeeded(sortOrder, x, inactiveList[i - 1])}
                          zibiljaRitual={x}
                          sortOrder={sortOrder}
                        />
                      )

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
        <Button onClick={openSlidein}>{translate("Add")}</Button>
        <RecommendedReference unfamiliarSpells />
      </Options>
      <Main>
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
        <Scroll stable>
          {activeList.length > 0 ? (
            <List>
              {activeList.map((x, i) => {
                switch (x.kind) {
                  case "cantrip":
                    return (
                      <ActiveCantripsListItem
                        key={`cantrip-${x.static.id}`}
                        insertTopMargin={isTopMarginNeeded(sortOrder, x, activeList[i - 1])}
                        cantrip={x}
                        sortOrder={sortOrder}
                        remove={handleRemoveCantrip}
                      />
                    )

                  case "spell":
                    return (
                      <ActiveSpellsListItem
                        key={`spell-${x.static.id}`}
                        insertTopMargin={isTopMarginNeeded(sortOrder, x, activeList[i - 1])}
                        spell={x}
                        sortOrder={sortOrder}
                      />
                    )

                  case "ritual":
                    return (
                      <ActiveRitualsListItem
                        key={`ritual-${x.static.id}`}
                        insertTopMargin={isTopMarginNeeded(sortOrder, x, activeList[i - 1])}
                        ritual={x}
                        sortOrder={sortOrder}
                      />
                    )

                  case "curse":
                    return (
                      <ActiveCursesListItem
                        key={`curse-${x.static.id}`}
                        insertTopMargin={isTopMarginNeeded(sortOrder, x, activeList[i - 1])}
                        curse={x}
                        sortOrder={sortOrder}
                      />
                    )

                  case "elvenMagicalSong":
                    return (
                      <ActiveElvenMagicalSongsListItem
                        key={`elven-magical-song-${x.static.id}`}
                        insertTopMargin={isTopMarginNeeded(sortOrder, x, activeList[i - 1])}
                        elvenMagicalSong={x}
                        sortOrder={sortOrder}
                      />
                    )

                  case "dominationRitual":
                    return (
                      <ActiveDominationRitualsListItem
                        key={`domination-ritual-${x.static.id}`}
                        insertTopMargin={isTopMarginNeeded(sortOrder, x, activeList[i - 1])}
                        dominationRitual={x}
                        sortOrder={sortOrder}
                      />
                    )

                  case "magicalDance":
                    return (
                      <ActiveMagicalDancesListItem
                        key={`magical-dance-${x.static.id}`}
                        insertTopMargin={isTopMarginNeeded(sortOrder, x, activeList[i - 1])}
                        magicalDance={x}
                        sortOrder={sortOrder}
                      />
                    )

                  case "magicalMelody":
                    return (
                      <ActiveMagicalMelodiesListItem
                        key={`magical-melody-${x.static.id}`}
                        insertTopMargin={isTopMarginNeeded(sortOrder, x, activeList[i - 1])}
                        magicalMelody={x}
                        sortOrder={sortOrder}
                      />
                    )

                  case "jesterTrick":
                    return (
                      <ActiveJesterTricksListItem
                        key={`jester-trick-${x.static.id}`}
                        insertTopMargin={isTopMarginNeeded(sortOrder, x, activeList[i - 1])}
                        jesterTrick={x}
                        sortOrder={sortOrder}
                      />
                    )

                  case "animistPower":
                    return (
                      <ActiveAnimistPowersListItem
                        key={`animist-power-${x.static.id}`}
                        insertTopMargin={isTopMarginNeeded(sortOrder, x, activeList[i - 1])}
                        animistPower={x}
                        sortOrder={sortOrder}
                      />
                    )

                  case "geodeRitual":
                    return (
                      <ActiveGeodeRitualsListItem
                        key={`geode-ritual-${x.static.id}`}
                        insertTopMargin={isTopMarginNeeded(sortOrder, x, activeList[i - 1])}
                        geodeRitual={x}
                        sortOrder={sortOrder}
                      />
                    )

                  case "zibiljaRitual":
                    return (
                      <ActiveZibiljaRitualsListItem
                        key={`zibilja-ritual-${x.static.id}`}
                        insertTopMargin={isTopMarginNeeded(sortOrder, x, activeList[i - 1])}
                        zibiljaRitual={x}
                        sortOrder={sortOrder}
                      />
                    )

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
}
