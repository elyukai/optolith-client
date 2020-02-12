import * as React from "react"
import { List } from "../../../Data/List"
import { Just, Maybe, Nothing } from "../../../Data/Maybe"
import { OrderedMap } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { WikiInfoContainer } from "../../Containers/WikiInfoContainer"
import { ActivatableActivationOptions } from "../../Models/Actions/ActivatableActivationOptions"
import { ActivatableDeactivationOptions } from "../../Models/Actions/ActivatableDeactivationOptions"
import { HeroModelRecord } from "../../Models/Hero/HeroModel"
import { ActiveActivatable } from "../../Models/View/ActiveActivatable"
import { InactiveActivatable } from "../../Models/View/InactiveActivatable"
import { L10nRecord } from "../../Models/Wiki/L10n"
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility"
import { translate } from "../../Utilities/I18n"
import { ActivatableAddList } from "../Activatable/ActivatableAddList"
import { ActivatableRemoveList } from "../Activatable/ActivatableRemoveList"
import { BorderButton } from "../Universal/BorderButton"
import { Checkbox } from "../Universal/Checkbox"
import { ListHeader } from "../Universal/ListHeader"
import { ListHeaderTag } from "../Universal/ListHeaderTag"
import { MainContent } from "../Universal/MainContent"
import { Options } from "../Universal/Options"
import { Page } from "../Universal/Page"
import { SearchField } from "../Universal/SearchField"
import { Slidein } from "../Universal/Slidein"
import { SortNames, SortOptions } from "../Universal/SortOptions"

export interface SpecialAbilitiesOwnProps {
  l10n: L10nRecord
  hero: HeroModelRecord
}

export interface SpecialAbilitiesStateProps {
  activeList: Maybe<List<Record<ActiveActivatable<SpecialAbility>>>>
  deactiveList: Maybe<List<
    Record<ActiveActivatable<SpecialAbility>>
    | Record<InactiveActivatable<SpecialAbility>>
  >>
  wikiEntries: OrderedMap<string, Record<SpecialAbility>>
  enableActiveItemHints: boolean
  isRemovingEnabled: boolean
  sortOrder: SortNames
  filterText: string
  inactiveFilterText: string
}

export interface SpecialAbilitiesDispatchProps {
  setSortOrder (sortOrder: SortNames): void
  switchActiveItemHints (): void
  addToList (args: Record<ActivatableActivationOptions>): void
  removeFromList (args: Record<ActivatableDeactivationOptions>): void
  setLevel (id: string, index: number, level: number): void
  setFilterText (filterText: string): void
  setInactiveFilterText (filterText: string): void
}

type Props = SpecialAbilitiesStateProps & SpecialAbilitiesDispatchProps & SpecialAbilitiesOwnProps

export const SpecialAbilities: React.FC<Props> = props => {
  const {
    activeList,
    addToList,
    deactiveList,
    enableActiveItemHints,
    l10n,
    isRemovingEnabled,
    removeFromList,
    setSortOrder,
    setLevel,
    sortOrder,
    switchActiveItemHints,
    filterText,
    inactiveFilterText,
    setInactiveFilterText,
    setFilterText,
  } = props

  const [ isSlideinOpen, setIsSlideinOpen ] = React.useState (false)
  const [ currentId, setCurrentId ] = React.useState<Maybe<string>> (Nothing)
  const [ currentSlideinId, setCurrentSlideinId ] = React.useState<Maybe<string>> (Nothing)

  const handleShowSlidein = React.useCallback (
    () => setIsSlideinOpen (true),
    [ setIsSlideinOpen ]
  )

  const handleHideSlidein = React.useCallback (
    () => {
      setInactiveFilterText ("")
      setIsSlideinOpen (false)
    },
    [ setIsSlideinOpen, setInactiveFilterText ]
  )

  const handleInfo = React.useCallback (
    (id: string) => setCurrentId (Just (id)),
    [ setCurrentId ]
  )

  const handleSlideinInfo = React.useCallback (
    (id: string) => setCurrentSlideinId (Just (id)),
    [ setCurrentSlideinId ]
  )

  return (
    <Page id="specialabilities">
      <Slidein isOpen={isSlideinOpen} close={handleHideSlidein}>
        <Options>
          <SearchField
            l10n={l10n}
            value={inactiveFilterText}
            onChange={setInactiveFilterText}
            fullWidth
            />
          <SortOptions
            sortOrder={sortOrder}
            sort={setSortOrder}
            options={List (SortNames.Name, SortNames.GroupName)}
            l10n={l10n}
            />
          <Checkbox
            checked={enableActiveItemHints}
            onClick={switchActiveItemHints}
            >
            {translate (l10n) ("general.filters.showactivatedentries")}
          </Checkbox>
        </Options>
        <MainContent>
          <ListHeader>
            <ListHeaderTag className="name">
              {translate (l10n) ("specialabilities.header.name")}
            </ListHeaderTag>
            <ListHeaderTag className="group">
              {translate (l10n) ("specialabilities.header.group")}
            </ListHeaderTag>
            <ListHeaderTag
              className="cost"
              hint={translate (l10n) ("specialabilities.header.adventurepoints.tooltip")}
              >
              {translate (l10n) ("specialabilities.header.adventurepoints")}
            </ListHeaderTag>
            <ListHeaderTag className="btn-placeholder" />
            <ListHeaderTag className="btn-placeholder" />
          </ListHeader>
          <ActivatableAddList
            addToList={addToList}
            inactiveList={deactiveList}
            l10n={l10n}
            selectForInfo={handleSlideinInfo}
            selectedForInfo={currentSlideinId}
            />
        </MainContent>
        <WikiInfoContainer l10n={l10n} currentId={currentSlideinId} />
      </Slidein>
      <Options>
        <SearchField
          l10n={l10n}
          value={filterText}
          onChange={setFilterText}
          fullWidth
          />
        <SortOptions
          sortOrder={sortOrder}
          sort={setSortOrder}
          options={List (SortNames.Name, SortNames.GroupName)}
          l10n={l10n}
          />
        <BorderButton
          label={translate (l10n) ("specialabilities.addbtn")}
          onClick={handleShowSlidein}
          />
      </Options>
      <MainContent>
        <ListHeader>
          <ListHeaderTag className="name">
            {translate (l10n) ("specialabilities.header.name")}
          </ListHeaderTag>
          <ListHeaderTag className="group">
            {translate (l10n) ("specialabilities.header.group")}
          </ListHeaderTag>
          <ListHeaderTag
            className="cost"
            hint={translate (l10n) ("specialabilities.header.adventurepoints.tooltip")}
            >
            {translate (l10n) ("specialabilities.header.adventurepoints")}
          </ListHeaderTag>
          {isRemovingEnabled ? <ListHeaderTag className="btn-placeholder" /> : null}
          <ListHeaderTag className="btn-placeholder" />
        </ListHeader>
        <ActivatableRemoveList
          filterText={filterText}
          list={activeList}
          l10n={l10n}
          isRemovingEnabled={isRemovingEnabled}
          removeFromList={removeFromList}
          setLevel={setLevel}
          selectForInfo={handleInfo}
          selectedForInfo={currentId}
          />
      </MainContent>
      <WikiInfoContainer currentId={currentId} l10n={l10n} />
    </Page>
  )
}
