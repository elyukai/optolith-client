import * as React from "react"
import { notEquals } from "../../../Data/Eq"
import { fmap } from "../../../Data/Functor"
import { List, mapAccumL, notNull, notNullStr, toArray } from "../../../Data/List"
import { bindF, ensure, fromMaybe, Just, Maybe, Nothing, or } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { Pair, snd } from "../../../Data/Tuple"
import { WikiInfoContainer } from "../../Containers/WikiInfoContainer"
import { ChantsSortOptions } from "../../Models/Config"
import { HeroModelRecord } from "../../Models/Hero/HeroModel"
import { AttributeCombined } from "../../Models/View/AttributeCombined"
import { BlessingCombined } from "../../Models/View/BlessingCombined"
import { LiturgicalChantWithRequirements } from "../../Models/View/LiturgicalChantWithRequirements"
import { Blessing } from "../../Models/Wiki/Blessing"
import { LiturgicalChant } from "../../Models/Wiki/LiturgicalChant"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { LCBCA } from "../../Utilities/Increasable/liturgicalChantUtils"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { BorderButton } from "../Universal/BorderButton"
import { Checkbox } from "../Universal/Checkbox"
import { ListView } from "../Universal/List"
import { ListHeader } from "../Universal/ListHeader"
import { ListHeaderTag } from "../Universal/ListHeaderTag"
import { ListPlaceholder } from "../Universal/ListPlaceholder"
import { MainContent } from "../Universal/MainContent"
import { Options } from "../Universal/Options"
import { Page } from "../Universal/Page"
import { Scroll } from "../Universal/Scroll"
import { SearchField } from "../Universal/SearchField"
import { Slidein } from "../Universal/Slidein"
import { SortNames, SortOptions } from "../Universal/SortOptions"
import { LiturgicalChantsListItemActive } from "./LiturgicalChantsListItemActive"
import { LiturgicalChantsListItemInactive } from "./LiturgicalChantsListItemInactive"

const isTopMarginNeeded =
  (sortOrder: string) =>
  (curr: Combined) =>
  (mprev: Maybe<Combined>) =>
    pipe_ (
      mprev,
      bindF (ensure (
        () => sortOrder === "group" && LCBCA.active (curr)
      )),
      fmap (prev =>
             (!BlessingCombined.is (prev) && BlessingCombined.is (curr))
             || (BlessingCombined.is (prev) && !BlessingCombined.is (curr))
             || (
               !BlessingCombined.is (prev)
               && !BlessingCombined.is (curr)
               && notEquals (LCBCA.gr (prev)) (LCBCA.gr (curr))
             )),
      or
    )

export interface LiturgicalChantsOwnProps {
  staticData: StaticDataRecord
  hero: HeroModelRecord
}

export interface LiturgicalChantsStateProps {
  activeList: Maybe<List<Record<BlessingCombined> | Record<LiturgicalChantWithRequirements>>>
  addChantsDisabled: boolean
  attributes: List<Record<AttributeCombined>>
  enableActiveItemHints: boolean
  filterText: string
  inactiveFilterText: string
  inactiveList: Maybe<List<Record<LiturgicalChantWithRequirements> | Record<BlessingCombined>>>
  isRemovingEnabled: boolean
  sortOrder: ChantsSortOptions
  traditionId: Maybe<number>
}

export interface LiturgicalChantsDispatchProps {
  setSortOrder (sortOrder: SortNames): void
  switchActiveItemHints (): void
  addPoint (id: string): void
  addToList (id: string): void
  addBlessingToList (id: string): void
  removePoint (id: string): void
  removeFromList (id: string): void
  removeBlessingFromList (id: string): void
  setFilterText (filterText: string): void
  setInactiveFilterText (filterText: string): void
}

export type LiturgicalChantsProps =
  LiturgicalChantsStateProps
  & LiturgicalChantsDispatchProps
  & LiturgicalChantsOwnProps

type Combined = Record<LiturgicalChantWithRequirements> | Record<BlessingCombined>

