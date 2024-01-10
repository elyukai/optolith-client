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
import {
  addAnimistPower,
  decrementAnimistPower,
  incrementAnimistPower,
  removeAnimistPower,
} from "../../../../slices/magicalActions/animistPowersSlice.ts"
import {
  addCurse,
  decrementCurse,
  incrementCurse,
  removeCurse,
} from "../../../../slices/magicalActions/cursesSlice.ts"
import {
  addDominationRitual,
  decrementDominationRitual,
  incrementDominationRitual,
  removeDominationRitual,
} from "../../../../slices/magicalActions/dominationRitualsSlice.ts"
import {
  addElvenMagicalSong,
  decrementElvenMagicalSong,
  incrementElvenMagicalSong,
  removeElvenMagicalSong,
} from "../../../../slices/magicalActions/elvenMagicalSongsSlice.ts"
import {
  addGeodeRitual,
  decrementGeodeRitual,
  incrementGeodeRitual,
  removeGeodeRitual,
} from "../../../../slices/magicalActions/geodeRitualsSlice.ts"
import {
  addJesterTrick,
  decrementJesterTrick,
  incrementJesterTrick,
  removeJesterTrick,
} from "../../../../slices/magicalActions/jesterTricksSlice.ts"
import {
  addMagicalDance,
  decrementMagicalDance,
  incrementMagicalDance,
  removeMagicalDance,
} from "../../../../slices/magicalActions/magicalDancesSlice.ts"
import {
  addMagicalMelody,
  decrementMagicalMelody,
  incrementMagicalMelody,
  removeMagicalMelody,
} from "../../../../slices/magicalActions/magicalMelodiesSlice.ts"
import {
  addZibiljaRitual,
  decrementZibiljaRitual,
  incrementZibiljaRitual,
  removeZibiljaRitual,
} from "../../../../slices/magicalActions/zibiljaRitualsSlice.ts"
import {
  addRitual,
  decrementRitual,
  incrementRitual,
  removeRitual,
} from "../../../../slices/ritualsSlice.ts"
import { changeSpellsSortOrder, selectSpellsSortOrder } from "../../../../slices/settingsSlice.ts"
import {
  addSpell,
  decrementSpell,
  incrementSpell,
  removeSpell,
} from "../../../../slices/spellsSlice.ts"
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

  const handleAddCantrip = useCallback((id: number) => dispatch(addCantrip(id)), [dispatch])
  const handleRemoveCantrip = useCallback((id: number) => dispatch(removeCantrip(id)), [dispatch])

  const handleAddSpell = useCallback((id: number) => dispatch(addSpell(id)), [dispatch])
  const handleRemoveSpell = useCallback((id: number) => dispatch(removeSpell(id)), [dispatch])
  const handleAddSpellPoint = useCallback((id: number) => dispatch(incrementSpell(id)), [dispatch])
  const handleRemoveSpellPoint = useCallback(
    (id: number) => dispatch(decrementSpell(id)),
    [dispatch],
  )

  const handleAddRitual = useCallback((id: number) => dispatch(addRitual(id)), [dispatch])
  const handleRemoveRitual = useCallback((id: number) => dispatch(removeRitual(id)), [dispatch])
  const handleAddRitualPoint = useCallback(
    (id: number) => dispatch(incrementRitual(id)),
    [dispatch],
  )
  const handleRemoveRitualPoint = useCallback(
    (id: number) => dispatch(decrementRitual(id)),
    [dispatch],
  )

  const handleAddCurse = useCallback((id: number) => dispatch(addCurse(id)), [dispatch])
  const handleRemoveCurse = useCallback((id: number) => dispatch(removeCurse(id)), [dispatch])
  const handleAddCursePoint = useCallback((id: number) => dispatch(incrementCurse(id)), [dispatch])
  const handleRemoveCursePoint = useCallback(
    (id: number) => dispatch(decrementCurse(id)),
    [dispatch],
  )

  const handleAddElvenMagicalSong = useCallback(
    (id: number) => dispatch(addElvenMagicalSong(id)),
    [dispatch],
  )
  const handleRemoveElvenMagicalSong = useCallback(
    (id: number) => dispatch(removeElvenMagicalSong(id)),
    [dispatch],
  )
  const handleAddElvenMagicalSongPoint = useCallback(
    (id: number) => dispatch(incrementElvenMagicalSong(id)),
    [dispatch],
  )
  const handleRemoveElvenMagicalSongPoint = useCallback(
    (id: number) => dispatch(decrementElvenMagicalSong(id)),
    [dispatch],
  )

  const handleAddDominationRitual = useCallback(
    (id: number) => dispatch(addDominationRitual(id)),
    [dispatch],
  )
  const handleRemoveDominationRitual = useCallback(
    (id: number) => dispatch(removeDominationRitual(id)),
    [dispatch],
  )
  const handleAddDominationRitualPoint = useCallback(
    (id: number) => dispatch(incrementDominationRitual(id)),
    [dispatch],
  )
  const handleRemoveDominationRitualPoint = useCallback(
    (id: number) => dispatch(decrementDominationRitual(id)),
    [dispatch],
  )

  const handleAddMagicalDance = useCallback(
    (id: number) => dispatch(addMagicalDance(id)),
    [dispatch],
  )
  const handleRemoveMagicalDance = useCallback(
    (id: number) => dispatch(removeMagicalDance(id)),
    [dispatch],
  )
  const handleAddMagicalDancePoint = useCallback(
    (id: number) => dispatch(incrementMagicalDance(id)),
    [dispatch],
  )
  const handleRemoveMagicalDancePoint = useCallback(
    (id: number) => dispatch(decrementMagicalDance(id)),
    [dispatch],
  )

  const handleAddMagicalMelody = useCallback(
    (id: number) => dispatch(addMagicalMelody(id)),
    [dispatch],
  )
  const handleRemoveMagicalMelody = useCallback(
    (id: number) => dispatch(removeMagicalMelody(id)),
    [dispatch],
  )
  const handleAddMagicalMelodyPoint = useCallback(
    (id: number) => dispatch(incrementMagicalMelody(id)),
    [dispatch],
  )
  const handleRemoveMagicalMelodyPoint = useCallback(
    (id: number) => dispatch(decrementMagicalMelody(id)),
    [dispatch],
  )

  const handleAddJesterTrick = useCallback((id: number) => dispatch(addJesterTrick(id)), [dispatch])
  const handleRemoveJesterTrick = useCallback(
    (id: number) => dispatch(removeJesterTrick(id)),
    [dispatch],
  )
  const handleAddJesterTrickPoint = useCallback(
    (id: number) => dispatch(incrementJesterTrick(id)),
    [dispatch],
  )
  const handleRemoveJesterTrickPoint = useCallback(
    (id: number) => dispatch(decrementJesterTrick(id)),
    [dispatch],
  )

  const handleAddAnimistPower = useCallback(
    (id: number) => dispatch(addAnimistPower(id)),
    [dispatch],
  )
  const handleRemoveAnimistPower = useCallback(
    (id: number) => dispatch(removeAnimistPower(id)),
    [dispatch],
  )
  const handleAddAnimistPowerPoint = useCallback(
    (id: number) => dispatch(incrementAnimistPower(id)),
    [dispatch],
  )
  const handleRemoveAnimistPowerPoint = useCallback(
    (id: number) => dispatch(decrementAnimistPower(id)),
    [dispatch],
  )

  const handleAddGeodeRitual = useCallback((id: number) => dispatch(addGeodeRitual(id)), [dispatch])
  const handleRemoveGeodeRitual = useCallback(
    (id: number) => dispatch(removeGeodeRitual(id)),
    [dispatch],
  )
  const handleAddGeodeRitualPoint = useCallback(
    (id: number) => dispatch(incrementGeodeRitual(id)),
    [dispatch],
  )
  const handleRemoveGeodeRitualPoint = useCallback(
    (id: number) => dispatch(decrementGeodeRitual(id)),
    [dispatch],
  )

  const handleAddZibiljaRitual = useCallback(
    (id: number) => dispatch(addZibiljaRitual(id)),
    [dispatch],
  )
  const handleRemoveZibiljaRitual = useCallback(
    (id: number) => dispatch(removeZibiljaRitual(id)),
    [dispatch],
  )
  const handleAddZibiljaRitualPoint = useCallback(
    (id: number) => dispatch(incrementZibiljaRitual(id)),
    [dispatch],
  )
  const handleRemoveZibiljaRitualPoint = useCallback(
    (id: number) => dispatch(decrementZibiljaRitual(id)),
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
            <ListHeaderTag className="name">{translate("spells.header.name")}</ListHeaderTag>
            <ListHeaderTag className="group">
              {translate("spells.header.property")}
              {sortOrder === "group" ? ` / ${translate("spells.header.group")}` : null}
            </ListHeaderTag>
            <ListHeaderTag className="check">{translate("spells.header.check")}</ListHeaderTag>
            <ListHeaderTag className="mod" hint={translate("spells.header.checkmodifier.tooltip")}>
              {translate("spells.header.checkmodifier")}
            </ListHeaderTag>
            <ListHeaderTag className="ic" hint={translate("spells.header.improvementcost.tooltip")}>
              {translate("spells.header.improvementcost")}
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
                          add={handleAddSpell}
                        />
                      )

                    case "ritual":
                      return (
                        <InactiveRitualsListItem
                          key={`ritual-${x.static.id}`}
                          insertTopMargin={isTopMarginNeeded(sortOrder, x, inactiveList[i - 1])}
                          ritual={x}
                          sortOrder={sortOrder}
                          add={handleAddRitual}
                        />
                      )

                    case "curse":
                      return (
                        <InactiveCursesListItem
                          key={`curse-${x.static.id}`}
                          insertTopMargin={isTopMarginNeeded(sortOrder, x, inactiveList[i - 1])}
                          curse={x}
                          sortOrder={sortOrder}
                          add={handleAddCurse}
                        />
                      )

                    case "elvenMagicalSong":
                      return (
                        <InactiveElvenMagicalSongsListItem
                          key={`elven-magical-song-${x.static.id}`}
                          insertTopMargin={isTopMarginNeeded(sortOrder, x, inactiveList[i - 1])}
                          elvenMagicalSong={x}
                          sortOrder={sortOrder}
                          add={handleAddElvenMagicalSong}
                        />
                      )

                    case "dominationRitual":
                      return (
                        <InactiveDominationRitualsListItem
                          key={`domination-ritual-${x.static.id}`}
                          insertTopMargin={isTopMarginNeeded(sortOrder, x, inactiveList[i - 1])}
                          dominationRitual={x}
                          sortOrder={sortOrder}
                          add={handleAddDominationRitual}
                        />
                      )

                    case "magicalDance":
                      return (
                        <InactiveMagicalDancesListItem
                          key={`magical-dance-${x.static.id}`}
                          insertTopMargin={isTopMarginNeeded(sortOrder, x, inactiveList[i - 1])}
                          magicalDance={x}
                          sortOrder={sortOrder}
                          add={handleAddMagicalDance}
                        />
                      )

                    case "magicalMelody":
                      return (
                        <InactiveMagicalMelodiesListItem
                          key={`magical-melody-${x.static.id}`}
                          insertTopMargin={isTopMarginNeeded(sortOrder, x, inactiveList[i - 1])}
                          magicalMelody={x}
                          sortOrder={sortOrder}
                          add={handleAddMagicalMelody}
                        />
                      )

                    case "jesterTrick":
                      return (
                        <InactiveJesterTricksListItem
                          key={`jester-trick-${x.static.id}`}
                          insertTopMargin={isTopMarginNeeded(sortOrder, x, inactiveList[i - 1])}
                          jesterTrick={x}
                          sortOrder={sortOrder}
                          add={handleAddJesterTrick}
                        />
                      )

                    case "animistPower":
                      return (
                        <InactiveAnimistPowersListItem
                          key={`animist-power-${x.static.id}`}
                          insertTopMargin={isTopMarginNeeded(sortOrder, x, inactiveList[i - 1])}
                          animistPower={x}
                          sortOrder={sortOrder}
                          add={handleAddAnimistPower}
                        />
                      )

                    case "geodeRitual":
                      return (
                        <InactiveGeodeRitualsListItem
                          key={`geode-ritual-${x.static.id}`}
                          insertTopMargin={isTopMarginNeeded(sortOrder, x, inactiveList[i - 1])}
                          geodeRitual={x}
                          sortOrder={sortOrder}
                          add={handleAddGeodeRitual}
                        />
                      )

                    case "zibiljaRitual":
                      return (
                        <InactiveZibiljaRitualsListItem
                          key={`zibilja-ritual-${x.static.id}`}
                          insertTopMargin={isTopMarginNeeded(sortOrder, x, inactiveList[i - 1])}
                          zibiljaRitual={x}
                          sortOrder={sortOrder}
                          add={handleAddZibiljaRitual}
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
          <ListHeaderTag className="name">{translate("spells.header.name")}</ListHeaderTag>
          <ListHeaderTag className="group">
            {translate("spells.header.property")}
            {sortOrder === "group" ? ` / ${translate("spells.header.group")}` : null}
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
                        addPoint={handleAddSpellPoint}
                        removePoint={handleRemoveSpellPoint}
                        remove={handleRemoveSpell}
                      />
                    )

                  case "ritual":
                    return (
                      <ActiveRitualsListItem
                        key={`ritual-${x.static.id}`}
                        insertTopMargin={isTopMarginNeeded(sortOrder, x, activeList[i - 1])}
                        ritual={x}
                        sortOrder={sortOrder}
                        addPoint={handleAddRitualPoint}
                        removePoint={handleRemoveRitualPoint}
                        remove={handleRemoveRitual}
                      />
                    )

                  case "curse":
                    return (
                      <ActiveCursesListItem
                        key={`curse-${x.static.id}`}
                        insertTopMargin={isTopMarginNeeded(sortOrder, x, activeList[i - 1])}
                        curse={x}
                        sortOrder={sortOrder}
                        addPoint={handleAddCursePoint}
                        removePoint={handleRemoveCursePoint}
                        remove={handleRemoveCurse}
                      />
                    )

                  case "elvenMagicalSong":
                    return (
                      <ActiveElvenMagicalSongsListItem
                        key={`elven-magical-song-${x.static.id}`}
                        insertTopMargin={isTopMarginNeeded(sortOrder, x, activeList[i - 1])}
                        elvenMagicalSong={x}
                        sortOrder={sortOrder}
                        addPoint={handleAddElvenMagicalSongPoint}
                        removePoint={handleRemoveElvenMagicalSongPoint}
                        remove={handleRemoveElvenMagicalSong}
                      />
                    )

                  case "dominationRitual":
                    return (
                      <ActiveDominationRitualsListItem
                        key={`domination-ritual-${x.static.id}`}
                        insertTopMargin={isTopMarginNeeded(sortOrder, x, activeList[i - 1])}
                        dominationRitual={x}
                        sortOrder={sortOrder}
                        addPoint={handleAddDominationRitualPoint}
                        removePoint={handleRemoveDominationRitualPoint}
                        remove={handleRemoveDominationRitual}
                      />
                    )

                  case "magicalDance":
                    return (
                      <ActiveMagicalDancesListItem
                        key={`magical-dance-${x.static.id}`}
                        insertTopMargin={isTopMarginNeeded(sortOrder, x, activeList[i - 1])}
                        magicalDance={x}
                        sortOrder={sortOrder}
                        addPoint={handleAddMagicalDancePoint}
                        removePoint={handleRemoveMagicalDancePoint}
                        remove={handleRemoveMagicalDance}
                      />
                    )

                  case "magicalMelody":
                    return (
                      <ActiveMagicalMelodiesListItem
                        key={`magical-melody-${x.static.id}`}
                        insertTopMargin={isTopMarginNeeded(sortOrder, x, activeList[i - 1])}
                        magicalMelody={x}
                        sortOrder={sortOrder}
                        addPoint={handleAddMagicalMelodyPoint}
                        removePoint={handleRemoveMagicalMelodyPoint}
                        remove={handleRemoveMagicalMelody}
                      />
                    )

                  case "jesterTrick":
                    return (
                      <ActiveJesterTricksListItem
                        key={`jester-trick-${x.static.id}`}
                        insertTopMargin={isTopMarginNeeded(sortOrder, x, activeList[i - 1])}
                        jesterTrick={x}
                        sortOrder={sortOrder}
                        addPoint={handleAddJesterTrickPoint}
                        removePoint={handleRemoveJesterTrickPoint}
                        remove={handleRemoveJesterTrick}
                      />
                    )

                  case "animistPower":
                    return (
                      <ActiveAnimistPowersListItem
                        key={`animist-power-${x.static.id}`}
                        insertTopMargin={isTopMarginNeeded(sortOrder, x, activeList[i - 1])}
                        animistPower={x}
                        sortOrder={sortOrder}
                        addPoint={handleAddAnimistPowerPoint}
                        removePoint={handleRemoveAnimistPowerPoint}
                        remove={handleRemoveAnimistPower}
                      />
                    )

                  case "geodeRitual":
                    return (
                      <ActiveGeodeRitualsListItem
                        key={`geode-ritual-${x.static.id}`}
                        insertTopMargin={isTopMarginNeeded(sortOrder, x, activeList[i - 1])}
                        geodeRitual={x}
                        sortOrder={sortOrder}
                        addPoint={handleAddGeodeRitualPoint}
                        removePoint={handleRemoveGeodeRitualPoint}
                        remove={handleRemoveGeodeRitual}
                      />
                    )

                  case "zibiljaRitual":
                    return (
                      <ActiveZibiljaRitualsListItem
                        key={`zibilja-ritual-${x.static.id}`}
                        insertTopMargin={isTopMarginNeeded(sortOrder, x, activeList[i - 1])}
                        zibiljaRitual={x}
                        sortOrder={sortOrder}
                        addPoint={handleAddZibiljaRitualPoint}
                        removePoint={handleRemoveZibiljaRitualPoint}
                        remove={handleRemoveZibiljaRitual}
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
