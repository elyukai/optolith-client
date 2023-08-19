import * as React from "react"
import { fmapF } from "../../../Data/Functor"
import { List } from "../../../Data/List"
import { fromMaybe, Just, Maybe, Nothing, orN } from "../../../Data/Maybe"
import { OrderedMap } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { WikiInfoContainer } from "../../Containers/WikiInfoContainer"
import { ActivatableActivationOptions } from "../../Models/Actions/ActivatableActivationOptions"
import { ActivatableDeactivationOptions } from "../../Models/Actions/ActivatableDeactivationOptions"
import { EntryRating } from "../../Models/Hero/heroTypeHelpers"
import { ActiveActivatable } from "../../Models/View/ActiveActivatable"
import { AdventurePointsCategories } from "../../Models/View/AdventurePointsCategories"
import { InactiveActivatable } from "../../Models/View/InactiveActivatable"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { WikiInfoSelector } from "../InlineWiki/WikiInfo"
import { BorderButton } from "../Universal/BorderButton"
import { Checkbox } from "../Universal/Checkbox"
import { ListHeader } from "../Universal/ListHeader"
import { ListHeaderTag } from "../Universal/ListHeaderTag"
import { MainContent } from "../Universal/MainContent"
import { Options } from "../Universal/Options"
import { Page } from "../Universal/Page"
import { RecommendedReference } from "../Universal/RecommendedReference"
import { SearchField } from "../Universal/SearchField"
import { Slidein } from "../Universal/Slidein"
import { ActiveList } from "./ActiveList"
import { APSpentOnAdvDisadv } from "./APSpentOnAdvDisadv"
import { InactiveList } from "./InactiveList"

export interface AdvantagesDisadvantagesProps {
  staticData: StaticDataRecord
  activeList: Maybe<List<Record<ActiveActivatable>>>
  ap: Maybe<Record<AdventurePointsCategories>>
  deactiveList: Maybe<List<
    Record<ActiveActivatable>
    | Record<InactiveActivatable>
  >>
  enableActiveItemHints: boolean
  magicalMax: Maybe<number>
  rating: Maybe<OrderedMap<string, EntryRating>>
  showRating: boolean
  isRemovingEnabled: boolean
  filterText: string
  inactiveFilterText: string
  isAdvantages?: boolean
  switchActiveItemHints (): void
  switchRatingVisibility (): void
  addToList (args: Record<ActivatableActivationOptions>): void
  removeFromList (args: Record<ActivatableDeactivationOptions>): void
  setLevel (id: string, index: number, level: number): void
  setFilterText (filterText: string): void
  setInactiveFilterText (filterText: string): void
}