export const LiturgicalChants: React.FC<LiturgicalChantsProps> = props => {
  const {
    addChantsDisabled,
    addPoint,
    addToList,
    addBlessingToList,
    enableActiveItemHints,
    attributes,
    activeList,
    inactiveList,
    staticData,
    isRemovingEnabled,
    removeFromList,
    removeBlessingFromList,
    removePoint,
    setSortOrder,
    sortOrder,
    switchActiveItemHints,
    traditionId: mtradition_id,
    filterText,
    inactiveFilterText,
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
    <Page id="liturgies">
      <Slidein
        isOpen={showAddSlidein}
        close={handleHideSlidein}
        className="adding-liturgical-chants"
        >
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
            options={List (SortNames.Name, SortNames.Group, SortNames.IC)}
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
              {translate (staticData) ("liturgicalchants.header.name")}
            </ListHeaderTag>
            <ListHeaderTag className="group">
              {translate (staticData) ("liturgicalchants.header.traditions")}
              {sortOrder === SortNames.Group
                ? ` / ${translate (staticData) ("liturgicalchants.header.group")}`
                : null}
            </ListHeaderTag>
            <ListHeaderTag className="check">
              {translate (staticData) ("liturgicalchants.header.check")}
            </ListHeaderTag>
            <ListHeaderTag
              className="mod"
              hint={translate (staticData) ("liturgicalchants.header.checkmodifier.tooltip")}
              >
              {translate (staticData) ("liturgicalchants.header.checkmodifier")}
            </ListHeaderTag>
            <ListHeaderTag
              className="ic"
              hint={translate (staticData) ("liturgicalchants.header.improvementcost.tooltip")}
              >
              {translate (staticData) ("liturgicalchants.header.improvementcost")}
            </ListHeaderTag>
            {isRemovingEnabled ? <ListHeaderTag className="btn-placeholder" /> : null}
            <ListHeaderTag className="btn-placeholder" />
          </ListHeader>
          <Scroll>
            <ListView>
              {pipe_ (
                inactiveList,
                bindF (ensure (notNull)),
                fmap (pipe (
                  mapAccumL ((mprev: Maybe<Combined>) => (curr: Combined) => {
                              const insertTopMargin = isTopMarginNeeded (sortOrder) (curr) (mprev)

                              return Pair<Maybe<Combined>, JSX.Element> (
                                Just (curr),
                                (
                                  <LiturgicalChantsListItemInactive
                                    key={
                                      LiturgicalChantWithRequirements.is (curr)
                                      ? pipe_ (
                                          curr,
                                          LiturgicalChantWithRequirements.A.wikiEntry,
                                          LiturgicalChant.A.id
                                        )
                                      : pipe_ (
                                          curr,
                                          BlessingCombined.A.wikiEntry,
                                          Blessing.A.id
                                        )
                                    }
                                    staticData={staticData}
                                    addChantsDisabled={addChantsDisabled}
                                    attributes={attributes}
                                    currentInfoId={currentSlideinId}
                                    entry={curr}
                                    insertTopMargin={insertTopMargin}
                                    mtradition_id={mtradition_id}
                                    sortOrder={sortOrder}
                                    addToList={addToList}
                                    addBlessingToList={addBlessingToList}
                                    selectForInfo={handleShowSlideinInfo}
                                    />
                                )
                              )
                            })
                            (Nothing),
                  snd,
                  toArray,
                  arr => <>{arr}</>
                )),
                fromMaybe (
                  <ListPlaceholder
                    staticData={staticData}
                    type="inactiveLiturgicalChants"
                    noResults
                    />
                )
              )}
            </ListView>
          </Scroll>
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
          options={List (SortNames.Name, SortNames.Group, SortNames.IC)}
          staticData={staticData}
          />
        <BorderButton
          label={translate (staticData) ("liturgicalchants.addbtn")}
          onClick={handleShowSlidein}
          />
      </Options>
      <MainContent>
        <ListHeader>
          <ListHeaderTag className="name">
            {translate (staticData) ("liturgicalchants.header.name")}
          </ListHeaderTag>
          <ListHeaderTag className="group">
            {translate (staticData) ("liturgicalchants.header.traditions")}
            {sortOrder === "group"
              ? ` / ${translate (staticData) ("liturgicalchants.header.group")}`
              : null}
          </ListHeaderTag>
          <ListHeaderTag
            className="value"
            hint={translate (staticData) ("liturgicalchants.header.skillrating.tooltip")}
            >
            {translate (staticData) ("liturgicalchants.header.skillrating")}
          </ListHeaderTag>
          <ListHeaderTag className="check">
            {translate (staticData) ("liturgicalchants.header.check")}
          </ListHeaderTag>
          <ListHeaderTag
            className="mod"
            hint={translate (staticData) ("liturgicalchants.header.checkmodifier.tooltip")}
            >
            {translate (staticData) ("liturgicalchants.header.checkmodifier")}
          </ListHeaderTag>
          <ListHeaderTag
            className="ic"
            hint={translate (staticData) ("liturgicalchants.header.improvementcost.tooltip")}
            >
            {translate (staticData) ("liturgicalchants.header.improvementcost")}
          </ListHeaderTag>
          {isRemovingEnabled ? <ListHeaderTag className="btn-placeholder" /> : null}
          <ListHeaderTag className="btn-placeholder" />
          <ListHeaderTag className="btn-placeholder" />
        </ListHeader>
        <Scroll>
          <ListView>
            {pipe_ (
              activeList,
              bindF (ensure (notNull)),
              fmap (pipe (
                mapAccumL ((mprev: Maybe<Combined>) => (curr: Combined) => {
                            const insertTopMargin = isTopMarginNeeded (sortOrder) (curr) (mprev)

                            return Pair<Maybe<Combined>, JSX.Element> (
                              Just (curr),
                              (
                                <LiturgicalChantsListItemActive
                                  key={
                                    LiturgicalChantWithRequirements.is (curr)
                                    ? pipe_ (
                                        curr,
                                        LiturgicalChantWithRequirements.A.wikiEntry,
                                        LiturgicalChant.A.id
                                      )
                                    : pipe_ (
                                        curr,
                                        BlessingCombined.A.wikiEntry,
                                        Blessing.A.id
                                      )
                                  }
                                  staticData={staticData}
                                  attributes={attributes}
                                  currentInfoId={currentId}
                                  entry={curr}
                                  insertTopMargin={insertTopMargin}
                                  isRemovingEnabled={isRemovingEnabled}
                                  mtradition_id={mtradition_id}
                                  sortOrder={sortOrder}
                                  addPoint={addPoint}
                                  removePoint={removePoint}
                                  removeFromList={removeFromList}
                                  removeBlessingFromList={removeBlessingFromList}
                                  selectForInfo={handleShowInfo}
                                  />
                              )
                            )
                          })
                          (Nothing),
                snd,
                toArray,
                arr => <>{arr}</>
              )),
              fromMaybe (
                <ListPlaceholder
                  staticData={staticData}
                  type="liturgicalChants"
                  noResults={notNullStr (filterText)}
                  />
              )
            )}
          </ListView>
        </Scroll>
      </MainContent>
      <WikiInfoContainer currentId={currentId} />
    </Page>
  )
}
