import * as React from "react"
import { notEquals } from "../../../Data/Eq"
import { fmap } from "../../../Data/Functor"
import { List, mapAccumL, notNull, toArray } from "../../../Data/List"
import { bindF, ensure, fromMaybe, Just, Maybe, maybe, Nothing } from "../../../Data/Maybe"
import { lookupF } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { Pair, snd } from "../../../Data/Tuple"
import { WikiInfoContainer } from "../../Containers/WikiInfoContainer"
import { HeroModelRecord } from "../../Models/Hero/Hero"
import { EntryRating } from "../../Models/Hero/heroTypeHelpers"
import { AttributeCombined } from "../../Models/View/AttributeCombined"
import { SkillWithRequirements, SkillWithRequirementsA_ } from "../../Models/View/SkillWithRequirements"
import { SkillGroup } from "../../Models/Wiki/SkillGroup"
import { StaticData, StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { isSkillCommon, isSkillUncommon } from "../../Utilities/Increasable/skillUtils"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { Checkbox } from "../Universal/Checkbox"
import { ListView } from "../Universal/List"
import { ListHeader } from "../Universal/ListHeader"
import { ListHeaderTag } from "../Universal/ListHeaderTag"
import { ListPlaceholder } from "../Universal/ListPlaceholder"
import { MainContent } from "../Universal/MainContent"
import { Options } from "../Universal/Options"
import { Page } from "../Universal/Page"
import { RecommendedReference } from "../Universal/RecommendedReference"
import { Scroll } from "../Universal/Scroll"
import { SearchField } from "../Universal/SearchField"
import { SortNames, SortOptions } from "../Universal/SortOptions"
import { SkillListItem } from "./SkillListItem"

type Element = Record<SkillWithRequirements>
const SWRA = SkillWithRequirements.A
const SWRA_ = SkillWithRequirementsA_

const isTopMarginNeeded =
  (sortOrder: string) =>
  (curr: Element) =>
  (mprev: Maybe<Element>) =>
    sortOrder === "group"
    && maybe (false) (pipe (SWRA_.gr, notEquals (SWRA_.gr (curr)))) (mprev)

export interface SkillsOwnProps {
  staticData: StaticDataRecord
  hero: HeroModelRecord
}

export interface SkillsStateProps {
  attributes: List<Record<AttributeCombined>>
  list: Maybe<List<Record<SkillWithRequirements>>>
  isRemovingEnabled: boolean
  sortOrder: SortNames
  filterText: string
  ratingVisibility: boolean
  skillRating: StrMap<EntryRating>
}

export interface SkillsDispatchProps {
  setSortOrder (sortOrder: SortNames): void
  setFilterText (filterText: string): void
  switchRatingVisibility (): void
  addPoint (id: string): void
  removePoint (id: string): void
}

type Props = SkillsStateProps & SkillsDispatchProps & SkillsOwnProps

export interface SkillsState {
  infoId: Maybe<string>
}

export const Skills: React.FC<Props> = props => {
  const [ infoId, setInfoId ] = React.useState<Maybe<string>> (Nothing)

  const showInfo = React.useCallback (
    (id: string) => setInfoId (Just (id)),
    [ setInfoId ]
  )

  const {
    addPoint,
    attributes,
    staticData,
    isRemovingEnabled,
    ratingVisibility: is_rating_visible,
    removePoint,
    setSortOrder,
    sortOrder,
    switchRatingVisibility,
    skillRating,
    list,
    filterText,
    setFilterText,
  } = props

  return (
    <Page id="talents">
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
          staticData={staticData}
          options={List (SortNames.Name, SortNames.Group, SortNames.IC)}
          />
        <Checkbox
          checked={is_rating_visible}
          onClick={switchRatingVisibility}
          >
          {translate (staticData) ("skills.commonskills")}
        </Checkbox>
        {is_rating_visible ? <RecommendedReference staticData={staticData} /> : null}
      </Options>
      <MainContent>
        <ListHeader>
          <ListHeaderTag className="name">
            {translate (staticData) ("skills.header.name")}
          </ListHeaderTag>
          <ListHeaderTag className="group">
            {translate (staticData) ("skills.header.group")}
          </ListHeaderTag>
          <ListHeaderTag
            className="value"
            hint={translate (staticData) ("skills.header.skillrating.tooltip")}
            >
            {translate (staticData) ("skills.header.skillrating")}
          </ListHeaderTag>
          <ListHeaderTag className="check">
            {translate (staticData) ("skills.header.check")}
          </ListHeaderTag>
          <ListHeaderTag
            className="ic"
            hint={translate (staticData) ("skills.header.improvementcost.tooltip")}
            >
            {translate (staticData) ("skills.header.improvementcost")}
          </ListHeaderTag>
          {isRemovingEnabled ? <ListHeaderTag className="btn-placeholder" /> : null}
          <ListHeaderTag className="btn-placeholder" />
          <ListHeaderTag className="btn-placeholder" />
        </ListHeader>
        <Scroll>
          <ListView>
            {pipe_ (
              list,
              bindF (ensure (notNull)),
              fmap (pipe (
                mapAccumL ((mprev: Maybe<Element>) => (curr: Element) =>
                            Pair<Maybe<Element>, JSX.Element> (
                              Just (curr),
                              (
                                <SkillListItem
                                  key={SWRA_.id (curr)}
                                  id={SWRA_.id (curr)}
                                  typ={
                                    is_rating_visible
                                    && isSkillCommon (skillRating) (SWRA.wikiEntry (curr))
                                  }
                                  untyp={
                                    is_rating_visible
                                    && isSkillUncommon (skillRating) (SWRA.wikiEntry (curr))
                                  }
                                  name={SWRA_.name (curr)}
                                  sr={SWRA_.value (curr)}
                                  check={SWRA_.check (curr)}
                                  ic={SWRA_.ic (curr)}
                                  addDisabled={!SWRA.isIncreasable (curr)}
                                  addPoint={addPoint}
                                  removeDisabled={!isRemovingEnabled || !SWRA.isDecreasable (curr)}
                                  removePoint={removePoint}
                                  addFillElement
                                  insertTopMargin={isTopMarginNeeded (sortOrder) (curr) (mprev)}
                                  attributes={attributes}
                                  staticData={staticData}
                                  isRemovingEnabled={isRemovingEnabled}
                                  selectForInfo={showInfo}
                                  group={SWRA_.gr (curr)}
                                  getGroupName={pipe (
                                    lookupF (StaticData.A.skillGroups (staticData)),
                                    maybe ("") (SkillGroup.A.name)
                                  )}
                                  selectedForInfo={infoId}
                                  />
                              )
                            ))
                          (Nothing),
                snd,
                toArray,
                arr => <>{arr}</>
              )),
              fromMaybe (<ListPlaceholder staticData={staticData} type="skills" noResults />)
            )}
          </ListView>
        </Scroll>
      </MainContent>
      <WikiInfoContainer currentId={infoId} />
    </Page>
  )
}