export const AdvantagesDisadvantages: React.FC<AdvantagesDisadvantagesProps> = props => {
  const {
    staticData,
    activeList,
    ap: m_ap,
    deactiveList,
    enableActiveItemHints,
    magicalMax,
    rating,
    showRating,
    isRemovingEnabled,
    filterText,
    inactiveFilterText,
    isAdvantages,
    switchActiveItemHints,
    switchRatingVisibility,
    addToList,
    removeFromList,
    setLevel,
    setFilterText,
    setInactiveFilterText,
  } = props

  const [ showAddSlidein, setShowAddSlidein ] = React.useState (false)
  const [ currentWikiSelector, setCurrentWikiSelector ] = React.useState<Maybe<WikiInfoSelector>> (Nothing)
  const [ currentSlideinId, setCurrentSlideinId ] = React.useState<Maybe<string>> (Nothing)

  const handleShowSlidein = React.useCallback (
    () => setShowAddSlidein (true),
    [ setShowAddSlidein ]
  )

  const handleHideSlidein = React.useCallback (
    () => {
      setInactiveFilterText ("")
      setCurrentSlideinId (Nothing)
      setShowAddSlidein (false)
    },
    [ setInactiveFilterText, setCurrentSlideinId, setShowAddSlidein ]
  )

  const handleShowInfo = React.useCallback (
    (selector: WikiInfoSelector) => {
      setCurrentWikiSelector (Just (selector))
    },
    [ setCurrentWikiSelector ]
  )

  const handleShowSlideinInfo = React.useCallback (
    (id: string) => setCurrentSlideinId (Just (id)),
    [ setCurrentSlideinId ]
  )

  return (
    <Page id={orN (isAdvantages) ? "advantages" : "disadvantages"}>
      <Slidein isOpen={showAddSlidein} close={handleHideSlidein}>
        <Options>
          <SearchField
            staticData={staticData}
            value={inactiveFilterText}
            onChange={setInactiveFilterText}
            fullWidth
            />
          <Checkbox
            checked={showRating}
            onClick={switchRatingVisibility}
            >
            {translate (staticData)
                       (orN (isAdvantages)
                         ? "advantages.filters.commonadvantages"
                         : "disadvantages.filters.commondisadvantages")}
          </Checkbox>
          <Checkbox
            checked={enableActiveItemHints}
            onClick={switchActiveItemHints}
            >
            {translate (staticData) ("general.filters.showactivatedentries")}
          </Checkbox>
          {fromMaybe (null as React.ReactNode)
                     (fmapF (m_ap)
                            (ap => (
                              <APSpentOnAdvDisadv
                                ap={ap}
                                magicalMax={magicalMax}
                                staticData={staticData}
                                />
                            )))}
          {showRating ? <RecommendedReference staticData={staticData} strongly /> : null}
        </Options>
        <MainContent>
          <ListHeader>
            <ListHeaderTag className="name">
              {translate (staticData) ("advantagesdisadvantages.header.name")}
            </ListHeaderTag>
            <ListHeaderTag
              className="cost"
              hint={
                translate (staticData) ("advantagesdisadvantages.header.adventurepoints.tooltip")
              }
              >
              {translate (staticData) ("advantagesdisadvantages.header.adventurepoints")}
            </ListHeaderTag>
            <ListHeaderTag className="btn-placeholder" />
            <ListHeaderTag className="btn-placeholder" />
          </ListHeader>
          <InactiveList
            inactiveList={deactiveList}
            staticData={staticData}
            rating={rating}
            showRating={showRating}
            addToList={addToList}
            selectForInfo={handleShowSlideinInfo}
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
        <Checkbox
          checked={showRating}
          onClick={switchRatingVisibility}
          >
          {translate (staticData)
                     (orN (isAdvantages)
                       ? "advantages.filters.commonadvantages"
                       : "disadvantages.filters.commondisadvantages")}
        </Checkbox>
        <BorderButton
          label={translate (staticData) ("advantagesdisadvantages.addbtn")}
          onClick={handleShowSlidein}
          />
        {showRating ? <RecommendedReference staticData={staticData} strongly /> : null}
        {fromMaybe (null as React.ReactNode)
                   (fmapF (m_ap)
                          (ap => (
                            <APSpentOnAdvDisadv
                              ap={ap}
                              magicalMax={magicalMax}
                              staticData={staticData}
                              />
                          )))}
      </Options>
      <MainContent>
        <ListHeader>
          <ListHeaderTag className="name">
            {translate (staticData) ("advantagesdisadvantages.header.name")}
          </ListHeaderTag>
          <ListHeaderTag
            className="cost"
            hint={translate (staticData) ("advantagesdisadvantages.header.adventurepoints.tooltip")}
            >
            {translate (staticData) ("advantagesdisadvantages.header.adventurepoints")}
          </ListHeaderTag>
          <ListHeaderTag className="btn-placeholder" />
          <ListHeaderTag className="btn-placeholder" />
        </ListHeader>
        <ActiveList
          filterText={filterText}
          list={activeList}
          staticData={staticData}
          rating={rating}
          showRating={showRating}
          isRemovingEnabled={isRemovingEnabled}
          selectedForInfo={currentWikiSelector}
          removeFromList={removeFromList}
          setLevel={setLevel}
          selectForInfo={handleShowInfo}
          />
      </MainContent>
      <WikiInfoContainer currentSelector={currentWikiSelector} />
    </Page>
  )
}
