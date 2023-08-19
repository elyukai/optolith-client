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
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { ActivatableAddList } from "../Activatable/ActivatableAddList"
import { ActivatableRemoveList } from "../Activatable/ActivatableRemoveList"
import { WikiInfoSelector } from "../InlineWiki/WikiInfo"
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
  staticData: StaticDataRecord
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
    staticData,
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
  const [ currentWikiSelector, setCurrentWikiSelector ] = React.useState<Maybe<WikiInfoSelector>> (Nothing)
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
    (selector: WikiInfoSelector) => {
      setCurrentWikiSelector (Just (selector))
    },
    [ setCurrentWikiSelector ]
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
            staticData={staticData}
            value={inactiveFilterText}
            onChange={setInactiveFilterText}
            fullWidth
            />
          <SortOptions
            sortOrder={sortOrder}
            sort={setSortOrder}
            options={List (SortNames.Name, SortNames.GroupName)}
            staticData={staticData}
            />
          <Checkbox
            checked={enableActiveItemHints}
            onClick={switchActiveItemHints}
            >
            {translate (staticData) ("general.filters.showactivatedentries")}
          </Checkbox>
        </Options>
        <MainContent>
          <ListHeader>
            <ListHeaderTag className="name">
              {translate (staticData) ("specialabilities.header.name")}
            </ListHeaderTag>
            <ListHeaderTag className="group">
              {translate (staticData) ("specialabilities.header.group")}
            </ListHeaderTag>
            <ListHeaderTag
              className="cost"
              hint={translate (staticData) ("specialabilities.header.adventurepoints.tooltip")}
              >
              {translate (staticData) ("specialabilities.header.adventurepoints")}
            </ListHeaderTag>
            <ListHeaderTag className="btn-placeholder" />
            <ListHeaderTag className="btn-placeholder" />
          </ListHeader>
          <ActivatableAddList
            addToList={addToList}
            inactiveList={deactiveList}
            staticData={staticData}
            selectForInfo={handleSlideinInfo}
            selectedForInfo={currentSlideinId}
            />
        </MainContent>
        <WikiInfoContainer currentId={currentSlideinId} />
      </Slidein>
      <Options>
        <SearchField
          staticData={staticData}
          value={filterText}
          onChange={setFilterText}
          fullWidth
          />
        <SortOptions
          sortOrder={sortOrder}
          sort={setSortOrder}
          options={List (SortNames.Name, SortNames.GroupName)}
          staticData={staticData}
          />
        <BorderButton
          label={translate (staticData) ("specialabilities.addbtn")}
          onClick={handleShowSlidein}
          />
      </Options>
      <MainContent>
        <ListHeader>
          <ListHeaderTag className="name">
            {translate (staticData) ("specialabilities.header.name")}
          </ListHeaderTag>
          <ListHeaderTag className="group">
            {translate (staticData) ("specialabilities.header.group")}
          </ListHeaderTag>
          <ListHeaderTag
            className="cost"
            hint={translate (staticData) ("specialabilities.header.adventurepoints.tooltip")}
            >
            {translate (staticData) ("specialabilities.header.adventurepoints")}
          </ListHeaderTag>
          {isRemovingEnabled ? <ListHeaderTag className="btn-placeholder" /> : null}
          <ListHeaderTag className="btn-placeholder" />
        </ListHeader>
        <ActivatableRemoveList
          filterText={filterText}
          list={activeList}
          staticData={staticData}
          isRemovingEnabled={isRemovingEnabled}
          removeFromList={removeFromList}
          setLevel={setLevel}
          selectForInfo={handleInfo}
          selectedForInfo={currentWikiSelector}
          />
      </MainContent>
      <WikiInfoContainer currentSelector={currentWikiSelector} />
    </Page>
  )
}
