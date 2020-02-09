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
import { L10nRecord } from "../../Models/Wiki/L10n"
import { translate } from "../../Utilities/I18n"
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
import { InactiveList } from "./DeactiveList"

export interface AdvantagesDisadvantagesProps {
  l10n: L10nRecord
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
    l10n,
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
  const [ currentId, setCurrenId ] = React.useState<Maybe<string>> (Nothing)
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
    (id: string) => setCurrenId (Just (id)),
    [ setCurrenId ]
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
            l10n={l10n}
            value={inactiveFilterText}
            onChange={setInactiveFilterText}
            fullWidth
            />
          <Checkbox
            checked={showRating}
            onClick={switchRatingVisibility}
            >
            {translate (l10n)
                       (orN (isAdvantages)
                         ? "advantages.commonadvantages"
                         : "disadvantages.commondisadvantages")}
          </Checkbox>
          <Checkbox
            checked={enableActiveItemHints}
            onClick={switchActiveItemHints}
            >
            {translate (l10n) ("general.filters.showactivatedentries")}
          </Checkbox>
          {fromMaybe (null as React.ReactNode)
                     (fmapF (m_ap)
                            (ap => (
                              <APSpentOnAdvDisadv
                                ap={ap}
                                magicalMax={magicalMax}
                                l10n={l10n}
                                />
                            )))}
          {showRating ? <RecommendedReference l10n={l10n} strongly /> : null}
        </Options>
        <MainContent>
          <ListHeader>
            <ListHeaderTag className="name">
              {translate (l10n) ("advantagesdisadvantages.header.name")}
            </ListHeaderTag>
            <ListHeaderTag
              className="cost"
              hint={translate (l10n) ("advantagesdisadvantages.header.adventurepoints.tooltip")}
              >
              {translate (l10n) ("advantagesdisadvantages.header.adventurepoints")}
            </ListHeaderTag>
            <ListHeaderTag className="btn-placeholder" />
            <ListHeaderTag className="btn-placeholder" />
          </ListHeader>
          <InactiveList
            inactiveList={deactiveList}
            l10n={l10n}
            rating={rating}
            showRating={showRating}
            addToList={addToList}
            selectForInfo={handleShowSlideinInfo}
            selectedForInfo={currentSlideinId}
            />
        </MainContent>
        <WikiInfoContainer currentId={currentSlideinId} l10n={l10n} />
      </Slidein>
      <Options>
        <SearchField
          l10n={l10n}
          value={filterText}
          onChange={setFilterText}
          fullWidth
          />
        <Checkbox
          checked={showRating}
          onClick={switchRatingVisibility}
          >
          {translate (l10n)
                     (orN (isAdvantages)
                       ? "advantages.commonadvantages"
                       : "disadvantages.commondisadvantages")}
        </Checkbox>
        <BorderButton
          label={translate (l10n) ("advantagesdisadvantages.addbtn")}
          onClick={handleShowSlidein}
          />
        {showRating ? <RecommendedReference l10n={l10n} strongly /> : null}
        {fromMaybe (null as React.ReactNode)
                   (fmapF (m_ap)
                          (ap => (
                            <APSpentOnAdvDisadv
                              ap={ap}
                              magicalMax={magicalMax}
                              l10n={l10n}
                              />
                          )))}
      </Options>
      <MainContent>
        <ListHeader>
          <ListHeaderTag className="name">
            {translate (l10n) ("advantagesdisadvantages.header.name")}
          </ListHeaderTag>
          <ListHeaderTag
            className="cost"
            hint={translate (l10n) ("advantagesdisadvantages.header.adventurepoints.tooltip")}
            >
            {translate (l10n) ("advantagesdisadvantages.header.adventurepoints")}
          </ListHeaderTag>
          <ListHeaderTag className="btn-placeholder" />
          <ListHeaderTag className="btn-placeholder" />
        </ListHeader>
        <ActiveList
          filterText={filterText}
          list={activeList}
          l10n={l10n}
          rating={rating}
          showRating={showRating}
          isRemovingEnabled={isRemovingEnabled}
          selectedForInfo={currentId}
          removeFromList={removeFromList}
          setLevel={setLevel}
          selectForInfo={handleShowInfo}
          />
      </MainContent>
      <WikiInfoContainer currentId={currentId} l10n={l10n} />
    </Page>
  )
}
